import { Executor } from "../executors/base.js";
import { ExecutorId, RouteDecision, TaskClassification, TaskEnvelope, WorkplaneConfig, WorkspaceSignals } from "../core/types.js";

export async function consultRoutingAdvisor(task:TaskEnvelope,c:TaskClassification,ws:WorkspaceSignals,route:RouteDecision,advisor:Executor,cfg:WorkplaneConfig):Promise<RouteDecision>{
  if(!cfg.routing.advisor.enabled) return route;
  if(cfg.routing.advisor.onUncertaintyOnly && !route.escalation) return route;
  if(!advisor.available(cfg)) return {...route,rationale:[...route.rationale,"routing advisor unavailable; kept baseline route"]};
  const candidates=route.scores.map(s=>({executor:s.executor,quality:s.quality,speed:s.speed,precision:s.precision,quotaEfficiency:s.quotaEfficiency,baseline:s.confidence}));
  const prompt=`Act only as a routing judge. Choose the coding product most likely to complete this task correctly with the priority order quality > speed > precision > quota. Do not solve the coding task.\n\nTask: ${task.objective}\nClassification: ${JSON.stringify(c)}\nWorkspace: ${JSON.stringify({languages:ws.languages,fileCount:ws.fileCount,hasTests:ws.hasTests,candidateFiles:ws.candidateFiles.slice(0,8)})}\nCandidates: ${JSON.stringify(candidates)}\n\nReturn ONLY JSON: {"primary":"codex|claude|antigravity","reviewer":"codex|claude|antigravity","confidence":0.0,"rationale":"short"}. The reviewer must differ from primary when possible.`;
  try {
    const r=await advisor.run(task,prompt,cfg,"advisor"); if(!r.success) throw new Error(r.stderr||"advisor failed");
    const m=r.response.match(/\{[\s\S]*\}/); const j=JSON.parse(m?.[0]??r.response);
    const valid=(x:any):x is ExecutorId=>["codex","claude","antigravity"].includes(x)&&cfg.executors[x as ExecutorId]?.enabled;
    if(!valid(j.primary)) throw new Error("invalid primary from advisor");
    let reviewer:ExecutorId=valid(j.reviewer)&&j.reviewer!==j.primary?j.reviewer:route.scores.find(s=>s.executor!==j.primary)?.executor??j.primary;
    return {...route,primary:j.primary,reviewer,confidence:Math.max(route.confidence,Math.min(1,Number(j.confidence)||0)),advisorUsed:true,advisorRationale:String(j.rationale??""),rationale:[...route.rationale,`advisor selected ${j.primary}: ${String(j.rationale??"")}`]};
  } catch(e) {
    if(!cfg.routing.advisor.failOpen) throw e;
    return {...route,rationale:[...route.rationale,`routing advisor failed open: ${e instanceof Error?e.message:String(e)}`]};
  }
}
