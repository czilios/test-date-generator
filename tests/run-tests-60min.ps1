# Playwright Stability Runner
# ---------------------------------------------
# This script repeatedly executes the Playwright test suite
# for a fixed duration (60 minutes).
#
# The goal is to observe generator behaviour over time and
# detect potential intermittent issues such as:
# - flaky behaviour
# - formatting inconsistencies
# - rare edge cases that may not appear in a single run
#
# Each execution produces a separate report folder,
# making it easier to analyse individual runs.

# Define the end time of the stability execution window
$endTime = (Get-Date).AddMinutes(2)

# Counter used to track individual test executions
$run = 1

# Continue running tests until the defined end time is reached
while ((Get-Date) -lt $endTime) {

    # Define unique report directory for this run
    $reportPath = "tests/reports/html-report/run-$run"

    Write-Host "---------------------------------------------"
    Write-Host "Run #$run started at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

    # Execute Playwright test suite
    npx playwright test --reporter=line --reporter=html --output=$reportPath

    # Log execution result
    Write-Host "Run #$run finished with exit code $LASTEXITCODE"

    # Increment run counter
    $run++
    Write-Host "Stability execution finished after 60 minutes."
}