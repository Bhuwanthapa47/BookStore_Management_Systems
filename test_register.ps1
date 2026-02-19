$body = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "test123"
    role = "CUSTOMER"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "Register Status: $($response.StatusCode)"
    Write-Host "Register Response: $($response.Content)"
} catch {
    Write-Host "Register Error: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "Body: $($reader.ReadToEnd())"
}
