import crypto from "node:crypto";
import { loadConfig, initConfig } from "../core/config.js";
import { intake } from "../core/intake.js";
import { inspectWorkspace } from "../core/workspace.js";
import { classifyTask } from "../decision/jev.js";
import { routeTask } from "../routing/router.js";
import { consultRoutingAdvisor } from "../routing/advisor.js";
import { appendRun } from "../routing/history.js";
import { codexExecutor } from "../executors/codex.js";
import { claudeExecutor } from "../executors/claude.js";
import { antigravityExecutor } from "../executors/antigravity.js";
import { Executor } from "../executors/base.js";
import { implementationPrompt, repairPrompt } from "./prompts.js";
import { independentReview } from "./review.js";
import { RunRecord, ExecutorId, WorkplaneConfig } from "../core/types.js";

const executors:Record<ExecutorId,Executor>={codex:codexExecutor,claude:claudeExecutor,antigravity:antigravityExecutor};
function availableConfig(cfg:WorkplaneConfig):WorkplaneConfig{
  const copy=structuredClone(cfg);
  for(const id of Object.keys(copy.executors) as ExecutorId[]) if(copy.executors[id].enabled&&!executors[id].available()) copy.executors[id].enabled=false;
  return copy;
}
export async function plan(input:string,workspace:string,opts:any={}){
 initConfig(workspace); const loaded=loadConfig(workspace); const cfg=availableConfig(loaded); const enabled=(Object.keys(cfg.executors) as ExecutorId[]).filter(x=>cfg.executors[x].enabled);
 if(!enabled.length) throw new Error("No coding executor is installed/enabled. Run 'work doctor'.");
 if(cfg.review.enabled&&cfg.review.independent&&cfg.review.failClosed&&enabled.length<2) throw new Error("Quality policy requires an independent reviewer, but fewer than two coding executors are available.");
 const task=await intake(input,workspace,opts); const ws=inspectWorkspace(task.workspace,task.objective); const classification=await classifyTask(task,ws,cfg); let route=routeTask(task,classification,ws,cfg);
 const advisor=executors[cfg.routing.advisor.executor]; route=await consultRoutingAdvisor(task,classification,ws,route,advisor,cfg);
 // Advisor is not allowed to select an unavailable executor.
 if(!cfg.executors[route.primary].enabled) route=routeTask(task,classification,ws,cfg);
 return {cfg,task,ws,classification,route};
}
export async function start(input:string,workspace:string,opts:any={}){
 const p=await plan(input,workspace,opts); const {cfg,task,ws,classification,route}=p; const primary=executors[route.primary];
 const run:RunRecord={runId:`run-${crypto.randomUUID().slice(0,8)}`,task,classification,route,status:"running",reworkCount:0,startedAt:new Date().toISOString()};
 run.execution=await primary.run(task,implementationPrompt(task,classification,ws,route),cfg,"implement");
 if(!run.execution.success){run.status="failed";run.failureReason=`primary executor failed: ${run.execution.stderr||run.execution.response}`;run.finishedAt=new Date().toISOString();appendRun(workspace,run);return run;}
 if(cfg.review.enabled){
   run.status="reviewing"; const reviewer=executors[route.reviewer];
   if(!reviewer.available() || (cfg.review.independent&&route.reviewer===route.primary)){
     run.failureReason="independent reviewer unavailable";
     if(cfg.review.failClosed){run.status="failed";run.finishedAt=new Date().toISOString();appendRun(workspace,run);return run;}
   } else {
     run.review=await independentReview(task,route.primary,reviewer,cfg);
     if(!run.review.pass && cfg.review.maxRework>0){
       run.reworkCount=1; const repair=await primary.run(task,repairPrompt(task,run.review.findings),cfg,"implement"); run.execution=repair;
       if(repair.success) run.review=await independentReview(task,route.primary,reviewer,cfg); else run.failureReason="repair executor failed";
     }
   }
 }
 const reviewSatisfied=!cfg.review.enabled || (run.review?.pass===true) || (!cfg.review.failClosed&&!run.review);
 run.status=run.execution.success && reviewSatisfied?"done":"failed";
 if(run.status==="failed"&&!run.failureReason&&run.review&&!run.review.pass) run.failureReason=`review failed with score ${run.review.score}`;
 run.finishedAt=new Date().toISOString(); appendRun(workspace,run); return run;
}
