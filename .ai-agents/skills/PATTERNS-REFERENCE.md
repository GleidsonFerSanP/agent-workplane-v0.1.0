# Project Code Patterns

This document describes the code conventions and patterns for `agent-workplane`.

## General Conventions
- **TypeScript Strict Mode**: The project uses strict TS (`NodeNext` module resolution).
- **ES Modules**: We use `.js` extensions in imports (e.g., `import { loadConfig } from "./core/config.js";`).
- **No Semicolons / Single Quotes**: Standardize on functional patterns where possible.

## Feature Patterns & MCP Integration
When you encounter a new pattern that should be reused, or need to learn an existing one, use the AI Project Context MCP:

| Tool | Purpose |
|------|---------|
| `learn_pattern` | Teach the MCP a new code pattern you've identified. |
| `get_features` | List registered project features. |
| `get_feature_context` | Get complete context on a specific feature implementation. |

## Example: Native Node Testing
The project uses the native Node.js test runner.
Test files are located in `./test/` and run via `node --test dist/test/*.test.js`.

When writing tests:
```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { plan } from "../src/orchestration/runner.js";

test("runner plan creates correct route", async () => {
  // test logic
});
```

*Always use relative paths like `./src/...` or `./test/...` when calling MCP tools to register or learn patterns!*
