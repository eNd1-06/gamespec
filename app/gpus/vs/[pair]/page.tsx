import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

type Props = { params: Promise<{ pair: string }> };

const BASE_URL = "https://gamespec.vercel.app";

export const VS_PAIRS: [string, string][] = [
  ["msi-rtx5090-gaming-trio", "asus-rtx5080-rog-strix"],
  ["asus-rtx4090-rog-strix", "msi-rtx4080super-gaming-x-trio"],
  ["gigabyte-rtx4070tisuper-gaming-oc", "zotac-rtx4070super-amp-airo"],
  ["msi-rtx4070-gaming-x-trio", "asus-rtx4060ti-dual-oc"],
  ["sapphire-rx9070xt-nitro", "powercolor-rx9070-hellhound"],
  ["sapphire-rx9070xt-nitro", "gigabyte-rtx4070tisuper-gaming-oc"],
  ["msi-rtx5090-gaming-trio", "asus-rtx4090-rog-strix"],
  ["gigabyte-rtx5070ti-gaming-oc", "zotac-rtx4070super-amp-airo"],
  ["msi-rtx4060-gaming-x", "gigabyte-rtx4060-eagle-oc"],
  ["sapphire-rx7900xtx-nitro", "asus-rtx4090-rog-strix"],
  ["powercolor-rx7900xt-red-devil", "msi-rtx4080super-gaming-x-trio"],
  ["xfx-rx7800xt-speedster", "msi-rtx4070-gaming-x-trio"],
  ["sapphire-rx7700xt-pulse", "asus-rtx4060ti-dual-oc"],
  ["powercolor-rx7600xt-hellhound", "msi-rtx4060-gaming-x"],
  ["asus-rtx5080-rog-strix", "msi-rtx4080super-gaming-x-trio"],
  ["zotac-rtx5070-twin-edge", "msi-rtx4070-gaming-x-trio"],
  ["msi-rtx5060ti-gaming-x", "asus-rtx4060ti-dual-oc"],
  ["sapphire-rx9070xt-nitro", "powercolor-rx7900xt-red-devil"],
  ["asus-rtx4090-rog-strix", "sapphire-rx7900xtx-nitro"],
  ["gigabyte-rtx4060-eagle-oc", "powercolor-rx7600xt-hellhound"],
];

