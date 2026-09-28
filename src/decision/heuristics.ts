import { TaskClassification, TaskEnvelope, WorkspaceSignals } from "../core/types.js";

const clamp = (n:number) => Math.max(0, Math.min(1, n));
export function classifyHeuristically(task: TaskEnvelope, ws: WorkspaceSignals): TaskClassification {
  const t = task.objective.toLowerCase();
  const kind = /review|revis/.test(t) ? "review" : /investig|diagnos|por que|why/.test(t) ? "investigation" : /bug|fix|corrig|erro|falha/.test(t) ? "bugfix" : /refactor/.test(t) ? "refactor" : /implement|adicion|create|crie|feature/.test(t) ? "feature" : "unknown";
  const hardWords = ["architecture","arquitet","distributed","distribu","migration","migrar","multi-service","cross-service","security","auth","concurrency","concorr","data model","schema"];
  const hardHits = hardWords.filter(w => t.includes(w)).length;
  const complexity = hardHits >= 2 || ws.fileCount > 3000 ? "hard" : hardHits === 1 || ws.candidateFiles.length > 8 ? "medium" : t.length < 80 ? "simple" : "medium";
  return {
    kind, complexity,
    architectureImpact: clamp(hardHits * 0.3 + (/refactor|migration|arquitet|architecture/.test(t) ? .35 : 0)),
    securityRelevance: clamp(/auth|security|oauth|token|permission|credencial|secret/.test(t) ? .85 : .12),
    visualReasoning: clamp(/ui|ux|layout|screen|tela|compose|swiftui|css|visual/.test(t) ? .75 : .08),
    repoExploration: clamp((ws.candidateFiles.length / 12) + (ws.fileCount > 2000 ? .25 : 0)),
    testingNeed: clamp(/test|bug|fix|feature|implement|corrig/.test(t) ? .9 : .55),
    parallelizable: clamp(/android.*ios|ios.*android|parallel|paralel|multi/.test(t) ? .88 : complexity === "hard" ? .6 : .3),
    confidence: .58,
    source: "heuristic"
  };
}
