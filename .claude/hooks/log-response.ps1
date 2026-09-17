param()

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
$data = $raw | ConvertFrom-Json

$session_id = $data.session_id
$response = if ($data.PSObject.Properties.Name -contains 'last_assistant_message') { $data.last_assistant_message } else { $null }

$project_dir = $env:CLAUDE_PROJECT_DIR
if (-not $project_dir) { $project_dir = (Get-Location).Path }

$stateFile = Join-Path $project_dir ".claude\hooks\session_state\$session_id.json"
if (-not (Test-Path $stateFile)) { exit 0 }

$state = Get-Content $stateFile -Raw | ConvertFrom-Json
$logfile = $state.log_file
if (-not $logfile) { exit 0 }

$now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

if ($null -eq $response) { exit 0 }

# Append response to logfile
"`n### Response`n$response`n" | Out-File -FilePath $logfile -Append -Encoding UTF8

# update state
$state.last_prompt_time = $now
$state | ConvertTo-Json | Set-Content -Path $stateFile -Encoding UTF8

# update header in logfile
$text = Get-Content -Raw -Path $logfile
$text = [regex]::Replace($text, 'last_prompt_time: .*', "last_prompt_time: $($state.last_prompt_time)")

Set-Content -Path $logfile -Value $text -Encoding UTF8

exit 0
