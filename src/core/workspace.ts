import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { WorkspaceSignals } from "./types.js";

const SKIP = new Set([".git","node_modules","dist","build",".gradle",".idea","Pods","DerivedData","vendor"]);
const EXT_LANG: Record<string,string> = { ".ts":"typescript", ".tsx":"typescript", ".js":"javascript", ".jsx":"javascript", ".kt":"kotlin", ".kts":"kotlin", ".java":"java", ".swift":"swift", ".py":"python", ".go":"go", ".rs":"rust", ".cs":"csharp", ".rb":"ruby", ".php":"php" };

export function inspectWorkspace(workspace: string, objective = ""): WorkspaceSignals {
  const files: string[] = [];
  const walk = (dir: string) => {
    if (files.length >= 5000) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full); else files.push(path.relative(workspace, full));
      if (files.length >= 5000) return;
    }
  };
  walk(workspace);
  const languages = [...new Set(files.map(f => EXT_LANG[path.extname(f)]).filter(Boolean))] as string[];
  const managerFiles: Array<[string, string]> = [
    ["package-lock.json","npm"],["pnpm-lock.yaml","pnpm"],["yarn.lock","yarn"],["gradlew","gradle"],["pom.xml","maven"],["Package.swift","swiftpm"],["go.mod","go"]
  ];
  const packageManagers = managerFiles.filter(([f]) => files.includes(f)).map(([,m]) => m);
  const git = fs.existsSync(path.join(workspace, ".git"));
  const status = git ? spawnSync("git", ["status", "--porcelain"], { cwd: workspace, encoding: "utf8" }) : null;
  const terms = objective.toLowerCase().split(/[^a-z0-9_]+/).filter(t => t.length >= 4).slice(0,12);
  const candidateFiles = files.map(f => ({f,score:terms.reduce((s,t)=>s+(f.toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,20).map(x=>x.f);
  return { git, languages, packageManagers, fileCount: files.length, candidateFiles, hasTests: files.some(f => /(test|spec)/i.test(f)), dirty: Boolean(status?.stdout.trim()) };
}
