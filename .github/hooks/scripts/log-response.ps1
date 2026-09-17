Param()
Set-StrictMode -Version Latest
if (-not (Test-Path -Path .agent-logs)) { New-Item -ItemType Directory -Path .agent-logs | Out-Null }
$inputJson = [Console]::In.ReadToEnd()
try {
    $data = $inputJson | ConvertFrom-Json -ErrorAction Stop
} catch {
    exit 0
}
$sid = $null
if ($data.PSObject.Properties.Name -contains 'session_id') { $sid = $data.session_id }
elseif ($data.PSObject.Properties.Name -contains 'sessionId') { $sid = $data.sessionId }
else { $sid = 'unknown' }
$logFile = Join-Path -Path '.agent-logs' -ChildPath "$sid.jsonl"
Add-Content -Path $logFile -Value $inputJson
Write-Output "{\"status\": \"ok\", \"file\": \"$logFile\"}"
