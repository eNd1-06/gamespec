// Run with Node.js 22.18+ (native TypeScript stripping):
// node --test tests/gpu-data.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { gpus, getGpuBySlug } from "../data/gpus.ts";

test("GPU slugs identify exactly one product", () => {
  const seen = new Set();
  const duplicates = new Set();
  for (const gpu of gpus) {
    if (seen.has(gpu.slug)) duplicates.add(gpu.slug);
    seen.add(gpu.slug);
  }
  assert.deepEqual([...duplicates], [], "Duplicate GPU slugs");
});

test("every listed GPU matches its detail-page record", () => {
  for (const gpu of gpus) {
    assert.deepEqual(getGpuBySlug(gpu.slug), gpu, gpu.slug);
  }
});
