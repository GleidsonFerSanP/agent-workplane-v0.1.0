#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

async function stdin():Promise<string>{return await new Promise(resolve=>{let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>resolve(s));});}
const raw=await stdin(); let payload:any={}; try{payload=JSON.parse(raw||"{}")}catch{}
const event=process.env.WORKPLANE_HOOK_EVENT || payload.hook_event_name || payload.event || "unknown";
const tool=payload.tool_name || payload.toolCall?.name || payload.tool?.name || "";
const input=payload.tool_input || payload.toolCall?.args || payload.tool?.input || {};
const workspace=payload.cwd || payload.workspacePaths?.[0] || process.cwd();
const dir=path.join(workspace,".workplane"); fs.mkdirSync(dir,{recursive:true}); fs.appendFileSync(path.join(dir,"hooks.jsonl"),JSON.stringify({ts:new Date().toISOString(),event,tool,input})+"\n");

// Conservative default: hooks observe and annotate; they do not block useful work.
let context="";
const file=String(input.file_path||input.AbsolutePath||input.path||"");
if(/read|view_file/i.test(tool)&&file){try{const stat=fs.statSync(file);if(stat.size>250_000)context="Large file detected. Prefer targeted ranges/search first; full content remains available if needed for correctness.";}catch{}}
const command=String(input.command||input.CommandLine||"");
if(/bash|run_command|shell/i.test(tool)&&command&&/(test|gradle|mvn|npm|pnpm|yarn|pytest|cargo test)/i.test(command)) context="Test/build output may be large. Focus on failing assertions, root stack frames, and summary; retrieve full logs only if needed.";

if(payload.hook_event_name){ // Claude/Codex compatible additional context shape
  process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:payload.hook_event_name,additionalContext:context}}));
} else if(payload.toolCall){ // Antigravity PreToolUse
  process.stdout.write(JSON.stringify({decision:"allow",reason:context||"workplane: pass"}));
} else process.stdout.write("{}");
