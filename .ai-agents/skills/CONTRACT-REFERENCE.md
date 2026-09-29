# Contract Reference & Validation

In `agent-workplane`, we rely on strict typings and defined interfaces for routing tasks across Codex, Claude Code, and Antigravity.

## MCP Tools for Contracts
Use the AI Project Context MCP to manage interfaces rather than guessing:

| Tool | Purpose |
|------|---------|
| `register_contract` | Define critical interfaces that must be respected. |
| `get_contracts` | Retrieve existing interface contracts. |
| `validate_contract` | Check code against contracts. |

## Workflow for Interface Changes
If you need to change a core type (e.g., in `./src/core/config.ts` or `./src/routing/history.ts`):

1. **Fetch existing contracts**:
   `get_contracts({ file_path: "./src/core/config.ts" })`
2. **Analyze impact**:
   Ensure downstream executors (`./src/executors/`) won't break.
3. **Validate**:
   After making changes, use `validate_contract({ file_path: "./src/core/config.ts" })`.
4. **Compile**:
   Run `npm run check` to verify TypeScript strict mode validations pass.

Remember, all MCP tool calls MUST use relative paths (e.g., `./src/core/config.ts`).
