import { TaskClassification, TaskEnvelope, WorkspaceSignals, WorkplaneConfig } from "../core/types.js";
import { classifyHeuristically } from "./heuristics.js";

function choiceValue(answer:any, fallback:string): string { return answer?.choice ?? answer?.value ?? answer?.answer ?? fallback; }
function noulValue(answer:any, fallback:number): number { const v = answer?.noul ?? answer?.probability ?? answer?.value; return typeof v === "number" ? v : fallback; }
function confidenceOf(answers:any): number {
  const cs = Object.values(answers ?? {}).map((a:any)=>a?.confidence).filter((x):x is number=>typeof x === "number");
  return cs.length ? cs.reduce((a,b)=>a+b,0)/cs.length : .7;
}

export async function classifyTask(task: TaskEnvelope, ws: WorkspaceSignals, cfg: WorkplaneConfig): Promise<TaskClassification> {
  const fallback = classifyHeuristically(task, ws);
  if (!cfg.jev.enabled || !process.env.JEV_API_KEY) return fallback;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.jev.timeoutMs);
  try {
    const state = {
      objective: task.objective, constraints: task.constraints, acceptanceCriteria: task.acceptanceCriteria,
      workspace: { languages: ws.languages, fileCount: ws.fileCount, hasTests: ws.hasTests, candidateFiles: ws.candidateFiles.slice(0,12) }
    };
    const body = {
      model: cfg.jev.model,
      state,
      questions: {
        kind: { type: "choice", instructions: "Classify the software work by primary intent.", criteria: { feature:"new behavior", bugfix:"fix incorrect behavior", refactor:"structural improvement without intended behavior change", review:"evaluate existing change", investigation:"diagnose or understand", maintenance:"tooling/dependencies/chores", unknown:"unclear" } },
        complexity: { type: "choice", instructions: "Estimate implementation complexity, not business importance.", criteria: { trivial:"mechanical tiny change", simple:"localized and well-known", medium:"multiple files or nontrivial reasoning", hard:"cross-cutting, architectural, ambiguous, or high-risk" } },
        architectureImpact: { type: "noul", instructions: "Is architecture-level reasoning materially important to task success?" },
        securityRelevance: { type: "noul", instructions: "Could security/auth/privacy behavior materially affect correctness?" },
        visualReasoning: { type: "noul", instructions: "Is visual/UI reasoning materially important to success?" },
        repoExploration: { type: "noul", instructions: "Will success likely require broad repository exploration rather than a localized edit?" },
        testingNeed: { type: "noul", instructions: "Are tests or runtime validation important to prove completion?" },
        parallelizable: { type: "noul", instructions: "Does the task contain independent work streams that can safely run in parallel?" }
      }
    };
    const res = await fetch(cfg.jev.endpoint, { method:"POST", headers:{Authorization:`Bearer ${process.env.JEV_API_KEY}`,"content-type":"application/json"}, body: JSON.stringify(body), signal: controller.signal });
    if (!res.ok) throw new Error(`Jev HTTP ${res.status}`);
    const json:any = await res.json(); const a = json.answers ?? json;
    return {
      kind: choiceValue(a.kind, fallback.kind) as any,
      complexity: choiceValue(a.complexity, fallback.complexity) as any,
      architectureImpact: noulValue(a.architectureImpact, fallback.architectureImpact),
      securityRelevance: noulValue(a.securityRelevance, fallback.securityRelevance),
      visualReasoning: noulValue(a.visualReasoning, fallback.visualReasoning),
      repoExploration: noulValue(a.repoExploration, fallback.repoExploration),
      testingNeed: noulValue(a.testingNeed, fallback.testingNeed),
      parallelizable: noulValue(a.parallelizable, fallback.parallelizable),
      confidence: confidenceOf(a), source: "jev"
    };
  } catch (e) {
    if (!cfg.jev.failOpen) throw e;
    return fallback;
  } finally { clearTimeout(timer); }
}
