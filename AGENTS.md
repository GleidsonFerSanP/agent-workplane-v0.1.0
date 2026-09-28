# agent-workplane-v0.1.0 Agent Instructions

Welcome to the `agent-workplane` project. This is a quality-first control plane for routing work across Codex, Claude Code, and Google Antigravity.

## Core Rules
1. **Relative Paths ONLY**: ALWAYS use relative paths starting with `./` in all MCP tool calls and examples (e.g., `./src/index.ts`). Never use absolute paths like `/Users/username/...`. This is critical for team compatibility.
2. **Progressive Context**: Don't guess the architecture. Use the AI Project Context MCP tools to discover information progressively without blowing up your context window.
3. **Session Management**: Always wrap your work in a session using the provided MCP tools to maintain focus and track milestones.

## Architecture
- **Language**: TypeScript (Node.js >= 22)
- **Source Code**: `./src/`
- **Tests**: `./test/` using native `node:test`
- **Build**: `tsc -p tsconfig.json`
- **CLI Entry**: `./dist/src/cli.js`

## AI Agent Workflow (MCP)
1. Initialize context: `identify_context({ file_path: "./src/index.ts" })`
2. Check focus: `get_current_focus()`
3. Start session: `start_session({ context: "feature implementation", current_focus: "new routing logic" })`
4. Execute tasks (use discovery tools to learn more).
5. Save progress: `create_checkpoint({ summary: "implemented base router", next_focus: "test cases" })`
6. Complete session: `complete_session()`

## Deep Dive
For detailed skill descriptions, workflows, and contract validations, progressively read the `.ai-agents` directory:
- [Quick Reference](./.ai-agents/QUICK-REFERENCE.md)
- [Agent Skills](./.ai-agents/skills/SKILL.md)
- [Session Workflow](./.ai-agents/skills/SESSION-WORKFLOW.md)
- [Contract Reference](./.ai-agents/skills/CONTRACT-REFERENCE.md)
- [Documentation Workflow](./.ai-agents/skills/DOCUMENTATION-WORKFLOW.md)
- [Patterns Reference](./.ai-agents/skills/PATTERNS-REFERENCE.md)
