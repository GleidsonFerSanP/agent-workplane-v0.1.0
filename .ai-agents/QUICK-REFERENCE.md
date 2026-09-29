# AI Agent Quick Reference - agent-workplane

Condensed checklist designed to fit into working memory (<500 tokens). Review this before taking action.

---

## 🚨 Critical Path Rule
**ALWAYS use relative paths starting with `./`** in all tool calls:
- ✅ `identify_context({ file_path: "./src/cli.ts" })`
- ❌ `identify_context({ file_path: "/Users/.../src/cli.ts" })`

---

## 🔄 Standard Turn Lifecycle

1. **Identify Context**:
   `identify_context({ file_path: "./src/target.ts" })`
2. **Check Focus**:
   `get_current_focus()`
3. **Initialize Session / Guidelines**:
   `start_session({ context: "agent-workplane", current_focus: "task description" })`
   OR `get_merged_guidelines({ context: "agent-workplane" })`
4. **Implement**:
   - Write code with ESM `.js` import extensions (`./core/types.js`).
   - Run verification: `npm run check && npm run test`.
5. **Checkpoint Milestone**:
   `create_checkpoint({ summary: "what was done", next_focus: "next step" })`
6. **Refresh (Every 10 Turns)**:
   `refresh_session_context()`
7. **Complete Session**:
   `complete_session()`

---

## ⚡ Fast Commands

| Action | Command |
|---|---|
| Typecheck | `npm run check` |
| Native Tests | `npm run test` |
| Build TS | `npm run build` |
| Work CLI Doctor | `node ./dist/src/cli.js doctor` |

---

## 🔗 Progressive Context Links

- [Full Guidelines](../AGENTS.md)
- [Skills Hub](./skills/SKILL.md)
- [Session Management](./skills/SESSION-WORKFLOW.md)
- [Contracts & Types](./skills/CONTRACT-REFERENCE.md)
- [Documentation & ADRs](./skills/DOCUMENTATION-WORKFLOW.md)
- [Code Patterns](./skills/PATTERNS-REFERENCE.md)
- [Copilot Instructions](./copilot-instructions.md)
