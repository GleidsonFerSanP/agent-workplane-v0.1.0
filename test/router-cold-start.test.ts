import test from "node:test";
import assert from "node:assert/strict";
import { routeTask } from "../src/routing/router.js";
import { DEFAULT_CONFIG } from "../src/core/config.js";
import { TaskClassification, TaskEnvelope, WorkspaceSignals } from "../src/core/types.js";

const task:TaskEnvelope={id:"t",objective:"do work",source:{type:"prompt"},workspace:"/tmp/nonexistent-workplane-test",constraints:[],acceptanceCriteria:[],hints:[],createdAt:new Date(0).toISOString()};
const ws:WorkspaceSignals={git:false,languages:["TypeScript"],packageManagers:["npm"],fileCount:100,candidateFiles:[],hasTests:true,dirty:false};
const base:TaskClassification={kind:"unknown",complexity:"medium",architectureImpact:.2,securityRelevance:.2,visualReasoning:.2,repoExploration:.4,testingNeed:.8,parallelizable:.4,confidence:.8,source:"heuristic"};

test("cold start does not encode an arbitrary global winner",()=>{
  const r=routeTask(task,base,ws,structuredClone(DEFAULT_CONFIG));
  const q=new Set(r.scores.map(x=>x.quality));
  const s=new Set(r.scores.map(x=>x.speed));
  assert.equal(q.size,1);
  assert.equal(s.size,1);
  assert.equal(r.escalation,true);
});

test("architecture signal is a narrow tie-breaker, not a global prior",()=>{
  const c={...base,architectureImpact:.95};
  const r=routeTask(task,c,ws,structuredClone(DEFAULT_CONFIG));
  assert.equal(r.primary,"claude");
  assert.ok(r.scores.find(x=>x.executor==="claude")!.quality > r.scores.find(x=>x.executor==="codex")!.quality);
});
