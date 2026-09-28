import { ExecutorId, RunRecord } from "../core/types.js";
export interface ExecutorReport { executor:ExecutorId;runs:number;successRate:number;firstReviewPassRate:number;avgRework:number;avgDurationMs:number;reportedInputTokens:number;reportedOutputTokens:number; }
export function buildReport(runs:RunRecord[]):ExecutorReport[]{
 const ids:ExecutorId[]=["codex","claude","antigravity"];
 return ids.map(executor=>{
   const xs=runs.filter(r=>r.route.primary===executor&&r.execution); const n=xs.length;
   const sum=(key:string)=>xs.reduce((s,r)=>s+Number(r.execution?.usage?.[key]??0),0);
   return {executor,runs:n,successRate:n?xs.filter(r=>r.status==="done").length/n:0,firstReviewPassRate:n?xs.filter(r=>r.review?.pass&&r.reworkCount===0).length/n:0,avgRework:n?xs.reduce((s,r)=>s+r.reworkCount,0)/n:0,avgDurationMs:n?xs.reduce((s,r)=>s+(r.execution?.durationMs??0),0)/n:0,reportedInputTokens:sum("input_tokens"),reportedOutputTokens:sum("output_tokens")};
 });
}
