# Quick Reference Checklist

Use this condensed checklist to ensure compliance with project rules within a minimal token footprint.

## The Golden Rule: Relative Paths ONLY
**ALWAYS USE RELATIVE PATHS.** 
- ✅ **Correct**: `./src/cli.ts`
- 🚫 **Wrong**: `/Users/gleidsonfersanp/workspace/agent-workplane-v0.1.0/src/cli.ts`

## Standard MCP Session Workflow
Every conversation should follow this pattern:
- [ ] **1. Identify Context**: `identify_context({ file_path: "./src/index.ts" })`
- [ ] **2. Check Focus**: `get_current_focus()`
- [ ] **3. Start Session**: `start_session(...)` or `get_merged_guidelines(...)`
- [ ] **4. Work Iteratively**: Avoid loading all files; use progressive disclosure.
- [ ] **5. Refresh Context**: `refresh_session_context()` every 10 turns.
- [ ] **6. Save Milestones**: `create_checkpoint(...)` when finishing a logical step.
- [ ] **7. End Session**: `complete_session()`

## Common Project Commands
- **Build**: `npm run build`
- **Test**: `npm run test`
- **Type Check**: `npm run check`

## References
Explore detailed capabilities only when needed:
- [Skills Hub](./skills/SKILL.md)
