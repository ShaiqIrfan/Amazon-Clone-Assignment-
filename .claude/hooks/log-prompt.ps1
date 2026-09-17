param()

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
$data = $raw | ConvertFrom-Json

$session_id = $data.session_id
$prompt = $data.prompt -join "\n"

$project_dir = $env:CLAUDE_PROJECT_DIR
if (-not $project_dir) { $project_dir = (Get-Location).Path }

$stateFile = Join-Path $project_dir ".claude\hooks\session_state\$session_id.json"

if (-not (Test-Path $stateFile)) {
  # fallback: create a session log entry
  & "$project_dir\.claude\hooks\create-session-log.ps1" <<<'{}' 2>$null
}

if (-not (Test-Path $stateFile)) { exit 0 }

$state = Get-Content $stateFile -Raw | ConvertFrom-Json
$logfile = $state.log_file

if (-not $logfile) { exit 0 }

$exchange = [int]$state.exchange_count + 1

$now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# Append prompt to logfile
"`n## Exchange $exchange`n`n### Prompt`n$prompt`n" | Out-File -FilePath $logfile -Append -Encoding UTF8

# update state
$state.exchange_count = $exchange
if (-not $state.first_prompt_time) { $state.first_prompt_time = $now }
$state.last_prompt_time = $now
$state | ConvertTo-Json | Set-Content -Path $stateFile -Encoding UTF8

# update header in logfile
$text = Get-Content -Raw -Path $logfile
$text = [regex]::Replace($text, 'total_exchanges: .*', "total_exchanges: $exchange")
$text = [regex]::Replace($text, 'first_prompt_time: .*', "first_prompt_time: $($state.first_prompt_time)")
$text = [regex]::Replace($text, 'last_prompt_time: .*', "last_prompt_time: $($state.last_prompt_time)")

Set-Content -Path $logfile -Value $text -Encoding UTF8

exit 0
