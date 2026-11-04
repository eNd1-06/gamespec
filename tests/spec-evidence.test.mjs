import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const now = Date.parse('2026-11-05T00:00:00Z');
class FixedDate extends Date { static now() { return now; } }

function load(file, overrides = {}, baseline = false) {
  const source = baseline
    ? execFileSync('git', ['show', `094e38f49805013f5ef3739e81e8b5edd6da62fc:${file}`], { cwd: root, encoding: 'utf8' })
    : readFileSync(resolve(root, file), 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: file, reportDiagnostics: true,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  assert.equal(compiled.diagnostics.length, 0, file);
  const loaded = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module: loaded, exports: loaded.exports, Date: FixedDate, URL,
    require: (name) => name in overrides ? overrides[name] : require(name),
  });
  return loaded.exports;
}
const { priceNote, specState } = load('lib/spec-evidence.ts');
const observation = { amount: 19800, currency: 'JPY', sourceUrl: 'https://example.org/price', fetchedAt: '2026-11-04T10:00:00+09:00' };
const unknown = '参考価格／取得日不明';

for (const fetchedAt of [
  '2026-02-30T10:00:00Z', '2026-02-29T10:00:00Z', '2026-04-31T10:00:00+09:00',
  '2999-01-01T10:00:00Z', '2026-11-05T00:00:00.001Z', '2026-11-05T09:00:01+09:00',
  '2026-11-04T10:00:00', '2026-11-04', '2026-13-01T00:00:00Z',
  '2026-00-01T00:00:00Z', '2026-11-00T00:00:00Z', '2026-11-04T24:00:00Z',
  '2026-11-04T10:60:00Z', '2026-11-04T10:00:60Z',
  '2026-11-04T10:00:00+24:00', '2026-11-04T10:00:00+09:60',
  '2026-11-04T10:00:00+0900', '', null, undefined,
]) test(`reject timestamp ${fetchedAt}`, () => {
  assert.equal(priceNote(19800, { ...observation, fetchedAt }, now), unknown);
});

for (const fetchedAt of [
  '2024-02-29T10:00:00Z', '2026-11-04T10:00:00.123Z',
  '2026-11-05T00:00:00Z', '2026-11-05T09:00:00+09:00',
  '2026-11-04T19:00:00-05:00', '2026-11-05T01:00:00+02:00',
]) test(`accept timestamp ${fetchedAt}`, () => {
  assert.equal(priceNote(19800, { ...observation, fetchedAt }, now), `参考価格／取得日時 ${fetchedAt}（現在価格・在庫を保証しません）`);
});

test('missing observation, amount mismatch, and missing/invalid source', () => {
  for (const value of [null, undefined, { ...observation, amount: 1 }, ...[null, undefined, '', 'javascript:alert(1)', 'invalid'].map(sourceUrl => ({ ...observation, sourceUrl }))]) {
    assert.equal(priceNote(19800, value, now), unknown);
  }
  assert.equal(priceNote(19800, { ...observation, fetchedAt: '2999-01-01T10:00:00Z' }), unknown);
});

test('spec dates remain separate and missing values remain missing', () => {
  const evidence = { value: 60, unit: 'g', conditions: 'test fixture', status: 'verified', source: { url: 'https://example.org/spec', kind: 'manufacturer-product', locator: 'fixture' }, checkedOn: '2026-11-05' };
  for (const value of [null, undefined]) assert.equal(specState(value, 'g', evidence).status, 'missing');
  assert.equal(specState(60, 'g', evidence).status, 'verified');
  for (const checkedOn of ['2026-02-30', '2026-11-06']) assert.equal(specState(60, 'g', { ...evidence, checkedOn }).status, 'needs-review');
  assert.equal(priceNote(19800, { ...observation, fetchedAt: null }, now), unknown);
});

const originalMice = load('data/mice.ts').mice;
const ledger = load('data/spec-evidence/mice.ts');
const slugs = ['logicool-g-pro-x-superlight-2', 'razer-viper-v3-pro'];
function render(mice, pair, baseline = false) {
  const page = load('app/mice/compare/page.tsx', {
    '@/data/mice': { mice }, '@/data/spec-evidence/mice': ledger,
    '@/lib/spec-evidence': { priceNote, specState },
    'next/navigation': { useSearchParams: () => new URLSearchParams(pair.length ? { a: pair[0], ...(pair[1] ? { b: pair[1] } : {}) } : {}) },
    'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children), __esModule: true },
  }, baseline).default;
  return renderToStaticMarkup(React.createElement(page));
}

for (const pair of [slugs, [...slugs].reverse(), [slugs[0], slugs[0]], [], [slugs[0]]]) {
  test(`normal HTML unchanged: ${pair.join(' / ') || 'selection'}`, () => {
    const html = render(originalMice, pair);
    const note = '<p class="px-4 py-2 text-xs text-gray-400">ポーリングレートは既存登録値です。発売時の公称値・ファームウェア更新後の最大対応値・標準設定値は同じとは限りません。表示値が最大値か標準値か、適用するファームウェア・レシーバー・接続条件は未確認で、現行の最大対応値を示すとは限りません。</p>';
    assert.equal(html.split(note).length - 1, pair.length === 2 ? 1 : 0);
    assert.equal(html.replace(note, ''), render(originalMice, pair, true));
  });
}

for (const missing of [null, undefined]) {
  for (const pair of [slugs, [...slugs].reverse()]) {
    test(`missing specs ${missing}, ${pair[0]}`, () => {
      const mice = originalMice.map(m => m.slug === slugs[0] ? {
        ...m, weight: missing, pollingRate: missing, maxDpi: missing, buttons: missing,
        length: missing, connection: missing, shape: missing, rgb: missing, releaseYear: missing,
        sensor: missing,
      } : m);
      const html = render(mice, pair);
      assert.ok(html.includes('—（未登録）'));
      assert.doesNotMatch(html, /nullg|undefinedg|nullHz|undefinedHz|null個|undefined個|NaN/);
      for (const label of ['重さ', '最大DPI', 'ポーリングレート']) {
        const row = html.split(`>${label}</span>`)[1].split('last:border-b-0')[0];
        assert.ok(row.includes('—（未登録）'));
        assert.ok(!row.includes('✓'), 'missing values must not award a winner');
        const missingFirst = row.indexOf('—（未登録）') < row.lastIndexOf('text-sm font-medium');
        assert.equal(missingFirst, pair[0] === slugs[0]);
      }
      assert.ok(render(mice, []).includes('—（未登録）'));
    });
  }
}
test('zero and false remain registered values; ties have no winner', () => {
  const mice = originalMice.map(m => slugs.includes(m.slug) ? { ...m, weight: 0, pollingRate: 0, maxDpi: 0, buttons: 0, rgb: false } : m);
  const html = render(mice, slugs);
  assert.ok(html.includes('0g'));
  assert.ok(html.includes('0Hz'));
  assert.ok(html.includes('0個'));
  assert.ok(html.includes('なし'));
  assert.ok(!html.includes('—（未登録）'));
});
