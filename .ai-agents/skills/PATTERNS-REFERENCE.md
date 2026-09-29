# Project Code Patterns & Conventions

This guide documents the architectural and code patterns used across `agent-workplane`.

Adhering to canonical patterns reduces rework, simplifies independent reviews, and ensures strict compatibility with the Node.js ESM execution model.

---

## 🚨 Critical Path Rule
**All file path parameters MUST be relative paths starting with `./`**:
- ✅ `learn_pattern({ pattern_name: "native_node_test", file_path: "./test/router.test.ts" })`
- ❌ `learn_pattern({ pattern_name: "native_node_test", file_path: "/Users/.../test/router.test.ts" })`

---

## 🛠️ Pattern MCP Tools

| Tool | Purpose | Example |
|---|---|---|
| `learn_pattern` | Register an identified codebase pattern for reuse | `learn_pattern({ pattern_name: "fail_open_client", file_path: "./src/decision/client.ts" })` |
| `get_features` | List registered codebase features | `get_features()` |
| `get_feature_context` | Inspect full feature context and business rules | `get_feature_context({ feature_name: "quality_first_routing" })` |

---

## 🧩 Established Code Patterns in `agent-workplane`

### 1. Mandatory `.js` Import Extensions in ESM
The project compiles with TypeScript `NodeNext` resolution and `"type": "module"`. **Every relative import must include the `.js` extension**:
```typescript
// ✅ CORRECT
import { loadConfig } from "./core/config.js";
import { RouteDecision, TaskEnvelope } from "./core/types.js";

// ❌ WRONG (fails compilation)
import { loadConfig } from "./core/config";
```

### 2. Native Node.js Testing (`node:test`)
No external testing libraries (Jest/Vitest/Mocha) are used. Tests use built-in Node 22 APIs:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { plan } from "../src/orchestration/runner.js";

test("detects bugfix and security relevance", async () => {
  const result = await plan("fix sql injection in auth handler", process.cwd(), {
    hint: [],
    constraint: []
  });
  
  assert.equal(result.classification.kind, "bugfix");
  assert.ok(result.classification.securityRelevance >= 0.7);
  assert.equal(result.route.validationStrength, "strict");
});
```

### 3. Fail-Open vs. Fail-Closed Resilience
- **Fail-Open (Heuristics / Telemetry)**: If an external classifier (like Jev) times out or errors, smoothly fallback to deterministic heuristics without crashing:
  ```typescript
  try {
    return await queryJev(envelope);
  } catch (err) {
    if (config.jev.failOpen) {
      return deterministicClassify(envelope);
    }
    throw err;
  }
  ```
- **Fail-Closed (Quality & Review Verification)**: Review checks and quality floor gates fail closed to prevent regressions:
  ```typescript
  if (!reviewResult.passed && config.review.failClosed) {
    throw new Error(`Review failed: ${reviewResult.issues.join("; ")}`);
  }
  ```

### 4. Subprocess Execution via `./src/utils/process.ts`
All external CLI calls (`git`, `gh`, `codex`, `claude`, `agy`) use `runCommand` or `commandExists`:
```typescript
import { runCommand, commandExists } from "./utils/process.js";

if (!commandExists("claude")) {
  throw new Error("claude CLI is not installed on PATH");
}
const { stdout, exitCode } = await runCommand("claude", ["-p", prompt]);
```

### 5. Task Locking & Concurrency Prevention
Every run claims a file-based lock in `./src/core/task-lock.ts` to prevent race conditions during long-horizon executions:
```typescript
import { acquireTaskLock, releaseTaskLock } from "./core/task-lock.js";

const lock = acquireTaskLock(workspace, taskEnvelope.id);
try {
  await executeTask(taskEnvelope);
} finally {
  releaseTaskLock(lock);
}
```
