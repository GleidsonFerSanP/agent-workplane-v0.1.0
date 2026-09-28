import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { acquireTaskLock } from "../src/core/task-lock.js";
import { intake } from "../src/core/intake.js";

test("prompt intake produces a stable workspace-scoped task id", async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"workplane-intake-"));
  try {
    const a=await intake("  Fix   refresh token loop ",dir);
    const b=await intake("fix refresh token loop",dir);
    assert.equal(a.id,b.id);
    assert.match(a.id,/^TASK-[a-f0-9]{12}$/);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});

test("task lock prevents concurrent duplicate execution and can be released",()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"workplane-lock-"));
  try {
    const release=acquireTaskLock(dir,"TASK-123");
    assert.throws(()=>acquireTaskLock(dir,"TASK-123"),/already running/);
    release();
    const releaseAgain=acquireTaskLock(dir,"TASK-123");
    releaseAgain();
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
