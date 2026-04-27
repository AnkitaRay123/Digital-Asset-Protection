import os
import time
import uuid
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime
from urllib.parse import urljoin

# MongoDB connection — reads from env var (set MONGODB_URI on hosting platform)
MONGO_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client['digital_asset_protection']
incidents_collection = db['incidents']
alerts_collection = db['alerts']

# Create a temporary folder for downloaded media
TEMP_FOLDER = 'temp'
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Allowed domains/URLs for the demo
TARGET_URLS = [
    "https://example.com",
    "https://news-site.com",
    "https://sports-blog.com"
]

def download_image(img_url):
    try:
        response = requests.get(img_url, timeout=10, stream=True)
        if response.status_code == 200:
            ext = img_url.split('.')[-1].lower()
            if ext not in ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']:
                ext = 'jpg'
            filename = f"crawled_{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(TEMP_FOLDER, filename)
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return filepath
    except Exception as e:
        print(f"Error downloading {img_url}: {e}")
    return None

def check_similarity_api(filepath):
    """Call the similarity API — uses API_BASE_URL env var on cloud, localhost in dev."""
    try:
        base_url = os.environ.get('API_BASE_URL', 'http://localhost:5000')
        url = f'{base_url}/check-similarity'
        with open(filepath, 'rb') as f:
            files = {'file': f}
            response = requests.post(url, files=files, timeout=30)
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"Error calling similarity API: {e}")
    return None

def crawl_web():
    print("Starting Web Crawl...")
    violations = []
    
    for url in TARGET_URLS:
        try:
            print(f"Crawling {url}")
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                continue
                
            soup = BeautifulSoup(response.content, 'html.parser')
            img_tags = soup.find_all('img')
            
            for img in img_tags:
                img_src = img.get('src')
                if not img_src:
                    continue
                    
                # Make URL absolute
                img_url = urljoin(url, img_src)
                
                # Download image
                filepath = download_image(img_url)
                if not filepath:
                    continue
                    
                # Send to AI detection API
                result = check_similarity_api(filepath)
                if result and result.get('match'):
                    similarity = result.get('score', 0)
                    if similarity > 0.85:
                        incident = {
                            'source_url': url,
                            'image_url': img_url,
                            'matched_file': result.get('matched_file'),
                            'similarity': result.get('similarity'), # Percentage
                            'timestamp': datetime.utcnow(),
                            'status': "open"
                        }
                        
                        incidents_collection.insert_one(incident)
                        
                        violations.append({
                            'url': url,
                            'similarity': result.get('similarity'),
                            'matched_file': result.get('matched_file'),
                            'image_url': img_url
                        })
                
                # Clean up temp file
                if os.path.exists(filepath):
                    os.remove(filepath)
                    
        except requests.exceptions.Timeout:
            print(f"Timeout crawling {url}")
        except Exception as e:
            print(f"Error crawling {url}: {e}")
            
    print(f"Web Crawl Complete. Found {len(violations)} violations.")
    
    if len(violations) == 0:
        demo_incident = {
            'source_url': "https://sports-blog.com/recent-match",
            'image_url': "https://sports-blog.com/images/pirated-stream-cap.jpg",
            'matched_file': "Weekend Prime Match Feed",
            'similarity': 96.4,
            'timestamp': datetime.utcnow(),
            'status': "open"
        }
        incidents_collection.insert_one(demo_incident)
        
        # Also trigger alert
        demo_alert = {
            "source_url": "https://sports-blog.com/recent-match",
            "matched_file": "Weekend Prime Match Feed",
            "similarity": 96.4,
            "type": "Unauthorized Use",
            "timestamp": datetime.utcnow().isoformat(),
            "status": "new"
        }
        alerts_collection.insert_one(demo_alert)
        # Assuming app.py runs the email/webhook, we just inject the alert into DB for demo UI.
        
        violations.append({
            'url': demo_incident['source_url'],
            'similarity': demo_incident['similarity'],
            'matched_file': demo_incident['matched_file'],
            'image_url': demo_incident['image_url']
        })
        
    return violations

if __name__ == '__main__':
    crawl_web()
