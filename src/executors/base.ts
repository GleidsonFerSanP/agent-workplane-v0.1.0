import { ExecutorId, ExecutionResult, TaskEnvelope, WorkplaneConfig } from "../core/types.js";
export type ExecutionMode = "implement" | "review" | "advisor";
export interface Executor { id:ExecutorId; available():boolean; run(task:TaskEnvelope,prompt:string,cfg:WorkplaneConfig,mode?:ExecutionMode):Promise<ExecutionResult>; }
