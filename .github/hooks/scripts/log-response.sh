#!/usr/bin/env bash
set -euo pipefail

# Compose final session log using the saved prompt state and the transcript_path provided
mkdir -p .agent-logs
mkdir -p .github/hooks/session_state
INPUT=$(cat)

SESSION_ID=$(python - <<'PY'
import sys, json
try:
        d = json.load(sys.stdin)
except Exception:
        sys.exit(0)
sid = d.get('session_id') or d.get('sessionId') or 'unknown'
print(sid)
PY <<EOF
$INPUT
EOF

# Attempt to get transcript_path and last assistant message
TRANSCRIPT_PATH=$(python - <<'PY'
import sys, json, os
try:
        d = json.load(sys.stdin)
except Exception:
        print("")
        sys.exit(0)
tp = d.get('transcript_path') or d.get('transcriptPath') or ''
print(tp)
PY <<EOF
$INPUT
EOF

STATE_FILE=".github/hooks/session_state/${SESSION_ID}.json"
PROMPT=""
TIMESTAMP=""
if [ -f "$STATE_FILE" ]; then
    PROMPT=$(jq -r '.prompt // ""' "$STATE_FILE") || PROMPT=""
    TIMESTAMP=$(jq -r '.timestamp // ""' "$STATE_FILE") || TIMESTAMP=""
fi

ASSISTANT_RESPONSE=""
MODEL_NAME=""
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    # Try to parse JSON transcript; fall back to reading last JSONL line containing assistant
    if jq -e . "$TRANSCRIPT_PATH" >/dev/null 2>&1; then
        # Traverse to find last assistant message in known shapes
        ASSISTANT_RESPONSE=$(jq -r '[.. | objects | select(.role=="assistant" or .type=="assistant" or .sender=="assistant") | .content // .message // .text] | map(select(.!=null and .!="")) | last // ""' "$TRANSCRIPT_PATH") || ASSISTANT_RESPONSE=""
        MODEL_NAME=$(jq -r '(.model // .model_name // "")' "$TRANSCRIPT_PATH" 2>/dev/null) || MODEL_NAME=""
    else
        # Try JSONL: get last line and look for assistant
        LAST=$(tail -n 200 "$TRANSCRIPT_PATH" | jq -s -c '.[-1]' 2>/dev/null || tail -n 1 "$TRANSCRIPT_PATH" )
        ASSISTANT_RESPONSE=$(echo "$LAST" | jq -r '.response // .message // .content // ""' 2>/dev/null) || ASSISTANT_RESPONSE=""
    fi
fi

# If payload contains last_assistant_message, prefer it
PAYLOAD_ASSISTANT=$(python - <<'PY'
import sys, json
try:
        d = json.load(sys.stdin)
except Exception:
        print("")
        sys.exit(0)
print(d.get('last_assistant_message') or d.get('lastAssistantMessage') or d.get('response') or "")
PY <<EOF
$INPUT
EOF

if [ -n "$PAYLOAD_ASSISTANT" ]; then
    ASSISTANT_RESPONSE="$PAYLOAD_ASSISTANT"
fi

# Compose minimal YAML/markdown log with only required fields
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
OUTFILE=".agent-logs/${TS}_${SESSION_ID}.md"
{
    echo "---"
    echo "session_id: ${SESSION_ID}"
    echo "date: ${TS}"
    echo "model: ${MODEL_NAME}"
    echo "---"
    echo
    echo "user_prompt: |"
    echo "  ${PROMPT//"/\"}"
    echo
    echo "assistant_response: |"
    echo "  ${ASSISTANT_RESPONSE//"/\"}"
} > "$OUTFILE"

# cleanup state
if [ -f "$STATE_FILE" ]; then rm -f "$STATE_FILE"; fi

echo "{\"status\": \"ok\", \"file\": \"$OUTFILE\"}"
