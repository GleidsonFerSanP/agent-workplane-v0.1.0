# agent-workplane

A **quality-first control plane for coding agents**. It routes product work across **Codex, Claude Code and Google Antigravity**, optionally uses **Jev** for cheap calibrated classification, performs independent review, and learns from your own run history.

The optimization order is deliberately strict:

1. **Quality / task success**
2. **Delivery speed**
3. **Precision / low rework**
4. **Quota efficiency**

Quota savings are rejected when they increase the chance of an incorrect task. Jev is a helper, never the authority over correctness.

## Why this exists

The user should express **what must be delivered**, not micromanage which coding agent, model, subagent count, context strategy, or review procedure should be used.

```bash
work start "implement Android deep links according to the approved spec"
```

or, when `gh` is installed/authenticated and the current repo contains the issue:

```bash
work start 231
```

The control plane then:

```text
Task intake
  -> deterministic workspace inspection
  -> Jev classification (optional/fail-open)
  -> quality-first routing
  -> primary coding agent
  -> deterministic validation performed by the agent
  -> independent review by a different agent
  -> one bounded repair cycle when needed
  -> outcome history for future routing
```

## Design principles

- **Fail open on optimization, fail closed on quality.** If Jev is unavailable, routing continues. If independent review finds a material defect, the run is not marked done.
- **No aggressive context deletion.** Search/ranking may prioritize context, but source material remains recoverable.
- **Deterministic before probabilistic.** Git state, file discovery and tool availability do not need an LLM.
- **Independent review.** The reviewer is different from the primary executor whenever possible.
- **Bounded automation.** Rework is limited; loops do not consume quota indefinitely.
- **Local evidence beats internet folklore.** Routing history is gradually weighted into decisions.
- **Minimal user ceremony.** The normal entrypoint is `work start <intent-or-issue>`.

## Requirements

- Node.js 22+
- At least one of: `codex`, `claude`, `agy`
- Optional: `gh` for GitHub issue intake
- Optional: `JEV_API_KEY` for Jev decisions

## Install locally

```bash
npm run build
npm link
work init
work doctor
```

## Commands

```bash
work init
work doctor
work plan "task"
work start "task"
work status
work history
work report
work install-hooks
```

Useful optional inputs:

```bash
work start "task" --constraint "do not change backend contract"
work start "task" --hint "existing navigation pattern is in app/navigation"
```

These are hints/constraints, not a requirement to describe the execution plan.

## Jev

When `JEV_API_KEY` exists, Workplane calls the typed decision endpoint to estimate task kind, complexity, architectural/security/visual relevance, repository exploration need, testing need and safe parallelism. Multiple decisions are made in one request. If the call times out or fails, a conservative local classifier is used.

```bash
export JEV_API_KEY='jv_live_...'
```

No secret is written to the repository.

## Routing

The router does **not** simply pick the cheapest model. Every executor gets four scores:

- quality
- speed
- precision
- quota efficiency

Quality has the dominant weight and a configured floor. After enough local runs, the router blends generic priors with outcomes from similar tasks (`kind:complexity`). Review pass rate and rework matter more than raw token savings.

An optional **routing advisor model** can be enabled for uncertain routes. It runs through one of the locally authenticated coding CLIs, not an API key. It is disabled by default until your local evals show that its extra quota improves routing quality. Configure `routing.advisor` in `.workplane/config.json`.

## Agent execution

Default adapters use the products' local/headless CLIs, so you keep their normal account/subscription authentication:

- Codex: `codex exec --json --full-auto`
- Claude Code: `claude -p --output-format json --permission-mode acceptEdits`
- Antigravity: `agy -p --output-format json`

Adjust commands in `.workplane/config.json` if your local policies differ.

## Hooks

`work install-hooks` generates conservative integration fragments under `.workplane/integrations/` for Claude Code, Codex and Antigravity. Initial hooks **observe and annotate** expensive reads/build outputs rather than aggressively blocking them. This is intentional: the first version optimizes quality and instrumentation before quota.

Hook events are logged to `.workplane/hooks.jsonl`, providing the dataset needed to later add safe context/output gates.

## State

All runtime state lives in `.workplane/` and is ignored by Git:

```text
.workplane/
  config.json
  history.jsonl
  hooks.jsonl
  integrations/
```

## Current MVP boundaries

Implemented:
- natural-language and GitHub issue task intake
- deterministic repository inspection
- Jev typed classification with safe fallback
- quality-first routing among three coding products
- local CLI execution
- independent cross-agent review
- bounded repair loop
- historical reward signal and `work report` metrics
- optional local-CLI routing advisor for uncertain decisions
- hook configuration generator and telemetry

Deliberately not enabled by default yet:
- hard blocking of file reads
- lossy log/context compression
- automatic multi-agent DAG decomposition
- contextual-bandit exploration

Those should be turned on only after evals show no quality regression.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).
