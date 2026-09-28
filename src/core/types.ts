export type ExecutorId = "codex" | "claude" | "antigravity";
export type TaskKind = "feature" | "bugfix" | "refactor" | "review" | "investigation" | "maintenance" | "unknown";
export type Complexity = "trivial" | "simple" | "medium" | "hard" | "unknown";

export interface TaskEnvelope {
  id: string;
  objective: string;
  source: { type: "prompt" | "github-issue"; ref?: string };
  workspace: string;
  constraints: string[];
  acceptanceCriteria: string[];
  hints: string[];
  createdAt: string;
}

export interface WorkspaceSignals {
  git: boolean;
  languages: string[];
  packageManagers: string[];
  fileCount: number;
  candidateFiles: string[];
  hasTests: boolean;
  dirty: boolean;
}

export interface TaskClassification {
  kind: TaskKind;
  complexity: Complexity;
  architectureImpact: number;
  securityRelevance: number;
  visualReasoning: number;
  repoExploration: number;
  testingNeed: number;
  parallelizable: number;
  confidence: number;
  source: "jev" | "heuristic";
}

export interface HistoricalStats {
  attempts: number;
  successRate: number;
  firstReviewPassRate: number;
  avgRework: number;
  avgDurationMs: number;
}

export interface RouteScore {
  executor: ExecutorId;
  quality: number;
  speed: number;
  precision: number;
  quotaEfficiency: number;
  confidence: number;
  rationale: string[];
}

export interface RouteDecision {
  primary: ExecutorId;
  reviewer: ExecutorId;
  scores: RouteScore[];
  confidence: number;
  escalation: boolean;
  advisorUsed?: boolean;
  advisorRationale?: string;
  rationale: string[];
}

export interface ExecutionResult {
  executor: ExecutorId;
  exitCode: number;
  success: boolean;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  response: string;
  stdout: string;
  stderr: string;
  usage?: Record<string, number>;
  sessionId?: string;
}

export interface ReviewResult {
  pass: boolean;
  score: number;
  findings: string[];
  raw: string;
}

export interface RunRecord {
  runId: string;
  task: TaskEnvelope;
  classification: TaskClassification;
  route: RouteDecision;
  execution?: ExecutionResult;
  review?: ReviewResult;
  status: "planned" | "running" | "reviewing" | "done" | "failed";
  reworkCount: number;
  startedAt: string;
  finishedAt?: string;
  failureReason?: string;
}

export interface ExecutorConfig {
  enabled: boolean;
  command: string;
  argsBeforePrompt: string[];
  argsAfterPrompt: string[];
}

export interface WorkplaneConfig {
  priority: ["quality", "speed", "precision", "quota"];
  qualityFloor: number;
  jev: {
    enabled: boolean;
    endpoint: string;
    model: string;
    timeoutMs: number;
    failOpen: boolean;
  };
  hooks: {
    mode: "observe" | "advise";
    largeFileBytes: number;
    jevAssist: boolean;
  };
  routing: {
    minConfidence: number;
    historyWeight: number;
    preferred?: ExecutorId;
    advisor: {
      enabled: boolean;
      onUncertaintyOnly: boolean;
      executor: ExecutorId;
      model?: string;
      timeoutMs: number;
      failOpen: boolean;
    };
  };
  executors: Record<ExecutorId, ExecutorConfig>;
  review: {
    enabled: boolean;
    independent: boolean;
    maxRework: number;
    minScore: number;
    failClosed: boolean;
  };
}
