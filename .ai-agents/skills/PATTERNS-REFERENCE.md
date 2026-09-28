# Code Patterns & Features

We use MCP tools to teach and retrieve coding patterns for the `agent-workplane` project, keeping context sizes small by only loading patterns when necessary.

## Discovering Patterns
- `get_features()` - Lists all registered features in the project.
- `get_feature_context({ feature_name: "routing" })` - Fetches the full context, business rules, and patterns for a specific feature.

## Registering Patterns
If you implement a new architectural pattern or feature, document it so future AI agents can learn from it:
- `learn_pattern({ pattern_name: "Routing Strategy", description: "Standard way to route tasks", examples: ["./src/router.ts"] })`
- `register_feature({ name: "CLI Options", description: "How CLI args are parsed", rules: ["Use built-in node:util parseArgs"] })`
*(Notice the use of `./src/router.ts` — ALWAYS use relative paths!)*

## Base Project Patterns (Node 22 & TypeScript)
- Use ESM (`"type": "module"` in `package.json`).
- Use the native `node:test` runner.
- Strict TypeScript typings without `any`.
- Functional patterns preferred over heavy classes.
