Param()

# Codex supplies one hook event as JSON on stdin.  This script intentionally
# consumes only the documented prompt, final-message, session, and model fields.
Set-StrictMode -Version Latest
$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }

try { $event = $raw | ConvertFrom-Json -ErrorAction Stop } catch { exit 0 }
if (-not $event.cwd -or -not $event.session_id) { exit 0 }

$projectDir = [string]$event.cwd
$stateDir = Join-Path $projectDir '.codex\hooks\session_state'
$logsDir = Join-Path $projectDir '.agent-logs'
$stateFile = Join-Path $stateDir ("{0}.json" -f $event.session_id)

function ConvertTo-LiteralBlock([AllowNull()][string]$Value) {
    if ($null -eq $Value) { return '  ' }
    return (($Value -replace "`r`n", "`n" -replace "`r", "`n") -split "`n", -1 | ForEach-Object { "  $_" }) -join "`n"
}

if ($event.hook_event_name -eq 'UserPromptSubmit') {
    if ($null -eq $event.prompt) { exit 0 }
    New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
    $state = [ordered]@{
        prompt = [string]$event.prompt
        timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        model = [string]$event.model
    }
    $state | ConvertTo-Json -Compress | Set-Content -LiteralPath $stateFile -Encoding utf8
    exit 0
}

if ($event.hook_event_name -eq 'Stop') {
    if (-not (Test-Path -LiteralPath $stateFile)) { '{}' ; exit 0 }
    try { $state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json -ErrorAction Stop } catch { '{}' ; exit 0 }
    if ($null -eq $event.last_assistant_message) { '{}' ; exit 0 }

    New-Item -ItemType Directory -Force -Path $logsDir | Out-Null
    $fileTimestamp = ([string]$state.timestamp).Replace(':', '-').Replace('T', '_').Replace('Z', '')
    $logFile = Join-Path $logsDir ("{0}_{1}.md" -f $fileTimestamp, $event.session_id)
    $model = if ($event.model) { [string]$event.model } else { [string]$state.model }
    $markdown = @"
user_prompt: |
$(ConvertTo-LiteralBlock $state.prompt)

assistant_response: |
$(ConvertTo-LiteralBlock ([string]$event.last_assistant_message))

date: $($state.timestamp)
model: $model
"@
    Set-Content -LiteralPath $logFile -Value $markdown -Encoding utf8
    Remove-Item -LiteralPath $stateFile -Force
    '{}' 
}
