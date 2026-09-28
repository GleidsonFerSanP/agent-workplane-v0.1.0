# Session & Focus Management

This workflow defines how to use the AI Project Context MCP tools to structure your work and maintain context effectively.

## Initialization
When beginning a task, always establish your coordinates and goals to initialize your context:
1. `identify_context({ file_path: "./src/index.ts" })` - Remember, ALWAYS use relative paths.
2. `get_current_focus()` - Check if there's already an active goal or session.
3. `start_session({ context: "Your high-level goal", current_focus: "Immediate next step" })` - Lock in your intent.

## Mid-Session Management
- **Pivoting**: If the goal changes during the workflow, call `update_focus({ new_focus: "Refactoring the router instead" })`.
- **Milestones**: After completing a significant sub-task, record the state: `create_checkpoint({ summary: "Added unit tests for routing", next_focus: "Implement CLI command" })`.
- **Compaction**: If the context window feels large or you've completed ~10 turns, call `refresh_session_context()` to compact your memory.

## Completion
When the objective is fully met, close out the workspace:
- `complete_session()`
