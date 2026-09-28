import { RouteDecision, TaskClassification, TaskEnvelope, WorkspaceSignals } from "../core/types.js";
export function implementationPrompt(task:TaskEnvelope,c:TaskClassification,ws:WorkspaceSignals,route:RouteDecision):string{
return `You are the primary implementation agent for task ${task.id}.

OBJECTIVE
${task.objective}

ACCEPTANCE CRITERIA
${task.acceptanceCriteria.length?task.acceptanceCriteria.map(x=>`- ${x}`).join("\n"):"- Infer concrete, testable completion criteria from the objective and existing repository conventions."}

CONSTRAINTS
${task.constraints.length?task.constraints.map(x=>`- ${x}`).join("\n"):"- Preserve existing contracts unless the task explicitly requires changing them."}

EXECUTION PRINCIPLES
- Optimize in this exact order: correctness/quality, delivery speed, precision, quota efficiency.
- Work autonomously to completion; do not create process ceremony that does not reduce product risk.
- Prefer deterministic repository search (rg/LSP/build tools) before broad context ingestion.
- Keep original sources recoverable; do not rely on aggressive context filtering for correctness.
- Run the most relevant tests/validation before concluding.
- If you discover a hidden dependency, follow it even if it was not in the initial candidate context.
- Do not spawn/delegate work unless independence and expected quality gain justify coordination cost.
- Leave the workspace in an implementation-ready state. Do not merely describe a solution.

TASK SIGNALS
kind=${c.kind}; complexity=${c.complexity}; architecture=${c.architectureImpact.toFixed(2)}; security=${c.securityRelevance.toFixed(2)}; tests=${c.testingNeed.toFixed(2)}
languages=${ws.languages.join(",")||"unknown"}; candidateFiles=${ws.candidateFiles.slice(0,8).join(",")||"none"}
routeConfidence=${route.confidence.toFixed(2)}${route.escalation?"; routing uncertainty is elevated, so validate more aggressively":""}

When done, summarize: files changed, tests/validation executed, unresolved risks (if any).`;
}

export function reviewPrompt(task:TaskEnvelope, primary:string):string{return `Independently review the current workspace changes for task ${task.id}: ${task.objective}
The implementation was produced by ${primary}. Do not assume it is correct.
Prioritize concrete correctness defects, regressions, security issues, missing requirements, and insufficient tests. Ignore cosmetic preferences unless they create maintenance or correctness risk.
Run deterministic checks/tests where useful. Do not modify files.
Return ONLY JSON: {"pass":boolean,"score":0-100,"findings":["..."]}. Passing requires score >= 85 and no material defect.`;}

export function repairPrompt(task:TaskEnvelope,findings:string[]):string{return `Repair the implementation for ${task.id}: ${task.objective}\nIndependent review found:\n${findings.map(x=>`- ${x}`).join("\n")}\nFix the root causes, preserve valid work, rerun relevant validation, and finish the task. Do not add process ceremony.`;}
