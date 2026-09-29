# Session & Focus Management Workflow

This guide details session lifecycle management for `agent-workplane` using the AI Project Context MCP tools. 

Following the Anthropic Context Engineering principles, context is a finite resource with diminishing marginal returns. Managing session state externally prevents context rot, preserves working memory, and enables seamless recovery across long-horizon coding tasks.

---

## 🚨 Critical Path Rule
**All file path parameters MUST be relative paths starting with `./`**:
- ✅ `identify_context({ file_path: "./src/orchestration/runner.ts" })`
- ❌ `identify_context({ file_path: "/Users/username/workspace/agent-workplane-v0.1.0/src/orchestration/runner.ts" })`

---

## 🛠️ Session Management Tools

| Tool | Purpose | Example |
|---|---|---|
| `identify_context` | Detect project, language, and context from file | `identify_context({ file_path: "./src/routing/router.ts" })` |
| `get_current_focus` | Inspect active session objectives and state | `get_current_focus()` |
| `start_session` | Initiate a focused task session with explicit goals | `start_session({ context: "agent-workplane", current_focus: "Refactor router scoring" })` |
| `get_merged_guidelines`| Load combined global and project rules | `get_merged_guidelines({ context: "agent-workplane" })` |
| `update_focus` | Pivot session objectives when direction shifts | `update_focus({ new_focus: "Fix broken cold-start tests" })` |
| `create_checkpoint` | Persist progress milestone to external memory | `create_checkpoint({ summary: "Router tests pass", next_focus: "Update CLI report" })` |
| `refresh_session_context` | Reload context and clear decay every 10 turns | `refresh_session_context()` |
| `complete_session` | Finalize task and close the session | `complete_session()` |

---

## 🔄 End-to-End Session Lifecycle

### 1. Discovery & Session Initialization
Always start by identifying the file you are targeting and inspecting the active session:
```typescript
// Identify file context with relative path
identify_context({ file_path: "./src/orchestration/runner.ts" });

// Check existing focus
const state = get_current_focus();

// If no active session or new task:
start_session({
  context: "agent-workplane",
  current_focus: "Add bounded review retry to runner"
});

// Load merged project guidelines
get_merged_guidelines({ context: "agent-workplane" });
```

### 2. Execution & Focus Updates
As you work through your plan, adjust the focus if the user changes direction or if a bug is uncovered:
```typescript
// User asks to write a test first:
update_focus({
  new_focus: "Write native test in ./test/review-retry.test.ts for runner retry logic"
});
```

### 3. Checkpointing & Compaction
Do not wait until the entire task is done to record progress. Anthropic's research emphasizes structured note-taking as external memory:
```typescript
// After implementing and verifying a sub-step:
create_checkpoint({
  summary: "Implemented bounded repair loop in runner.ts; verified with npm run check",
  next_focus: "Add unit tests in test/review-retry.test.ts"
});
```

### 4. Combating Context Rot (Turn Refresh)
LLM attention degrades over multi-turn interactions. If your conversation exceeds **10 turns**, proactively call:
```typescript
refresh_session_context();
```
This prunes transient noise and restores high-signal objectives.

### 5. Task Completion
When all acceptance criteria are met, tests pass (`npm run test`), and typechecking succeeds (`npm run check`):
```typescript
complete_session();
```
