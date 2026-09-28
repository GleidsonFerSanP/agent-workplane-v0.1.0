import fs from "node:fs";
import path from "node:path";
import { configDir } from "./config.js";

interface LockData { pid:number; taskId:string; acquiredAt:string; }

function lockDir(workspace:string){ return path.join(configDir(workspace),"locks"); }
function lockFile(workspace:string,taskId:string){ return path.join(lockDir(workspace),`${taskId.replace(/[^a-zA-Z0-9._-]/g,"_")}.lock`); }
function pidAlive(pid:number):boolean { try { process.kill(pid,0); return true; } catch { return false; } }

export function acquireTaskLock(workspace:string,taskId:string):()=>void {
  fs.mkdirSync(lockDir(workspace),{recursive:true});
  const file=lockFile(workspace,taskId);
  for(let attempt=0;attempt<2;attempt++){
    try {
      const fd=fs.openSync(file,"wx");
      const data:LockData={pid:process.pid,taskId,acquiredAt:new Date().toISOString()};
      fs.writeFileSync(fd,JSON.stringify(data)+"\n"); fs.closeSync(fd);
      let released=false;
      return ()=>{if(released)return;released=true;try{fs.unlinkSync(file)}catch{}};
    } catch(e:any) {
      if(e?.code!=="EEXIST") throw e;
      try {
        const existing=JSON.parse(fs.readFileSync(file,"utf8")) as LockData;
        if(Number.isInteger(existing.pid)&&pidAlive(existing.pid)) throw new Error(`Task ${taskId} is already running in pid ${existing.pid} since ${existing.acquiredAt}.`);
        fs.unlinkSync(file); // stale lock, retry once
      } catch(readErr:any) {
        if(readErr instanceof Error && readErr.message.startsWith("Task ")) throw readErr;
        try{fs.unlinkSync(file)}catch{}
      }
    }
  }
  throw new Error(`Could not acquire task lock for ${taskId}.`);
}
