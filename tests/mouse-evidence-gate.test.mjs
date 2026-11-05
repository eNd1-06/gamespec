import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

// URL syntax cannot prove source authenticity or value/condition accuracy.
// Extend the allowed field/unit rules when adding new specification fields.
const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const now = () => new Date();

function load(source, file) {
  const result = ts.transpileModule(source, { fileName: file, reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS } });
  assert.equal(result.diagnostics.length, 0, `${file}: syntax`);
  const module = { exports: {} };
  vm.runInNewContext(result.outputText, { module, exports: module.exports });
  return module.exports;
}
function checkSyntax(source) {
  const file = ts.createSourceFile('mice.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(file.parseDiagnostics.length, 0, 'ledger syntax');
  const roots = new Set();
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ['mouseEvidence', 'priceObservations'].includes(node.name.getText(file))) {
      assert.ok(node.initializer && ts.isObjectLiteralExpression(node.initializer), 'ledger must use literal objects');
      roots.add(node.name.getText(file));
      checkObject(node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  function checkObject(object) {
    const keys = new Set();
    for (const p of object.properties) {
      assert.ok(ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)), 'only literal property names are allowed');
      const key = p.name.text;
      assert.ok(!keys.has(key), `duplicate key: ${key}`);
      keys.add(key);
      if (ts.isObjectLiteralExpression(p.initializer)) checkObject(p.initializer);
    }
  }
  visit(file);
  assert.equal(roots.size, 2, 'both ledger maps required');
}
const nonempty = v => typeof v === 'string' && v.trim().length > 0;
function url(v) { try { return typeof v === 'string' && ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; } }
function date(v, today) {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isFinite(d.valueOf()) && d.toISOString().slice(0, 10) === v && v <= today;
}
function timestamp(v, reference) {
  if (typeof v !== 'string') return false;
  const m = /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(v);
  return !!m && date(m[1], '9999-12-31') && Number.isFinite(Date.parse(v)) && Date.parse(v) <= reference.valueOf();
}
function validate(source, mice, reference = now()) {
  checkSyntax(source);
  const { mouseEvidence, priceObservations } = load(source, 'ledger.ts');
  const today = new Date(reference.valueOf() + 9 * 3600000).toISOString().slice(0, 10);
  const base = new Map();
  for (const mouse of mice) { assert.ok(nonempty(mouse.slug) && !base.has(mouse.slug), `duplicate or invalid base slug: ${mouse.slug}`); base.set(mouse.slug, mouse); }
  const sourceValid = s => s && url(s.url) && ['manufacturer-product', 'manufacturer-manual'].includes(s.kind) && nonempty(s.locator);
  for (const [slug, fields] of Object.entries(mouseEvidence)) {
    assert.ok(base.has(slug), `unknown slug: ${slug}`);
    assert.ok(fields && typeof fields === 'object' && !Array.isArray(fields) && Object.keys(fields).length, `empty fields: ${slug}`);
    for (const [field, entry] of Object.entries(fields)) {
      const units = { weight: 'g', pollingRate: 'Hz' };
      assert.ok(Object.hasOwn(units, field), `unknown field: ${field}`);
      const unit = units[field];
      assert.ok(entry && typeof entry === 'object', 'missing evidence');
      assert.ok(typeof entry.value === 'number' && Number.isFinite(entry.value) && entry.value > 0 && entry.value === base.get(slug)[field], `invalid or mismatched ${slug}.${field}`);
      assert.equal(entry.unit, unit, `invalid unit ${slug}.${field}`);
      assert.ok(entry.conditions === null || nonempty(entry.conditions), 'invalid conditions');
      if (entry.status === 'unverified') assert.ok(entry.source === null && entry.checkedOn === null, 'unverified state');
      else if (entry.status === 'verified') assert.ok(sourceValid(entry.source) && date(entry.checkedOn, today) && nonempty(entry.conditions), 'verified requires source, date and conditions');
      else if (entry.status === 'needs-review') {
        assert.ok(nonempty(entry.reason), 'needs-review reason');
        assert.ok(entry.source === null || sourceValid(entry.source), 'invalid review source');
        assert.ok(entry.checkedOn === null || date(entry.checkedOn, today), 'invalid review date');
        assert.equal(entry.source === null, entry.checkedOn === null, 'review source/date must be paired');
      } else assert.fail('invalid status');
    }
  }
  for (const [slug, price] of Object.entries(priceObservations)) {
    assert.ok(base.has(slug), `unknown price slug: ${slug}`);
    assert.ok(price && typeof price.amount === 'number' && Number.isFinite(price.amount) && price.amount > 0 && price.amount === base.get(slug).price && price.currency === 'JPY', 'invalid price');
    assert.ok(price.sourceUrl === null || url(price.sourceUrl), 'invalid price URL');
    assert.ok(price.fetchedAt === null || timestamp(price.fetchedAt, reference), 'invalid price timestamp');
    assert.ok(price.fetchedAt === null || url(price.sourceUrl), 'price timestamp requires source URL');
  }
}

