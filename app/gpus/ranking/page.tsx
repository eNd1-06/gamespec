import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "グラフィックボード おすすめランキング2026【コスパ・VRAM・ゲーム用途別】",
  description: "2026年版グラフィックボード（GPU）おすすめランキング。コスパTOP5・ハイエンドTOP5・1440pゲーミングTOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/gpus/ranking` },
  openGraph: { title: "グラフィックボード おすすめランキング2026 | GameSpec", description: "コスパ・VRAM・ゲーム用途別のGPUランキング。スペックデータで客観的に比較。", type: "website", url: `${BASE_URL}/gpus/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "グラフィックボード おすすめランキング2026 | GameSpec", description: "コスパ・VRAM・ゲーム用途別のGPUランキング。" },
};

// 総合スコア算出の考え方:
// ① 実効性能 = クロック × ティア乗数: クロック速度だけではCUDAコア数・ROP数の差が反映されないため、
//    ティア（フラッグシップ/ハイエンド/ミドル/エントリー）を乗数として掛けることで実ゲーム性能を補正。
// ② VRAM: 4K・高品質テクスチャ・DLSS/FSRのフレーム生成に直結。16GB以上が2026年基準で推奨。
// ③ 発売年（アーキテクチャ世代）: 新世代ほどIPC・AI推論・レイトレ効率が向上。ただし旧世代フラッグシップも評価。
// ④ 消費電力効率は除外（ゲーム用途では性能が最優先）。価格も品質指標に含めない。
function calcScore(g: (typeof gpus)[0]): number {
  // 実効性能: クロック × ティア乗数（アーキテクチャ・コア数差を補正）
  const tierMultiplier =
    g.tier === "フラッグシップ" ? 1.0 :
    g.tier === "ハイエンド" ? 0.85 :
    g.tier === "ミドル" ? 0.6 :
    0.4;
  const perfScore = Math.min(g.boostClock / 2700, 1) * 35 * tierMultiplier;

  // VRAM: 高解像度・高品質テクスチャ・AI生成機能への対応
  const vramScore =
    g.vram >= 24 ? 30 :
    g.vram >= 16 ? 25 :
    g.vram >= 12 ? 18 :
    g.vram >= 8 ? 10 :
    4;

  // 発売年（アーキテクチャ世代の恩恵）
  const newScore = g.releaseYear >= 2025 ? 8 : g.releaseYear >= 2024 ? 6 : g.releaseYear >= 2023 ? 4 : 2;

  return perfScore + vramScore + newScore;
}

const overall = [...gpus].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const highend = [...gpus].filter((g) => g.tier === "ハイエンド" || g.tier === "フラッグシップ").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...gpus].filter((g) => g.tier === "エントリー" || g.tier === "ミドル").sort((a, b) => {
  const scoreA = calcScore(a) / a.price * 10000;
  const scoreB = calcScore(b) / b.price * 10000;
  return scoreB - scoreA;
}).slice(0, 5);
const gaming1440p = [...gpus].filter((g) => g.recommendFor.includes("1440p")).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

function RankCard({ rank, gpu, badge }: { rank: number; gpu: (typeof gpus)[0]; badge?: string }) {
  return (
    <Link href={`/gpus/${gpu.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{gpu.brand} / {gpu.gpuBrand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {gpu.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{gpu.chipset}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">VRAM {gpu.vram}GB</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.memoryType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">TDP {gpu.tdp}W</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.tier}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{gpu.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function GpusRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">グラフィックボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">グラフィックボード おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">ブーストクロック・VRAM・TDP・価格のスペックデータをもとに算出したランキング。全{gpus.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#highend" className="text-sm text-blue-400 hover:text-blue-300">▶ ハイエンド・フラッグシップ TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強（エントリー・ミドル）TOP5</a></li>
            <li><a href="#1440p" className="text-sm text-blue-400 hover:text-blue-300">▶ 1440pゲーミング向け TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">ブーストクロック・VRAM・TDP・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">{overall.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} />)}</div>
        </section>
        <section id="highend" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ハイエンド・フラッグシップ TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">4K・高fps・レイトレーシングを最高品質で楽しみたい方向け。</p>
          <div className="space-y-3">{highend.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge={g.tier} />)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強（エントリー・ミドル）TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">予算を抑えながら1080p〜1440pを快適に遊べるGPU。コスパ重視の方向け。</p>
          <div className="space-y-3">{cospa.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge="コスパ◎" />)}</div>
        </section>
        <section id="1440p" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">1440pゲーミング向け TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">WQHDで高フレームレートを維持できるGPU。ゲーミングモニターと合わせて使いたい方に。</p>
          <div className="space-y-3">{gaming1440p.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge="1440p向け" />)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/gpus" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">グラフィックボード {gpus.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
