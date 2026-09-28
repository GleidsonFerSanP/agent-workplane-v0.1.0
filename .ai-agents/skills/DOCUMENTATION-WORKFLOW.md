# Documentation & Decisions Workflow

Documentation is treated as code in this project and is maintained progressively.

## Tools
- `check_existing_documentation({ topic: "CLI usage" })` - ALWAYS check before writing new documentation to avoid duplicates.
- `manage_documentation({ action: "update", file_path: "./docs/cli.md", content: "..." })` - Safely modify documentation. Note the relative path!
- `add_decision({ title: "Use Node.js 22 built-in test runner", rationale: "Avoids external dependencies like Jest" })` - Record an Architecture Decision Record (ADR) when making structural choices.
- `get_complete_project_context()` - Use when you need a broad summary of existing features and architecture to inform documentation.

## Rules
1. **Relative Paths**: Always use relative paths for files (e.g., `./docs/api.md`). Never use absolute paths.
2. **Synchronous Updates**: Update documentation synchronously with code changes in the same session.
3. **Capture Intent**: Document *why* a decision was made, not just *what* the code does (use `add_decision`).
