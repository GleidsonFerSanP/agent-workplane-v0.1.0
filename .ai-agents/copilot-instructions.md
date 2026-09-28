# GitHub Copilot Custom Instructions

Follow these core rules when generating or modifying code in this workspace:

1. **Relative Paths ONLY**: Always use relative paths starting with `./` in examples, comments, and tool calls (e.g., `./src/index.ts`). Never use absolute paths like `/Users/username/...`.
2. **Progressive Context**: See `./AGENTS.md` at the project root for high-level architecture. Do not guess project structure.
3. **Session Workflow**: Utilize the AI Project Context MCP tools (`identify_context`, `start_session`, `create_checkpoint`, `update_focus`, `complete_session`).
4. **TypeScript & Node 22**: Use NodeNext module resolution, ESM imports, and the native Node.js test runner (`node:test`).
5. **Code Style**: Prefer functional patterns and strict typing.
6. **Documentation**: When adding features, use `add_decision` and `manage_documentation` to keep the context up to date.

For detailed skills and workflows, explore the `./.ai-agents/skills/` directory progressively.
