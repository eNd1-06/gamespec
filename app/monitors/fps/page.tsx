import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "FPS向けゲーミングモニターおすすめ2026【144Hz・240Hz・360Hz比較】",
  description: "FPS・APEX向けゲーミングモニターのおすすめを144Hz・240Hz・360Hz別に比較。応答速度1ms以下・低遅延パネルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/monitors/fps` },
  openGraph: {
    title: "FPS向けゲーミングモニターおすすめ2026 | GameSpec",
    description: "144Hz・240Hz・360HzのFPS向けゲーミングモニターをスペックで比較。応答速度・パネルタイプ・価格で厳選。",
    type: "website",
    url: `${BASE_URL}/monitors/fps`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "FPS向けゲーミングモニターおすすめ2026 | GameSpec",
    description: "144Hz・240Hz・360HzのFPS向けゲーミングモニターをスペックで比較。",
  },
};

function calcScore(m: (typeof monitors)[0]): number {
  const rateScore = Math.min(m.refreshRate / 360, 1) * 40;
  const responseScore = Math.max(0, (5 - m.responseTime) / 5) * 30;
  const priceScore = Math.max(0, (80000 - m.price) / 80000) * 20;
  const newScore = m.releaseYear >= 2024 ? 10 : m.releaseYear >= 2023 ? 6 : 3;
  return rateScore + responseScore + priceScore + newScore;
}

const fpsMons = [...monitors]
  .filter((m) => m.recommendFor.includes("fps") || m.recommendFor.includes("competitive") || m.recommendFor.includes("apex"))
  .sort((a, b) => calcScore(b) - calcScore(a));

const hz144 = fpsMons.filter((m) => m.refreshRate >= 144 && m.refreshRate < 200).slice(0, 5);
const hz240 = fpsMons.filter((m) => m.refreshRate >= 200 && m.refreshRate < 300).slice(0, 5);
const hz360 = fpsMons.filter((m) => m.refreshRate >= 300).slice(0, 5);

const panelLabel = (p: string) => p;

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
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{panelLabel(monitor.panelType)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}型 {monitor.resolution}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{monitor.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FpsMonitorPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">FPS向けおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">FPS向けゲーミングモニターおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX・Valorant・CS2などFPS向けモニターを144Hz・240Hz・360Hz別に掲載。リフレッシュレート・応答速度・パネルタイプをスコア化して厳選。全{monitors.length}製品から抽出しています。
        </p>

        {/* FPS向けの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">FPSに最適なモニターの3条件</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">240Hz以上のリフレッシュレート</span> — フレームレートが高いほど映像が滑らかになり、敵の動きを素早く捉えられる。競技プレイには240Hz以上が標準になりつつある。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">応答速度1ms以下（GTG）</span> — 残像感が少ないほど動体視力を活かせる。IPS・Fast IPSパネルは1ms以下が多く、色の再現性も高い。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">24〜27インチ・フルHDまたは1440p</span> — 大きすぎると視点移動が増える。FPSには24〜27インチが最適。1440pはGPUへの負荷を考慮して選択。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {hz360.length > 0 && <li><a href="#hz360" className="text-sm text-blue-400 hover:text-blue-300">▶ 360Hz以上モデル（最高性能）</a></li>}
            {hz240.length > 0 && <li><a href="#hz240" className="text-sm text-blue-400 hover:text-blue-300">▶ 200〜299Hzモデル（競技標準）</a></li>}
            {hz144.length > 0 && <li><a href="#hz144" className="text-sm text-blue-400 hover:text-blue-300">▶ 144〜165Hzモデル（エントリー）</a></li>}
            <li><a href="#faq" className="text-sm text-blue-400 hover:text-blue-300">▶ よくある質問</a></li>
          </ul>
        </nav>

        {/* 360Hz以上 */}
        {hz360.length > 0 && (
          <section id="hz360" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">360Hz以上モデル（最高性能）</h2>
            <p className="text-xs text-gray-500 mb-4">プロゲーマー・最高レートを目指すプレイヤー向け。GPU要件が高いため環境確認必須。</p>
            <div className="space-y-3">
              {hz360.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="360Hz+" />)}
            </div>
          </section>
        )}

        {/* 240Hz */}
        {hz240.length > 0 && (
          <section id="hz240" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">200〜299Hzモデル（競技標準）</h2>
            <p className="text-xs text-gray-500 mb-4">現在の競技シーンの主流。高フレームレートと価格のバランスが優れたゾーン。</p>
            <div className="space-y-3">
              {hz240.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="240Hz" />)}
            </div>
          </section>
        )}

        {/* 144Hz */}
        {hz144.length > 0 && (
          <section id="hz144" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">144〜165Hzモデル（エントリー）</h2>
            <p className="text-xs text-gray-500 mb-4">コスパ重視・初めてゲーミングモニターを買う方に。60Hzからの乗り換えで大幅に改善を実感できる。</p>
            <div className="space-y-3">
              {hz144.map((m, i) => <MonitorCard key={m.slug} monitor={m} rank={i + 1} badge="144Hz" />)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXには何Hzのモニターがおすすめ？</h3>
              <p className="text-sm text-gray-400">APEXはフレームレート上限が300fpsのため、240Hz以上のモニターで恩恵を受けられます。RTX 3070以上のGPUがあれば240Hzを、RTX 3060以下なら144Hzで十分です。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">1080pと1440pどちらがFPS向き？</h3>
              <p className="text-sm text-gray-400">フレームレート優先なら1080p、画質と競技性のバランスなら1440p。ただし1440pは必要GPUパワーが増えるため、RTX 3080以上が推奨です。プロは1080pを使うことが多いです。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">OLEDとIPSはFPSにどちらが向いている？</h3>
              <p className="text-sm text-gray-400">OLEDは応答速度・コントラスト最強ですが焼き付きリスクと価格がネック。IPS/Fast IPSは価格対性能が高く、FPS競技シーンでは依然として主流です。予算があればOLEDも検討を。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/monitors/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全モニターのおすすめ順を見る</p>
          </Link>
          <Link href="/monitors/1440p" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">1440pモニター一覧</p>
            <p className="text-xs text-gray-400">WQHD解像度モデルを比較</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">サイズ・解像度・リフレッシュレートで自分で絞り込む</p>
          <Link href="/monitors" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングモニター {monitors.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
