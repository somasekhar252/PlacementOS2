# Deployment Script for PlacementOS AI
Write-Host "🚀 Deploying PlacementOS AI..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️  Warning: .env.local file not found!" -ForegroundColor Yellow
    Write-Host "Please create .env.local with your environment variables." -ForegroundColor Yellow
    Write-Host ""
}

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check for Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if ($vercelInstalled) {
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Cyan
    Write-Host "Note: You may need to login first with 'vercel login'" -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "📋 Deployment Options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Install Vercel CLI: npm i -g vercel" -ForegroundColor Yellow
    Write-Host "2. Login: vercel login" -ForegroundColor Yellow
    Write-Host "3. Deploy: vercel --prod" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use the web interface:" -ForegroundColor Cyan
    Write-Host "- Push to GitHub" -ForegroundColor Yellow
    Write-Host "- Import on vercel.com" -ForegroundColor Yellow
    Write-Host "- Add environment variables in project settings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
