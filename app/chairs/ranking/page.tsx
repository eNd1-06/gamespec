import Link from "next/link";
import type { Metadata } from "next";
import { chairs } from "@/data/chairs";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングチェア おすすめランキング2026【腰痛・長時間・コスパ別】",
  description: "2026年版ゲーミングチェアおすすめランキング。腰痛対策TOP5・コスパTOP5・ファブリック素材TOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/chairs/ranking` },
  openGraph: { title: "ゲーミングチェア おすすめランキング2026 | GameSpec", description: "腰痛・長時間・コスパ別のゲーミングチェアランキング。", type: "website", url: `${BASE_URL}/chairs/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲーミングチェア おすすめランキング2026 | GameSpec", description: "腰痛・長時間・コスパ別のゲーミングチェアランキング。" },
};

function calcScore(c: (typeof chairs)[0]): number {
  const priceScore = Math.max(0, (100000 - c.price) / 100000) * 30;
  const lumbarScore = c.lumbarSupport ? 20 : 0;
  const armrestScore = c.armrest === "4D" ? 20 : c.armrest === "3D" ? 15 : c.armrest === "2D" ? 8 : 0;
  const recliningScore = Math.min((c.recliningAngle - 90) / 80, 1) * 15;
  const newScore = c.releaseYear >= 2024 ? 10 : c.releaseYear >= 2023 ? 5 : 0;
  const footrestScore = c.footrest ? 5 : 0;
  return priceScore + lumbarScore + armrestScore + recliningScore + newScore + footrestScore;
}

const overall = [...chairs].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const backPain = [...chairs].filter((c) => c.lumbarSupport && c.recommendFor.includes("back-pain")).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...chairs].filter((c) => c.price <= 40000).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const fabric = [...chairs].filter((c) => c.material === "ファブリック" || c.material === "メッシュ").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

function RankCard({ rank, chair, badge }: { rank: number; chair: (typeof chairs)[0]; badge?: string }) {
  return (
    <Link href={`/chairs/${chair.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{chair.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {chair.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{chair.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.type}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.material}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">アームレスト {chair.armrest}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">リクライニング {chair.recliningAngle}°</span>
          {chair.lumbarSupport && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ランバーサポート</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{chair.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ChairsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/chairs" className="text-gray-400 hover:text-white text-sm">ゲーミングチェア</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングチェア おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">ランバーサポート・アームレスト・リクライニング角度・価格のスペックデータをもとに算出。全{chairs.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#backpain" className="text-sm text-blue-400 hover:text-blue-300">▶ 腰痛対策・長時間向け TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#fabric" className="text-sm text-blue-400 hover:text-blue-300">▶ ファブリック・メッシュ素材 TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">ランバーサポート・アームレスト・リクライニング・価格・発売年を総合スコア化</p>
          <div className="space-y-3">{overall.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} />)}</div>
        </section>
        <section id="backpain" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">腰痛対策・長時間向け TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ランバーサポート付きで腰への負担を軽減。長時間のゲームセッションにおすすめ。</p>
          <div className="space-y-3">{backPain.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge="腰痛対策" />)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">4万円以下でしっかりした機能を持つゲーミングチェア。</p>
          <div className="space-y-3">{cospa.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge="コスパ◎" />)}</div>
        </section>
        <section id="fabric" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ファブリック・メッシュ素材 TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">通気性が高く夏でも蒸れにくい。長時間プレイ時の快適さを重視したい方に。</p>
          <div className="space-y-3">{fabric.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge={c.material} />)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/chairs" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲーミングチェア {chairs.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
