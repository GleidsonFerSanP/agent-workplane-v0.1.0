# agent-workplane-v0.1.0 - AI Agent Guidelines

Welcome, AI Agent! You are working in the `agent-workplane` codebase, a quality-first control plane for routing work across Codex, Claude Code, and Google Antigravity.

This project implements **Progressive Context Disclosure**. This file is your entry point. Do not try to load all context at once. Instead, follow the links to specific files as needed for your task.

## 🚀 Quick Start
If you are starting a new session or need a quick refresher on this project's rules, immediately refer to the quick reference checklist:
- [QUICK-REFERENCE.md](./.ai-agents/QUICK-REFERENCE.md)

## 📁 Project Structure & Navigation
- `./src/cli.ts`: Main CLI entry point.
- `./src/core/`: Configuration and core logic.
- `./src/orchestration/`: Task planning and runner execution.
- `./src/routing/`: Run history and reporting.
- `./src/executors/`: Logic for dispatching to different agents.
- `./src/hooks/`: Integration hooks for other tools.
- `./test/`: Native Node.js tests.

**CRITICAL RULE**: ALWAYS use **relative paths** starting with `./` in all MCP tool calls (e.g., `./src/cli.ts`, not `/Users/.../src/cli.ts`). Absolute paths break across different developer environments.

## 🛠️ Development Environment
- **Node.js**: >= 22
- **Build**: `npm run build` (compiles TypeScript via `tsc`)
- **Test**: `npm run test` (uses Node's native test runner)
- **Check**: `npm run check` (type-checking without emitting)
- **Clean**: `npm run clean`

## 📚 Progressive Context Files
Depending on your current task, fetch the relevant context using standard file reads or MCP tools:
- **Core Skills & MCP Workflow**: [SKILL.md](./.ai-agents/skills/SKILL.md)
- **Session & Focus Management**: [SESSION-WORKFLOW.md](./.ai-agents/skills/SESSION-WORKFLOW.md)
- **Code Patterns**: [PATTERNS-REFERENCE.md](./.ai-agents/skills/PATTERNS-REFERENCE.md)
- **Interface Contracts**: [CONTRACT-REFERENCE.md](./.ai-agents/skills/CONTRACT-REFERENCE.md)
- **Documentation**: [DOCUMENTATION-WORKFLOW.md](./.ai-agents/skills/DOCUMENTATION-WORKFLOW.md)

## 🤖 MCP Tools Integration
This project integrates with the **AI Project Context MCP**. You must use these tools to manage your sessions, focus, and guidelines.
Example workflow initialization:
1. `identify_context({ file_path: "./src/cli.ts" })`
2. `get_current_focus()`
3. `start_session({ context, current_focus })`

See [SESSION-WORKFLOW.md](./.ai-agents/skills/SESSION-WORKFLOW.md) for full details on session management.
