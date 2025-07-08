# Ascendum Form & Workflow Management System Setup Script
# This script helps set up the development environment

Write-Host "🚀 Ascendum Form & Workflow Management System Setup" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Docker is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if .NET 8 SDK is installed
try {
    dotnet --version | Out-Null
    Write-Host "✅ .NET 8 SDK is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET 8 SDK is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Download from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    node --version | Out-Null
    Write-Host "✅ Node.js is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🔧 Setting up the project..." -ForegroundColor Yellow

# Create necessary directories
Write-Host "Creating directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "temp" | Out-Null

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# Build backend
Write-Host "`n🔨 Building backend..." -ForegroundColor Cyan
Set-Location backend
dotnet restore
dotnet build
Set-Location ..

Write-Host "`n✅ Setup completed successfully!" -ForegroundColor Green
Write-Host "`n🚀 To start the application:" -ForegroundColor Yellow
Write-Host "   1. Run: docker-compose up -d" -ForegroundColor White
Write-Host "   2. Wait for all services to start" -ForegroundColor White
Write-Host "   3. Open: http://localhost:3000" -ForegroundColor White
Write-Host "   4. API docs: http://localhost:5000" -ForegroundColor White
Write-Host "`n📚 For more information, see README.md" -ForegroundColor Cyan 