# Deployment Guide - Render + MongoDB Atlas

## 🚀 Quick Deployment Steps

### Phase 1: MongoDB Atlas Setup (5 minutes)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new project

2. **Create a Free Cluster**
   - Click "Build a Cluster"
   - Select "M0 Free" tier
   - Choose your preferred region
   - Click "Create"

3. **Get Connection String**
   - Once cluster is created, click "Connect"
   - Choose "Drivers"
   - Copy the connection string
   - Replace `<password>` and `<username>` with your credentials
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/digital_asset_protection`

---

### Phase 2: Deploy Backend on Render (10 minutes)

1. **Push Latest Changes to GitHub**
   ```bash
   git add .
   git commit -m "Updated for production deployment"
   git push
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub
   - Connect your GitHub account

3. **Create Web Service for Backend**
   - Click "New +" → "Web Service"
   - Connect to your GitHub repo
   - Select repository: `Digital-Asset-Protection`
   - Configure:
     - **Name**: `digital-asset-protection-backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r backend/requirements.txt`
     - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT backend.app:app`
     - **Plan**: Free tier

4. **Add Environment Variables**
   - In Render dashboard, go to your service settings
   - Click "Environment"
   - Add new variable:
     - **Key**: `MONGODB_URI`
     - **Value**: `[Your MongoDB Atlas connection string from Phase 1]`
   - Add another:
     - **Key**: `FLASK_ENV`
     - **Value**: `production`
   - Click "Deploy"

5. **Get Your Backend URL**
   - Once deployed, you'll see: `https://digital-asset-protection-backend.onrender.com`
   - ✅ **This is your backend URL**

---

### Phase 3: Deploy Frontend on Render (10 minutes)

1. **Create Static Site for Frontend**
   - In Render dashboard, click "New +" → "Static Site"
   - Select the same GitHub repo
   - Configure:
     - **Name**: `digital-asset-protection-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Click "Create Static Site"

2. **Update API Calls**
   - In your React code, update all API calls to use:
     ```javascript
     const API_BASE = process.env.REACT_APP_API_URL || 'https://digital-asset-protection-backend.onrender.com'
     ```
   - Or manually update axios baseURL in your API files

3. **Deploy & Get Frontend URL**
   - Render will automatically deploy
   - Your frontend URL: `https://digital-asset-protection-frontend.onrender.com`
   - ✅ **This is your hosting link**

---

## 📱 Final URLs

- **Frontend (Your App)**: `https://digital-asset-protection-frontend.onrender.com`
- **Backend API**: `https://digital-asset-protection-backend.onrender.com`
- **MongoDB**: `mongodb+srv://...` (Atlas)

---

## ⚠️ Important Notes

- Free tier services sleep after 15 minutes of inactivity (takes ~30 sec to wake up)
- MongoDB Atlas free tier has storage limits (512 MB)
- For production, consider upgrading to paid plans
- PyTorch models may take time to download on first deploy (be patient!)

---

## 🔧 Environment Variables Needed

**Backend (Render):**
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `FLASK_ENV`: `production`

**Frontend (Render):**
- (No additional variables needed if hardcoding backend URL)

---

## ✅ Verification

Once deployed, test:
1. Visit your frontend URL
2. Try uploading/checking media
3. Verify MongoDB is storing data
4. Check Render logs if issues occur
