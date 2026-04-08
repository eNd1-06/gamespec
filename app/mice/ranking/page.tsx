import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウス おすすめランキング2026【軽量・コスパ・無線別】",
  description: "2026年版ゲーミングマウスおすすめランキング。軽量マウストップ5・コスパ最強トップ5・無線マウストップ5・総合おすすめトップ10をスペックデータで客観的に比較。",
  alternates: { canonical: `${BASE_URL}/mice/ranking` },
  openGraph: {
    title: "ゲーミングマウス おすすめランキング2026 | GameSpec",
    description: "軽量・コスパ・無線別のゲーミングマウスランキング。スペックデータで客観的に比較。",
    type: "website",
    url: `${BASE_URL}/mice/ranking`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングマウス おすすめランキング2026 | GameSpec",
    description: "軽量・コスパ・無線別のゲーミングマウスランキング。スペックデータで客観的に比較。",
  },
};

// 総合スコア（重さ・ポーリングレート・価格・新しさで算出）
function calcScore(m: (typeof mice)[0]): number {
  const weightScore = Math.max(0, (120 - m.weight) / 80) * 30;
  const pollingScore = Math.min(m.pollingRate / 8000, 1) * 20;
  const priceScore = Math.max(0, (30000 - m.price) / 30000) * 30;
  const newScore = (m.releaseYear >= 2024 ? 20 : m.releaseYear >= 2023 ? 12 : m.releaseYear >= 2022 ? 6 : 0);
  return weightScore + pollingScore + priceScore + newScore;
}

const overall = [...mice]
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 10);

const lightweight = [...mice]
  .filter((m) => m.weight <= 70)
  .sort((a, b) => a.weight - b.weight)
  .slice(0, 5);

const cospa = [...mice]
  .filter((m) => m.price <= 15000)
  .sort((a, b) => {
    const scoreA = (120 - a.weight) / a.price * 10000;
    const scoreB = (120 - b.weight) / b.price * 10000;
    return scoreB - scoreA;
  })
  .slice(0, 5);

const wireless = [...mice]
  .filter((m) => m.connection === "wireless" || m.connection === "both")
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function RankCard({
  rank,
  mouse,
  badge,
}: {
  rank: number;
  mouse: (typeof mice)[0];
  badge?: string;
}) {
  const weightLabel =
    mouse.weight <= 55 ? "超軽量" : mouse.weight <= 70 ? "軽量" : mouse.weight <= 90 ? "標準" : "重め";
  return (
    <Link
      href={`/mice/${mouse.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{mouse.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {mouse.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{mouse.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g · {weightLabel}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function MiceRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウス おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">重さ・ポーリングレート・価格・発売年のスペックデータをもとに客観的に算出したランキングです。全{mice.length}製品から厳選。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#lightweight" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量マウス ランキング TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線マウス ランキング TOP5</a></li>
          </ul>
        </nav>

        {/* 総合ランキング */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・ポーリングレート・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">
            {overall.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} />
            ))}
          </div>
        </section>

        {/* 軽量マウスランキング */}
        <section id="lightweight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量マウス ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">70g以下の軽量マウスを重さ順に掲載。FPS・APEXプレイヤーにおすすめ。</p>
          <div className="space-y-3">
            {lightweight.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge={`${mouse.weight}g`} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?weight=70&sort=weight" className="text-sm text-blue-400 hover:text-blue-300">
              70g以下の軽量マウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* コスパランキング */}
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">15,000円以下のマウスを「軽さ÷価格」でスコア化。予算を抑えたい方向け。</p>
          <div className="space-y-3">
            {cospa.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge="コスパ◎" />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?price=15000" className="text-sm text-blue-400 hover:text-blue-300">
              15,000円以下のマウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* 無線マウスランキング */}
        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線マウス ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ワイヤレス対応マウスを総合スコア順に掲載。コード不要で快適な操作が可能。</p>
          <div className="space-y-3">
            {wireless.map((mouse, i) => (
              <RankCard key={mouse.slug} rank={i + 1} mouse={mouse} badge="無線" />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/mice?conn=wireless" className="text-sm text-blue-400 hover:text-blue-300">
              無線マウスをすべて見る →
            </Link>
          </div>
        </section>

        {/* 全製品へのリンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/mice" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウス {mice.length}製品をすべて見る
          </Link>
        </div>
      </main>
    </div>
  );
}
