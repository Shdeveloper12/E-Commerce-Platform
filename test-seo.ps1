# SEO Quick Test Script
# Run this to check your website's SEO status

$baseUrl = "https://tech-bazar-swart.vercel.app"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   TechBazar SEO Quick Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Sitemap
Write-Host "1. Testing Sitemap..." -ForegroundColor Yellow
try {
    $sitemap = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing
    if ($sitemap.StatusCode -eq 200) {
        $urlCount = ([regex]::Matches($sitemap.Content, '<loc>')).Count
        Write-Host "   ✅ Sitemap: OK ($urlCount URLs found)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Sitemap: FAILED" -ForegroundColor Red
}

# Test 2: Robots.txt
Write-Host "2. Testing Robots.txt..." -ForegroundColor Yellow
try {
    $robots = Invoke-WebRequest -Uri "$baseUrl/robots.txt" -UseBasicParsing
    if ($robots.StatusCode -eq 200) {
        Write-Host "   ✅ Robots.txt: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Robots.txt: FAILED" -ForegroundColor Red
}

# Test 3: Google Verification
Write-Host "3. Testing Google Verification..." -ForegroundColor Yellow
try {
    $verification = Invoke-WebRequest -Uri "$baseUrl/google19c4cb8233c169fd.html" -UseBasicParsing
    if ($verification.StatusCode -eq 200) {
        Write-Host "   ✅ Google Verification: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Google Verification: FAILED" -ForegroundColor Red
}

# Test 4: HTTPS
Write-Host "4. Testing HTTPS/SSL..." -ForegroundColor Yellow
try {
    $homepage = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    if ($homepage.BaseResponse.ResponseUri.Scheme -eq "https") {
        Write-Host "   ✅ HTTPS: Enabled" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ HTTPS: Issue detected" -ForegroundColor Red
}

# Test 5: Response Time
Write-Host "5. Testing Response Time..." -ForegroundColor Yellow
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    $stopwatch.Stop()
    $responseTime = $stopwatch.ElapsedMilliseconds
    
    if ($responseTime -lt 1000) {
        Write-Host "   ✅ Response Time: ${responseTime}ms (Excellent)" -ForegroundColor Green
    } elseif ($responseTime -lt 2000) {
        Write-Host "   ⚠️  Response Time: ${responseTime}ms (Good)" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  Response Time: ${responseTime}ms (Needs improvement)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Response Time: Test failed" -ForegroundColor Red
}

# Test 6: Meta Tags
Write-Host "6. Testing Meta Tags..." -ForegroundColor Yellow
try {
    $homepage = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing
    $hasTitle = $homepage.Content -match '<title>'
    $hasDescription = $homepage.Content -match 'name="description"'
    
    if ($hasTitle -and $hasDescription) {
        Write-Host "   ✅ Meta Tags: Present" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Meta Tags: Incomplete" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Meta Tags: Test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Full Report: SEO_ANALYSIS_REPORT.md" -ForegroundColor White
Write-Host "🔗 Test Online: https://pagespeed.web.dev/" -ForegroundColor White
Write-Host ""
