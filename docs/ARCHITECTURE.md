# Architecture

## Control plane

```text
                  user intent / issue
                         |
                    Task Intake
                         |
              deterministic inspection
                         |
                 optional Jev classify
                         |
                 Quality-first Router
                         |
            +------------+-------------+
            |            |             |
          Codex        Claude      Antigravity
            |            |             |
            +------------+-------------+
                         |
                 Independent Review
                         |
                bounded repair if needed
                         |
                    Outcome Store
                         |
                 future routing signal
```

## The important separation

**Decision plane** chooses an executor and verification strength. **Execution plane** lets the selected coding product do the actual software engineering. Jev is not used as a substitute for coding reasoning.

## Priority function

Workplane's priority is lexicographic in intent even though the initial scoring implementation uses a dominant weighted approximation:

1. avoid correctness/quality regression;
2. minimize wall-clock delivery time;
3. reduce imprecision/rework;
4. reduce quota usage.

A candidate below `qualityFloor` gets a substantially larger quality penalty so a cheaper/faster path cannot easily win by sacrificing correctness.

## Failure modes and defenses

| Failure | Defense |
|---|---|
| Jev unavailable | fail-open to deterministic classifier |
| router uncertain | mark escalation and strengthen validation |
| selected CLI missing | stop before execution with `work doctor` guidance |
| primary agent wrong | independent review by another executor |
| reviewer finds defects | one bounded repair + re-review |
| optimization loops | bounded rework and no recursive routing |
| context filter hides dependency | no destructive context filtering in MVP |
| local routing priors wrong | capture real outcomes and blend history gradually |

## Historical reward

A route is evaluated primarily by:

- completed successfully;
- independent review passed;
- passed on first review;
- amount of rework;
- duration.

Quota/token data is captured when a CLI exposes it but is intentionally not the primary reward signal.

## Hook strategy

Hooks are deliberately conservative in v0.1. They log and add small model-visible hints on expensive reads and test/build commands. Later gates can use the captured evidence to prove that compression/ranking improves *successful completion per unit quota* before enforcing anything.
