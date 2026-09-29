# AI Agent Quick Reference

This is a condensed checklist designed to fit efficiently into your context window. Review this before starting work on the `agent-workplane` project.

## 🚨 CRITICAL PATH RULE
**ALWAYS use relative paths** starting with `./` in all MCP tool calls and examples.
- ✅ CORRECT: `identify_context({ file_path: "./src/core/config.ts" })`
- ❌ WRONG: `identify_context({ file_path: "/Users/username/workspace/agent-workplane-v0.1.0/src/core/config.ts" })`

## 📋 Session Checklist

1. **Initialization**
   - Call `identify_context({ file_path: "./src/cli.ts" })` to orient yourself.
   - Call `get_current_focus()` to check the active session.
   - If starting fresh, call `start_session({ context, current_focus })`.
   - Call `get_merged_guidelines({ context })` to load active rules.

2. **Execution**
   - Use `npm run check` to verify TypeScript typings.
   - Use `npm run test` to run native Node.js tests.
   - Update focus using `update_focus({ new_focus })` if the direction changes.

3. **Checkpoints & Completion**
   - After completing a milestone, call `create_checkpoint({ summary, next_focus })`.
   - When the task is done, call `complete_session()`.

## 🔗 Deep Dives (Progressive Context)
If you need more detailed instructions on specific areas, read these files:
- [Session Management](./skills/SESSION-WORKFLOW.md)
- [Project Code Patterns](./skills/PATTERNS-REFERENCE.md)
- [Contracts & Validation](./skills/CONTRACT-REFERENCE.md)
- [Documentation Standards](./skills/DOCUMENTATION-WORKFLOW.md)
