# Skills Hub - Progressive Context Disclosure

This document serves as the discovery hub for specialized context in the `agent-workplane` repository. 

Context is a finite resource. Loading unnecessary documentation degrades attention recall and triggers context rot. Rather than reading the entire repository, load specialized documentation on demand using the links below.

---

## 🚨 Path Convention Rule

**ALL MCP tool arguments and examples MUST use relative paths starting with `./`**:
- ✅ `identify_context({ file_path: "./src/routing/router.ts" })`
- ❌ `identify_context({ file_path: "/Users/developer/.../src/routing/router.ts" })`

---

## 🧭 Progressive Context Map

| Task Domain | Context File | When to Load |
|---|---|---|
| **Session & Focus** | [SESSION-WORKFLOW.md](./SESSION-WORKFLOW.md) | Beginning work, tracking state, compacting memory, changing focus |
| **Contracts & Interfaces** | [CONTRACT-REFERENCE.md](./CONTRACT-REFERENCE.md) | Modifying `types.ts`, `config.ts`, route envelopes, or executor interfaces |
| **Documentation & ADRs** | [DOCUMENTATION-WORKFLOW.md](./DOCUMENTATION-WORKFLOW.md) | Adding features, recording architecture decisions, querying docs |
| **Code Patterns** | [PATTERNS-REFERENCE.md](./PATTERNS-REFERENCE.md) | Writing ESM TypeScript, Node test runners, executor wrappers |
| **Fast Overview** | [QUICK-REFERENCE.md](../QUICK-REFERENCE.md) | Quick checklist between tasks (<500 tokens) |
| **Root Entrypoint** | [AGENTS.md](../../AGENTS.md) | Comprehensive project overview & commands |

---

## 💻 Quick Start Execution Flow

```typescript
// Step 1: Detect workspace and context from current file
const ctx = identify_context({ file_path: "./src/routing/router.ts" });

// Step 2: Check current focus
const focus = get_current_focus();

// Step 3: Start session or reload merged guidelines
start_session({
  context: "agent-workplane",
  current_focus: "Refining quality score calculation in router"
});

// Step 4: Perform implementation using test-driven flow
// Build & verify: npm run check && npm run test

// Step 5: Save milestone checkpoint
create_checkpoint({
  summary: "Added quality floor penalty test for router",
  next_focus: "Verify advisor uncertainty threshold"
});

// Step 6: Complete session
complete_session();
```

---

## 🛑 Anti-Patterns to Avoid

1. **Absolute Paths in MCP Calls**: Never pass `/Users/...` or `/home/...` to `identify_context`, `register_contract`, or `manage_documentation`.
2. **Context Stuffing**: Do not read multiple files or entire directories up front. Use discovery tools first (`get_features()`, `get_contracts()`, `check_existing_documentation()`).
3. **Skipping Typecheck and Tests**: Always verify with `npm run check` and `npm run test` before declaring a task complete.
4. **Missing Checkpoints**: Failing to call `create_checkpoint()` after completing milestones leads to lost work if a session resets.
5. **Ignoring Context Decay**: Failing to call `refresh_session_context()` after 10 turns risks hallucination and lost task constraints.
