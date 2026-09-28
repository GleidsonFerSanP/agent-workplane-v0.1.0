import { ExecutorId, RouteDecision, RouteScore, TaskClassification, TaskEnvelope, WorkspaceSignals, WorkplaneConfig } from "../core/types.js";
import { statsFor } from "./history.js";

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
// Cold-start priors are intentionally neutral. We do not pretend to know which
// product is globally "best". Small task-specific nudges break ties until local
// outcome history becomes statistically useful.
const BASE:Record<ExecutorId,{quality:number;speed:number;precision:number;quota:number}>={
  codex:{quality:.90,speed:.82,precision:.90,quota:.80},
  claude:{quality:.90,speed:.82,precision:.90,quota:.80},
  antigravity:{quality:.90,speed:.82,precision:.90,quota:.80}
};

export function routeTask(task:TaskEnvelope, c:TaskClassification, ws:WorkspaceSignals, cfg:WorkplaneConfig):RouteDecision {
  const ids=(Object.keys(cfg.executors) as ExecutorId[]).filter(id=>cfg.executors[id].enabled);
  if(!ids.length) throw new Error("No executor enabled");
  const fingerprint=`${c.kind}:${c.complexity}`;
  const scores:RouteScore[]=ids.map(executor=>{
    const base={...BASE[executor]}; const why:string[]=[];
    if(c.architectureImpact>.65 && executor==="claude"){base.quality+=.04;base.precision+=.03;why.push("architecture-heavy task");}
    if(c.visualReasoning>.65 && executor==="antigravity"){base.speed+=.03;base.quality+=.03;why.push("visual/UI signal");}
    if((c.kind==="bugfix"||c.kind==="feature") && executor==="codex"){base.quality+=.02;base.speed+=.02;why.push("implementation/debugging signal");}
    if(c.securityRelevance>.7 && executor==="claude"){base.precision+=.02;why.push("security-sensitive task");}
    const h=statsFor(task.workspace,executor,fingerprint);
    if(h.attempts>=2){ const histQuality=.6*h.successRate+.4*h.firstReviewPassRate; base.quality=(1-cfg.routing.historyWeight)*base.quality+cfg.routing.historyWeight*histQuality; base.speed=(1-cfg.routing.historyWeight)*base.speed+cfg.routing.historyWeight*(h.avgDurationMs?clamp(1/(1+h.avgDurationMs/900000)):.5); why.push(`history n=${h.attempts}`); }
    if(cfg.routing.preferred===executor){base.quality+=.01;why.push("user preference hint");}
    const quality=clamp(base.quality),speed=clamp(base.speed),precision=clamp(base.precision),quotaEfficiency=clamp(base.quota);
    // Lexicographic intent approximated with dominant weights; quality cannot be traded below floor.
    const composite=quality>=cfg.qualityFloor ? .48*quality+.24*speed+.20*precision+.08*quotaEfficiency : .70*quality+.12*speed+.14*precision+.04*quotaEfficiency;
    return {executor,quality,speed,precision,quotaEfficiency,confidence:clamp(composite),rationale:why};
  }).sort((a,b)=>b.confidence-a.confidence);
  const first=scores[0]!; const second=scores[1]??first; const margin=first.confidence-second.confidence;
  const escalation=first.confidence<cfg.routing.minConfidence || margin<.025 || c.confidence<.45;
  const reviewer=(scores.find(s=>s.executor!==first.executor)?.executor ?? first.executor);
  return {primary:first.executor,reviewer,scores,confidence:clamp(first.confidence*(.75+.25*c.confidence)),escalation,rationale:[`quality-first routing`, `cold-start priors are neutral; local outcomes take precedence as evidence accumulates`, `primary=${first.executor}`, `margin=${margin.toFixed(3)}`, escalation?"low routing certainty: use stronger verification":"routing confidence acceptable"]};
}
