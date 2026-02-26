# PowerShell Script to Run Spring Boot with Supabase (PostgreSQL)
# IMPORTANT: Update the credentials below with your actual Supabase details

Write-Host "Starting Bookstore Backend with Supabase Database..." -ForegroundColor Green
Write-Host ""

# Set environment variables - UPDATE THESE WITH YOUR CREDENTIALS
$env:SPRING_PROFILES_ACTIVE = "prod"
$env:SUPABASE_DB_URL = "jdbc:postgresql://db.YOUR-PROJECT-REF.supabase.co:5432/postgres"
$env:SUPABASE_DB_USER = "postgres"
$env:SUPABASE_DB_PASSWORD = "your-supabase-password-here"
$env:JWT_SECRET = "your-super-secret-jwt-key-at-least-32-characters-long"
$env:JWT_EXPIRATION = "86400000"
$env:FRONTEND_URL = "http://localhost:5173"
$env:PORT = "8080"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "Running Maven Spring Boot..." -ForegroundColor Yellow
Write-Host ""

# Run Spring Boot
mvn spring-boot:run
