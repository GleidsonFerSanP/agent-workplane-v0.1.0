import { spawn, spawnSync } from "node:child_process";

export function commandExists(command: string): boolean {
  const result = spawnSync(process.platform === "win32" ? "where" : "which", [command], { stdio: "ignore" });
  return result.status === 0;
}

export async function runProcess(command: string, args: string[], opts: { cwd: string; timeoutMs?: number; env?: NodeJS.ProcessEnv }): Promise<{exitCode:number;stdout:string;stderr:string}> {
  return await new Promise((resolve) => {
    const child = spawn(command, args, { cwd: opts.cwd, env: { ...process.env, ...opts.env }, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = ""; let stderr = ""; let done = false;
    const timer = opts.timeoutMs ? setTimeout(() => { if (!done) child.kill("SIGTERM"); }, opts.timeoutMs) : undefined;
    child.stdout.on("data", d => stdout += d.toString());
    child.stderr.on("data", d => stderr += d.toString());
    child.on("error", e => { stderr += e.message; });
    child.on("close", code => { done = true; if (timer) clearTimeout(timer); resolve({ exitCode: code ?? 1, stdout, stderr }); });
  });
}
