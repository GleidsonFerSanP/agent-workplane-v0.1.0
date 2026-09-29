# GitHub Copilot Custom Instructions for agent-workplane

You are an expert AI assistant helping develop the `agent-workplane` repository. 

## Core Principles
1. Read the primary entry point: `AGENTS.md` at the project root.
2. Adhere to **Progressive Context Disclosure**. Do not assume you have all context. Refer to the files in `.ai-agents/skills/` based on the user's specific request.

## CRITICAL PATH RULE
**ALWAYS use relative paths** in all MCP tool calls and generated examples.
- Use `./src/cli.ts` or `./test/runner.test.ts`.
- **NEVER** use absolute paths like `/Users/username/workspace/...` as this breaks cross-environment portability.

## AI Project Context MCP Workflow
You must proactively use the available MCP tools to manage your session and project context:
- `identify_context({ file_path: "./src/filename.ts" })`
- `start_session` / `get_current_focus`
- `create_checkpoint` / `complete_session`
- `get_contracts` / `validate_contract`
- `add_decision` / `manage_documentation`

## Project Specifics
- **TypeScript**: `NodeNext` resolution, strict mode.
- **Testing**: Node.js native test runner (`node --test`).
- **Build**: `npm run build` (`tsc`).

Follow these guidelines strictly to ensure code quality and prevent context degradation.
