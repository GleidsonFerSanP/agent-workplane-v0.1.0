# Roadmap driven by evidence

## v0.1 — control plane foundation (implemented)
- intake
- deterministic inspection
- Jev classification
- quality-first router
- Codex / Claude / Antigravity adapters
- independent review
- bounded repair
- history
- conservative hooks

## v0.2 — evaluation harness
- fixture repositories with known defects/features
- repeated A/B runs with Jev on/off
- task success, review pass, rework, duration, quota metrics
- per-executor calibration report

Gate: no optimization becomes default without non-inferior quality.

## v0.3 — safe context economy
- rank candidate files, never hide them
- target large reads using line/symbol ranges
- compact test/build output while persisting the complete output locally
- recovery command/tool to retrieve any omitted source/log

Gate: demonstrate lower quota consumption without lower task success.

## v0.4 — adaptive routing
- feature vector + historical reward
- minimum sample thresholds
- conservative contextual bandit with small exploration budget
- drift detection as products/models change

Gate: adaptive router must beat the best simple baseline on quality-adjusted delivery time.

## v0.5 — parallel DAG execution
- task decomposition only when work streams are genuinely independent
- Git worktree isolation
- merge/conflict cost estimation
- concurrency cap based on coordination overhead

Gate: parallelism must reduce wall-clock time without increasing review failures/rework.
