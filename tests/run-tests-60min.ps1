$ErrorActionPreference = "Continue"

# ---- CONFIGURE HERE (1-60 minutes) ----
$durationMinutes = 2
# ----------------------------------------

if ($durationMinutes -lt 1)  { $durationMinutes = 1 }
if ($durationMinutes -gt 60) { $durationMinutes = 60 }

$endTime       = (Get-Date).AddMinutes($durationMinutes)
$run           = 1
$totalDuration = 0
$passCount     = 0
$failCount     = 0
$blobDirs      = @()

$reportsBase = "reports"
New-Item -ItemType Directory -Force -Path $reportsBase | Out-Null

# Prevent HTML reporter from auto-opening a browser window after each run
$env:PLAYWRIGHT_HTML_OPEN = "never"

Write-Host "Starting stability test for $durationMinutes minute(s)..."
Write-Host "Tests: test_case_1 through test_case_5"
Write-Host "Per-run reports : $reportsBase\run-N-html\index.html"
Write-Host "Overall report  : $reportsBase\overall-report\index.html"

while ($true) {
    $now = Get-Date
    if ($now -ge $endTime) { break }

    Write-Host "---------------------------------------------"
    Write-Host "Run #$run started at $($now.ToString('HH:mm:ss'))"

    $runBlobDir = "$reportsBase/run-$run-blob"
    $runHtmlDir = "$reportsBase/run-$run-html"
    $blobDirs  += $runBlobDir

    # Direct each reporter to a run-specific folder via environment variables
    $env:PLAYWRIGHT_HTML_REPORT     = $runHtmlDir
    $env:PLAYWRIGHT_BLOB_OUTPUT_DIR = $runBlobDir

    $start = Get-Date

    npx playwright test `
        tests/test_case_1.spec.ts `
        tests/test_case_2.spec.ts `
        tests/test_case_3.spec.ts `
        tests/test_case_4.spec.ts `
        tests/test_case_5.spec.ts `
        --reporter=blob,html

    $exitCode      = $LASTEXITCODE
    $end           = Get-Date
    $runDuration   = ($end - $start).TotalSeconds
    $totalDuration += $runDuration

    if ($exitCode -eq 0) {
        $passCount++
        Write-Host "Run #$run PASSED"
    } else {
        $failCount++
        Write-Host "Run #$run FAILED (exit code: $exitCode)"
    }

    Write-Host "Per-run report : $runHtmlDir\index.html"
    Write-Host "Run duration   : $([math]::Round($runDuration, 2)) sec"

    $run++
    Start-Sleep -Seconds 1
}

$totalRuns = $run - 1

if ($totalRuns -eq 0) {
    Write-Host "No runs completed - duration too short."
    exit 0
}

Write-Host ""
Write-Host "=================================="
Write-Host "Generating overall merged report..."

# Copy all per-run blob zips into one staging directory
$stagingDir = "$reportsBase/all-blobs"
New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null
Get-ChildItem -Path $stagingDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
for ($i = 0; $i -lt $blobDirs.Count; $i++) {
    $blobDir = $blobDirs[$i]
    $runNo = $i + 1
    if (Test-Path $blobDir) {
        $blobFiles = Get-ChildItem -Path $blobDir -File -Filter *.zip
        foreach ($blobFile in $blobFiles) {
            $uniqueName = "run-$runNo-$($blobFile.Name)"
            Copy-Item -Path $blobFile.FullName -Destination (Join-Path $stagingDir $uniqueName) -Force
        }
    }
}

$overallHtmlDir = "$reportsBase/overall-report"
$env:PLAYWRIGHT_HTML_REPORT = $overallHtmlDir

npx playwright merge-reports --reporter html $stagingDir

$avgRunTime    = $totalDuration / $totalRuns
$estimatedRuns = ($durationMinutes * 60) / $avgRunTime

Write-Host ""
Write-Host "=================================="
Write-Host "TOTAL RUNS   : $totalRuns"
Write-Host "PASSED       : $passCount"
Write-Host "FAILED       : $failCount"
Write-Host "AVG RUN TIME : $([math]::Round($avgRunTime, 2)) sec"
Write-Host "ESTIMATED RUNS (based on avg): $([math]::Round($estimatedRuns))"
Write-Host "=================================="
Write-Host "Per-run reports : $reportsBase\run-N-html\index.html"
Write-Host "Overall report  : $overallHtmlDir\index.html"
Write-Host "=================================="