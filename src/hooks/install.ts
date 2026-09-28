import fs from "node:fs";
import path from "node:path";

function writeJson(file:string,obj:any){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(obj,null,2)+"\n");}
export function installHooks(workspace:string, compiledHandler:string){
 const cmd=`node ${JSON.stringify(compiledHandler)}`;
 const claude={hooks:{UserPromptSubmit:[{hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=UserPromptSubmit ${cmd}`}]}],PreToolUse:[{matcher:"Read|Bash|Agent",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PreToolUse ${cmd}`}]}],PostToolUse:[{matcher:"Bash",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PostToolUse ${cmd}`}]}]}};
 const codex={hooks:{UserPromptSubmit:[{hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=UserPromptSubmit ${cmd}`}]}],PreToolUse:[{matcher:"Bash|Read|Agent",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PreToolUse ${cmd}`}]}],PostToolUse:[{matcher:"Bash",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PostToolUse ${cmd}`}]}]}};
 const antigravity={"workplane":{PreToolUse:[{matcher:"run_command|view_file|invoke_subagent",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PreToolUse ${cmd}`}]}],PostToolUse:[{matcher:"run_command",hooks:[{type:"command",command:`WORKPLANE_HOOK_EVENT=PostToolUse ${cmd}`}]}]}};
 writeJson(path.join(workspace,".workplane","integrations","claude.settings.fragment.json"),claude);
 writeJson(path.join(workspace,".workplane","integrations","codex.hooks.json"),codex);
 writeJson(path.join(workspace,".workplane","integrations","antigravity.hooks.json"),antigravity);
 return [".workplane/integrations/claude.settings.fragment.json",".workplane/integrations/codex.hooks.json",".workplane/integrations/antigravity.hooks.json"];
}
