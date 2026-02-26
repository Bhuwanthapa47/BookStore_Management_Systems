# Local Environment Setup Guide

## For Local Development with MySQL

If you want to run the application locally with MySQL:

### Option 1: Use Environment Variables (Recommended)

Set these environment variables before running:

**Windows PowerShell:**
```powershell
$env:SPRING_PROFILES_ACTIVE = "dev"
$env:DB_PASSWORD = "your-mysql-password"
mvn spring-boot:run
```

**Windows CMD:**
```cmd
set SPRING_PROFILES_ACTIVE=dev
set DB_PASSWORD=your-mysql-password
mvn spring-boot:run
```

### Option 2: Create Local Properties File

1. Copy `application-local.properties` (if it exists) or create your own
2. Update with your MySQL credentials
3. Run with: `mvn spring-boot:run -Dspring-boot.run.profiles=local`

### Option 3: Use the Provided .env File

The `.env` file in the backend directory contains your Supabase credentials.
To use it, run:

```powershell
cd bookstore-backend
.\run-with-supabase.ps1
```

Or on Windows CMD:
```cmd
cd bookstore-backend
run-with-supabase.bat
```

## For Production with Supabase

Use the production profile with environment variables (see DEPLOYMENT_GUIDE.md)
