$end = (Get-Date).AddMinutes(60)
$run = 1

while ((Get-Date) -lt $end) {
  $env:PW_HTML_REPORT = "tests/reports/html-report/run-$run"
  Write-Host "Run #$run started at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  npx playwright test --reporter="html" --reporter="line" --timeout=300000
  Write-Host "Run #$run finished with exit code $LASTEXITCODE"
  $run++
}