import os
import cv2
import imagehash
import numpy as np
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
import requests as req
from numpy.linalg import norm
from apscheduler.schedulers.background import BackgroundScheduler
from crawler import crawl_web

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# MongoDB connection
MONGO_URI = 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['digital_asset_protection']
media_collection = db['media_fingerprints']
incidents_collection = db['incidents']
alerts_collection = db['alerts']
scan_logs_collection = db['scan_logs']  # tracks every similarity scan for analytics

# ==========================================
# ALERT SYSTEM: EMAIL & WEBHOOK
# ==========================================
def send_email_alert(alert_data):
    sender = os.environ.get('SMTP_EMAIL', 'alert@digitalassetprotection.com')
    password = os.environ.get('SMTP_PASSWORD', 'dummy_password')
    recipient = 'admin@example.com'
    
    msg = MIMEText(f"A potential misuse of your content has been detected.\n\nDetails:\n- Source URL: {alert_data['source_url']}\n- Similarity: {alert_data['similarity']}%\n- Type: {alert_data['type']}")
    msg['Subject'] = '[ALERT] Digital Asset Violation Detected'
    msg['From'] = sender
    msg['To'] = recipient
    
    print(f"DEBUG: Attempting to send email alert to {recipient}...")
    try:
        if password != 'dummy_password':
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(sender, password)
                server.send_message(msg)
            print("[SUCCESS] Email sent successfully.")
        else:
            print("[WARNING] Email simulated (mock SMTP credentials used).")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")

def trigger_alert(alert_data):
    alert_copy = alert_data.copy()
    alerts_collection.insert_one(alert_copy)
    send_email_alert(alert_data)
    
    webhook_url = os.environ.get('WEBHOOK_URL')
    if webhook_url:
        try:
            req.post(webhook_url, json=alert_data, timeout=5)
            print("[SUCCESS] Webhook fired.")
        except Exception as e:
            print(f"[ERROR] Webhook failed: {e}")

# ==========================================
# STEP 1: MODEL SETUP
# ==========================================
# Use CPU by default for safety, switch to cuda if fully configured
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Loading ResNet50 on {device}...")

# Load pretrained ResNet50
resnet50 = models.resnet50(pretrained=True)
# Remove the final classification layer (fc) to get the 2048-dimensional feature embedding vector
resnet50 = torch.nn.Sequential(*list(resnet50.children())[:-1])
resnet50 = resnet50.to(device)
resnet50.eval()

# Image transformation pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# ==========================================
# STEP 2: EMBEDDING GENERATION
# ==========================================
def extract_embedding(image_path_or_pil):
    """Generate AI feature embedding vector for an image."""
    try:
        if isinstance(image_path_or_pil, str):
            with Image.open(image_path_or_pil) as img:
                img_rgb = img.convert('RGB')
        else:
            img_rgb = image_path_or_pil.convert('RGB')
            
        img_t = preprocess(img_rgb)
        batch_t = torch.unsqueeze(img_t, 0).to(device)
        
        with torch.no_grad():
            features = resnet50(batch_t)
            
        # Flatten the feature tensor to a 1D vector (size 2048)
        embedding = features.squeeze().cpu().numpy()
        return embedding.tolist()
    except Exception as e:
        print(f"Error extracting embedding: {str(e)}")
        return None

def compute_image_hash(filepath):
    """Generate standard perceptual hash for an image (legacy/fallback)."""
    with Image.open(filepath) as img:
        phash = imagehash.phash(img)
    return str(phash)

def process_video_frames(filepath, interval=2):
    """Extract frames every `interval` seconds and generate hashes and embeddings."""
    vidcap = cv2.VideoCapture(filepath)
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    
    if fps == 0 or fps != fps: # Handle 0 or NaN cases
        fps = 30 # Default fallback fps
        
    frame_interval = int(fps * interval)
    hashes = []
    embeddings = []
    
    success, image = vidcap.read()
    count = 0
    max_frames = 5
    frames_processed = 0
    
    while success and frames_processed < max_frames:
        if count % frame_interval == 0:
            # Convert OpenCV BGR to PIL RGB
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_image)
            
            # Legacy hash
            phash = imagehash.phash(pil_image)
            hashes.append(str(phash))
            
            # AI Embedding
            emb = extract_embedding(pil_image)
            if emb:
                embeddings.append(emb)
            
            frames_processed += 1
            
        success, image = vidcap.read()
        count += 1
        
    vidcap.release()
    return hashes, embeddings

