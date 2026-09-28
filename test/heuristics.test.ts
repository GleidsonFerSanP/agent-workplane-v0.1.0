import test from "node:test";import assert from "node:assert/strict";import { classifyHeuristically } from "../src/decision/heuristics.js";
const ws:any={git:true,languages:["kotlin"],packageManagers:[],fileCount:500,candidateFiles:["a"],hasTests:true,dirty:false};
test("detects bugfix and security relevance",()=>{const c=classifyHeuristically({id:"x",objective:"corrija o bug de refresh token na autenticação",source:{type:"prompt"},workspace:".",constraints:[],acceptanceCriteria:[],hints:[],createdAt:""},ws);assert.equal(c.kind,"bugfix");assert.ok(c.securityRelevance>.7);});
