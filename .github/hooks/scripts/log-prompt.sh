#!/usr/bin/env bash
set -euo pipefail

# Capture only the user's full prompt and timestamp into a per-session state file
mkdir -p .agent-logs
mkdir -p .github/hooks/session_state
INPUT=$(cat)

SESSION_ID=$(python - <<'PY'
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
sid = d.get('session_id') or d.get('sessionId') or d.get('sessionId'.lower()) or 'unknown'
print(sid)
PY <<EOF
$INPUT
EOF

# Extract prompt and timestamp
PROMPT=$(python - <<'PY'
import sys, json
try:
    d = json.load(sys.stdin)
except Exception:
    print("")
    sys.exit(0)
print(json.dumps({
    'prompt': d.get('prompt') or d.get('Prompt') or d.get('message') or '',
    'timestamp': d.get('timestamp') or d.get('time') or ''
}))
PY <<EOF
$INPUT
EOF

STATE_FILE=".github/hooks/session_state/${SESSION_ID}.json"
echo "$PROMPT" > "$STATE_FILE"
echo "{\"status\": \"ok\", \"state_file\": \"$STATE_FILE\"}"