function parsePair(pair: string): [string, string] | null {
  const slugSet = new Set(gpus.map((g) => g.slug));
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
    ([a, b]) => gpus.find((g) => g.slug === a) && gpus.find((g) => g.slug === b)
  ).map(([a, b]) => ({ pair: `${a}-vs-${b}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const gA = gpus.find((g) => g.slug === slugA)!;
  const gB = gpus.find((g) => g.slug === slugB)!;
  const title = `${gA.name} vs ${gB.name} 比較【2025年】GPU スペック・価格`;
  const description = `${gA.name}（${gA.chipset}・VRAM ${gA.vram}GB・¥${gA.price.toLocaleString()}）と${gB.name}（${gB.chipset}・VRAM ${gB.vram}GB・¥${gB.price.toLocaleString()}）を徹底比較。VRAM・クロック・TDP・価格の違いを解説。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/gpus/vs/${pair}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/gpus/vs/${pair}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function GpusVsPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const gA = gpus.find((g) => g.slug === slugA)!;
  const gB = gpus.find((g) => g.slug === slugB)!;

  const rows: { label: string; a: string; b: string; winLow?: true; winHigh?: true }[] = [
    { label: "チップセット", a: gA.chipset, b: gB.chipset },
    { label: "GPUブランド", a: gA.gpuBrand, b: gB.gpuBrand },
    { label: "VRAM", a: `${gA.vram}GB`, b: `${gB.vram}GB`, winHigh: true },
    { label: "ブーストクロック", a: `${gA.boostClock.toLocaleString()}MHz`, b: `${gB.boostClock.toLocaleString()}MHz`, winHigh: true },
    { label: "TDP", a: `${gA.tdp}W`, b: `${gB.tdp}W`, winLow: true },
    { label: "メモリタイプ", a: gA.memoryType, b: gB.memoryType },
    { label: "メモリバス", a: `${gA.memoryBus}bit`, b: `${gB.memoryBus}bit`, winHigh: true },
    { label: "ティア", a: gA.tier, b: gB.tier },
    { label: "出力端子", a: gA.outputs, b: gB.outputs },
    { label: "発売年", a: `${gA.releaseYear}年`, b: `${gB.releaseYear}年`, winHigh: true },
    { label: "価格", a: `¥${gA.price.toLocaleString()}`, b: `¥${gB.price.toLocaleString()}`, winLow: true },
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

  if (gA.vram > gB.vram) {
    recommendA.push(`VRAM重視（${gA.vram}GB）`);
    recommendB.push(`VRAMより価格を抑えたい`);
  } else if (gB.vram > gA.vram) {
    recommendB.push(`VRAM重視（${gB.vram}GB）`);
    recommendA.push(`VRAMより価格を抑えたい`);
  }

  if (gA.boostClock > gB.boostClock) {
    recommendA.push(`高クロックでゲーム性能重視`);
    recommendB.push(`クロックより省電力を重視`);
  } else if (gB.boostClock > gA.boostClock) {
    recommendB.push(`高クロックでゲーム性能重視`);
    recommendA.push(`クロックより省電力を重視`);
  }

  if (gA.tdp < gB.tdp) {
    recommendA.push(`省電力・静音PC向け（${gA.tdp}W）`);
    recommendB.push(`性能を最優先にしたい`);
  } else if (gB.tdp < gA.tdp) {
    recommendB.push(`省電力・静音PC向け（${gB.tdp}W）`);
    recommendA.push(`性能を最優先にしたい`);
  }

  if (gA.price < gB.price) {
    recommendA.push(`コスパ重視（¥${gA.price.toLocaleString()}）`);
    recommendB.push(`予算に余裕があり最高スペックを求める`);
  } else if (gB.price < gA.price) {
    recommendB.push(`コスパ重視（¥${gB.price.toLocaleString()}）`);
    recommendA.push(`予算に余裕があり最高スペックを求める`);
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
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">GPU</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold truncate">比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1 leading-snug">
          {gA.name} vs {gB.name}
        </h1>
        <p className="text-sm text-gray-400 mb-8">VRAM・クロック・TDP・価格を徹底比較</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[gA, gB].map((g) => (
            <Link key={g.slug} href={`/gpus/${g.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all group">
              <p className="text-xs text-gray-500 mb-1">{g.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug mb-2">{g.name}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{g.chipset}</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">VRAM {g.vram}GB</span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">{g.tier}</span>
              </div>
              <p className="text-base font-bold text-yellow-400">¥{g.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-800">
            <div className="px-4 py-3 border-r border-gray-700" />
            <div className="px-4 py-3 border-r border-gray-700 text-center">
              <p className="text-xs font-bold text-white leading-tight">{gA.name}</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs font-bold text-white leading-tight">{gB.name}</p>
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
              <a href={gA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-3 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="px-4 py-3 text-center">
              <a href={gB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
              <p className="text-xs font-bold text-blue-400 mb-2">{gA.name} を選ぶなら</p>
              {recommendA.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendA.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。ブランドや予算で選ぶのがおすすめ。</p>
              )}
            </div>
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">{gB.name} を選ぶなら</p>
              {recommendB.length > 0 ? (
                <ul className="space-y-1.5">
                  {recommendB.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-blue-400 mt-0.5">✔</span><span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">スペックが拮抗しています。ブランドや予算で選ぶのがおすすめ。</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[gA, gB].map((g) => (
            <Link key={g.slug} href={`/gpus/${g.slug}`}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 text-center transition-all">
              <p className="text-xs text-gray-400">{g.brand}</p>
              <p className="text-xs font-bold text-white mt-0.5">{g.name}</p>
              <p className="text-xs text-blue-400 mt-1">詳細スペックを見る →</p>
            </Link>
          ))}
        </div>

        {relatedPairs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
            <h2 className="text-sm font-bold text-gray-300 mb-3">関連する比較</h2>
            <div className="space-y-2">
              {relatedPairs.map(([a, b]) => {
                const gPairA = gpus.find((g) => g.slug === a)!;
                const gPairB = gpus.find((g) => g.slug === b)!;
                return (
                  <Link key={`${a}-${b}`} href={`/gpus/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group">
                    <span className="text-xs text-white group-hover:text-blue-400">{gPairA.name} vs {gPairB.name}</span>
                    <span className="text-xs text-gray-500">比較 →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/gpus/ranking"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
            GPU ランキングを見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
