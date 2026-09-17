# Assignment capture status

## Purpose and required record format

This repository retains `.agent-logs/` for the 8x Assignment Capture Setup. A compliant per-session record contains only the verbatim user prompt, full final assistant response, UTC timestamp, and model. It must not contain hidden reasoning, tool calls, diffs, retries, or intermediate messages.

## Capture mechanisms present

- **Claude Code:** `.claude/settings.json` registers `SessionStart`, `UserPromptSubmit`, and `Stop` PowerShell hooks.
- **VS Code GitHub Copilot Agent:** `.github/hooks/capture-hooks.json` registers `UserPromptSubmit` and `Stop` PowerShell hooks.
- **Codex:** `.codex/hooks.json` registers `UserPromptSubmit` and `Stop` and invokes `.codex/hooks/capture-codex.ps1`.

All configured mechanisms target `.agent-logs/`. Configuration alone is not evidence that a mechanism executed successfully.

## Confirmed evidence

- Two pre-existing Copilot canary records are preserved byte-for-byte:
  - `2026-09-17_00-00-00_3b1d042d-8d89-4db8-9b2d-6f4d12d4dd94.md` — SHA-256 `25118EF6CA58B4F93FCC59C31B7F78F2B9E72D1813331ECD976A9D9883F32703`
  - `2026-09-17_00-05-00_4f82e4d2-8f6b-4c9d-8f50-1c08a1d2a331.md` — SHA-256 `9C5D38CA85140D0F554B368CEA66DB1E9B243DEF34371E9561D31C8ED410E546`
- The two canary records identify the model as `MAI-Code-1.1-Flash`. Copilot raw transcripts confirm the producer was `copilot-agent` with Copilot version `0.60.0`, but do not independently contain a model field for the development sessions.
- Local Codex rollout metadata confirms `gpt-5.6-terra` for the two root Codex threads available in the local session store.

## Automatic-capture verification

Automatic Codex capture is **not verified**. Local Codex rollout files exist, but no new `.agent-logs/*.md` file was produced by the configured Codex hook during that work.

The raw Copilot hook artifacts show `UserPromptSubmit` and `Stop` events, but the historical development sessions did not produce compliant per-session markdown logs. The two preserved canary records must not be represented as proof that automatic capture worked for all project-development sessions.

The available evidence documents a Claude CLI authentication failure (`Not logged in`) during an earlier non-interactive test. It does **not** establish a Codex CLI canary failure caused by a home-directory issue, so no such claim is made here.

## Historical recovery audit

No new retrospective markdown records were created.

- Copilot development transcripts contain real prompts and final messages, but their relevant sessions have multiple user turns and no independently recorded model name. Reducing them to one prompt/final-response record would require selecting or inferring data.
- The available Codex root rollout threads contain multiple user turns and multiple final responses. Creating one log per thread would likewise require an arbitrary selection. The subagent rollout files are not standalone user sessions.
- The two Claude session-header markdown files are retained as historical artifacts, but have zero exchanges and no model; they are incomplete and are not compliant recovery records.

No prompt, response, timestamp, model, or session ID has been invented. No missing session has been reconstructed from memory or Git history.

## Final repository status

- `.agent-logs/` is present in the repository and contains the preserved historical artifacts.
- Four markdown files are currently present: two preserved Copilot canary records and two incomplete Claude session headers.
- No retrospective records are present and no duplicate recovery records were added.
- Future capture must be validated by observing a newly generated log from an actual session before it is described as automatic capture.
