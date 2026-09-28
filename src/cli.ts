#!/usr/bin/env node
import path from "node:path";
import { initConfig, loadConfig } from "./core/config.js";
import { plan, start } from "./orchestration/runner.js";
import { commandExists } from "./utils/process.js";
import { readRuns } from "./routing/history.js";
import { buildReport } from "./routing/report.js";
import { installHooks } from "./hooks/install.js";

const argv=process.argv.slice(2); const command=argv.shift()??"help";
function value(flag:string){const i=argv.indexOf(flag);if(i<0)return undefined;return argv[i+1];}
function values(flag:string){const out:string[]=[];for(let i=0;i<argv.length;i++)if(argv[i]===flag&&argv[i+1])out.push(argv[i+1]!);return out;}
function positional(){const out:string[]=[];const valued=new Set(["--workspace","--hint","--constraint"]);for(let i=0;i<argv.length;i++){if(argv[i]!.startsWith("--")){if(valued.has(argv[i]!))i++;continue;}out.push(argv[i]!);}return out;}
function has(flag:string){return argv.includes(flag);}
const workspace=path.resolve(value("--workspace")??process.cwd());

async function main(){
 if(command==="init"){
   const f=initConfig(workspace); console.log(`Initialized ${f}`); console.log(`Priority: quality > speed > precision > quota`); return;
 }
 if(command==="doctor"){
   initConfig(workspace); const cfg=loadConfig(workspace);
   const rows=[...Object.entries(cfg.executors).map(([id,e])=>({component:id,command:e.command,available:commandExists(e.command)})),{component:"git",command:"git",available:commandExists("git")},{component:"github issue intake",command:"gh",available:commandExists("gh")}];
   console.table(rows); console.log(`Jev: ${process.env.JEV_API_KEY?"configured":"not configured (safe heuristic fallback)"}`); return;
 }
 if(command==="plan"||command==="start"){
   const input=positional().join(" ").trim(); if(!input) throw new Error(`Usage: work ${command} "task" [--workspace path]`);
   const opts={hint:values("--hint"),constraint:values("--constraint"),newRun:has("--new-run")};
   if(command==="plan"){
     const p=await plan(input,workspace,opts); console.log(JSON.stringify({task:p.task,workspace:p.ws,classification:p.classification,route:p.route},null,2)); return;
   }
   const r=await start(input,workspace,opts); console.log(JSON.stringify(r,null,2)); process.exitCode=r.status==="done"?0:2; return;
 }
 if(command==="status"){
   const runs=readRuns(workspace); const last=runs.at(-1); console.log(last?JSON.stringify(last,null,2):"No runs recorded."); return;
 }
 if(command==="history"){
   const runs=readRuns(workspace); console.table(runs.map(r=>({run:r.runId,task:r.task.id,status:r.status,primary:r.route.primary,review:r.review?.score??"-",rework:r.reworkCount,reason:r.failureReason??""}))); return;
 }
 if(command==="report"){
   const report=buildReport(readRuns(workspace)); console.table(report.map(r=>({...r,successRate:(r.successRate*100).toFixed(1)+"%",firstReviewPassRate:(r.firstReviewPassRate*100).toFixed(1)+"%",avgDurationSec:(r.avgDurationMs/1000).toFixed(1)}))); return;
 }
 if(command==="install-hooks"){
   initConfig(workspace); const handler=path.resolve(path.dirname(new URL(import.meta.url).pathname),"hooks","handler.js"); const files=installHooks(workspace,handler); console.log(`Generated conservative hook fragments:\n${files.map(x=>`- ${x}`).join("\n")}\nMerge/install the fragment appropriate to each coding tool.`); return;
 }
 if(command==="config") { initConfig(workspace); console.log(JSON.stringify(loadConfig(workspace),null,2)); return; }
 console.log(`agent-workplane\n\nCommands:\n  work init\n  work doctor\n  work plan "task"\n  work start "task"\n  work status\n  work history\n  work report\n  work install-hooks\n\nOptions:\n  --workspace <path>\n  --hint <text> (repeatable)\n  --constraint <text> (repeatable)
  --new-run (bypass idempotent completed-task reuse)`);
}
main().catch(e=>{console.error(`work: ${e instanceof Error?e.message:String(e)}`);process.exitCode=1;});
