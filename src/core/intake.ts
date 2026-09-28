import crypto from "node:crypto";
import path from "node:path";
import { TaskEnvelope } from "./types.js";
import { commandExists, runProcess } from "../utils/process.js";

function stablePromptId(workspace:string, objective:string):string {
  const normalized=objective.trim().replace(/\s+/g," ").toLowerCase();
  return `TASK-${crypto.createHash("sha256").update(`${workspace}\0${normalized}`).digest("hex").slice(0,12)}`;
}

export async function intake(input: string, workspace = process.cwd(), opts: { hint?: string[]; constraint?: string[] } = {}): Promise<TaskEnvelope> {
  const abs = path.resolve(workspace);
  const ghIssue = /^(?:#?\d+|https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+)$/.test(input.trim());
  if (ghIssue && commandExists("gh")) {
    const issueArg = input.startsWith("http") ? input : input.replace(/^#/, "");
    const r = await runProcess("gh", ["issue", "view", issueArg, "--json", "number,title,body,url"], { cwd: abs, timeoutMs: 10000 });
    if (r.exitCode === 0) {
      const issue = JSON.parse(r.stdout);
      const body = String(issue.body ?? "");
      return {
        id: `GH-${issue.number}`,
        objective: issue.title,
        source: { type: "github-issue", ref: issue.url },
        workspace: abs,
        constraints: [...(opts.constraint ?? [])],
        acceptanceCriteria: extractChecklist(body),
        hints: [...(opts.hint ?? [])],
        createdAt: new Date().toISOString()
      };
    }
  }
  return {
    id: stablePromptId(abs,input), objective: input, source: { type: "prompt" }, workspace: abs,
    constraints: [...(opts.constraint ?? [])], acceptanceCriteria: [], hints: [...(opts.hint ?? [])], createdAt: new Date().toISOString()
  };
}

function extractChecklist(body: string): string[] {
  return body.split("\n").map(x => x.trim()).filter(x => /^- \[[ xX]\]/.test(x)).map(x => x.replace(/^- \[[ xX]\]\s*/, ""));
}
