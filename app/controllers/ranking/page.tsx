import Link from "next/link";
import type { Metadata } from "next";
import { controllers } from "@/data/controllers";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲームコントローラー おすすめランキング2026【PS5・Xbox・PC対応別】",
  description: "2026年版ゲームコントローラーおすすめランキング。PS5向けTOP5・背面ボタン付きTOP5・コスパTOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/controllers/ranking` },
  openGraph: { title: "ゲームコントローラー おすすめランキング2026 | GameSpec", description: "PS5・Xbox・PC対応別のゲームコントローラーランキング。", type: "website", url: `${BASE_URL}/controllers/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲームコントローラー おすすめランキング2026 | GameSpec", description: "PS5・Xbox・PC対応別のゲームコントローラーランキング。" },
};

// 総合スコア算出の考え方:
// ① 背面ボタン: FPS最重要。親指をスティックから離さずアクションできる。
// ② トリガーストップ: 射撃速度に直結。FPS競技プレイには必須級。
// ③ 重さ: 長時間プレイの快適性。軽すぎても剛性感が損なわれるため適正域で評価。
// ④ ジャイロ: エイム補助として利用者増加中。加点要素として評価。
// ⑤ haptic（振動）はFPSランキングでは評価しない。価格も品質指標に含めない。
function calcScore(c: (typeof controllers)[0]): number {
  // 背面ボタン: FPS競技で最も差がつく機能
  const backScore = c.backButtons ? 35 : 0;

  // トリガーストップ: 射撃速度向上
  const triggerScore = c.triggerStop ? 28 : 0;

  // 重さ: 200-320gを適正域とする
  const weightScore =
    c.weight >= 200 && c.weight <= 300 ? 20 :
    c.weight < 200 ? 14 :
    c.weight <= 350 ? 12 :
    6;

  // ジャイロ: エイム補助として有用
  const gyroScore = c.gyro ? 10 : 0;

  // 発売年
  const newScore = c.releaseYear >= 2025 ? 7 : c.releaseYear >= 2024 ? 5 : c.releaseYear >= 2023 ? 3 : 1;

  return backScore + triggerScore + weightScore + gyroScore + newScore;
}

const overall = [...controllers].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const ps5 = [...controllers].filter((c) => c.platform === "PS5" || c.platform === "マルチ").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const backButtons = [...controllers].filter((c) => c.backButtons).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...controllers].filter((c) => c.price <= 8000).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

const comments: Record<string, string> = {
  "sony-dualsense-white": "PS5純正コントローラー。ハプティックとアダプティブトリガーの没入感は唯一無二。",
  "sony-dualsense-edge": "PS5プロコンの決定版。トリガーストップ・背面ボタン・スティック感度調整で競技プレイを最適化。",
  "xbox-elite-series-2": "Xbox最上位コントローラー。40時間バッテリーと豊富なカスタマイズでPC・Xbox両対応。",
  "razer-wolverine-v2-pro": "PS5対応のサードパーティプロコン。6つのエクストラボタンで操作効率が大幅に向上。",
  "nacon-revolution-5-pro": "ホールエフェクトスティック採用でドリフト問題を根本解決。長期使用での信頼性が高い。",
  "scuf-instinct-pro": "SCUF独自の背面パドルシステム。プロゲーマー愛用のカスタムコントローラーの代表格。",
};

function RankCard({ rank, controller, badge, comment }: { rank: number; controller: (typeof controllers)[0]; badge?: string; comment?: string }) {
  return (
    <Link href={`/controllers/${controller.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{controller.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {controller.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{controller.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{controller.platform}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(controller.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{controller.weight}g</span>
          {controller.backButtons && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">背面ボタン</span>}
          {controller.haptic && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">ハプティック</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{controller.price.toLocaleString()}</span>
        </div>
        {controller.feelTags && controller.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {controller.feelTags.map((tag) => (
              <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        {comment && (
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{comment}</p>
        )}
      </div>
    </Link>
  );
}

export default function ControllersRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/controllers" className="text-gray-400 hover:text-white text-sm">ゲームコントローラー</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲームコントローラー おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">重さ・背面ボタン・ハプティック・価格のスペックデータをもとに算出。全{controllers.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#ps5" className="text-sm text-blue-400 hover:text-blue-300">▶ PS5対応コントローラー TOP5</a></li>
            <li><a href="#backbuttons" className="text-sm text-blue-400 hover:text-blue-300">▶ 背面ボタン付きコントローラー TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・背面ボタン・ハプティック・トリガーストップ・価格を総合スコア化</p>
          <div className="space-y-3">{overall.map((c, i) => <RankCard key={c.slug} rank={i + 1} controller={c} comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="ps5" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">PS5対応コントローラー TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">PS5またはマルチプラットフォーム対応のコントローラー。純正の代替や競技向けプロコンも掲載。</p>
          <div className="space-y-3">{ps5.map((c, i) => <RankCard key={c.slug} rank={i + 1} controller={c} badge="PS5対応" comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="backbuttons" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">背面ボタン付きコントローラー TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">背面ボタンで操作の幅が広がる。FPS・格ゲーなど競技シーンで人気。</p>
          <div className="space-y-3">{backButtons.map((c, i) => <RankCard key={c.slug} rank={i + 1} controller={c} badge="背面ボタン" comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">8,000円以下で買えるコスパ重視コントローラー。</p>
          <div className="space-y-3">{cospa.map((c, i) => <RankCard key={c.slug} rank={i + 1} controller={c} badge="コスパ◎" comment={comments[c.slug]}/>)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/controllers" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲームコントローラー {controllers.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
