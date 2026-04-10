import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "安いゲーミングモニターおすすめ2026【3万円以下・コスパ最強比較】",
  description: "安いゲーミングモニターのおすすめを3万円以下・2万円以下に分けて比較。144Hz・165Hz対応のコスパ最強モデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/monitors/budget` },
  openGraph: {
    title: "安いゲーミングモニターおすすめ2026 | GameSpec",
    description: "3万円以下・2万円以下の安いゲーミングモニターを144Hz・パネル・価格で比較。",
    type: "website",
    url: `${BASE_URL}/monitors/budget`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "安いゲーミングモニターおすすめ2026 | GameSpec",
    description: "3万円以下コスパ最強ゲーミングモニターをスペックで比較。",
  },
};

function calcScore(m: (typeof monitors)[0]): number {
  const rateScore = Math.min(m.refreshRate / 240, 1) * 40;
  const responseScore = Math.max(0, (5 - m.responseTime) / 5) * 30;
  const priceScore = Math.max(0, (40000 - m.price) / 40000) * 30;
  return rateScore + responseScore + priceScore;
}

const under20k = [...monitors]
  .filter((m) => m.price <= 20000)
  .sort((a, b) => calcScore(b) - calcScore(a));

const under30k = [...monitors]
  .filter((m) => m.price > 20000 && m.price <= 30000)
  .sort((a, b) => calcScore(b) - calcScore(a));

const under40k = [...monitors]
  .filter((m) => m.price > 30000 && m.price <= 40000)
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 5);

function MonitorCard({ monitor, rank, badge }: { monitor: (typeof monitors)[0]; rank: number; badge?: string }) {
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
          {badge && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {monitor.isNew && <span className="text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{monitor.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-bold">¥{monitor.price.toLocaleString()}</span>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{monitor.refreshRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.responseTime}ms</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.panelType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}型 {monitor.resolution}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BudgetMonitorPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">安い・コスパ最強</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">安いゲーミングモニターおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          2万円以下・3万円以下・4万円以下の価格帯別にコスパ最強ゲーミングモニターを厳選。リフレッシュレートと応答速度でスコア化。全{monitors.length}製品から掲載。
        </p>

        {/* コスパモニターの見極め方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">安いゲーミングモニターの見極め方</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">144Hz以上は必須</span> — 60Hzと144Hzの差は誰でも体感できるほど大きい。予算が限られても144Hz以上を優先しよう。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">TNよりIPSを選ぶ</span> — 安価なモニターはTNパネルが多いが、視野角・色再現性が劣る。同じ価格帯ならIPSパネルを選ぼう。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">無名ブランドより実績ブランドを</span> — ASUS・BenQ・LG・Dell・AOCなど実績あるブランドは品質管理・保証対応が安心。極端に安いモデルは不良率・サポートに注意。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {under20k.length > 0 && <li><a href="#under20k" className="text-sm text-blue-400 hover:text-blue-300">▶ 2万円以下のゲーミングモニター</a></li>}
            {under30k.length > 0 && <li><a href="#under30k" className="text-sm text-blue-400 hover:text-blue-300">▶ 2〜3万円のゲーミングモニター</a></li>}
            {under40k.length > 0 && <li><a href="#under40k" className="text-sm text-blue-400 hover:text-blue-300">▶ 3〜4万円のゲーミングモニター（コスパ上位）</a></li>}
          </ul>
        </nav>

        {under20k.length > 0 && (
          <section id="under20k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">2万円以下のゲーミングモニター</h2>
            <p className="text-xs text-gray-500 mb-4">入門・サブ用途向け。144Hz・165Hzでもこの価格帯で選べる。</p>
            <div className="space-y-3">{under20k.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="〜2万円" />)}</div>
          </section>
        )}

        {under30k.length > 0 && (
          <section id="under30k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">2〜3万円のゲーミングモニター</h2>
            <p className="text-xs text-gray-500 mb-4">コスパの主戦場。1440p・240Hzモデルも選べるゾーン。最初の1台に最適。</p>
            <div className="space-y-3">{under30k.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="〜3万円" />)}</div>
          </section>
        )}

        {under40k.length > 0 && (
          <section id="under40k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">3〜4万円のゲーミングモニター（コスパ上位）</h2>
            <p className="text-xs text-gray-500 mb-4">少し予算を増やすと1440p・240Hzなど競技レベルの選択肢が大幅に広がる。</p>
            <div className="space-y-3">{under40k.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="〜4万円" />)}</div>
          </section>
        )}

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link href="/monitors/fps" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">FPS向け</p>
            <p className="text-xs text-gray-400">240Hz・360Hz比較</p>
          </Link>
          <Link href="/monitors/1440p" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">1440p</p>
            <p className="text-xs text-gray-400">WQHDモデルを比較</p>
          </Link>
          <Link href="/monitors/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全モデルおすすめ順</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">価格・リフレッシュレート・パネルで自分で絞り込む</p>
          <Link href="/monitors" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングモニター {monitors.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
