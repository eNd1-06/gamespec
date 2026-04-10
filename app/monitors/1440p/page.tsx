import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "1440p（WQHD）ゲーミングモニターおすすめ2026【144Hz〜360Hz比較】",
  description: "1440p（WQHD・2560×1440）ゲーミングモニターのおすすめをリフレッシュレート・パネル別に比較。FPS・RPG向けWQHDモデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/monitors/1440p` },
  openGraph: {
    title: "1440pゲーミングモニターおすすめ2026 | GameSpec",
    description: "WQHD（2560×1440）ゲーミングモニターをリフレッシュレート・パネル・価格で比較。",
    type: "website",
    url: `${BASE_URL}/monitors/1440p`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "1440pゲーミングモニターおすすめ2026 | GameSpec",
    description: "WQHD（2560×1440）ゲーミングモニターをスペックで比較。",
  },
};

function calcScore(m: (typeof monitors)[0]): number {
  const rateScore = Math.min(m.refreshRate / 360, 1) * 35;
  const responseScore = Math.max(0, (5 - m.responseTime) / 5) * 25;
  const priceScore = Math.max(0, (80000 - m.price) / 80000) * 20;
  const newScore = m.releaseYear >= 2024 ? 20 : m.releaseYear >= 2023 ? 12 : 6;
  return rateScore + responseScore + priceScore + newScore;
}

const wqhdMonitors = [...monitors]
  .filter((m) => m.resolution === "1440p")
  .sort((a, b) => calcScore(b) - calcScore(a));

const oledWqhd = wqhdMonitors.filter((m) => m.panelType === "OLED" || m.panelType === "QD-OLED").slice(0, 5);
const ipsWqhd = wqhdMonitors.filter((m) => m.panelType !== "OLED" && m.panelType !== "QD-OLED").slice(0, 8);

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
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {monitor.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{monitor.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-bold">{monitor.refreshRate}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.responseTime}ms</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.panelType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}型</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{monitor.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Wqhd1440pPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">1440p（WQHD）</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">1440p（WQHD）ゲーミングモニターおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          2560×1440（WQHD・1440p）解像度のゲーミングモニターを厳選。フルHDより高精細でGPU負荷も許容範囲内。全{monitors.length}製品中、1440pモデル{wqhdMonitors.length}製品を掲載。
        </p>

        {/* 1440pを選ぶ理由 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">1440pを選ぶ理由</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">フルHD比78%増の解像度</span> — キャラクターの輪郭・遠距離の敵がくっきり見える。ゲームと作業の両立にも最適。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">4Kより軽いGPU負荷</span> — RTX 3070〜4070クラスで144Hz〜165Hzを安定して出せる。4Kに比べてコスパが高い。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">240Hz・360HzモデルもWQHDで登場</span> — 高解像度と高リフレッシュレートの両立が可能になってきた。特にOLED 1440p 240Hzモデルが人気。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {oledWqhd.length > 0 && <li><a href="#oled" className="text-sm text-blue-400 hover:text-blue-300">▶ OLED・QD-OLED 1440pモデル</a></li>}
            <li><a href="#ips" className="text-sm text-blue-400 hover:text-blue-300">▶ IPS系 1440pモデル（コスパ重視）</a></li>
          </ul>
        </nav>

        {/* OLED */}
        {oledWqhd.length > 0 && (
          <section id="oled" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">OLED・QD-OLED 1440pモデル</h2>
            <p className="text-xs text-gray-500 mb-4">応答速度・コントラスト最強クラス。価格は高めだが画質は圧倒的。</p>
            <div className="space-y-3">
              {oledWqhd.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="OLED" />)}
            </div>
          </section>
        )}

        {/* IPS */}
        <section id="ips" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">IPS系 1440pモデル（コスパ重視）</h2>
          <p className="text-xs text-gray-500 mb-4">Fast IPS・Nano IPS・IPSパネルの1440pモデル。高リフレッシュレートとコスパのバランスが優れる。</p>
          <div className="space-y-3">
            {ipsWqhd.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} />)}
          </div>
        </section>

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/monitors/fps" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">FPS向けモニター</p>
            <p className="text-xs text-gray-400">240Hz・360Hzモデルを見る</p>
          </Link>
          <Link href="/monitors/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全モニターのおすすめ順を見る</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">解像度・リフレッシュレート・パネルで自分で絞り込む</p>
          <Link href="/monitors" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングモニター {monitors.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
