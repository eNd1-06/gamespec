import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングモニター おすすめランキング2026【Hz・解像度・パネル別】",
  description: "2026年版ゲーミングモニターおすすめランキング。高リフレッシュレートTOP5・コスパTOP5・OLED/QD-OLEDトップ・総合おすすめTOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/monitors/ranking` },
  openGraph: {
    title: "ゲーミングモニター おすすめランキング2026 | GameSpec",
    description: "Hz・解像度・パネル別のゲーミングモニターランキング。スペックデータで客観的に比較。",
    type: "website",
    url: `${BASE_URL}/monitors/ranking`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングモニター おすすめランキング2026 | GameSpec",
    description: "Hz・解像度・パネル別のゲーミングモニターランキング。スペックデータで客観的に比較。",
  },
};

function calcScore(m: (typeof monitors)[0]): number {
  const hzScore = Math.min(m.refreshRate / 390, 1) * 35;
  const resScore = m.resolution === "4K" ? 20 : m.resolution === "1440p" ? 15 : 8;
  const priceScore = Math.max(0, (150000 - m.price) / 150000) * 25;
  const panelScore = m.panelType === "QD-OLED" || m.panelType === "OLED" ? 15 : m.panelType === "Fast IPS" || m.panelType === "Nano IPS" ? 10 : 5;
  const newScore = m.releaseYear >= 2024 ? 5 : m.releaseYear >= 2023 ? 3 : 0;
  return hzScore + resScore + priceScore + panelScore + newScore;
}

const overall = [...monitors].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const highHz = [...monitors].sort((a, b) => b.refreshRate - a.refreshRate).slice(0, 5);
const cospa = [...monitors].filter((m) => m.price <= 50000).sort((a, b) => (b.refreshRate / b.price) - (a.refreshRate / a.price)).slice(0, 5);
const oled = [...monitors].filter((m) => m.panelType === "OLED" || m.panelType === "QD-OLED").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

function RankCard({ rank, monitor, badge }: { rank: number; monitor: (typeof monitors)[0]; badge?: string }) {
  return (
    <Link
      href={`/monitors/${monitor.slug}`}
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
          <p className="text-xs text-gray-500">{monitor.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {monitor.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{monitor.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.refreshRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.resolution}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.panelType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}インチ</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{monitor.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function MonitorsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングモニター おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">リフレッシュレート・解像度・パネル種類・価格のスペックデータをもとに客観的に算出したランキング。全{monitors.length}製品から厳選。</p>

        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#highhz" className="text-sm text-blue-400 hover:text-blue-300">▶ 高リフレッシュレート ランキング TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#oled" className="text-sm text-blue-400 hover:text-blue-300">▶ OLED・QD-OLED ランキング TOP5</a></li>
          </ul>
        </nav>

        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">Hz・解像度・パネル・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">
            {overall.map((m, i) => <RankCard key={m.slug} rank={i + 1} monitor={m} />)}
          </div>
        </section>

        <section id="highhz" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">高リフレッシュレート ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">FPS・APEXなど競技向け。高Hzほど映像が滑らかになり、有利なシーンが増える。</p>
          <div className="space-y-3">
            {highHz.map((m, i) => <RankCard key={m.slug} rank={i + 1} monitor={m} badge={`${m.refreshRate}Hz`} />)}
          </div>
          <div className="mt-4 text-center">
            <Link href="/monitors" className="text-sm text-blue-400 hover:text-blue-300">高リフレッシュレートモニターをすべて見る →</Link>
          </div>
        </section>

        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">5万円以下のモニターをHz÷価格でスコア化。予算を抑えたい方向け。</p>
          <div className="space-y-3">
            {cospa.map((m, i) => <RankCard key={m.slug} rank={i + 1} monitor={m} badge="コスパ◎" />)}
          </div>
        </section>

        <section id="oled" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">OLED・QD-OLED ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">完全な黒と圧倒的なコントラスト。没入感重視・RPG・映像制作にも。</p>
          <div className="space-y-3">
            {oled.map((m, i) => <RankCard key={m.slug} rank={i + 1} monitor={m} badge={m.panelType} />)}
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/monitors" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングモニター {monitors.length}製品をすべて見る
          </Link>
        </div>
      </main>
    </div>
  );
}
