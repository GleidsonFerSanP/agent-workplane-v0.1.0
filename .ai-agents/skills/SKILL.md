# Core Skills & MCP Workflow

This document serves as the progressive disclosure hub for the AI Project Context MCP tools within the `agent-workplane` repository. 

## 🗺️ Progressive Context Architecture
To avoid context rot and token explosion, do not load all guidelines at once. Use the following specialized documents based on your current task:

- **Managing state & workflow**: Read [SESSION-WORKFLOW.md](./SESSION-WORKFLOW.md)
- **Writing TypeScript code/tests**: Read [PATTERNS-REFERENCE.md](./PATTERNS-REFERENCE.md)
- **Modifying core interfaces**: Read [CONTRACT-REFERENCE.md](./CONTRACT-REFERENCE.md)
- **Writing or updating docs**: Read [DOCUMENTATION-WORKFLOW.md](./DOCUMENTATION-WORKFLOW.md)

## 🛠️ The Standard MCP Workflow
Whenever you perform work in this project, adhere to this lifecycle using the AI Project Context MCP tools:

1. **Identify**: `identify_context({ file_path: "./src/cli.ts" })`
   - *CRITICAL*: Always use relative paths starting with `./`.
2. **Assess**: `get_current_focus()`
3. **Start**: `start_session({ context, current_focus })` or `get_merged_guidelines({ context })`
4. **Execute**: Do the coding/writing task. Use tools like `get_features()` or `get_contracts()` as needed.
5. **Persist**: `create_checkpoint({ summary, next_focus })`
6. **Refresh**: If the conversation goes beyond 10 turns, use `refresh_session_context()` to combat context decay.
7. **Complete**: `complete_session()`

## 🛑 Anti-Patterns to Avoid
- **Absolute Paths**: Using `/Users/...` in MCP tools will break on other developers' machines.
- **Context Stuffing**: Requesting all documentation resources at once instead of progressively calling specific endpoints.
- **Missing Checkpoints**: Writing massive amounts of code without calling `create_checkpoint()`.
- **Ignoring Tests**: Pushing code without ensuring `npm run test` and `npm run check` pass cleanly.
