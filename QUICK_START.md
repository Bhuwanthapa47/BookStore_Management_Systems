# Quick Start Guide - Supabase Setup

## 🚀 Quick Setup Steps

### 1. Set up Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project named "bookstore-db"
3. Wait for the project to be created (~2 minutes)
4. Go to Settings → Database
5. Copy your connection details:
   - Host: `db.xxxxxxxxxxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (the one you set during project creation)

### 2. Configure Backend for Supabase

Create a `.env` file in `bookstore-backend/` directory:

```env
SPRING_PROFILE=prod
SUPABASE_DB_URL=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-actual-password-here
JWT_SECRET=create-a-random-32-character-secret-key-here
FRONTEND_URL=http://localhost:5173
```

### 3. Test Locally with Supabase

```bash
# For Windows PowerShell
cd bookstore-backend
$env:SPRING_PROFILES_ACTIVE="prod"
$env:SUPABASE_DB_URL="jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
$env:SUPABASE_DB_USER="postgres"
$env:SUPABASE_DB_PASSWORD="your-password"
mvn spring-boot:run

# For Linux/Mac
cd bookstore-backend
export SPRING_PROFILES_ACTIVE=prod
export SUPABASE_DB_URL=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
export SUPABASE_DB_USER=postgres
export SUPABASE_DB_PASSWORD=your-password
mvn spring-boot:run
```

### 4. Deploy Backend (Render.com)

1. Push your code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your repository
5. Select Docker runtime
6. Set Root Directory: `bookstore-backend`
7. Add environment variables from step 2
8. Deploy!

### 5. Deploy Frontend (Netlify)

1. Update `bookstore-frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
2. Go to https://netlify.com
3. Import from Git
4. Set Build settings:
   - Base directory: `bookstore-frontend`
   - Build command: `npm run build`
   - Publish directory: `bookstore-frontend/dist`
5. Add environment variable: `VITE_API_BASE_URL`
6. Deploy!

## ✅ Verify Deployment

- Backend: `https://your-backend.onrender.com/swagger-ui.html`
- Frontend: `https://your-site.netlify.app`

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
