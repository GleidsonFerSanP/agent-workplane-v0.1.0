# Session & Focus Management Workflow

This document outlines how to use the AI Project Context MCP to manage your workflow state.

## Core Session Tools
Use these tools to ensure you stay aligned with the user's goals and prevent context loss.

| Tool | Usage | Example |
|------|-------|---------|
| `identify_context` | Detect project/context from file. | `identify_context({ file_path: "./src/orchestration/runner.ts" })` |
| `start_session` | Begin focused work session. | `start_session({ context: "runner", current_focus: "Refactoring start logic" })` |
| `get_current_focus`| Check active state. | `get_current_focus()` |
| `update_focus` | Change focus when pivoting. | `update_focus({ focus: "Writing tests for runner" })` |
| `create_checkpoint`| Save milestone progress. | `create_checkpoint({ summary: "Refactored plan fn", next_focus: "test" })` |
| `complete_session` | Mark session as done. | `complete_session()` |
| `refresh_session_context` | Reload context if degrading. | `refresh_session_context()` |

## Best Practices
- **Relative Paths**: Always use `./src/...` or `./test/...` when identifying context.
- **Frequent Checkpoints**: Call `create_checkpoint` after every major functional implementation or successful test run.
- **Focus Alignment**: If the user asks you to switch tasks (e.g., from fixing a bug in `runner.ts` to adding a feature in `cli.ts`), call `update_focus` before starting the new task.
