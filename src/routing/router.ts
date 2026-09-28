import { ExecutorId, RouteDecision, RouteScore, TaskClassification, TaskEnvelope, WorkspaceSignals, WorkplaneConfig } from "../core/types.js";
import { statsFor } from "./history.js";

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const BASE:Record<ExecutorId,{quality:number;speed:number;precision:number;quota:number}>={
  codex:{quality:.91,speed:.88,precision:.91,quota:.82},
  claude:{quality:.92,speed:.80,precision:.93,quota:.76},
  antigravity:{quality:.89,speed:.90,precision:.88,quota:.84}
};

export function routeTask(task:TaskEnvelope, c:TaskClassification, ws:WorkspaceSignals, cfg:WorkplaneConfig):RouteDecision {
  const ids=(Object.keys(cfg.executors) as ExecutorId[]).filter(id=>cfg.executors[id].enabled);
  if(!ids.length) throw new Error("No executor enabled");
  const fingerprint=`${c.kind}:${c.complexity}`;
  const scores:RouteScore[]=ids.map(executor=>{
    const base={...BASE[executor]}; const why:string[]=[];
    if(c.architectureImpact>.65 && executor==="claude"){base.quality+=.05;base.precision+=.04;why.push("architecture-heavy task");}
    if(c.visualReasoning>.65 && executor==="antigravity"){base.speed+=.04;base.quality+=.03;why.push("visual/UI signal");}
    if((c.kind==="bugfix"||c.kind==="feature") && executor==="codex"){base.quality+=.025;base.speed+=.025;why.push("implementation/debugging signal");}
    if(c.securityRelevance>.7 && executor==="claude"){base.precision+=.025;why.push("security-sensitive task");}
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
  return {primary:first.executor,reviewer,scores,confidence:clamp(first.confidence*(.75+.25*c.confidence)),escalation,rationale:[`quality-first routing`, `primary=${first.executor}`, `margin=${margin.toFixed(3)}`, escalation?"low routing certainty: use stronger verification":"routing confidence acceptable"]};
}
