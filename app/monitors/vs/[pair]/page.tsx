import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

export const VS_PAIRS: [string, string][] = [
  ["lg-27gp850-b", "asus-rog-swift-pg259qn"],
  ["lg-27gp850-b", "samsung-odyssey-g7-27"],
  ["lg-27gp850-b", "msi-mag274qrf"],
  ["lg-27gp850-b", "gigabyte-m27q"],
  ["benq-zowie-xl2546k", "asus-rog-swift-pg259qn"],
  ["benq-zowie-xl2546k", "alienware-aw2523hf"],
  ["benq-zowie-xl2546k", "benq-zowie-xl2566k"],
  ["benq-zowie-xl2411k", "aoc-24g2"],
  ["asus-rog-swift-pg259qn", "alienware-aw2523hf"],
  ["asus-rog-swift-pg259qn", "asus-rog-swift-pg259qnr"],
  ["asus-rog-pg27aqdm", "lg-27gr95qe"],
  ["asus-rog-pg27aqdm", "samsung-odyssey-oled-g8"],
  ["alienware-aw3423dwf", "samsung-odyssey-oled-g8"],
  ["lg-27gp950-b", "asus-rog-strix-xg27aqm"],
  ["samsung-odyssey-g4-25", "aoc-24g2"],
  ["lg-24gn600-b", "aoc-24g2"],
  ["gigabyte-m27q", "msi-mag274qrf"],
  ["benq-zowie-xl2566k", "alienware-aw2523hf"],
  ["samsung-odyssey-g7-27", "lg-27gp950-b"],
  ["corsair-xeneon-27qhd240", "asus-rog-pg27aqdm"],
];

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(monitors.map((m) => m.slug));
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
    monitors.find((m) => m.slug === a) && monitors.find((m) => m.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const mA = monitors.find((m) => m.slug === slugA)!;
  const mB = monitors.find((m) => m.slug === slugB)!;
  const title = `${mA.name} vs ${mB.name} 比較【2025年】スペック・リフレッシュレート・価格`;
  const description = `${mA.name}（${mA.refreshRate}Hz・${mA.resolution}・¥${mA.price.toLocaleString()}）と${mB.name}（${mB.refreshRate}Hz・${mB.resolution}・¥${mB.price.toLocaleString()}）のスペックを徹底比較。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/monitors/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/monitors/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function MonitorsVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const mA = monitors.find((m) => m.slug === slugA)!;
  const mB = monitors.find((m) => m.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: mA.brand, b: mB.brand },
    { label: "サイズ", a: `${mA.size}インチ`, b: `${mB.size}インチ` },
    { label: "解像度", a: mA.resolution, b: mB.resolution },
    { label: "リフレッシュレート", a: `${mA.refreshRate}Hz`, b: `${mB.refreshRate}Hz`, winHigh: true },
    { label: "応答速度", a: `${mA.responseTime}ms`, b: `${mB.responseTime}ms`, winLow: true },
    { label: "パネル", a: mA.panelType, b: mB.panelType },
    { label: "HDR", a: mA.hdr ? "対応" : "非対応", b: mB.hdr ? "対応" : "非対応" },
    { label: "G-Sync", a: mA.gsync ? "対応" : "非対応", b: mB.gsync ? "対応" : "非対応" },
    { label: "FreeSync", a: mA.freesync ? "対応" : "非対応", b: mB.freesync ? "対応" : "非対応" },
    { label: "曲面", a: mA.curved ? "あり" : "なし", b: mB.curved ? "あり" : "なし" },
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

  if (mA.refreshRate > mB.refreshRate) {
    recommendA.push(`高リフレッシュレート重視（${mA.refreshRate}Hz）`);
    recommendB.push(`${mB.refreshRate}Hzで十分`);
  } else if (mB.refreshRate > mA.refreshRate) {
    recommendB.push(`高リフレッシュレート重視（${mB.refreshRate}Hz）`);
    recommendA.push(`${mA.refreshRate}Hzで十分`);
  }

  if (mA.resolution !== mB.resolution) {
    const resOrder = ["1080p", "1440p", "4K"];
    if (resOrder.indexOf(mA.resolution) > resOrder.indexOf(mB.resolution)) {
      recommendA.push(`高解像度（${mA.resolution}）で映像美を求める`);
      recommendB.push(`${mB.resolution}でFPSを最優先する`);
    } else {
      recommendB.push(`高解像度（${mB.resolution}）で映像美を求める`);
      recommendA.push(`${mA.resolution}でFPSを最優先する`);
    }
  }

  const oledTypes = ["OLED", "QD-OLED"];
  if (oledTypes.includes(mA.panelType) && !oledTypes.includes(mB.panelType)) {
    recommendA.push("OLEDの圧倒的なコントラスト・発色を求める");
    recommendB.push("焼き付きリスクなしで長期使用したい");
  } else if (oledTypes.includes(mB.panelType) && !oledTypes.includes(mA.panelType)) {
    recommendB.push("OLEDの圧倒的なコントラスト・発色を求める");
    recommendA.push("焼き付きリスクなしで長期使用したい");
  }

  if (mA.price < mB.price) {
    recommendA.push(`コスパ重視（¥${mA.price.toLocaleString()}）`);
    recommendB.push("予算に余裕があり上位スペックを求める");
  } else if (mB.price < mA.price) {
    recommendB.push(`コスパ重視（¥${mB.price.toLocaleString()}）`);
    recommendA.push("予算に余裕があり上位スペックを求める");
  }

  const relatedPairs = VS_PAIRS.filter(
    ([a, b]) =>
      monitors.find((m) => m.slug === a) && monitors.find((m) => m.slug === b) &&
      (a === slugA || b === slugA || a === slugB || b === slugB) &&
      !(a === slugA && b === slugB) && !(a === slugB && b === slugA)
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {mA.name} vs {mB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">スペック・リフレッシュレート・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[mA, mB].map((m) => (
            <Link key={m.slug} href={`/monitors/${m.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{m.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.refreshRate}Hz</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.resolution}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{m.panelType}</span>
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
                <p className="text-xs text-gray-400">スペックが拮抗しています。デザインや設置環境で選ぶのがおすすめ。</p>
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
                <p className="text-xs text-gray-400">スペックが拮抗しています。デザインや設置環境で選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[mA, mB].map((m) => (
            <Link key={m.slug} href={`/monitors/${m.slug}`}
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
                const pA = monitors.find((m) => m.slug === a)!;
                const pB = monitors.find((m) => m.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/monitors/vs/${a}-vs-${b}`}
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
          <Link href="/monitors/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            ゲーミングモニター ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
