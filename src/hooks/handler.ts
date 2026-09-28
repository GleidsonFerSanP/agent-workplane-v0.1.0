#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadConfig } from "../core/config.js";
import { readActive } from "../core/active.js";
import { jevDecide, jevNoul } from "../decision/client.js";

async function stdin():Promise<string>{return await new Promise(resolve=>{let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>resolve(s));});}
const raw=await stdin(); let payload:any={}; try{payload=JSON.parse(raw||"{}")}catch{}
const event=process.env.WORKPLANE_HOOK_EVENT || payload.hook_event_name || payload.event || "unknown";
const tool=payload.tool_name || payload.toolCall?.name || payload.tool?.name || "";
const input=payload.tool_input || payload.toolCall?.args || payload.tool?.input || {};
const workspace=payload.cwd || payload.workspacePaths?.[0] || process.cwd();
const dir=path.join(workspace,".workplane"); fs.mkdirSync(dir,{recursive:true});
let cfg:any; try{cfg=loadConfig(workspace)}catch{cfg={hooks:{mode:"observe",largeFileBytes:250000,jevAssist:false},jev:{enabled:false}}}
const active=readActive(workspace);

let context=""; let expensive=false; let reason="";
const file=String(input.file_path||input.AbsolutePath||input.path||"");
if(/read|view_file/i.test(tool)&&file){try{const resolved=path.isAbsolute(file)?file:path.resolve(workspace,file);const stat=fs.statSync(resolved);if(stat.size>cfg.hooks.largeFileBytes){expensive=true;reason=`large file (${stat.size} bytes)`;context="Large file detected. Prefer targeted ranges/search first; full content remains available if needed for correctness.";}}catch{}}
const command=String(input.command||input.CommandLine||"");
if(/bash|run_command|shell/i.test(tool)&&command&&/(test|gradle|mvn|npm|pnpm|yarn|pytest|cargo test)/i.test(command)){expensive=true;reason=reason||"potentially large build/test output";context="Test/build output may be large. Focus on failing assertions, root stack frames, and summary; retrieve full logs if needed for correctness.";}
if(/agent|subagent|delegate/i.test(tool)){expensive=true;reason=reason||"subagent delegation";}

let jev:any=undefined;
if(expensive && active && cfg.hooks.mode==="advise" && cfg.hooks.jevAssist){
  const answers=await jevDecide({objective:active.task.objective,classification:active.classification,tool,input,reason},{
    useful:{type:"noul",instructions:"Is this proposed tool action likely to materially help complete the active coding task correctly?"},
    coordinationWorthIt:{type:"noul",instructions:"If this action delegates to another agent, is expected quality/speed benefit likely to exceed coordination and quota cost? For non-delegation actions answer neutral."},
    correctnessRiskIfSkipped:{type:"noul",instructions:"Could discouraging or skipping this action create a meaningful correctness risk?"}
  },cfg);
  if(answers){
    jev={useful:jevNoul(answers.useful),coordinationWorthIt:jevNoul(answers.coordinationWorthIt),correctnessRiskIfSkipped:jevNoul(answers.correctnessRiskIfSkipped)};
    if(jev.useful<.25 && jev.correctnessRiskIfSkipped<.25) context += `${context?" ":""}Jev advisory: low expected task value (${jev.useful.toFixed(2)}); reconsider before spending quota, but proceed if repository evidence says it is necessary.`;
    if(/agent|subagent|delegate/i.test(tool)&&jev.coordinationWorthIt<.3) context += `${context?" ":""}Jev advisory: delegation benefit appears low (${jev.coordinationWorthIt.toFixed(2)}); prefer continuing in the current agent unless work is genuinely independent.`;
  }
}
fs.appendFileSync(path.join(dir,"hooks.jsonl"),JSON.stringify({ts:new Date().toISOString(),event,tool,input,taskId:active?.task.id,runId:active?.runId,reason,jev})+"\n");

// Quality-first default: advisory only. No useful action is hard-blocked and no source is discarded.
if(payload.hook_event_name){
  process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:payload.hook_event_name,additionalContext:context}}));
} else if(payload.toolCall){
  process.stdout.write(JSON.stringify({decision:"allow",reason:context||"workplane: pass"}));
} else process.stdout.write("{}");
