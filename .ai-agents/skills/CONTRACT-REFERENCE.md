# Contract & Guidelines Validation

This project relies on strict interface contracts and specific coding guidelines. Use progressive disclosure to load them only when relevant.

## MCP Tools for Guidelines & Contracts
- `get_merged_guidelines({ context: "typescript" })` - Load global and project-local guidelines simultaneously.
- `get_guidelines({ topic: "routing" })` - Fetch specific contextual rules for a subsystem.
- `get_contracts()` - Retrieve existing system interfaces and boundaries.
- `register_contract({ name: "RouterInterface", file_path: "./src/router.ts", rules: ["Must be async", "Must return Response"] })` - Document a newly created interface.
- `validate_contract({ code_snippet: "...", contract_name: "RouterInterface" })` - Ensure your generated code conforms to the established rules before finalizing it.

## Contract Workflow
1. Before modifying core modules (like routing or CLI args), fetch their constraints using `get_contracts()`.
2. After generating new code, use `validate_contract` to ensure no boundaries were broken.
3. If you establish a new core interface, always persist it with `register_contract` so future agents can respect it. ALWAYS use relative paths like `./src/router.ts`.
