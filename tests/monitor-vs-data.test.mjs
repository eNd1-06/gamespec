// Run with Node.js 22.18+: node --test tests/monitor-vs-data.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { monitors, getMonitorBySlug } from "../data/monitors.ts";
import { MONITOR_VS_PAIRS } from "../data/vs-pairs.ts";

test("all monitor comparison endpoints resolve to catalog products", () => {
  const missing = MONITOR_VS_PAIRS.flatMap((pair) =>
    pair.filter((slug) => !getMonitorBySlug(slug))
  );
  assert.deepEqual([...new Set(missing)], []);
});

test("every monitor detail comparison can render both product names", () => {
  for (const monitor of monitors) {
    const pairs = MONITOR_VS_PAIRS.filter(([a, b]) =>
      a === monitor.slug || b === monitor.slug
    );
    for (const [a, b] of pairs) {
      assert.equal(typeof getMonitorBySlug(a)?.name, "string", a);
      assert.equal(typeof getMonitorBySlug(b)?.name, "string", b);
    }
  }
});
