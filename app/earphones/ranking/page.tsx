import Link from "next/link";
import type { Metadata } from "next";
import { earphones } from "@/data/earphones";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホン おすすめランキング2026【有線・無線・ANC別】",
  description: "2026年版ゲーミングイヤホンおすすめランキング。有線TOP5・無線TOP5・ANC対応TOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/earphones/ranking` },
  openGraph: { title: "ゲーミングイヤホン おすすめランキング2026 | GameSpec", description: "有線・無線・ANC別のゲーミングイヤホンランキング。", type: "website", url: `${BASE_URL}/earphones/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲーミングイヤホン おすすめランキング2026 | GameSpec", description: "有線・無線・ANC別のゲーミングイヤホンランキング。" },
};

function calcScore(e: (typeof earphones)[0]): number {
  const weightScore = Math.max(0, (50 - e.weight) / 50) * 25;
  const priceScore = Math.max(0, (50000 - e.price) / 50000) * 30;
  const wirelessScore = e.connection !== "wired" ? 20 : 10;
  const ancScore = e.anc ? 15 : 0;
  const micScore = e.microphone ? 5 : 0;
  const newScore = e.releaseYear >= 2024 ? 5 : e.releaseYear >= 2023 ? 3 : 0;
  return weightScore + priceScore + wirelessScore + ancScore + micScore + newScore;
}

const overall = [...earphones].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const wired = [...earphones].filter((e) => e.connection === "wired").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const wireless = [...earphones].filter((e) => e.connection !== "wired").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const ancTop = [...earphones].filter((e) => e.anc).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function RankCard({ rank, earphone, badge }: { rank: number; earphone: (typeof earphones)[0]; badge?: string }) {
  return (
    <Link href={`/earphones/${earphone.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{earphone.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {earphone.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{earphone.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(earphone.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.driver}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.weight}g</span>
          {earphone.anc && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ANC</span>}
          {earphone.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{earphone.batteryLife}h</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{earphone.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function EarphonesRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングイヤホン おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">有線・無線・ANC・価格のスペックデータをもとに算出。全{earphones.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#wired" className="text-sm text-blue-400 hover:text-blue-300">▶ 有線イヤホン ランキング TOP5</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線イヤホン ランキング TOP5</a></li>
            <li><a href="#anc" className="text-sm text-blue-400 hover:text-blue-300">▶ ANC対応イヤホン TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">接続方式・ANC・重さ・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">{overall.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} />)}</div>
        </section>
        <section id="wired" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">有線イヤホン ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">遅延ゼロで安定した音質。FPSや競技ゲームで足音を正確に聞き取りたい方向け。</p>
          <div className="space-y-3">{wired.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="有線" />)}</div>
        </section>
        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線イヤホン ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">コードなしで自由に動ける。低遅延モデルならゲームでも快適。</p>
          <div className="space-y-3">{wireless.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="無線" />)}</div>
        </section>
        <section id="anc" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ANC対応イヤホン TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">アクティブノイズキャンセリングで周囲の騒音を遮断。集中してゲームに臨める。</p>
          <div className="space-y-3">{ancTop.map((e, i) => <RankCard key={e.slug} rank={i + 1} earphone={e} badge="ANC" />)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/earphones" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲーミングイヤホン {earphones.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
