param()

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
$data = $raw | ConvertFrom-Json

$session_id = $data.session_id
$model = if ($data.PSObject.Properties.Name -contains 'model') { $data.model } else { "" }

$project_dir = $env:CLAUDE_PROJECT_DIR
if (-not $project_dir) { $project_dir = (Get-Location).Path }

$agentLogs = Join-Path $project_dir ".agent-logs"
New-Item -ItemType Directory -Path $agentLogs -Force | Out-Null

$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd_HH-mm-ss")
$filename = "${timestamp}_$session_id.md"
$filepath = Join-Path $agentLogs $filename

# author: try git config user.name, otherwise environment user
try {
  $author = (& git -C $project_dir config user.name) -join ""
} catch { $author = $null }
if (-not $author) { $author = $env:USERNAME }

$project_name = Split-Path $project_dir -Leaf
$dateISO = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

$header = @"
---
session_id: $session_id
date: $dateISO
author: $author
model: $model
tool: Claude Code (VS Code extension)
project: $project_name
total_exchanges: 0
first_prompt_time:
last_prompt_time:
---

# Session Log

"@

Set-Content -Path $filepath -Value $header -Encoding UTF8

# create session state
$stateDir = Join-Path $project_dir ".claude\hooks\session_state"
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
$stateFile = Join-Path $stateDir ("$session_id.json")

$state = @{ log_file = $filepath; exchange_count = 0; first_prompt_time = $null; last_prompt_time = $null; model = $model }
$state | ConvertTo-Json | Set-Content -Path $stateFile -Encoding UTF8

exit 0