# ==========================================
# STEP 4: SIMILARITY FUNCTION
# ==========================================
def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors (returns 0 to 1)."""
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    
    if norm(v1) == 0 or norm(v2) == 0:
        return 0.0
        
    sim = np.dot(v1, v2) / (norm(v1) * norm(v2))
    return float(sim)


@app.route('/upload-media', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
        
    if file:
        import uuid
        base_filename = secure_filename(file.filename)
        name, ext_part = os.path.splitext(base_filename)
        filename = f"{name}_{uuid.uuid4().hex[:8]}{ext_part}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        ext = filename.rsplit('.', 1)[-1].lower()
        hashes = []
        embeddings = []
        media_type = ''
        
        try:
            if ext in ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']:
                media_type = 'image'
                hashes = [compute_image_hash(filepath)]
                emb = extract_embedding(filepath)
                if emb:
                    embeddings = [emb]
            elif ext in ['mp4', 'avi', 'mov', 'mkv', 'webm']:
                media_type = 'video'
                hashes, embeddings = process_video_frames(filepath, interval=2)
            else:
                os.remove(filepath)
                return jsonify({'error': 'Unsupported file type'}), 400
                
            # ==========================================
            # DEDUPLICATION CHECK
            # ==========================================
            best_match_file = None
            highest_sim = 0.0
            
            for record in media_collection.find():
                stored_embeddings = record.get('embeddings', [])
                for target_emb in embeddings:
                    for stored_emb in stored_embeddings:
                        sim = cosine_similarity(target_emb, stored_emb)
                        if sim > highest_sim:
                            highest_sim = sim
                            best_match_file = record.get('filename')
                            
            if highest_sim > 0.85:
                os.remove(filepath)
                return jsonify({
                    'error': f'Media rejected: Duplicate or highly similar media already exists.',
                    'matched_file': best_match_file,
                    'similarity': round(highest_sim * 100, 2)
                }), 409
                
            # ==========================================
            # STEP 3: STORE EMBEDDINGS IN MONGODB
            # ==========================================
            record = {
                'filename': filename,
                'type': media_type,
                'hashes': hashes,
                'embeddings': embeddings,
                'upload_time': datetime.utcnow()
            }
            
            result = media_collection.insert_one(record)
            record['_id'] = str(result.inserted_id) # Convert ObjectId to string for JSON
            
            # Remove full embeddings from response to keep JSON light for frontend
            record.pop('embeddings', None)
            
            return jsonify({
                'message': 'File fingerprinted and stored successfully',
                'data': record
            }), 201
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            try:
                if os.path.exists(filepath):
                    os.remove(filepath)
            except Exception as cleanup_err:
                print(f"Cleanup error: {cleanup_err}")
            return jsonify({'error': str(e) or repr(e)}), 500

# ==========================================
# MEDIA LIBRARY MANAGEMENT
# ==========================================

@app.route('/media', methods=['GET'])
def get_all_media():
    try:
        from bson.objectid import ObjectId
        media_cursor = media_collection.find().sort('upload_time', -1)
        media_list = []
        for record in media_cursor:
            record['_id'] = str(record['_id'])
            record.pop('embeddings', None)
            media_list.append(record)
        return jsonify({'media': media_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/media/<media_id>', methods=['GET'])
def get_media(media_id):
    try:
        from bson.objectid import ObjectId
        record = media_collection.find_one({'_id': ObjectId(media_id)})
        if not record:
            return jsonify({'error': 'Media not found'}), 404
        record['_id'] = str(record['_id'])
        record.pop('embeddings', None)
        return jsonify(record), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/media/<media_id>', methods=['DELETE'])
def delete_media(media_id):
    try:
        from bson.objectid import ObjectId
        record = media_collection.find_one({'_id': ObjectId(media_id)})
        if not record:
            return jsonify({'error': 'Media not found'}), 404
            
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], record.get('filename', ''))
        if os.path.exists(filepath):
            os.remove(filepath)
            
        media_collection.delete_one({'_id': ObjectId(media_id)})
        return jsonify({'message': 'Media deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/media/rescan/<media_id>', methods=['POST'])
def rescan_media(media_id):
    try:
        from bson.objectid import ObjectId
        record = media_collection.find_one({'_id': ObjectId(media_id)})
        if not record:
            return jsonify({'error': 'Media not found'}), 404
            
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], record.get('filename', ''))
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found on server'}), 404
            
        ext = record.get('filename', '').rsplit('.', 1)[-1].lower()
        hashes = []
        embeddings = []
        
        if ext in ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']:
            hashes = [compute_image_hash(filepath)]
            emb = extract_embedding(filepath)
            if emb:
                embeddings = [emb]
        elif ext in ['mp4', 'avi', 'mov', 'mkv', 'webm']:
            hashes, embeddings = process_video_frames(filepath, interval=2)
            
        media_collection.update_one(
            {'_id': ObjectId(media_id)},
            {'$set': {'hashes': hashes, 'embeddings': embeddings}}
        )
        
        return jsonify({'message': 'Media rescanned successfully', 'hashes': hashes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# ==========================================
# INCIDENT MANAGEMENT API
# ==========================================

@app.route('/incidents', methods=['GET'])
def get_all_incidents():
    try:
        status_filter = request.args.get('status')
        query = {}
        if status_filter:
            query['status'] = status_filter
            
        cursor = incidents_collection.find(query).sort('timestamp', -1)
        incidents = []
        for record in cursor:
            record['_id'] = str(record['_id'])
            # Normalize fields to match frontend expectations
            record['created_at'] = record.get('timestamp') or record.get('created_at')
            record['media_url'] = record.get('image_url') or record.get('filename') or record.get('media_url')
            # Normalize similarity (ensure it's a percentage)
            sim = record.get('similarity', 0)
            if sim <= 1.0:
                record['similarity'] = round(sim * 100, 2)
            incidents.append(record)
            
        return jsonify(incidents), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/incidents/<incident_id>', methods=['GET'])
def get_incident(incident_id):
    try:
        from bson.objectid import ObjectId
        record = incidents_collection.find_one({'_id': ObjectId(incident_id)})
        if not record:
            return jsonify({'error': 'Incident not found'}), 404
        record['_id'] = str(record['_id'])
        record['created_at'] = record.get('timestamp') or record.get('created_at')
        record['media_url'] = record.get('image_url') or record.get('filename') or record.get('media_url')
        sim = record.get('similarity', 0)
        if sim <= 1.0:
            record['similarity'] = round(sim * 100, 2)
        return jsonify(record), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/incidents/<incident_id>/resolve', methods=['POST'])
def resolve_incident(incident_id):
    try:
        from bson.objectid import ObjectId
        result = incidents_collection.update_one(
            {'_id': ObjectId(incident_id)},
            {'$set': {'status': 'resolved', 'resolved_at': datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'Incident not found'}), 404
        return jsonify({'message': 'Incident marked as resolved'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/incidents/<incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    try:
        from bson.objectid import ObjectId
        result = incidents_collection.delete_one({'_id': ObjectId(incident_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Incident not found'}), 404
        return jsonify({'message': 'Incident deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# STEP 5: DETECTION API
# ==========================================
@app.route('/check-similarity', methods=['POST'])
def check_similarity():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
        
    if file:
        import uuid
        base_filename = secure_filename(file.filename)
        name, ext_part = os.path.splitext(base_filename)
        filename = f"{name}_{uuid.uuid4().hex[:8]}{ext_part}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        ext = filename.rsplit('.', 1)[-1].lower()
        
        try:
            target_embeddings = []
            target_hash = None
            if ext in ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']:
                target_hash = compute_image_hash(filepath)
                emb = extract_embedding(filepath)
                if emb:
                    target_embeddings = [emb]
            elif ext in ['mp4', 'avi', 'mov', 'mkv', 'webm']:
                hashes, target_embeddings = process_video_frames(filepath, interval=2)
                target_hash = hashes[0] if hashes else None
            else:
                os.remove(filepath)
                return jsonify({'error': 'Unsupported file type'}), 400
                
            if not target_embeddings:
                os.remove(filepath)
                return jsonify({'error': 'Could not generate AI embeddings'}), 400
                
            # Compare AI embeddings with all stored DB embeddings
            best_match_file = None
            highest_sim = 0.0
            
            for record in media_collection.find():
                stored_embeddings = record.get('embeddings', [])
                
                # Check maximum similarity across all frames/images
                for target_emb in target_embeddings:
                    for stored_emb in stored_embeddings:
                        sim = cosine_similarity(target_emb, stored_emb)
                        if sim > highest_sim:
                            highest_sim = sim
                            best_match_file = record.get('filename')
            
            # Clean up uploaded file
            os.remove(filepath)
            
            is_match = highest_sim > 0.85
            sim_percentage = round(highest_sim * 100, 2)
            
            print(f"DEBUG - API [/check-similarity]: Target file compared against DB.")
            print(f"DEBUG - Matched File: {best_match_file} | Similarity: {highest_sim} ({sim_percentage}%)")
            
            # ==========================================
            # STEP 6: INCIDENT CREATION & ALERT TRIGGER
            # ==========================================
            if is_match and best_match_file:
                incident = {
                    'filename': filename,
                    'matched_file': best_match_file,
                    'similarity': highest_sim,
                    'timestamp': datetime.utcnow(),
                    'status': 'open'
                }
                incidents_collection.insert_one(incident)
                
                alert_data = {
                    "source_url": "Manual Upload / Scanner",
                    "matched_file": best_match_file,
                    "similarity": sim_percentage,
                    "type": "Unauthorized Use",
                    "timestamp": datetime.utcnow().isoformat(),
                    "status": "new"
                }
                trigger_alert(alert_data)
            
            # ---- ANALYTICS: log this scan ----
            scan_log = {
                'type': 'check_similarity',
                'filename': filename,
                'similarity': sim_percentage,
                'is_match': is_match,
                'scanned_at': datetime.utcnow()
            }
            scan_logs_collection.insert_one(scan_log)
            # ------------------------------------
            
            return jsonify({
                'match': is_match,
                'similarity': sim_percentage,
                'matched_file': best_match_file,
                'target_hash': target_hash,
                'score': highest_sim
            }), 200
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e) or repr(e)}), 500

# ==========================================
# TESTING ENDPOINT
# ==========================================
@app.route('/test-similarity', methods=['POST'])
def test_similarity():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
        
    if file:
        import uuid
        base_filename = secure_filename(file.filename)
        name, ext_part = os.path.splitext(base_filename)
        filename = f"{name}_{uuid.uuid4().hex[:8]}{ext_part}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        ext = filename.rsplit('.', 1)[-1].lower()
        
        try:
            target_embeddings = []
            if ext in ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']:
                emb = extract_embedding(filepath)
                if emb:
                    target_embeddings = [emb]
            elif ext in ['mp4', 'avi', 'mov', 'mkv', 'webm']:
                _, target_embeddings = process_video_frames(filepath, interval=2)
            else:
                os.remove(filepath)
                return jsonify({'error': 'Unsupported file type'}), 400
                
            if not target_embeddings:
                os.remove(filepath)
                return jsonify({'error': 'Could not generate AI embeddings'}), 400
                
            best_match_file = None
            highest_sim = 0.0
            
            for record in media_collection.find():
                stored_embeddings = record.get('embeddings', [])
                
                for target_emb in target_embeddings:
                    for stored_emb in stored_embeddings:
                        sim = cosine_similarity(target_emb, stored_emb)
                        if sim > highest_sim:
                            highest_sim = sim
                            best_match_file = record.get('filename')
            
            os.remove(filepath)
            
            is_match = highest_sim > 0.85
            sim_percentage = round(highest_sim * 100, 2)
            
            print(f"DEBUG - API [/test-similarity]: Target file compared against DB.")
            print(f"DEBUG - Matched File: {best_match_file} | Similarity: {highest_sim} ({sim_percentage}%)")
            
            label = "Different Image"
            if highest_sim >= 0.95:
                label = "Same Image"
                is_match = True
            elif highest_sim >= 0.80:
                label = "Edited Version"
                is_match = True
            else:
                is_match = False
                
            if is_match and best_match_file:
                alert_data = {
                    "source_url": "Similarity Test Tool",
                    "matched_file": best_match_file,
                    "similarity": sim_percentage,
                    "type": label,
                    "timestamp": datetime.utcnow().isoformat(),
                    "status": "new"
                }
                trigger_alert(alert_data)

            # ---- ANALYTICS: log this scan ----
            scan_log = {
                'type': 'test_similarity',
                'filename': filename,
                'similarity': sim_percentage,
                'is_match': is_match,
                'scanned_at': datetime.utcnow()
            }
            scan_logs_collection.insert_one(scan_log)
            # ------------------------------------
                
            return jsonify({
                'match': is_match,
                'similarity': sim_percentage,
                'matched_file': best_match_file,
                'label': label
            }), 200
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e) or repr(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==========================================
# ALERTS API
# ==========================================
@app.route('/alerts', methods=['GET'])
def get_alerts():
    try:
        records = []
        for r in alerts_collection.find().sort("timestamp", -1).limit(50):
            r['_id'] = str(r['_id'])
            records.append(r)
        return jsonify({'alerts': records}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/alerts/mark-read', methods=['POST'])
def mark_read():
    try:
        data = request.json or {}
        alert_id = data.get('id')
        from bson.objectid import ObjectId
        if alert_id:
            alerts_collection.update_one({'_id': ObjectId(alert_id)}, {'$set': {'status': 'read'}})
        else:
            alerts_collection.update_many({'status': 'new'}, {'$set': {'status': 'read'}})
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# ANALYTICS API
# ==========================================
@app.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        from datetime import timedelta

        total_media = media_collection.count_documents({})
        total_scans = scan_logs_collection.count_documents({})
        total_violations = incidents_collection.count_documents({})
        total_alerts = alerts_collection.count_documents({})

        # --- Average detection time (from upload_time to first alert per file) ---
        avg_det_time = 'N/A'
        try:
            pipeline = [
                {'$lookup': {
                    'from': 'alerts',
                    'localField': 'filename',
                    'foreignField': 'matched_file',
                    'as': 'related_alerts'
                }},
                {'$unwind': '$related_alerts'},
                {'$project': {
                    'diff_seconds': {
                        '$divide': [
                            {'$subtract': ['$related_alerts.timestamp_dt', '$upload_time']},
                            1000
                        ]
                    }
                }},
                {'$group': {'_id': None, 'avg_seconds': {'$avg': '$diff_seconds'}}}
            ]
            result = list(media_collection.aggregate(pipeline))
            if result and result[0].get('avg_seconds'):
                avg_seconds = abs(result[0]['avg_seconds'])
                avg_minutes = round(avg_seconds / 60, 1)
                avg_det_time = f'{avg_minutes} min'
        except Exception:
            pass  # fallback stays 'N/A'

        # --- Last-24h detection chart (hourly scan counts) ---
        now = datetime.utcnow()
        chart_data = []
        for h in range(23, -1, -1):
            bucket_start = now - timedelta(hours=h + 1)
            bucket_end = now - timedelta(hours=h)
            label = bucket_end.strftime('%H:%M')
            count = scan_logs_collection.count_documents({
                'scanned_at': {'$gte': bucket_start, '$lt': bucket_end}
            })
            chart_data.append({'time': label, 'scans': count})

        return jsonify({
            'total_media': total_media,
            'total_scans': total_scans,
            'total_violations': total_violations,
            'total_alerts': total_alerts,
            'avg_detection_time': avg_det_time,
            'chart_data': chart_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scan-web', methods=['GET'])
def scan_web():
    try:
        violations = crawl_web()
        return jsonify({
            'message': 'Scan completed',
            'violations': violations
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start background scheduler for automated scans
scheduler = BackgroundScheduler()
scheduler.add_job(func=crawl_web, trigger="interval", minutes=5)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
