import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { headsets } from "@/data/headsets";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

export const VS_PAIRS: [string, string][] = [
  ["steelseries-arctis-nova-pro-wireless", "logicool-g-pro-x-2-lightspeed"],
  ["steelseries-arctis-nova-pro-wireless", "razer-blackshark-v2-pro"],
  ["steelseries-arctis-nova-pro-wireless", "sony-inzone-h9"],
  ["logicool-g-pro-x-2-lightspeed", "razer-blackshark-v2-pro"],
  ["logicool-g-pro-x-2-lightspeed", "hyperx-cloud-alpha-wireless"],
  ["razer-blackshark-v2-pro", "astro-a50-x"],
  ["hyperx-cloud-alpha-wireless", "corsair-hs80-rgb-wireless"],
  ["hyperx-cloud-alpha-wireless", "steelseries-arctis-nova-7"],
  ["steelseries-arctis-nova-7", "logicool-g-pro-x-2-lightspeed"],
  ["steelseries-arctis-nova-7", "corsair-hs80-rgb-wireless"],
  ["sony-inzone-h9", "astro-a50-x"],
  ["sony-inzone-h9", "logicool-g-pro-x-2-lightspeed"],
  ["logicool-g435", "corsair-hs80-rgb-wireless"],
  ["steelseries-arctis-7-plus", "corsair-hs80-rgb-wireless"],
  ["steelseries-arctis-7-plus", "hyperx-cloud-alpha-wireless"],
  ["razer-blackshark-v2", "hyperx-cloud-alpha"],
  ["hyperx-cloud-ii-wireless", "corsair-hs80-rgb-wireless"],
  ["epos-h6pro-closed", "razer-blackshark-v2"],
  ["corsair-virtuoso-rgb-wireless-xt", "astro-a50-x"],
  ["sony-inzone-h7", "hyperx-cloud-alpha-wireless"],
];

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(headsets.map((h) => h.slug));
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
    headsets.find((h) => h.slug === a) && headsets.find((h) => h.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const hA = headsets.find((h) => h.slug === slugA)!;
  const hB = headsets.find((h) => h.slug === slugB)!;
  const title = `${hA.name} vs ${hB.name} 比較【2025年】スペック・音質・価格`;
  const description = `${hA.name}（${hA.weight}g・¥${hA.price.toLocaleString()}）と${hB.name}（${hB.weight}g・¥${hB.price.toLocaleString()}）を徹底比較。接続方式・バッテリー・ノイキャンの違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/headsets/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/headsets/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線/無線両対応";

export default async function HeadsetsVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const hA = headsets.find((h) => h.slug === slugA)!;
  const hB = headsets.find((h) => h.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "ブランド", a: hA.brand, b: hB.brand },
    { label: "接続方式", a: connLabel(hA.connection), b: connLabel(hB.connection) },
    { label: "ドライバー径", a: `${hA.driverSize}mm`, b: `${hB.driverSize}mm` },
    { label: "重さ", a: `${hA.weight}g`, b: `${hB.weight}g`, winLow: true },
    ...(hA.batteryLife || hB.batteryLife ? [{
      label: "バッテリー",
      a: hA.batteryLife ? `${hA.batteryLife}時間` : "—",
      b: hB.batteryLife ? `${hB.batteryLife}時間` : "—",
      winHigh: true as const,
    }] : []),
    { label: "ノイズキャンセリング", a: hA.noiseCancelling ? "あり" : "なし", b: hB.noiseCancelling ? "あり" : "なし" },
    { label: "ANC", a: hA.anc ? "対応" : "非対応", b: hB.anc ? "対応" : "非対応" },
    { label: "バーチャルサラウンド", a: hA.virtualSurround ? "対応" : "非対応", b: hB.virtualSurround ? "対応" : "非対応" },
    { label: "マイク着脱", a: hA.micDetachable ? "着脱式" : "固定", b: hB.micDetachable ? "着脱式" : "固定" },
    { label: "発売年", a: `${hA.releaseYear}年`, b: `${hB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${hA.price.toLocaleString()}`, b: `¥${hB.price.toLocaleString()}`, winLow: true },
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

  if (hA.connection === "wireless" && hB.connection !== "wireless") {
    recommendA.push("無線で自由に動き回りたい");
    recommendB.push("有線で遅延なし・充電不要の安定感が欲しい");
  } else if (hB.connection === "wireless" && hA.connection !== "wireless") {
    recommendB.push("無線で自由に動き回りたい");
    recommendA.push("有線で遅延なし・充電不要の安定感が欲しい");
  }

  if (hA.anc && !hB.anc) {
    recommendA.push("ANCで周囲の騒音をカットしたい");
    recommendB.push("パッシブ遮音でシンプルに使いたい");
  } else if (hB.anc && !hA.anc) {
    recommendB.push("ANCで周囲の騒音をカットしたい");
    recommendA.push("パッシブ遮音でシンプルに使いたい");
  }

  if (hA.weight < hB.weight) {
    recommendA.push(`軽量で長時間装着が楽（${hA.weight}g）`);
    recommendB.push("重量よりも音質・機能を重視する");
  } else if (hB.weight < hA.weight) {
    recommendB.push(`軽量で長時間装着が楽（${hB.weight}g）`);
    recommendA.push("重量よりも音質・機能を重視する");
  }

  if ((hA.batteryLife ?? 0) > (hB.batteryLife ?? 0) && hB.batteryLife) {
    recommendA.push(`長時間プレイ対応（バッテリー${hA.batteryLife}時間）`);
    recommendB.push("バッテリー寿命より他のスペックを優先する");
  } else if ((hB.batteryLife ?? 0) > (hA.batteryLife ?? 0) && hA.batteryLife) {
    recommendB.push(`長時間プレイ対応（バッテリー${hB.batteryLife}時間）`);
    recommendA.push("バッテリー寿命より他のスペックを優先する");
  }

  if (hA.price < hB.price) {
    recommendA.push(`コスパ重視（¥${hA.price.toLocaleString()}）`);
    recommendB.push("予算に余裕があり上位スペックを求める");
  } else if (hB.price < hA.price) {
    recommendB.push(`コスパ重視（¥${hB.price.toLocaleString()}）`);
    recommendA.push("予算に余裕があり上位スペックを求める");
  }

  const relatedPairs = VS_PAIRS.filter(
    ([a, b]) =>
      headsets.find((h) => h.slug === a) && headsets.find((h) => h.slug === b) &&
      (a === slugA || b === slugA || a === slugB || b === slugB) &&
      !(a === slugA && b === slugB) && !(a === slugB && b === slugA)
  ).slice(0, 6);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {hA.name} vs {hB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">スペック・音質・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[hA, hB].map((h) => (
            <Link key={h.slug} href={`/headsets/${h.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{h.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{h.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{connLabel(h.connection)}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{h.weight}g</span>
                {h.batteryLife && <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{h.batteryLife}h</span>}
              </div>
              <p className="text-base font-bold text-yellow-400">¥{h.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{hA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{hB.name}</p>
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
              <a href={hA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={hB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
              <p className="text-xs font-bold text-blue-400 mb-2">{hA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。装着感の好みで選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{hB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。装着感の好みで選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[hA, hB].map((h) => (
            <Link key={h.slug} href={`/headsets/${h.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{h.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{h.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const pA = headsets.find((h) => h.slug === a)!;
                const pB = headsets.find((h) => h.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/headsets/vs/${a}-vs-${b}`}
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
          <Link href="/headsets/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            ゲーミングヘッドセット ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
