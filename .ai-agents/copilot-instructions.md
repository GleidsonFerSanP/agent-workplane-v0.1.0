# GitHub Copilot Custom Instructions for agent-workplane

You are an expert AI software engineer assisting in the development of `agent-workplane` (a quality-first control plane for routing tasks across Codex, Claude Code, and Google Antigravity).

---

## 📖 Primary Directive & Progressive Context

1. **Root Instructions**: Always read and follow [`AGENTS.md`](../AGENTS.md) at the project root as the primary contract.
2. **Progressive Disclosure**: Do not assume you have all context in memory. Consult specific reference documents on demand:
   - Session & state tracking: [`.ai-agents/skills/SESSION-WORKFLOW.md`](./skills/SESSION-WORKFLOW.md)
   - Interface contracts & types: [`.ai-agents/skills/CONTRACT-REFERENCE.md`](./skills/CONTRACT-REFERENCE.md)
   - Documentation & ADRs: [`.ai-agents/skills/DOCUMENTATION-WORKFLOW.md`](./skills/DOCUMENTATION-WORKFLOW.md)
   - Code patterns & testing: [`.ai-agents/skills/PATTERNS-REFERENCE.md`](./skills/PATTERNS-REFERENCE.md)
   - Quick reference cheat sheet: [`.ai-agents/QUICK-REFERENCE.md`](./QUICK-REFERENCE.md)

---

## 🚨 Critical Path Rule

**ALWAYS use relative paths starting with `./` in all examples, code, and MCP tool invocations**:
- ✅ `identify_context({ file_path: "./src/cli.ts" })`
- ❌ `identify_context({ file_path: "/Users/username/workspace/.../src/cli.ts" })`

Absolute paths break across different developer machines and CI/CD pipelines.

---

## 🛠️ MCP Workflow

When working with the AI Project Context MCP:
1. `identify_context({ file_path: "./src/file.ts" })`
2. `get_current_focus()`
3. `start_session({ context: "agent-workplane", current_focus: "task objective" })` OR `get_merged_guidelines({ context: "agent-workplane" })`
4. Execute code changes adhering to project conventions
5. `create_checkpoint({ summary: "milestone achieved", next_focus: "next step" })`
6. `refresh_session_context()` every 10 turns to combat context rot
7. `complete_session()` when finished

---

## 💻 Code Quality Rules

- **ESM Modules**: TypeScript compiles with `NodeNext`. Every relative import MUST include the `.js` extension (e.g. `import { loadConfig } from "./core/config.js";`).
- **Native Node Testing**: Tests live in `./test/` and run via native Node 22 (`npm run test`). Do not install Jest/Vitest/Mocha.
- **Verification**: Always execute `npm run check` and `npm run test` before finishing code edits.
- **Fail-Safe Semantics**: Preserve fail-open semantics for telemetry/heuristics and fail-closed semantics for review/quality gates.
