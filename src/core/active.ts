import fs from "node:fs";
import path from "node:path";
import { configDir } from "./config.js";
import { RouteDecision, TaskClassification, TaskEnvelope } from "./types.js";

export interface ActiveRunContext { runId:string; task:TaskEnvelope; classification:TaskClassification; route:RouteDecision; startedAt:string; }
export function activeFile(workspace:string){return path.join(configDir(workspace),"active.json");}
export function writeActive(workspace:string,ctx:ActiveRunContext){fs.mkdirSync(configDir(workspace),{recursive:true});fs.writeFileSync(activeFile(workspace),JSON.stringify(ctx,null,2)+"\n");}
export function clearActive(workspace:string,runId:string){
  const f=activeFile(workspace); if(!fs.existsSync(f))return;
  try{const cur=JSON.parse(fs.readFileSync(f,"utf8"));if(cur.runId===runId)fs.unlinkSync(f);}catch{}
}
export function readActive(workspace:string):ActiveRunContext|undefined{
  const f=activeFile(workspace); if(!fs.existsSync(f))return undefined;
  try{return JSON.parse(fs.readFileSync(f,"utf8"));}catch{return undefined;}
}
