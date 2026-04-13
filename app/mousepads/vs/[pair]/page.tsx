import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mousepads } from "@/data/mousepads";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

import { MOUSEPAD_VS_PAIRS } from "@/data/vs-pairs";
export const VS_PAIRS = MOUSEPAD_VS_PAIRS;

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(mousepads.map((m) => m.slug));
  let start = 0;
  while (true) {
    const idx = pair.indexOf("-vs-", start);
    if (idx === -1) return null;
    const a = pair.slice(0, idx);
    const b = pair.slice(idx + 4);
    if (slugSet.has(a) && slugSet.has(b)) return [a, b];
    start = idx + 1;
  }
}

export async function generateStaticParams() {
  return VS_PAIRS.filter(
    ([a, b]) => mousepads.find((m) => m.slug === a) && mousepads.find((m) => m.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const mA = mousepads.find((m) => m.slug === slugA)!;
  const mB = mousepads.find((m) => m.slug === slugB)!;
  const title = `${mA.name} vs ${mB.name} 比較【2025年】マウスパッド スペック・価格`;
  const description = `${mA.name}（${mA.size}・¥${mA.price.toLocaleString()}）と${mB.name}（${mB.size}・¥${mB.price.toLocaleString()}）を徹底比較。サイズ・表面素材・厚さ・価格の違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mousepads/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/mousepads/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function MousepadsVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const mA = mousepads.find((m) => m.slug === slugA)!;
  const mB = mousepads.find((m) => m.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: mA.brand, b: mB.brand },
    { label: "サイズ", a: mA.size, b: mB.size },
    { label: "幅 × 高さ", a: `${mA.width}×${mA.height}mm`, b: `${mB.width}×${mB.height}mm` },
    { label: "厚さ", a: `${mA.thickness}mm`, b: `${mB.thickness}mm` },
    { label: "表面タイプ", a: mA.surface, b: mB.surface },
    { label: "素材", a: mA.material, b: mB.material },
    { label: "ステッチ縫い", a: mA.stitchedEdge ? "あり" : "なし", b: mB.stitchedEdge ? "あり" : "なし" },
    { label: "RGB", a: mA.rgb ? "あり" : "なし", b: mB.rgb ? "あり" : "なし" },
    { label: "発売年", a: `${mA.releaseYear}年`, b: `${mB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${mA.price.toLocaleString()}`, b: `¥${mB.price.toLocaleString()}`, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b"): boolean => {
    const valA = parseFloat(row.a.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  const recommendA: string[] = [];
  const recommendB: string[] = [];

  if (mA.thickness > mB.thickness) {
    recommendA.push(`クッション性重視（厚さ${mA.thickness}mm）`);
    recommendB.push(`薄めで滑らかな操作感が好き`);
  } else if (mB.thickness > mA.thickness) {
    recommendB.push(`クッション性重視（厚さ${mB.thickness}mm）`);
    recommendA.push(`薄めで滑らかな操作感が好き`);
  }

  if (mA.surface !== mB.surface) {
    recommendA.push(`${mA.surface}が好み`);
    recommendB.push(`${mB.surface}が好み`);
  }

  if (mA.stitchedEdge && !mB.stitchedEdge) {
    recommendA.push("端のほつれが気になる（ステッチ縫いあり）");
    recommendB.push("価格を抑えたい");
  } else if (mB.stitchedEdge && !mA.stitchedEdge) {
    recommendB.push("端のほつれが気になる（ステッチ縫いあり）");
    recommendA.push("価格を抑えたい");
  }

  if (mA.price < mB.price) {
    recommendA.push(`コスパ重視（¥${mA.price.toLocaleString()}）`);
    recommendB.push(`品質・ブランドを重視する`);
  } else if (mB.price < mA.price) {
    recommendB.push(`コスパ重視（¥${mB.price.toLocaleString()}）`);
    recommendA.push(`品質・ブランドを重視する`);
  }

  const relatedPairs = VS_PAIRS.filter(
    ([a, b]) =>
      (a === slugA || b === slugA || a === slugB || b === slugB) &&
      !(a === slugA && b === slugB) &&
      !(a === slugB && b === slugA)
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mousepads" className="text-gray-400 hover:text-white text-sm">マウスパッド</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold truncate">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {mA.name} vs {mB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">サイズ・表面タイプ・厚さ・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[mA, mB].map((m) => (
            <Link
              key={m.slug}
              href={`/mousepads/${m.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group"
            >
              <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{m.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.size}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.surface}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">厚さ{m.thickness}mm</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{m.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{mA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{mB.name}</p>
            </div>
          </div>

          {rows.map((row) => {
            const winA = getWinner(row, "a");
            const winB = getWinner(row, "b");
            return (
              <div key={row.label} className="grid grid-cols-3 border-b border-gray-800 last:border-b-0">
                <div className="px-4 py-3 border-r border-gray-800 flex items-center">
                  <span className="text-xs text-gray-500">{row.label}</span>
                </div>
                <div className={`px-3 py-3 border-r border-gray-800 flex items-center justify-center ${winA ? "bg-blue-950" : ""}`}>
                  <span className={`text-xs font-medium text-center ${winA ? "text-blue-300" : "text-gray-300"}`}>
                    {winA && <span className="mr-1">✓</span>}{row.a}
                  </span>
                </div>
                <div className={`px-3 py-3 flex items-center justify-center ${winB ? "bg-blue-950" : ""}`}>
                  <span className={`text-xs font-medium text-center ${winB ? "text-blue-300" : "text-gray-300"}`}>
                    {winB && <span className="mr-1">✓</span>}{row.b}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-3 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <a href={mA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={mB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4">どちらを選ぶべきか？</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{mA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。ブランドや好みで選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{mB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。ブランドや好みで選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[mA, mB].map((m) => (
            <Link key={m.slug} href={`/mousepads/${m.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{m.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{m.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const pA = mousepads.find((m) => m.slug === a)!;
                const pB = mousepads.find((m) => m.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/mousepads/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group">
                    <span className="text-xs text-white group-hover:text-blue-400">{pA.name} vs {pB.name}</span>
                    <span className="text-xs text-gray-500">比較 →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/mousepads/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            マウスパッド ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
