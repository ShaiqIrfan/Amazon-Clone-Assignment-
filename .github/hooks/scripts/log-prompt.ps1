Param()
Set-StrictMode -Version Latest
if (-not (Test-Path -Path .agent-logs)) { New-Item -ItemType Directory -Path .agent-logs | Out-Null }
if (-not (Test-Path -Path .github/hooks/session_state)) { New-Item -ItemType Directory -Path .github/hooks/session_state | Out-Null }
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

$stateFile = Join-Path -Path '.github/hooks/session_state' -ChildPath ("$sid.json")
$prompt = ""
$timestamp = ""
if (Test-Path -Path $stateFile) {
    try { $st = Get-Content -Path $stateFile -Raw | ConvertFrom-Json -ErrorAction Stop } catch { $st = $null }
    if ($st -ne $null) {
        $prompt = $st.prompt
        $timestamp = $st.timestamp
    }
}

$transcriptPath = $data.transcript_path -or $data.transcriptPath -or ""
$assistantResponse = ""
$modelName = ""
if ($transcriptPath -and (Test-Path -Path $transcriptPath)) {
    try {
        $txt = Get-Content -Path $transcriptPath -Raw -ErrorAction Stop
        $json = $null
        try { $json = $txt | ConvertFrom-Json -ErrorAction Stop } catch { $json = $null }
        if ($json -ne $null) {
            # Attempt to find last assistant message in common fields
            $assistantResponse = ($json | Select-String -Pattern 'assistant' -SimpleMatch -AllMatches | Select-Object -Last 1).ToString()
            if (-not $assistantResponse) { $assistantResponse = ($json | ConvertTo-Json -Compress) }
            if ($json.PSObject.Properties.Name -contains 'model') { $modelName = $json.model }
            elseif ($json.PSObject.Properties.Name -contains 'model_name') { $modelName = $json.model_name }
        } else {
            # Try JSONL: read last non-empty line
            $last = Get-Content -Path $transcriptPath | Where-Object { $_ -match '\S' } | Select-Object -Last 1
            if ($last) {
                try { $lj = $last | ConvertFrom-Json -ErrorAction Stop; $assistantResponse = $lj.response -or $lj.message -or $lj.content } catch { $assistantResponse = $last }
            }
        }
    } catch {
        # ignore parse errors
    }
}

# payload may include assistant text directly
if ($data.PSObject.Properties.Name -contains 'last_assistant_message') { $assistantResponse = $data.last_assistant_message }
elseif ($data.PSObject.Properties.Name -contains 'lastAssistantMessage') { $assistantResponse = $data.lastAssistantMessage }

# Write minimal YAML/markdown log
$ts = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$outfile = Join-Path -Path '.agent-logs' -ChildPath ("$ts_$sid.md")

@"
---
session_id: $sid
date: $ts
model: $modelName
---

user_prompt: |
  $prompt

assistant_response: |
  $assistantResponse
"@ | Set-Content -Path $outfile -Encoding UTF8

if (Test-Path -Path $stateFile) { Remove-Item -Path $stateFile -Force }

Write-Output ("{""status"": ""ok"", ""file"": ""$outfile""}")
