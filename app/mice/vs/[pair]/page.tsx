import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

// 静的生成する比較ペア（slugA-vs-slugB）
export const VS_PAIRS: [string, string][] = [
  ["logicool-g-pro-x-superlight-2", "razer-viper-v3-pro"],
  ["logicool-g-pro-x-superlight-2", "finalmouse-starlight-12"],
  ["logicool-g-pro-x-superlight-2", "pulsar-xlite-v3"],
  ["logicool-g-pro-x-superlight-2", "razer-viper-v2-pro"],
  ["logicool-g-pro-x-superlight-2", "logicool-g-pro-x2-lightspeed"],
  ["logicool-g-pro-x-superlight-2", "attack-shark-x6"],
  ["razer-viper-v3-pro", "finalmouse-starlight-12"],
  ["razer-viper-v3-pro", "pulsar-xlite-v3"],
  ["razer-viper-v3-pro", "zowie-ec2-c"],
  ["razer-viper-v3-pro", "razer-viper-v2-pro"],
  ["razer-viper-v3-pro", "logicool-g-pro-x2-lightspeed"],
  ["razer-deathadder-v3", "pulsar-xlite-v3"],
  ["razer-deathadder-v3", "zowie-ec2-c"],
  ["razer-deathadder-v3", "endgame-gear-xm2we"],
  ["pulsar-xlite-v3", "endgame-gear-xm2we"],
  ["pulsar-xlite-v3", "ninjutso-sora-v2"],
  ["pulsar-xlite-v3", "lamzu-atlantis-mini"],
  ["pulsar-xlite-v3", "pulsar-x2-mini"],
  ["finalmouse-starlight-12", "pulsar-xlite-v3"],
  ["finalmouse-starlight-12", "ninjutso-sora-v2"],
  ["ninjutso-sora-v2", "lamzu-atlantis-mini"],
  ["ninjutso-sora-v2", "endgame-gear-xm2we"],
  ["zowie-ec2-c", "zowie-ec1-c"],
  ["zowie-ec2-c", "zowie-s2-c"],
  ["logicool-g502x-plus", "razer-basilisk-v3-pro"],
  ["logicool-g304", "razer-basilisk-x-hyperspeed"],
  ["razer-viper-v2-pro", "pulsar-xlite-v3"],
  ["attack-shark-x6", "pulsar-xlite-v3"],
  ["lamzu-atlantis-mini", "endgame-gear-xm2we"],
  ["logicool-g-pro-x2-lightspeed", "finalmouse-starlight-12"],
];

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(mice.map((m) => m.slug));
  // "-vs-" を区切りとして全候補を試す
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
  return VS_PAIRS.map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const mA = mice.find((m) => m.slug === slugA)!;
  const mB = mice.find((m) => m.slug === slugB)!;
  const title = `${mA.name} vs ${mB.name} 比較【2025年】スペック・重さ・価格`;
  const description = `${mA.name}（${mA.weight}g・¥${mA.price.toLocaleString()}）と${mB.name}（${mB.weight}g・¥${mB.price.toLocaleString()}）のスペックを徹底比較。重さ・センサー・ポーリングレート・価格の違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mice/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/mice/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線/無線両対応";
const shapeLabel = (s: string) =>
  s === "symmetrical" ? "左右対称" : "エルゴノミクス（右手用）";

export default async function MiceVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const mA = mice.find((m) => m.slug === slugA)!;
  const mB = mice.find((m) => m.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: mA.brand, b: mB.brand },
    { label: "重さ", a: `${mA.weight}g`, b: `${mB.weight}g`, winLow: true },
    { label: "センサー", a: mA.sensor, b: mB.sensor },
    { label: "最大DPI", a: mA.maxDpi.toLocaleString(), b: mB.maxDpi.toLocaleString(), winHigh: true },
    { label: "ポーリングレート", a: `${mA.pollingRate}Hz`, b: `${mB.pollingRate}Hz`, winHigh: true },
    { label: "接続方式", a: connectionLabel(mA.connection), b: connectionLabel(mB.connection) },
    { label: "形状", a: shapeLabel(mA.shape), b: shapeLabel(mB.shape) },
    { label: "ボタン数", a: `${mA.buttons}個`, b: `${mB.buttons}個` },
    { label: "RGB", a: mA.rgb ? "あり" : "なし", b: mB.rgb ? "あり" : "なし" },
    { label: "サイズ", a: `${mA.length}×${mA.width}×${mA.height}mm`, b: `${mB.length}×${mB.width}×${mB.height}mm` },
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

  // どちらを選ぶか — 推薦ポイント生成
  const recommendA: string[] = [];
  const recommendB: string[] = [];

  if (mA.weight < mB.weight) {
    recommendA.push(`軽さ重視（${mA.weight}g vs ${mB.weight}g）`);
    recommendB.push(`少し重くても安定感が欲しい`);
  } else if (mB.weight < mA.weight) {
    recommendB.push(`軽さ重視（${mB.weight}g vs ${mA.weight}g）`);
    recommendA.push(`少し重くても安定感が欲しい`);
  }

  if (mA.pollingRate > mB.pollingRate) {
    recommendA.push(`超高ポーリングレート（${mA.pollingRate}Hz）が欲しい`);
    recommendB.push(`標準ポーリングレートで十分`);
  } else if (mB.pollingRate > mA.pollingRate) {
    recommendB.push(`超高ポーリングレート（${mB.pollingRate}Hz）が欲しい`);
    recommendA.push(`標準ポーリングレートで十分`);
  }

  if (mA.connection === "wireless" && mB.connection !== "wireless") {
    recommendA.push("無線でケーブルレスにしたい");
    recommendB.push("有線で安定した接続が欲しい");
  } else if (mB.connection === "wireless" && mA.connection !== "wireless") {
    recommendB.push("無線でケーブルレスにしたい");
    recommendA.push("有線で安定した接続が欲しい");
  }

  if (mA.shape !== mB.shape) {
    if (mA.shape === "symmetrical") {
      recommendA.push("左右対称形状が好み（両手対応）");
      recommendB.push("エルゴノミクス形状が手にフィットする");
    } else {
      recommendB.push("左右対称形状が好み（両手対応）");
      recommendA.push("エルゴノミクス形状が手にフィットする");
    }
  }

  if (mA.price < mB.price) {
    recommendA.push(`コスパ重視（¥${mA.price.toLocaleString()}）`);
    recommendB.push(`予算に余裕があり最高スペックを求める`);
  } else if (mB.price < mA.price) {
    recommendB.push(`コスパ重視（¥${mB.price.toLocaleString()}）`);
    recommendA.push(`予算に余裕があり最高スペックを求める`);
  }

  // 関連比較（同じマウスを含むペア）
  const relatedPairs = VS_PAIRS.filter(
    ([a, b]) =>
      (a === slugA || b === slugA || a === slugB || b === slugB) &&
      !(a === slugA && b === slugB) &&
      !(a === slugB && b === slugA)
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold truncate">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* タイトル */}
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {mA.name} vs {mB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          スペック・重さ・価格を徹底比較
        </p>

        {/* 製品カード */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[mA, mB].map((m) => (
            <Link
              key={m.slug}
              href={`/mice/${m.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group"
            >
              <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{m.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.weight}g</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.pollingRate}Hz</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{connectionLabel(m.connection)}</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{m.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        {/* 比較テーブル */}
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

          {/* Amazonリンク行 */}
          <div className="grid grid-cols-3 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <a
                href={mA.amazonUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all"
              >
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a
                href={mB.amazonUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all"
              >
                Amazonで見る →
              </a>
            </div>
          </div>
        </div>

        {/* どちらを選ぶか */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4">どちらを選ぶべきか？</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{mA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。デザインや持ち方で選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{mB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。デザインや持ち方で選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        {/* 個別ページへのリンク */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[mA, mB].map((m) => (
            <Link
              key={m.slug}
              href={`/mice/${m.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all"
            >
              <p className="text-xs text-gray-400">{m.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{m.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {/* 関連比較 */}
        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const mPairA = mice.find((m) => m.slug === a)!;
                const mPairB = mice.find((m) => m.slug === b)!;
                return (
                  <Link
                    key={`${a}-${b}`}
                    href={`/mice/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group"
                  >
                    <span className="text-xs text-white group-hover:text-blue-400">
                      {mPairA.name} vs {mPairB.name}
                    </span>
                    <span className="text-xs text-gray-500">比較 →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ランキングCTA */}
        <div className="text-center">
          <Link
            href="/mice/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            ゲーミングマウス ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
