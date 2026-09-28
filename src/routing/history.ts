import fs from "node:fs";
import path from "node:path";
import { ExecutorId, HistoricalStats, RunRecord } from "../core/types.js";
import { configDir } from "../core/config.js";

export function historyFile(workspace:string):string { return path.join(configDir(workspace), "history.jsonl"); }
export function appendRun(workspace:string, run:RunRecord):void { fs.mkdirSync(configDir(workspace), {recursive:true}); fs.appendFileSync(historyFile(workspace), JSON.stringify(run)+"\n"); }
export function readRuns(workspace:string):RunRecord[] {
  const f=historyFile(workspace); if(!fs.existsSync(f)) return [];
  return fs.readFileSync(f,"utf8").split("\n").filter(Boolean).flatMap(line=>{try{return [JSON.parse(line)]}catch{return []}});
}
export function statsFor(workspace:string, executor:ExecutorId, fingerprint:string):HistoricalStats {
  const matching=readRuns(workspace).filter(r=>r.route.primary===executor && fingerprintOf(r)===fingerprint && r.execution);
  if(!matching.length) return {attempts:0,successRate:.5,firstReviewPassRate:.5,avgRework:0.5,avgDurationMs:0};
  const n=matching.length;
  return { attempts:n,
    successRate: matching.filter(r=>r.status==="done").length/n,
    firstReviewPassRate: matching.filter(r=>r.review?.pass && r.reworkCount===0).length/n,
    avgRework: matching.reduce((s,r)=>s+r.reworkCount,0)/n,
    avgDurationMs: matching.reduce((s,r)=>s+(r.execution?.durationMs??0),0)/n };
}
export function fingerprintOf(r:{classification:any;task?:any}):string { return `${r.classification.kind}:${r.classification.complexity}`; }
