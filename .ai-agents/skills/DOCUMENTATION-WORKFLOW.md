# Documentation & Architecture Decision Records (ADR) Workflow

This document governs documentation generation and architectural decision tracking for `agent-workplane`.

In accordance with progressive context disclosure, documentation is on-demand context, not default payload. Flooding context with static documentation wastes tokens and dilutes reasoning. Query documentation selectively and record architectural decisions explicitly.

---

## 🚨 Critical Path Rule
**All file path parameters MUST be relative paths starting with `./`**:
- ✅ `manage_documentation({ file_path: "./docs/ADR-002.md", content: "..." })`
- ❌ `manage_documentation({ file_path: "/Users/.../docs/ADR-002.md", content: "..." })`

---

## 🛠️ Documentation MCP Tools

| Tool | Purpose | Example |
|---|---|---|
| `check_existing_documentation` | Search existing docs before creating new ones | `check_existing_documentation({ query: "independent review" })` |
| `manage_documentation` | Create or update Markdown documentation | `manage_documentation({ file_path: "./docs/HOOKS.md", action: "update" })` |
| `add_decision` | Record an Architectural Decision Record (ADR) | `add_decision({ decision: "Independent Review Fail-Closed", rationale: "..." })` |
| `get_complete_project_context` | Retrieve full project summary when context is lost | `get_complete_project_context()` |
| `register_feature` | Document a new feature with strict business rules | `register_feature({ feature_name: "advisor_fallback", description: "..." })` |

---

## 🧭 Documentation Rules

1. **Check First**: Always run `check_existing_documentation({ query: "<topic>" })` before generating a new file in `./docs/` to prevent duplicate or conflicting documentation.
2. **Right Altitude**: Write documentation at the right altitude (Anthropic Context Engineering):
   - Focus on *why* choices were made, non-obvious invariants, failure modes, and boundaries.
   - Do not duplicate what is already self-evident from TypeScript types.
3. **ADR Protocol**: Record every architectural pivot or decision with `add_decision()`:
   - **Decision**: Concise statement of change.
   - **Rationale**: Why this design was chosen over alternatives.
   - **Trade-offs**: Downsides accepted (e.g. latency vs. correctness).

---

## 📝 Example: Adding a New Executor Feature

```typescript
// 1. Check existing documentation
const existing = check_existing_documentation({ query: "executor dispatch" });

// 2. Register feature with business rules
register_feature({
  feature_name: "cursor_executor",
  description: "Dispatches tasks to the cursor CLI with JSON streaming output",
  business_rules: [
    "Must implement base Executor interface from ./src/executors/base.ts",
    "Must enforce timeout from config.executors.cursor.timeoutMs",
    "Must output parseable JSON execution results"
  ]
});

// 3. Record the architectural decision
add_decision({
  decision: "Use streaming JSON parser for Cursor CLI output",
  rationale: "Prevents buffering large command diffs in memory",
  file_path: "./docs/ADR-003-cursor-executor.md"
});
```
