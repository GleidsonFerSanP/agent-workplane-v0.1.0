# AGENTS.md - agent-workplane-v0.1.0

Quality-first control plane for routing work across Codex, Claude Code, and Google Antigravity with optional Jev decisions.

This project implements **Progressive Context Disclosure**. This file is your root entry point. Context is a finite resource—do not load the entire codebase into working memory at once. Follow the references below to load targeted guidance just-in-time.

---

## 🚨 Critical Path Rule

**ALWAYS use relative paths starting with `./`** in all MCP tool calls, examples, and file operations:
- ✅ **CORRECT**: `identify_context({ file_path: "./src/cli.ts" })`
- ❌ **WRONG**: `identify_context({ file_path: "/Users/username/workspace/.../src/cli.ts" })`

Absolute paths break across environments and multi-agent handoffs. Every file reference must start with `./`.

---

## ⚡ MCP Quick Start

When starting a session with the **AI Project Context MCP**, execute this standardized lifecycle:

```typescript
// 1. Orient to your target file (ALWAYS relative path)
identify_context({ file_path: "./src/cli.ts" });

// 2. Inspect active session and focus
get_current_focus();

// 3. Start session or load merged guidelines
start_session({ context: "agent-workplane", current_focus: "Implement CLI doctor check" });
get_merged_guidelines({ context: "agent-workplane" });

// 4. [Execute task using npm run check & npm run test]

// 5. Save milestone checkpoint
create_checkpoint({ summary: "Added executor verification to doctor", next_focus: "Add unit tests" });

// 6. Complete session when objective is met
complete_session();
```

If conversation extends past 10 turns, call `refresh_session_context()` to combat context rot.

---

## 🛠️ Development Environment & Commands

- **Runtime**: Node.js >= 22 (ESM, `"type": "module"`)
- **Type Check**: `npm run check` (`tsc -p tsconfig.json --noEmit`)
- **Build**: `npm run build` (`tsc -p tsconfig.json`)
- **Test**: `npm run test` (`npm run build && node --test dist/test/*.test.js`)
- **Clean**: `npm run clean` (`rm -rf dist`)
- **CLI Binary**: `node ./dist/src/cli.js` or `npm link` (command: `work`)

---

## 📐 Code Conventions

- **Module System**: ESM with `NodeNext` module resolution.
- **Import Extensions**: **MANDATORY `.js` extension** on relative imports:
  ```typescript
  import { loadConfig } from "./core/config.js";
  import { TaskEnvelope } from "./core/types.js";
  ```
- **Testing**: Native Node.js test runner (`node:test` and `node:assert/strict`). No Jest/Mocha.
- **Typing**: Strict TypeScript (`noImplicitAny`, strict null checks).
- **Error Handling**: Fail-open for non-critical heuristics (e.g. Jev timeout), fail-closed for review verification.

---

## 🏛️ Architecture Overview

The codebase is cleanly separated into two planes:
1. **Decision Plane**: Classifies task intent and deterministically selects the optimal executor and review configuration. Jev assists classification; it does not write code.
2. **Execution Plane**: Dispatches prompts to the selected CLI (`codex`, `claude`, or `agy`), enforces an independent reviewer, and applies bounded repair (`maxRework: 1`).

**Lexicographic Priority**:
1. Correctness / quality regression prevention (dominant factor)
2. Wall-clock delivery time minimization
3. Precision / rework reduction
4. Quota efficiency

### Core Directory Layout
- `./src/cli.ts`: Entry point for `work` CLI commands (`init`, `doctor`, `plan`, `start`, `status`, `history`, `report`, `install-hooks`).
- `./src/core/`: Intake (`intake.ts`), workspace inspection (`workspace.ts`), config (`config.ts`), task locking (`task-lock.ts`), interfaces (`types.ts`).
- `./src/decision/`: Jev API client (`jev.ts`), deterministic classifiers (`heuristics.ts`).
- `./src/routing/`: Routing algorithm (`router.ts`), run history store (`history.ts`), aggregations (`report.ts`), advisor fallback (`advisor.ts`).
- `./src/executors/`: Executor implementations (`codex.ts`, `claude.ts`, `antigravity.ts`, `base.ts`).
- `./src/orchestration/`: Run workflow (`runner.ts`), independent review engine (`review.ts`).
- `./src/hooks/`: Tool hooks and telemetry (`install.ts`, `handler.ts`).
- `./test/`: Native Node tests (`router.test.ts`, `task-lock.test.ts`, `heuristics.test.ts`, `router-cold-start.test.ts`).

---

## 📚 Progressive Context Directory (`.ai-agents/`)

For specialized workflows, load these progressive reference files on demand:

- [Quick Reference Checklist](./.ai-agents/QUICK-REFERENCE.md) - Condensed cheat sheet (<500 tokens).
- [Skills Hub](./.ai-agents/skills/SKILL.md) - Progressive disclosure hub and workflow patterns.
- [Session Workflow](./.ai-agents/skills/SESSION-WORKFLOW.md) - Session lifecycle, focus management, and compaction.
- [Contract Reference](./.ai-agents/skills/CONTRACT-REFERENCE.md) - Core interfaces and contract validation.
- [Documentation Workflow](./.ai-agents/skills/DOCUMENTATION-WORKFLOW.md) - ADRs and documentation governance.
- [Patterns Reference](./.ai-agents/skills/PATTERNS-REFERENCE.md) - Project code patterns and test fixtures.
- [GitHub Copilot Instructions](./.ai-agents/copilot-instructions.md) - Instructions tailored for GitHub Copilot.
