import { Executor } from "../executors/base.js";
import { ReviewResult, TaskEnvelope, WorkplaneConfig } from "../core/types.js";
import { reviewPrompt } from "./prompts.js";
export async function independentReview(task:TaskEnvelope,primary:string, reviewer:Executor,cfg:WorkplaneConfig):Promise<ReviewResult>{
 const r=await reviewer.run(task,reviewPrompt(task,primary),cfg,"review"); let parsed:any;
 if(!r.success) return {pass:false,score:0,findings:[`Reviewer execution failed: ${r.stderr||r.response}`],raw:r.response};
 try{const m=r.response.match(/\{[\s\S]*\}/); parsed=JSON.parse(m?.[0]??r.response);}catch{parsed={pass:false,score:0,findings:["Reviewer did not return valid structured JSON."]};}
 const score=Number(parsed.score??0); return {pass:Boolean(parsed.pass)&&score>=cfg.review.minScore,score,findings:Array.isArray(parsed.findings)?parsed.findings.map(String):[],raw:r.response};
}
