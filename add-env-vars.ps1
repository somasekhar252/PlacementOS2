# Add environment variables to Vercel
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Cyan

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

foreach ($key in $envVars.Keys) {
    Write-Host "Adding $key..." -ForegroundColor Yellow
    $value = $envVars[$key]
    echo "N" | vercel env add $key production preview development 2>&1 | Out-Null
    # Note: You'll need to manually add values through Vercel dashboard or use vercel env pull
}

Write-Host ""
Write-Host "⚠️  Note: Due to CLI limitations, please add environment variables through:" -ForegroundColor Yellow
Write-Host "1. Vercel Dashboard: https://vercel.com/sekhars-projects-4c22b3ab/placement/settings/environment-variables" -ForegroundColor Cyan
Write-Host "2. Or use: vercel env pull .env.local" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment variables to add:" -ForegroundColor Green
foreach ($key in $envVars.Keys) {
    Write-Host "  $key = $($envVars[$key])" -ForegroundColor Gray
}
