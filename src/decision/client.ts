import { WorkplaneConfig } from "../core/types.js";

export async function jevDecide(state:any, questions:Record<string,any>, cfg:WorkplaneConfig):Promise<any|undefined>{
  if(!cfg.jev.enabled || !process.env.JEV_API_KEY) return undefined;
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),cfg.jev.timeoutMs);
  try{
    const res=await fetch(cfg.jev.endpoint,{method:"POST",headers:{Authorization:`Bearer ${process.env.JEV_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({model:cfg.jev.model,state,questions}),signal:controller.signal});
    if(!res.ok) throw new Error(`Jev HTTP ${res.status}`);
    const json:any=await res.json(); return json.answers??json;
  }catch(e){if(!cfg.jev.failOpen)throw e;return undefined;}finally{clearTimeout(timer);}
}
export function jevNoul(answer:any,fallback=.5):number{const v=answer?.noul??answer?.probability??answer?.value;return typeof v==="number"?Math.max(0,Math.min(1,v)):fallback;}
