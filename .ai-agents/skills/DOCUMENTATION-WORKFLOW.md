# Documentation & Decisions Workflow

The `agent-workplane` project uses Architectural Decision Records (ADRs) and formal documentation for new features.

## MCP Tools for Documentation
Use the AI Project Context MCP to read and write documentation contextually:

| Tool | Purpose |
|------|---------|
| `check_existing_documentation` | Search before creating new docs to avoid duplication. |
| `manage_documentation` | Create or update documentation files. |
| `add_decision` | Record architectural decisions (ADRs). |
| `get_complete_project_context` | Get a full project summary when deeply confused. |

## Workflow for New Features
1. **Check Existing**:
   `check_existing_documentation({ query: "agent executors" })`
2. **Register Feature**:
   If building something new, use `register_feature({ feature_name: "new_executor", description: "..." })`.
3. **Record Decisions**:
   If you make a major architectural choice (e.g., how Jev heuristics are routed), use `add_decision({ decision: "Use naive fallback for Jev", rationale: "..." })`.

*Reminder*: Any file paths provided to these tools MUST be relative (`./docs/adr-01.md`).
