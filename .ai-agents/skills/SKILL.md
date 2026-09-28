# Agent Skills Hub

This directory contains progressive disclosure instructions for working on the `agent-workplane` project.
Rather than loading all documentation into your context window at once, explore these specific files only when their context is required for the task.

## Available Workflows
- **[Session Management](./SESSION-WORKFLOW.md)**: Details on using MCP session tools (`start_session`, `create_checkpoint`, etc.).
- **[Contracts & Guidelines](./CONTRACT-REFERENCE.md)**: How to validate code boundaries and interfaces.
- **[Documentation](./DOCUMENTATION-WORKFLOW.md)**: Rules for creating and maintaining project docs.
- **[Patterns & Features](./PATTERNS-REFERENCE.md)**: Retrieving and registering code patterns.

## Progressive Context Engineering Best Practices
1. **Search First**: Use tools like `get_features` or `get_complete_project_context` to understand the domain before making assumptions.
2. **Read Narrowly**: Fetch only the specific documents or files you need.
3. **Compact State**: Use `refresh_session_context` to avoid context window bloat during long-running tasks.

## Anti-Patterns
- 🚫 **Absolute Paths**: Never use `/Users/username/...` in tool calls. Always use relative paths like `./src/...`.
- 🚫 **Guessing**: Don't assume architecture. Use `identify_context` and `get_contracts` to fetch ground truth.
- 🚫 **Context Bloat**: Don't try to read the entire `./src` directory at once. Read files selectively.
