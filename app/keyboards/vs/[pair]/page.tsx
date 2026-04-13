import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

import { KEYBOARD_VS_PAIRS } from "@/data/vs-pairs";
export const VS_PAIRS = KEYBOARD_VS_PAIRS;

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(keyboards.map((k) => k.slug));
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
  return VS_PAIRS.filter(([a, b]) =>
    keyboards.find((k) => k.slug === a) && keyboards.find((k) => k.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const kA = keyboards.find((k) => k.slug === slugA)!;
  const kB = keyboards.find((k) => k.slug === slugB)!;
  const title = `${kA.name} vs ${kB.name} 比較【2025年】スペック・スイッチ・価格`;
  const description = `${kA.name}（${kA.switchName}・${kA.layout}・¥${kA.price.toLocaleString()}）と${kB.name}（${kB.switchName}・${kB.layout}・¥${kB.price.toLocaleString()}）を徹底比較。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/keyboards/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/keyboards/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線/無線両対応";

export default async function KeyboardsVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const kA = keyboards.find((k) => k.slug === slugA)!;
  const kB = keyboards.find((k) => k.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: kA.brand, b: kB.brand },
    { label: "レイアウト", a: kA.layout, b: kB.layout },
    { label: "スイッチ", a: kA.switchName, b: kB.switchName },
    { label: "アクチュエーション", a: `${kA.actuation}mm`, b: `${kB.actuation}mm`, winLow: true },
    { label: "ポーリングレート", a: `${kA.pollingRate}Hz`, b: `${kB.pollingRate}Hz`, winHigh: true },
    { label: "接続方式", a: connLabel(kA.connection), b: connLabel(kB.connection) },
    { label: "ホットスワップ", a: kA.hotswap ? "対応" : "非対応", b: kB.hotswap ? "対応" : "非対応" },
    { label: "RGB", a: kA.rgb ? "あり" : "なし", b: kB.rgb ? "あり" : "なし" },
    ...(kA.batteryLife || kB.batteryLife ? [{
      label: "バッテリー",
      a: kA.batteryLife ? `${kA.batteryLife}時間` : "—",
      b: kB.batteryLife ? `${kB.batteryLife}時間` : "—",
      winHigh: true as const,
    }] : []),
    { label: "発売年", a: `${kA.releaseYear}年`, b: `${kB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${kA.price.toLocaleString()}`, b: `¥${kB.price.toLocaleString()}`, winLow: true },
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

  if (kA.actuation < kB.actuation) {
    recommendA.push(`軽いアクチュエーション（${kA.actuation}mm）でAPEX・FPS向き`);
    recommendB.push("深めのキーストロークで打鍵感を重視する");
  } else if (kB.actuation < kA.actuation) {
    recommendB.push(`軽いアクチュエーション（${kB.actuation}mm）でAPEX・FPS向き`);
    recommendA.push("深めのキーストロークで打鍵感を重視する");
  }

  if (kA.wireless && !kB.wireless) {
    recommendA.push("無線でスッキリしたデスク環境にしたい");
    recommendB.push("有線で安定した接続を確保したい");
  } else if (kB.wireless && !kA.wireless) {
    recommendB.push("無線でスッキリしたデスク環境にしたい");
    recommendA.push("有線で安定した接続を確保したい");
  }

  if (kA.hotswap && !kB.hotswap) {
    recommendA.push("スイッチを交換してカスタマイズしたい");
    recommendB.push("固定スイッチで信頼性を求める");
  } else if (kB.hotswap && !kA.hotswap) {
    recommendB.push("スイッチを交換してカスタマイズしたい");
    recommendA.push("固定スイッチで信頼性を求める");
  }

  if (kA.price < kB.price) {
    recommendA.push(`コスパ重視（¥${kA.price.toLocaleString()}）`);
    recommendB.push("予算に余裕があり上位スペックを求める");
  } else if (kB.price < kA.price) {
    recommendB.push(`コスパ重視（¥${kB.price.toLocaleString()}）`);
    recommendA.push("予算に余裕があり上位スペックを求める");
  }

  const relatedPairs = VS_PAIRS.filter(
    ([a, b]) =>
      keyboards.find((k) => k.slug === a) && keyboards.find((k) => k.slug === b) &&
      (a === slugA || b === slugA || a === slugB || b === slugB) &&
      !(a === slugA && b === slugB) && !(a === slugB && b === slugA)
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {kA.name} vs {kB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">スペック・スイッチ・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[kA, kB].map((k) => (
            <Link key={k.slug} href={`/keyboards/${k.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{k.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{k.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{k.layout}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{k.switchType}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{connLabel(k.connection)}</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{k.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{kA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{kB.name}</p>
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
              <a href={kA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={kB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
              <p className="text-xs font-bold text-blue-400 mb-2">{kA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。打鍵感の好みで選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{kB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。打鍵感の好みで選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[kA, kB].map((k) => (
            <Link key={k.slug} href={`/keyboards/${k.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{k.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{k.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const pA = keyboards.find((k) => k.slug === a)!;
                const pB = keyboards.find((k) => k.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/keyboards/vs/${a}-vs-${b}`}
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
          <Link href="/keyboards/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            ゲーミングキーボード ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
