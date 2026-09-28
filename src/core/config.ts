import fs from "node:fs";
import path from "node:path";
import { WorkplaneConfig } from "./types.js";

export const DEFAULT_CONFIG: WorkplaneConfig = {
  priority: ["quality", "speed", "precision", "quota"],
  qualityFloor: 0.9,
  jev: {
    enabled: true,
    endpoint: "https://jevtypesafeai.com/api/v1/decide",
    model: "jev-latest",
    timeoutMs: 5000,
    failOpen: true
  },
  hooks: {
    mode: "observe",
    largeFileBytes: 250000,
    jevAssist: false
  },
  routing: {
    minConfidence: 0.6,
    historyWeight: 0.35,
    advisor: {
      enabled: false,
      onUncertaintyOnly: true,
      executor: "antigravity",
      timeoutMs: 60000,
      failOpen: true
    }
  },
  executors: {
    codex: { enabled: true, command: "codex", argsBeforePrompt: ["exec", "--json", "--full-auto"], argsAfterPrompt: [] },
    claude: { enabled: true, command: "claude", argsBeforePrompt: ["-p"], argsAfterPrompt: ["--output-format", "json", "--permission-mode", "acceptEdits"] },
    antigravity: { enabled: true, command: "agy", argsBeforePrompt: ["-p"], argsAfterPrompt: ["--output-format", "json"] }
  },
  review: {
    enabled: true,
    independent: true,
    maxRework: 1,
    minScore: 85,
    failClosed: true
  }
};

function merge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const out: any = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && typeof out[key] === "object") {
      out[key] = merge(out[key], value as any);
    } else if (value !== undefined) out[key] = value;
  }
  return out;
}

export function configDir(workspace: string): string { return path.join(workspace, ".workplane"); }
export function configPath(workspace: string): string { return path.join(configDir(workspace), "config.json"); }

export function loadConfig(workspace: string): WorkplaneConfig {
  const file = configPath(workspace);
  if (!fs.existsSync(file)) return structuredClone(DEFAULT_CONFIG);
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return merge(structuredClone(DEFAULT_CONFIG), parsed);
}

export function initConfig(workspace: string): string {
  fs.mkdirSync(configDir(workspace), { recursive: true });
  const file = configPath(workspace);
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");
  return file;
}
