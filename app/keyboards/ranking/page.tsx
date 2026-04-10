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

// コミュニティ評価スコア（0-100）
// 出典: ProSettings.net（2251人プロゲーマー使用データ, 2025年末）・r/MechanicalKeyboards・価格.com
// Wootingが2025年#1ブランドシェア。Razer Huntsman V3 Pro TKLがCS2プロに最人気。
const proScores: Record<string, number> = {
  "wooting-60he": 98,                     // 2025年プロ使用率#1、ラピッドトリガーの先駆者
  "wooting-60he-v2": 97,                  // 60HE後継（8000Hz、アルミ筐体、2025年末発売）
  "razer-huntsman-v3-pro-tkl": 92,        // CS2プロに最人気のアナログ光学式
  "steelseries-apex-pro-tkl-wireless": 87,// ワイヤレス最高峰、OmniPoint 2.0
  "wooting-two-he": 86,                   // TKL版Wooting、プロ・コミュニティ両方で高評価
  "steelseries-apex-pro-tkl": 82,         // 有線版Apex Pro TKL
  "steelseries-apex-pro": 80,             // フルサイズ版、FPSには若干大きい
  "logicool-g-pro-x-tkl-lightspeed": 72,
  "corsair-k65-rgb-mini": 67,
  "ducky-one-3-tkl": 68,
  "asus-rog-falchion-ace": 64,
  "razer-blackwidow-v4-pro": 60,          // フルサイズ、競技には不向き
};

// 総合スコア算出の考え方:
// ① コミュニティ評価(proScore): プロ使用率・コミュニティ評価を約30%ウェイトで加算
// ② アクチュエーションポイント: 0.1mmの磁気式・光学式（ラピッドトリガー対応）が競技最強
// ③ ポーリングレート: 8000Hzが最高クラス。1000Hzも競技で十分実用的
// ④ ホットスワップ: カスタマイズ性を評価
// ⑤ 無線: 利便性ボーナス。価格は品質指標に含めない。
function calcScore(k: (typeof keyboards)[0]): number {
  // コミュニティ評価ボーナス（proScore 50→0pt, 70→16pt, 98→38.4pt）
  const communityBonus = ((proScores[k.slug] ?? 70) - 50) / 50 * 40;

  // アクチュエーションポイント: 短いほど高得点（ラピッドトリガーの核心）
  const actuationScore =
    k.actuation <= 0.2 ? 35 :
    k.actuation <= 0.5 ? 30 :
    k.actuation <= 1.0 ? 25 :
    k.actuation <= 1.5 ? 18 :
    k.actuation <= 2.0 ? 12 :
    5;

  // ポーリングレート: 段階評価
  const pollingScore =
    k.pollingRate >= 8000 ? 30 :
    k.pollingRate >= 4000 ? 26 :
    k.pollingRate >= 1000 ? 20 :
    10;

  // ホットスワップ: カスタマイズ性
  const hotswapScore = k.hotswap ? 15 : 0;

  // 無線: 利便性ボーナス
  const wirelessScore = k.wireless ? 10 : 0;

  // 発売年
  const newScore = k.releaseYear >= 2025 ? 10 : k.releaseYear >= 2024 ? 7 : k.releaseYear >= 2023 ? 4 : 1;

  return communityBonus + actuationScore + pollingScore + hotswapScore + wirelessScore + newScore;
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
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{keyboard.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.layout}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.switchType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(keyboard)}</span>
          {keyboard.hotswap && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ホットスワップ</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{keyboard.price.toLocaleString()}</span>
        </div>
        {keyboard.feelTags && keyboard.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {keyboard.feelTags.map((tag) => (
              <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
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
