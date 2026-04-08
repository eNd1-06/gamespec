import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングキーボード おすすめランキング2026【無線・コスパ・スイッチ別】",
  description: "2026年版ゲーミングキーボードおすすめランキング。無線TOP5・コスパTOP5・ホットスワップ対応TOP5・総合おすすめTOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/keyboards/ranking` },
  openGraph: {
    title: "ゲーミングキーボード おすすめランキング2026 | GameSpec",
    description: "無線・コスパ・スイッチ別のゲーミングキーボードランキング。スペックデータで客観的に比較。",
    type: "website",
    url: `${BASE_URL}/keyboards/ranking`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングキーボード おすすめランキング2026 | GameSpec",
    description: "無線・コスパ・スイッチ別のゲーミングキーボードランキング。スペックデータで客観的に比較。",
  },
};

function calcScore(k: (typeof keyboards)[0]): number {
  const pollingScore = Math.min(k.pollingRate / 8000, 1) * 30;
  const priceScore = Math.max(0, (50000 - k.price) / 50000) * 30;
  const hotswapScore = k.hotswap ? 15 : 0;
  const wirelessScore = k.wireless ? 15 : 0;
  const newScore = k.releaseYear >= 2024 ? 10 : k.releaseYear >= 2023 ? 5 : 0;
  return pollingScore + priceScore + hotswapScore + wirelessScore + newScore;
}

const overall = [...keyboards].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const wirelessTop = [...keyboards].filter((k) => k.wireless).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...keyboards].filter((k) => k.price <= 15000).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const hotswap = [...keyboards].filter((k) => k.hotswap).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (k: (typeof keyboards)[0]) =>
  k.connection === "wireless" ? "無線" : k.connection === "wired" ? "有線" : "両対応";

function RankCard({ rank, keyboard, badge }: { rank: number; keyboard: (typeof keyboards)[0]; badge?: string }) {
  return (
    <Link
      href={`/keyboards/${keyboard.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      <div
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{keyboard.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {keyboard.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{keyboard.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.layout}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.switchType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(keyboard)}</span>
          {keyboard.hotswap && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ホットスワップ</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{keyboard.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function KeyboardsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングキーボード おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">ポーリングレート・価格・ホットスワップ・無線対応のスペックデータをもとに客観的に算出したランキング。全{keyboards.length}製品から厳選。</p>

        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線キーボード ランキング TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#hotswap" className="text-sm text-blue-400 hover:text-blue-300">▶ ホットスワップ対応 ランキング TOP5</a></li>
          </ul>
        </nav>

        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">ポーリングレート・価格・ホットスワップ・無線・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">
            {overall.map((k, i) => <RankCard key={k.slug} rank={i + 1} keyboard={k} />)}
          </div>
        </section>

        <section id="wireless" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線キーボード ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ワイヤレス対応キーボードを総合スコア順に掲載。デスク周りをスッキリさせたい方向け。</p>
          <div className="space-y-3">
            {wirelessTop.map((k, i) => <RankCard key={k.slug} rank={i + 1} keyboard={k} badge="無線" />)}
          </div>
          <div className="mt-4 text-center">
            <Link href="/keyboards?conn=wireless" className="text-sm text-blue-400 hover:text-blue-300">無線キーボードをすべて見る →</Link>
          </div>
        </section>

        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">15,000円以下のキーボードをスペックスコアで比較。コストを抑えたい方向け。</p>
          <div className="space-y-3">
            {cospa.map((k, i) => <RankCard key={k.slug} rank={i + 1} keyboard={k} badge="コスパ◎" />)}
          </div>
        </section>

        <section id="hotswap" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ホットスワップ対応 ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">工具なしでスイッチ交換ができるキーボード。打鍵感をカスタマイズしたい方に。</p>
          <div className="space-y-3">
            {hotswap.map((k, i) => <RankCard key={k.slug} rank={i + 1} keyboard={k} badge="ホットスワップ" />)}
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/keyboards" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングキーボード {keyboards.length}製品をすべて見る
          </Link>
        </div>
      </main>
    </div>
  );
}
