# Setup Vercel Environment Variables
Write-Host "🚀 Setting up Vercel Environment Variables" -ForegroundColor Cyan
Write-Host ""

$envVars = @{
    "VITE_FIREBASE_API_KEY" = "AIzaSyDFO1z-upVOuJp-v0nMKJCHMq2XD3RvVN8"
    "VITE_FIREBASE_AUTH_DOMAIN" = "placementos-ai-d335c.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID" = "placementos-ai-d335c"
    "VITE_FIREBASE_STORAGE_BUCKET" = "placementos-ai-d335c.firebasestorage.app"
    "VITE_FIREBASE_MESSAGING_SENDER_ID" = "734192125170"
    "VITE_FIREBASE_APP_ID" = "1:734192125170:web:d79f7473fc76e1091ffc6b"
    "VITE_FIREBASE_MEASUREMENT_ID" = "G-XXTMG65Y1B"
    "GEMINI_API_KEY" = "AIzaSyDaDyRIAi19edWzcLzSU5puM7vA54knl28"
}

Write-Host "Adding environment variables..." -ForegroundColor Yellow
Write-Host "Note: You'll be prompted to mark each as sensitive (press N for no)" -ForegroundColor Gray
Write-Host ""

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key..." -ForegroundColor Cyan
    
    # Add to production
    Write-Output "N" | Write-Output $value | vercel env add $key production 2>&1 | Out-Null
    
    # Add to preview
    Write-Output "N" | Write-Output $value | vercel env add $key preview 2>&1 | Out-Null
    
    # Add to development
    Write-Output "N" | Write-Output $value | vercel env add $key development 2>&1 | Out-Null
}

Write-Host ""
Write-Host "✅ Environment variables added!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Redeploy your application:" -ForegroundColor Yellow
Write-Host "  vercel --prod --yes" -ForegroundColor Cyan
