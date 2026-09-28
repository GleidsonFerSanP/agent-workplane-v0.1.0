import crypto from "node:crypto";
import path from "node:path";
import { TaskEnvelope } from "./types.js";
import { commandExists, runProcess } from "../utils/process.js";

function id(prefix = "task"): string { return `${prefix}-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${crypto.randomUUID().slice(0,8)}`; }

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
    id: id(), objective: input, source: { type: "prompt" }, workspace: abs,
    constraints: [...(opts.constraint ?? [])], acceptanceCriteria: [], hints: [...(opts.hint ?? [])], createdAt: new Date().toISOString()
  };
}

function extractChecklist(body: string): string[] {
  return body.split("\n").map(x => x.trim()).filter(x => /^- \[[ xX]\]/.test(x)).map(x => x.replace(/^- \[[ xX]\]\s*/, ""));
}
