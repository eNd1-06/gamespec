import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { controllers } from "@/data/controllers";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

export const VS_PAIRS: [string, string][] = [
  ["sony-dualsense-white", "microsoft-xbox-wireless-carbon"],
  ["sony-dualsense-edge", "microsoft-xbox-elite-series2"],
  ["sony-dualsense-white", "sony-dualsense-edge"],
  ["microsoft-xbox-wireless-carbon", "microsoft-xbox-elite-series2"],
  ["razer-wolverine-v3-pro", "scuf-instinct-pro"],
  ["razer-wolverine-v3-pro", "sony-dualsense-edge"],
  ["microsoft-xbox-elite-series2", "razer-wolverine-v3-pro"],
  ["sony-dualsense-white", "nintendo-pro-controller"],
  ["microsoft-xbox-wireless-carbon", "8bitdo-pro2-bluetooth"],
  ["sony-dualsense-edge", "scuf-instinct-pro"],
  ["razer-wolverine-v2-pro", "microsoft-xbox-elite-series2-core"],
  ["8bitdo-pro2-bluetooth", "nintendo-pro-controller"],
  ["microsoft-xbox-elite-series2", "victrix-pro-bfg"],
  ["sony-dualsense-white", "razer-wolverine-v2-chroma"],
  ["nacon-revolution-x", "microsoft-xbox-elite-series2-core"],
  ["gulikit-kingkong-3-pro", "8bitdo-ultimate-2c"],
  ["thrustmaster-eswap-x-pro", "microsoft-xbox-elite-series2"],
  ["powera-fusion-pro3", "razer-wolverine-v2-pro"],
  ["8bitdo-ultimate-bluetooth", "nintendo-pro-controller"],
  ["razer-wolverine-v2-chroma", "microsoft-xbox-elite-series2-core"],
];

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線/無線両対応";

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(controllers.map((c) => c.slug));
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
    ([a, b]) => controllers.find((c) => c.slug === a) && controllers.find((c) => c.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const cA = controllers.find((c) => c.slug === slugA)!;
  const cB = controllers.find((c) => c.slug === slugB)!;
  const title = `${cA.name} vs ${cB.name} 比較【2025年】コントローラー スペック・価格`;
  const description = `${cA.name}（${cA.platform}・¥${cA.price.toLocaleString()}）と${cB.name}（${cB.platform}・¥${cB.price.toLocaleString()}）を徹底比較。機能・接続方式・価格の違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/controllers/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/controllers/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ControllersVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const cA = controllers.find((c) => c.slug === slugA)!;
  const cB = controllers.find((c) => c.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "プラットフォーム", a: cA.platform, b: cB.platform },
    { label: "接続方式", a: connectionLabel(cA.connection), b: connectionLabel(cB.connection) },
    { label: "バッテリー", a: cA.batteryLife ? `${cA.batteryLife}時間` : "—", b: cB.batteryLife ? `${cB.batteryLife}時間` : "—", winHigh: true },
    { label: "重さ", a: `${cA.weight}g`, b: `${cB.weight}g`, winLow: true },
    { label: "背面ボタン", a: cA.backButtons ? "あり" : "なし", b: cB.backButtons ? "あり" : "なし" },
    { label: "トリガーストップ", a: cA.triggerStop ? "あり" : "なし", b: cB.triggerStop ? "あり" : "なし" },
    { label: "ハプティックフィードバック", a: cA.haptic ? "あり" : "なし", b: cB.haptic ? "あり" : "なし" },
    { label: "アダプティブトリガー", a: cA.adaptiveTriggers ? "あり" : "なし", b: cB.adaptiveTriggers ? "あり" : "なし" },
    { label: "ジャイロセンサー", a: cA.gyro ? "あり" : "なし", b: cB.gyro ? "あり" : "なし" },
    { label: "発売年", a: `${cA.releaseYear}年`, b: `${cB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${cA.price.toLocaleString()}`, b: `¥${cB.price.toLocaleString()}`, winLow: true },
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

  if (cA.backButtons && !cB.backButtons) {
    recommendA.push("背面ボタンでFPS・競技ゲームを有利に");
    recommendB.push("シンプルな操作性を求める");
  } else if (cB.backButtons && !cA.backButtons) {
    recommendB.push("背面ボタンでFPS・競技ゲームを有利に");
    recommendA.push("シンプルな操作性を求める");
  }

  if (cA.adaptiveTriggers && !cB.adaptiveTriggers) {
    recommendA.push("アダプティブトリガーで没入感重視");
    recommendB.push("トリガー感触より操作性を優先");
  } else if (cB.adaptiveTriggers && !cA.adaptiveTriggers) {
    recommendB.push("アダプティブトリガーで没入感重視");
    recommendA.push("トリガー感触より操作性を優先");
  }

  if (cA.connection === "wireless" && cB.connection !== "wireless") {
    recommendA.push("無線でケーブルレスにしたい");
    recommendB.push("有線で安定した接続が欲しい");
  } else if (cB.connection === "wireless" && cA.connection !== "wireless") {
    recommendB.push("無線でケーブルレスにしたい");
    recommendA.push("有線で安定した接続が欲しい");
  }

  if (cA.price < cB.price) {
    recommendA.push(`コスパ重視（¥${cA.price.toLocaleString()}）`);
    recommendB.push(`予算に余裕があり高機能を求める`);
  } else if (cB.price < cA.price) {
    recommendB.push(`コスパ重視（¥${cB.price.toLocaleString()}）`);
    recommendA.push(`予算に余裕があり高機能を求める`);
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
          <Link href="/controllers" className="text-gray-400 hover:text-white text-sm">コントローラー</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold truncate">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {cA.name} vs {cB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">機能・接続方式・重さ・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[cA, cB].map((c) => (
            <Link key={c.slug} href={`/controllers/${c.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{c.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{c.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{c.platform}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{connectionLabel(c.connection)}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{c.weight}g</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{c.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{cA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{cB.name}</p>
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
              <a href={cA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={cB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
              <p className="text-xs font-bold text-blue-400 mb-2">{cA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。対応プラットフォームや好みで選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{cB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。対応プラットフォームや好みで選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[cA, cB].map((c) => (
            <Link key={c.slug} href={`/controllers/${c.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{c.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{c.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const cPairA = controllers.find((c) => c.slug === a)!;
                const cPairB = controllers.find((c) => c.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/controllers/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group">
                    <span className="text-xs text-white group-hover:text-blue-400">{cPairA.name} vs {cPairB.name}</span>
                    <span className="text-xs text-gray-500">比較 →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/controllers/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            コントローラー ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
