import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "OLEDゲーミングモニターおすすめ2026【QD-OLED・焼き付き対策・比較】",
  description: "OLEDゲーミングモニターのおすすめをQD-OLED・W-OLED別に比較。応答速度0.03ms・無限コントラストのOLEDパネルをサイズ・リフレッシュレート・価格で厳選紹介。",
  alternates: { canonical: `${BASE_URL}/monitors/oled` },
  openGraph: {
    title: "OLEDゲーミングモニターおすすめ2026 | GameSpec",
    description: "QD-OLED・W-OLEDゲーミングモニターを応答速度・リフレッシュレート・価格で比較。",
    type: "website",
    url: `${BASE_URL}/monitors/oled`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "OLEDゲーミングモニターおすすめ2026 | GameSpec",
    description: "QD-OLED・W-OLEDゲーミングモニターをスペックで比較。",
  },
};

function calcScore(m: (typeof monitors)[0]): number {
  const rateScore = Math.min(m.refreshRate / 360, 1) * 40;
  const responseScore = Math.max(0, (5 - m.responseTime) / 5) * 30;
  const priceScore = Math.max(0, (150000 - m.price) / 150000) * 20;
  const newScore = m.releaseYear >= 2024 ? 10 : m.releaseYear >= 2023 ? 6 : 3;
  return rateScore + responseScore + priceScore + newScore;
}

const oledMonitors = [...monitors]
  .filter((m) => m.panelType === "OLED" || m.panelType === "QD-OLED")
  .sort((a, b) => calcScore(b) - calcScore(a));

const qdOled = oledMonitors.filter((m) => m.panelType === "QD-OLED");
const wOled = oledMonitors.filter((m) => m.panelType === "OLED");

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
          {badge && <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {monitor.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{monitor.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full font-bold">{monitor.panelType}</span>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{monitor.refreshRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.responseTime}ms</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}型 {monitor.resolution}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{monitor.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function OledMonitorPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">OLEDおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">OLEDゲーミングモニターおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          応答速度0.03ms・無限コントラストを誇るOLEDゲーミングモニターを厳選。QD-OLED・W-OLED別に比較。全{monitors.length}製品中、OLEDモデル{oledMonitors.length}製品を掲載。
        </p>

        {/* OLEDの特徴 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">OLEDゲーミングモニターが優れる3つの理由</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">応答速度0.03ms（GTG）</span> — IPSの最速1msを大幅に上回る。残像感がほぼゼロで動体視力を最大限活かせる。FPS・APEXの高速エイムに直結。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">真の黒・無限コントラスト</span> — 各ピクセルが自発光するため、黒を完全に消灯できる。暗所での視認性が圧倒的に高く、敵の発見が容易になる。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">QD-OLEDは色域・輝度も最強</span> — Quantum Dot + OLEDの組み合わせで色再現性・最大輝度がW-OLEDを超える。ゲームの没入感が段違い。</span>
            </li>
          </ul>
        </section>

        {/* 焼き付き注意 */}
        <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-4 mb-8">
          <p className="text-sm text-yellow-300"><span className="font-bold">⚠ 焼き付き（バーンイン）について：</span>同じ画像を長時間表示し続けると画面に残像が残る場合があります。ゲーム中のHUD・UIが固定表示されるケースで注意が必要。多くのメーカーが焼き付き補正機能を搭載していますが、輝度を下げて使用・定期的に壁紙を変えるなどの対策を推奨します。</p>
        </div>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ OLED総合ランキング</a></li>
            {qdOled.length > 0 && <li><a href="#qdoled" className="text-sm text-blue-400 hover:text-blue-300">▶ QD-OLEDモデル</a></li>}
            {wOled.length > 0 && <li><a href="#woled" className="text-sm text-blue-400 hover:text-blue-300">▶ W-OLEDモデル</a></li>}
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">OLED総合ランキング</h2>
          <p className="text-xs text-gray-500 mb-4">リフレッシュレート・応答速度・価格・発売年を総合スコア化</p>
          <div className="space-y-3">
            {oledMonitors.slice(0, 10).map((m, i) => (
              <MonitorCard key={m.slug} monitor={m} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* QD-OLED */}
        {qdOled.length > 0 && (
          <section id="qdoled" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">QD-OLEDモデル</h2>
            <p className="text-xs text-gray-500 mb-4">Samsung製パネル採用。色域・輝度・応答速度すべてにおいて最高クラス。</p>
            <div className="space-y-3">
              {qdOled.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="QD-OLED" />)}
            </div>
          </section>
        )}

        {/* W-OLED */}
        {wOled.length > 0 && (
          <section id="woled" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">W-OLEDモデル</h2>
            <p className="text-xs text-gray-500 mb-4">LG製OLEDパネル採用。焼き付き補正機能が充実しており長期使用にも配慮。</p>
            <div className="space-y-3">
              {wOled.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="OLED" />)}
            </div>
          </section>
        )}

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/monitors/fps" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">FPS向けモニター</p>
            <p className="text-xs text-gray-400">240Hz・360Hzモデルを見る</p>
          </Link>
          <Link href="/monitors/1440p" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">1440pモニター</p>
            <p className="text-xs text-gray-400">WQHDモデルを比較する</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">パネル・サイズ・解像度で自分で絞り込む</p>
          <Link href="/monitors" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングモニター {monitors.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
