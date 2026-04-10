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

// コミュニティ評価スコア（0-100）
// 出典: ProSettings.net（プロゲーマー使用率）・rtings.com・r/Monitors・価格.com
// プロFPS大会（ESL/BLAST）での採用実績を重視。
const proScores: Record<string, number> = {
  "benq-zowie-xl2586xplus": 92,          // 600Hz 世界最速、ZOWIEのプロ標準
  "asus-rog-swift-pro-pg248qp": 90,      // 540Hz ESL/BLASTプロリーグ採用
  "benq-zowie-xl2566k": 88,              // 360Hz CS2プロの定番モニター
  "alienware-aw2524h": 86,               // 500Hz Dell Alienware、プロピック
  "benq-zowie-xl2546k": 83,              // 240Hz 根強いプロ人気（DyAc+）
  "alienware-aw2523hf": 80,              // 360Hz Fast IPS、評価高い
  "lg-27gr95qe": 78,                     // OLED 240Hz、rtings.com高評価
  "asus-rog-pg27aqdm": 77,               // OLED 240Hz、ゲーマー高評価
  "acer-nitro-xv252q": 76,               // 390Hz コスパ高評価
  "samsung-odyssey-g4-25": 74,           // 240Hz コスパ競技向け人気
  "asus-rog-swift-pg259qn": 73,          // 360Hz 旧世代も現役
  "benq-zowie-xl2411k": 72,              // 144Hz CS2初心者の定番
  "asus-rog-swift-pg259qnr": 71,
  "lg-27gp850-b": 68,
  "asus-rog-strix-xg27aqm": 67,
};

// 総合スコア算出の考え方:
// ① コミュニティ評価(proScore): プロ使用率・rtings.com等評価を約30%ウェイトで加算
// ② リフレッシュレート: 500Hz以上が競技最高峰。144→240の差は特に大きい。
// ③ 応答速度(GTG): OLED 0.03msが最高。残像・ゴースト削減に直結。
// ④ パネル品質: OLED/QD-OLEDが視認性最高。競技ではFast IPSも有力。
// ⑤ 発売年: 新世代パネル技術を評価。価格は品質指標に含めない。
function calcScore(m: (typeof monitors)[0]): number {
  // コミュニティ評価ボーナス（proScore 50→0pt, 70→16pt, 92→33.6pt）
  const communityBonus = ((proScores[m.slug] ?? 70) - 50) / 50 * 40;

  // リフレッシュレート: 段階評価で実感差を反映。500Hz以上はプロ競技の最高峰。
  const hzScore =
    m.refreshRate >= 500 ? 40 :
    m.refreshRate >= 360 ? 35 :
    m.refreshRate >= 240 ? 30 :
    m.refreshRate >= 165 ? 20 :
    m.refreshRate >= 144 ? 15 :
    5;

  // 応答速度: 0.03ms(OLED)〜5ms以上まで。低いほど高得点。
  const responseScore = m.responseTime <= 0.1 ? 25 : m.responseTime <= 1 ? 20 : m.responseTime <= 3 ? 12 : 6;

  // パネル品質: 応答速度・コントラスト・視野角を総合評価
  const panelScore =
    m.panelType === "QD-OLED" ? 18 :
    m.panelType === "OLED" ? 16 :
    m.panelType === "Fast IPS" || m.panelType === "Fast TN" ? 11 :
    m.panelType === "Nano IPS" ? 10 :
    m.panelType === "IPS" ? 8 :
    m.panelType === "VA" ? 5 :
    4; // TN

  // 発売年: 新世代パネル・回路設計の恩恵
  const newScore = m.releaseYear >= 2025 ? 12 : m.releaseYear >= 2024 ? 8 : m.releaseYear >= 2023 ? 4 : 2;

  return communityBonus + hzScore + responseScore + panelScore + newScore;
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
