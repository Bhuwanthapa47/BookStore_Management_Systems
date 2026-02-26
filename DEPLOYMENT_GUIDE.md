# 🚀 Supabase Integration & Deployment Guide

This guide will help you integrate Supabase PostgreSQL database and deploy your Bookstore Management System.

## 📋 Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Testing](#testing)

---

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `bookstore-db`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get Database Connection Details

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **Java** (JDBC) and copy the connection string
4. It will look like:
   ```
   jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres?user=postgres&password=YOUR_PASSWORD
   ```

### Step 3: Configure Connection String

Split the connection string into parts for your backend:
- **URL**: `jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres`
- **Username**: `postgres`
- **Password**: Your database password

---

## 🔧 Backend Deployment

### Option 1: Deploy to Render.com (Recommended - Free Tier Available)

#### Step 1: Prepare Your Code
```bash
# Make sure all changes are committed
cd bookstore-backend
git add .
git commit -m "Add Supabase configuration"
git push
```

#### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com/) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `bookstore-api`
   - **Runtime**: `Docker`
   - **Branch**: `main` (or your branch name)
   - **Docker Build Context**: `bookstore-backend`
   - **Dockerfile Path**: `bookstore-backend/Dockerfile`

#### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:
```env
SPRING_PROFILE=prod
SUPABASE_DB_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-supabase-password
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRATION=86400000
FRONTEND_URL=https://your-frontend-url.netlify.app
```

5. Click **"Create Web Service"**
6. Wait for deployment to complete (~5-10 minutes)
7. Copy your backend URL (e.g., `https://bookstore-api.onrender.com`)

---

### Option 2: Deploy to Railway.app

1. Go to [Railway.app](https://railway.app/)
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables (same as Render)
5. Set Root Directory to `bookstore-backend`
6. Deploy

---

### Option 3: Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
cd bookstore-backend
heroku create bookstore-api

# Set environment variables
heroku config:set SPRING_PROFILE=prod
heroku config:set SUPABASE_DB_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
heroku config:set SUPABASE_DB_USER=postgres
heroku config:set SUPABASE_DB_PASSWORD=your-password
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-frontend-url.netlify.app

# Deploy
git push heroku main
```

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Netlify (Recommended)

#### Step 1: Update Environment Variables

1. In `bookstore-frontend/.env.production`, update:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.onrender.com
   ```

#### Step 2: Deploy to Netlify

**Method A: Via Netlify Dashboard**
1. Go to [Netlify](https://netlify.com/) and login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `bookstore-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `bookstore-frontend/dist`
5. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-api.onrender.com`
6. Click **"Deploy site"**

**Method B: Via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd bookstore-frontend

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

### Option 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd bookstore-frontend

# Set environment variable
# Create .env file with:
echo "VITE_API_BASE_URL=https://your-backend-api.onrender.com" > .env.production

# Deploy
vercel --prod

# Set environment variable in Vercel dashboard
# Go to Settings → Environment Variables
```

---

### Option 3: Deploy to GitHub Pages (Static Site)

```bash
# Install gh-pages
cd bookstore-frontend
npm install --save-dev gh-pages

# Add to package.json scripts:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Add homepage in package.json
"homepage": "https://yourusername.github.io/bookstore-frontend",

# Deploy
npm run deploy
```

---

## 🧪 Testing Your Deployment

### Test Backend

1. Open your browser and go to:
   ```
   https://your-backend-api.onrender.com/swagger-ui.html
   ```

2. Test the health endpoint:
   ```bash
   curl https://your-backend-api.onrender.com/api/auth/health
   ```

3. Test registration:
   ```bash
   curl -X POST https://your-backend-api.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "Password123!",
       "phone": "1234567890"
     }'
   ```

### Test Frontend

1. Open your deployed frontend URL
2. Try to register a new account
3. Login with the account
4. Browse books and create an order

---

## 🔒 Security Checklist

- [ ] Changed default JWT secret to a strong random string (32+ characters)
- [ ] Updated CORS allowed origins to your actual frontend URL
- [ ] Supabase database password is strong and not exposed in code
- [ ] Environment variables are set in deployment platform (not in code)
- [ ] `.env` files are added to `.gitignore`
- [ ] Enabled Row Level Security (RLS) in Supabase if needed

---

## 📝 Important Notes

### Backend First Time Deployment
- The first request may take 30-60 seconds (cold start)
- Database tables will be created automatically by Hibernate
- Check logs if something goes wrong

### Free Tier Limitations
- **Render.com**: Service spins down after 15 min inactivity (cold starts)
- **Supabase**: 500 MB database, 2 GB bandwidth per month
- **Netlify**: 100 GB bandwidth per month

### Troubleshooting

**Backend won't connect to Supabase:**
- Check if connection string is correct
- Verify database password
- Ensure Supabase project is not paused
- Check Render/Railway logs for errors

**Frontend can't reach backend:**
- Verify VITE_API_BASE_URL is set correctly
- Check CORS configuration in backend
- Ensure backend is fully deployed and running

**CORS errors:**
- Update `FRONTEND_URL` in backend environment variables
- Make sure it matches your actual frontend URL

---

## 🔄 Local Development After Setup

### Run Backend Locally (MySQL)
```bash
cd bookstore-backend
# Uses dev profile (MySQL) by default
mvn spring-boot:run
```

### Run Backend with Supabase (PostgreSQL)
```bash
cd bookstore-backend
# Set environment variables
export SPRING_PROFILE=prod
export SUPABASE_DB_URL=jdbc:postgresql://...
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=your-password
mvn spring-boot:run
```

### Run Frontend Locally
```bash
cd bookstore-frontend
npm install
npm run dev
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the deployment logs in your platform dashboard
2. Verify all environment variables are set correctly
3. Test database connection from Supabase dashboard
4. Check browser console for frontend errors

---

**Happy Deploying! 🎉**