const source = read('data/spec-evidence/mice.ts');
const mice = load(read('data/mice.ts'), 'mice.ts').mice;
const fixed = new Date('2026-11-05T03:00:00Z');
test('real ledger passes', () => validate(source, mice));
const cases = [
  ['unknown slug', source.replaceAll('logicool-g-pro-x-superlight-2', 'unknown')],
  ['duplicate field', source.replace('    weight:', '    weight: { value: 60, unit: "g", conditions: null, status: "unverified", source: null, checkedOn: null },\n    weight:')],
  ['duplicate slug', source.replace('  "logicool-g-pro-x-superlight-2": {', '  "logicool-g-pro-x-superlight-2": {},\n  "logicool-g-pro-x-superlight-2": {')],
  ['unknown field', source.replace('weight:', 'mass:')],
  ['wrong unit', source.replace('unit: "g"', 'unit: "Hz"')],
  ['missing value', source.replace('value: 60', 'value: null')],
  ['mismatch', source.replace('value: 60', 'value: 61')],
  ['invalid status', source.replace('status: "unverified"', 'status: "unknown"')],
  ['unverified source', source.replace('source: null', 'source: { url: "https://example.org", kind: "manufacturer-product", locator: "spec" }')],
  ['verified missing details', source.replace('status: "unverified"', 'status: "verified"')],
  ['review missing reason', source.replace('status: "unverified"', 'status: "needs-review"')],
  ['price mismatch', source.replace('amount: 19800', 'amount: 1')],
  ['price missing URL', source.replace('fetchedAt: null', 'fetchedAt: "2026-11-04T10:00:00Z"')],
  ['price invalid date', source.replace('fetchedAt: null', 'fetchedAt: "2026-02-30T10:00:00Z"')],
];
for (const [name, fixture] of cases) test(`reject ${name}`, () => assert.throws(() => validate(fixture, mice, fixed)));
const verified = source.replace('conditions: null, status: "unverified", source: null, checkedOn: null', 'conditions: "fixture", status: "verified", source: { url: "https://example.org/spec", kind: "manufacturer-manual", locator: "page 1" }, checkedOn: "2026-11-05"');
test('accept complete verified fixture', () => validate(verified, mice, fixed));
test('reject duplicate base slug', () => assert.throws(() => validate(source, [...mice, mice[0]], fixed)));
test('accept needs-review with reason', () => validate(source.replace('status: "unverified", source: null, checkedOn: null', 'status: "needs-review", source: null, checkedOn: null, reason: "fixture"'), mice, fixed));
test('accept separately sourced price timestamp', () => validate(source.replace('sourceUrl: null, fetchedAt: null', 'sourceUrl: "https://example.org/price", fetchedAt: "2026-11-04T10:00:00+09:00"'), mice, fixed));
for (const [name, fixture] of [
  ['future date', verified.replace('2026-11-05', '2026-11-06')],
  ['impossible date', verified.replace('2026-11-05', '2026-02-30')],
  ['bad source kind', verified.replace('manufacturer-manual', 'retailer')],
  ['bad URL', verified.replace('https://example.org/spec', 'javascript:alert(1)')],
  ['missing locator', verified.replace('page 1', ' ')],
  ['missing conditions', verified.replace('conditions: "fixture"', 'conditions: null')],
]) test(`reject verified ${name}`, () => assert.throws(() => validate(fixture, mice, fixed)));
