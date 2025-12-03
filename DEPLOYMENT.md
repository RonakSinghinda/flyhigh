# SpendWise MVP - Deployment Guide

Production deployment instructions for SpendWise expense management system.

---

## Deployment Overview

This guide covers deployment to popular cloud platforms:
- **Backend**: Railway, Render, or Heroku
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas (cloud)

---

## MongoDB Atlas Setup (Database)

### 1. Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project

### 2. Create Cluster

1. Click **"Build a Cluster"**
2. Choose **FREE tier (M0)**
3. Select cloud provider and region (closest to your backend)
4. Click **"Create Cluster"**

### 3. Configure Database Access

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Create username and password (save these!)
4. Set privileges to **"Read and write to any database"**

### 4. Configure Network Access

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add specific IP addresses for production
4. Click **"Confirm"**

### 5. Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/spendwise?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials

---

## Backend Deployment

### Option 1: Railway (Recommended)

#### 1. Prepare Backend

Create `.env.production` in backend folder:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRE=7d
CLIENT_URL=<your-frontend-url>
```

#### 2. Deploy to Railway

1. Visit [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Node.js

#### 3. Configure Environment Variables

1. Go to **Variables** tab
2. Add all variables from `.env.production`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `CLIENT_URL`
   - `PORT`
   - `NODE_ENV`

#### 4. Set Start Command

1. Go to **Settings**
2. Set **Start Command**: `node server.js`
3. Set **Root Directory**: `/backend`

#### 5. Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

---

### Option 2: Render

#### 1. Create Web Service

1. Visit [Render.com](https://render.com)
2. Sign up and create **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: spendwise-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### 2. Add Environment Variables

Add all variables from `.env.production` in the **Environment** section.

#### 3. Deploy

Click **Create Web Service** and wait for deployment.

---

### Option 3: Heroku

#### 1. Install Heroku CLI

```powershell
winget install Heroku.HerokuCLI
```

#### 2. Login to Heroku

```powershell
heroku login
```

#### 3. Create Heroku App

```powershell
cd backend
heroku create spendwise-backend
```

#### 4. Set Environment Variables

```powershell
heroku config:set MONGODB_URI="<your-mongodb-uri>"
heroku config:set JWT_SECRET="<your-secret>"
heroku config:set JWT_EXPIRE="7d"
heroku config:set CLIENT_URL="<your-frontend-url>"
heroku config:set NODE_ENV="production"
```

#### 5. Deploy

```powershell
git push heroku main
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Update API Base URL

Edit `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // ... rest of config
});
```

#### 2. Create Environment File

Create `frontend/.env.production`:
```
VITE_API_URL=<your-backend-url>/api
```

For example:
```
VITE_API_URL=https://your-app.up.railway.app/api
```

#### 3. Deploy to Vercel

1. Visit [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 4. Add Environment Variables

In Vercel project settings:
- Add `VITE_API_URL` with your backend URL

#### 5. Deploy

Click **Deploy** and wait for completion.

---

### Option 2: Netlify

#### 1. Create `netlify.toml` in frontend folder

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy to Netlify

1. Visit [Netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"New site from Git"**
4. Select repository
5. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/dist

#### 3. Add Environment Variables

In Netlify site settings:
- Add `VITE_API_URL` with your backend URL

---

## Post-Deployment Configuration

### 1. Update Backend CORS

Ensure `backend/.env` has correct frontend URL:
```
CLIENT_URL=https://your-frontend.vercel.app
```

### 2. Update Frontend API URL

Ensure `frontend/.env.production` has correct backend URL:
```
VITE_API_URL=https://your-backend.railway.app/api
```

### 3. Test Deployment

1. Visit your frontend URL
2. Register a new user
3. Create an expense
4. Login as admin and approve

---

## SSL/HTTPS

All recommended platforms (Railway, Vercel, Netlify, Render, Heroku) provide **automatic HTTPS** for free.

---

## Environment Variables Summary

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT secret key | `random-secret-string` |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL | `https://app.vercel.app` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app/api` |

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on recommended platforms)
- [ ] Configure MongoDB Atlas IP whitelist (optional)
- [ ] Set secure CORS settings
- [ ] Enable rate limiting (add package like `express-rate-limit`)
- [ ] Add helmet.js for security headers
- [ ] Validate and sanitize all inputs
- [ ] Use strong passwords for all accounts

---

## Monitoring & Maintenance

### Backend Monitoring

- Railway/Render/Heroku provide built-in logs
- Access via platform dashboard
- Set up alerts for errors

### Database Monitoring

- MongoDB Atlas provides free monitoring
- Check database metrics in Atlas dashboard
- Set up alerts for storage/performance

### Frontend Monitoring

- Vercel/Netlify provide analytics
- Monitor page load times
- Check error logs

---

## Scaling Considerations

### Free Tier Limitations

- **Railway**: 500 hours/month, 8GB RAM
- **Render**: 750 hours/month, auto-sleep after 15 min inactivity
- **Vercel**: 100GB bandwidth/month
- **MongoDB Atlas**: 512MB storage (M0 tier)

### Upgrade Recommendations

For production with >100 users:
- Upgrade MongoDB to M10+ tier ($10+/month)
- Use paid backend hosting ($7+/month)
- Consider CDN for frontend assets
- Implement caching (Redis)

---

## Custom Domain (Optional)

### Backend Custom Domain

1. Purchase domain (e.g., api.yourdomain.com)
2. Add CNAME record pointing to platform URL
3. Configure in platform settings

### Frontend Custom Domain

1. Purchase domain (e.g., app.yourdomain.com)
2. Add DNS records as per platform instructions
3. Platform will auto-provision SSL

---

## Backup Strategy

### Database Backups

- MongoDB Atlas provides automatic backups (M10+ tier)
- For M0 tier, export data manually via `mongodump`

### Code Backups

- Use Git for version control
- Push to GitHub/GitLab regularly
- Tag releases

---

## Troubleshooting Production Issues

### Backend Not Starting

- Check environment variables are set correctly
- Review platform logs for errors
- Verify MongoDB connection string

### CORS Errors

- Ensure `CLIENT_URL` matches frontend domain
- Check CORS middleware configuration

### Database Connection Errors

- Verify MongoDB Atlas credentials
- Check network access whitelist
- Ensure connection string is correct

### Frontend Can't Connect to Backend

- Verify `VITE_API_URL` is correct
- Check backend is running and accessible
- Review browser console for errors

---

## Cost Estimate

**Free Tier** (suitable for MVP and testing):
- Backend: $0 (Railway/Render free tier)
- Frontend: $0 (Vercel/Netlify free tier)
- Database: $0 (MongoDB Atlas M0)
- **Total: $0/month**

**Production** (suitable for small team):
- Backend: $7-20/month
- Frontend: $0 (free tier sufficient)
- Database: $9-25/month (M10 tier)
- **Total: $16-45/month**

---

## Next Steps

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Set up MongoDB Atlas
4. Configure environment variables
5. Test complete workflow
6. Set up monitoring
7. Configure custom domain (optional)

---

## Support Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Render Docs](https://render.com/docs)
