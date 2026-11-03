import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "グラフィックボード おすすめランキング2026【コスパ・VRAM・ゲーム用途別】",
  description: "グラフィックボード（GPU）の登録仕様による独自指標ランキング。総合・ハイエンド・コスパ・1440pタグ別に掲載。実測ゲーム性能を示すものではありません。",
  alternates: { canonical: `${BASE_URL}/gpus/ranking` },
  openGraph: { title: "グラフィックボード おすすめランキング2026 | GameSpec", description: "登録仕様による独自指標のGPUランキング。実測ゲーム性能を示すものではありません。", type: "website", url: `${BASE_URL}/gpus/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "グラフィックボード おすすめランキング2026 | GameSpec", description: "登録仕様による独自指標のGPUランキング。実測ゲーム性能は未検証。" },
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

const comments: Record<string, string> = {
  "msi-rtx5090-gaming-trio": "RTX 5090搭載モデル。登録仕様は製品詳細で確認できます。",
  "asus-rtx5080-rog-strix": "RTX 5080搭載モデル。登録仕様は製品詳細で確認できます。",
  "gigabyte-rtx5070ti-gaming-oc": "RTX 5070 Ti搭載モデル。登録仕様は製品詳細で確認できます。",
  "zotac-rtx5070-twin-edge": "RTX 5070搭載モデル。ケースへの適合はメーカーの寸法情報をご確認ください。",
  "msi-rtx4090-gaming-x-trio": "RTX 4090搭載モデル。登録仕様は製品詳細で確認できます。",
  "asus-rtx4070ti-super-rog-strix": "RTX 4070 Ti SUPER搭載モデル。登録仕様は製品詳細で確認できます。",
  "gigabyte-rtx4060ti-gaming-oc": "RTX 4060 Ti搭載モデル。登録仕様は製品詳細で確認できます。",
};

function RankCard({ rank, gpu, badge, comment }: { rank: number; gpu: (typeof gpus)[0]; badge?: string; comment?: string }) {
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
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{gpu.chipset}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">VRAM {gpu.vram}GB</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.memoryType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">TDP {gpu.tdp}W</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.tier}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{gpu.price.toLocaleString()}</span>
        </div>
        {comment && (
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{comment}</p>
        )}
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
        <p className="text-sm text-gray-400 mb-8">登録されたブーストクロック・ティア区分・VRAM・発売年から算出する独自の仕様指標です。実測ゲーム性能や人気を示すものではありません。登録データ{gpus.length}件を対象に集計しています。</p>
        <p className="text-sm text-gray-400 mb-8">価格・仕様の出典と検証日時は未整備です。掲載価格は現在の販売価格を保証しません。購入前にメーカー・販売店の情報をご確認ください。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合仕様指標ランキング TOP10</a></li>
            <li><a href="#highend" className="text-sm text-blue-400 hover:text-blue-300">▶ ハイエンド・フラッグシップ TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ指標（エントリー・ミドル）TOP5</a></li>
            <li><a href="#1440p" className="text-sm text-blue-400 hover:text-blue-300">▶ 1440pタグ登録製品 TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合仕様指標ランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">ブーストクロックにティア倍率を掛けた項目と、VRAM・発売年の配点を合計した総合スコア順。TDP・価格は総合スコアに含みません。</p>
          <div className="space-y-3">{overall.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} comment={comments[g.slug]}/>)}</div>
        </section>
        <section id="highend" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ハイエンド・フラッグシップ TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">登録ティアがハイエンド・フラッグシップの製品を、総合スコア順に掲載しています。</p>
          <div className="space-y-3">{highend.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge={g.tier} comment={comments[g.slug]}/>)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ指標（エントリー・ミドル）TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">登録ティアがエントリー・ミドルの製品を対象に、総合スコア ÷ 登録価格 × 10000 の別式で順位付けしています。実測性能あたりの価格ではありません。</p>
          <div className="space-y-3">{cospa.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge="価格比の独自指標" comment={comments[g.slug]}/>)}</div>
        </section>
        <section id="1440p" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">1440pタグ登録製品 TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">登録用途タグに1440pを含む製品を、総合スコア順に掲載しています。解像度別の実測やフレームレートの保証ではありません。</p>
          <div className="space-y-3">{gaming1440p.map((g, i) => <RankCard key={g.slug} rank={i + 1} gpu={g} badge="1440pタグ" comment={comments[g.slug]}/>)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">価格・VRAMなどで絞り込み、TDP順でも並べ替えられるGPU一覧をご利用ください。</p>
          <Link href="/gpus" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">GPU一覧で登録仕様を絞り込む</Link>
        </div>
      </main>
    </div>
  );
}
