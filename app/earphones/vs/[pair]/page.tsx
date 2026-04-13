import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { earphones } from "@/data/earphones";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

import { EARPHONE_VS_PAIRS } from "@/data/vs-pairs";
export const VS_PAIRS = EARPHONE_VS_PAIRS;

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線/無線両対応";

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(earphones.map((e) => e.slug));
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
    ([a, b]) => earphones.find((e) => e.slug === a) && earphones.find((e) => e.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const eA = earphones.find((e) => e.slug === slugA)!;
  const eB = earphones.find((e) => e.slug === slugB)!;
  const title = `${eA.name} vs ${eB.name} 比較【2025年】ゲーミングイヤホン スペック・価格`;
  const description = `${eA.name}（${eA.driver}・¥${eA.price.toLocaleString()}）と${eB.name}（${eB.driver}・¥${eB.price.toLocaleString()}）を徹底比較。ドライバー・重さ・価格の違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/earphones/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/earphones/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function EarphonesVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const eA = earphones.find((e) => e.slug === slugA)!;
  const eB = earphones.find((e) => e.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: eA.brand, b: eB.brand },
    { label: "接続方式", a: connectionLabel(eA.connection), b: connectionLabel(eB.connection) },
    { label: "ドライバー", a: eA.driver, b: eB.driver },
    { label: "インピーダンス", a: eA.impedance ? `${eA.impedance}Ω` : "—", b: eB.impedance ? `${eB.impedance}Ω` : "—" },
    { label: "感度", a: eA.sensitivity ? `${eA.sensitivity}dB` : "—", b: eB.sensitivity ? `${eB.sensitivity}dB` : "—", winHigh: true },
    { label: "バッテリー", a: eA.batteryLife ? `${eA.batteryLife}時間` : "—", b: eB.batteryLife ? `${eB.batteryLife}時間` : "—", winHigh: true },
    { label: "重さ", a: `${eA.weight}g`, b: `${eB.weight}g`, winLow: true },
    { label: "マイク", a: eA.microphone ? "あり" : "なし", b: eB.microphone ? "あり" : "なし" },
    { label: "ANC", a: eA.anc ? "あり" : "なし", b: eB.anc ? "あり" : "なし" },
    { label: "発売年", a: `${eA.releaseYear}年`, b: `${eB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${eA.price.toLocaleString()}`, b: `¥${eB.price.toLocaleString()}`, winLow: true },
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

  if (eA.connection === "wireless" && eB.connection !== "wireless") {
    recommendA.push("無線で快適なゲームプレイがしたい");
    recommendB.push("有線で遅延ゼロを重視したい");
  } else if (eB.connection === "wireless" && eA.connection !== "wireless") {
    recommendB.push("無線で快適なゲームプレイがしたい");
    recommendA.push("有線で遅延ゼロを重視したい");
  }

  if (eA.microphone && !eB.microphone) {
    recommendA.push("ボイスチャット用マイク内蔵が必要");
    recommendB.push("音質重視でマイク不要");
  } else if (eB.microphone && !eA.microphone) {
    recommendB.push("ボイスチャット用マイク内蔵が必要");
    recommendA.push("音質重視でマイク不要");
  }

  if (eA.anc && !eB.anc) {
    recommendA.push("周囲の音を遮断してゲームに集中したい");
    recommendB.push("環境音も聞きながらプレイしたい");
  } else if (eB.anc && !eA.anc) {
    recommendB.push("周囲の音を遮断してゲームに集中したい");
    recommendA.push("環境音も聞きながらプレイしたい");
  }

  if (eA.price < eB.price) {
    recommendA.push(`コスパ重視（¥${eA.price.toLocaleString()}）`);
    recommendB.push(`音質・機能に投資したい`);
  } else if (eB.price < eA.price) {
    recommendB.push(`コスパ重視（¥${eB.price.toLocaleString()}）`);
    recommendA.push(`音質・機能に投資したい`);
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
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold truncate">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {eA.name} vs {eB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">ドライバー・接続方式・重さ・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[eA, eB].map((e) => (
            <Link key={e.slug} href={`/earphones/${e.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{e.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{e.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{connectionLabel(e.connection)}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{e.driver}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{e.weight}g</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{e.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{eA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{eB.name}</p>
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
              <a href={eA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={eB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
              <p className="text-xs font-bold text-blue-400 mb-2">{eA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。音の好みやブランドで選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{eB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。音の好みやブランドで選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[eA, eB].map((e) => (
            <Link key={e.slug} href={`/earphones/${e.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{e.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{e.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const ePairA = earphones.find((e) => e.slug === a)!;
                const ePairB = earphones.find((e) => e.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/earphones/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group">
                    <span className="text-xs text-white group-hover:text-blue-400">{ePairA.name} vs {ePairB.name}</span>
                    <span className="text-xs text-gray-500">比較 →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/earphones/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            ゲーミングイヤホン ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
