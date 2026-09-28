import { ExecutionResult, ExecutorId, WorkplaneConfig, TaskEnvelope } from "../core/types.js";
import { ExecutionMode } from "./base.js";
import { commandExists, runProcess } from "../utils/process.js";

function parseJsonLines(text:string):any[]{return text.split("\n").filter(Boolean).flatMap(x=>{try{return[JSON.parse(x)]}catch{return[]}})}
function withMode(id:ExecutorId, before:string[], after:string[], mode:ExecutionMode, cfg:WorkplaneConfig):{before:string[];after:string[]} {
  let b=[...before], a=[...after];
  if(mode==="review") {
    if(id==="codex") b=b.filter(x=>x!=="--full-auto");
    if(id==="claude") {
      const i=a.indexOf("--permission-mode"); if(i>=0) a.splice(i,2,"--permission-mode","plan");
    }
    if(id==="antigravity" && !a.includes("--sandbox")) a.push("--sandbox");
  }
  if(mode==="advisor") {
    if(id==="codex") b=b.filter(x=>x!=="--full-auto");
    if(id==="claude") {
      const i=a.indexOf("--permission-mode"); if(i>=0) a.splice(i,2,"--permission-mode","plan");
    }
    const model=cfg.routing.advisor.model;
    if(model && id==="antigravity") a.push("--model",model);
  }
  return {before:b,after:a};
}
export function makeExecutor(id:ExecutorId){
  return {
    id,
    available(){ return commandExists(id==="antigravity"?"agy":id); },
    async run(task:TaskEnvelope,prompt:string,cfg:WorkplaneConfig,mode:ExecutionMode="implement"):Promise<ExecutionResult>{
      const ecfg=cfg.executors[id]; const started=new Date(); const m=withMode(id,ecfg.argsBeforePrompt,ecfg.argsAfterPrompt,mode,cfg);
      const args=[...m.before,prompt,...m.after];
      const timeoutMs=mode==="advisor"?cfg.routing.advisor.timeoutMs:45*60*1000;
      const r=await runProcess(ecfg.command,args,{cwd:task.workspace,timeoutMs});
      const finished=new Date(); let response=r.stdout; let usage:Record<string,number>|undefined; let sessionId:string|undefined;
      if(id==="codex"){
        const events=parseJsonLines(r.stdout); const msgs=events.filter(e=>e.type==="item.completed"&&e.item?.type==="agent_message"); response=msgs.at(-1)?.item?.text ?? r.stdout;
        const end=[...events].reverse().find(e=>e.usage||e.type==="turn.completed"); if(end?.usage) usage=end.usage;
      } else {
        try { const j=JSON.parse(r.stdout); response=j.response ?? j.result ?? r.stdout; usage=j.usage; sessionId=j.session_id ?? j.conversation_id; } catch {}
      }
      return {executor:id,exitCode:r.exitCode,success:r.exitCode===0,startedAt:started.toISOString(),finishedAt:finished.toISOString(),durationMs:finished.getTime()-started.getTime(),response,stdout:r.stdout,stderr:r.stderr,usage,sessionId};
    }
  };
}
