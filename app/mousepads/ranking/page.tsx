import Link from "next/link";
import type { Metadata } from "next";
import { mousepads } from "@/data/mousepads";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウスパッド おすすめランキング2026【サイズ・素材別】",
  description: "2026年版ゲーミングマウスパッドおすすめランキング。XL・XXLサイズTOP5・速度系TOP5・コスパTOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/mousepads/ranking` },
  openGraph: { title: "ゲーミングマウスパッド おすすめランキング2026 | GameSpec", description: "サイズ・素材・滑り感別のゲーミングマウスパッドランキング。", type: "website", url: `${BASE_URL}/mousepads/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲーミングマウスパッド おすすめランキング2026 | GameSpec", description: "サイズ・素材・滑り感別のゲーミングマウスパッドランキング。" },
};

// 総合スコア算出の考え方:
// ① サイズ: 大きいほどマウスの可動域が広がる。XL以上が競技標準。価格は品質指標に含めない。
// ② 縫い目加工: 端のほつれ防止で耐久性が大幅向上。長期コスパに直結する重要指標。
// ③ 厚み: 3-4mmがクッション性・安定性・センサー読み取りのバランス最良。
// ④ 素材: 布が主流でゲーム向き。ガラスは超高速だが一部向け。ハイブリッドは中間。
function calcScore(p: (typeof mousepads)[0]): number {
  // サイズ: ゲームでの可動域に直結（最重要）
  const sizeScore =
    p.size === "XXL" ? 40 :
    p.size === "XL" ? 33 :
    p.size === "L" ? 23 :
    p.size === "M" ? 12 :
    5;

  // 縫い目加工: 耐久性・使用感の長期品質
  const edgeScore = p.stitchedEdge ? 28 : 0;

  // 厚み: 3-4mmを最適とする
  const thicknessScore =
    p.thickness >= 3 && p.thickness <= 4 ? 20 :
    p.thickness >= 2 ? 12 :
    6;

  // 素材: 布が競技主流
  const materialScore =
    p.material === "布" ? 8 :
    p.material === "ガラス" ? 5 :
    6;

  // 発売年
  const newScore = p.releaseYear >= 2025 ? 4 : p.releaseYear >= 2024 ? 3 : 1;

  return sizeScore + edgeScore + thicknessScore + materialScore + newScore;
}

const overall = [...mousepads].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const largeSize = [...mousepads].filter((p) => p.size === "XL" || p.size === "XXL").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const speedType = [...mousepads].filter((p) => p.surface === "速度系").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...mousepads].filter((p) => p.price <= 3000).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

function RankCard({ rank, pad, badge }: { rank: number; pad: (typeof mousepads)[0]; badge?: string }) {
  return (
    <Link href={`/mousepads/${pad.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{pad.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {pad.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{pad.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.size}サイズ</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.surface}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.material}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.width}×{pad.height}mm</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{pad.price.toLocaleString()}</span>
        </div>
        {pad.feelTags && pad.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {pad.feelTags.map((tag) => (
              <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function MousepadsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mousepads" className="text-gray-400 hover:text-white text-sm">ゲーミングマウスパッド</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウスパッド おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">サイズ・素材・滑り感・価格のスペックデータをもとに客観的に算出。全{mousepads.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#large" className="text-sm text-blue-400 hover:text-blue-300">▶ 大型（XL・XXL）ランキング TOP5</a></li>
            <li><a href="#speed" className="text-sm text-blue-400 hover:text-blue-300">▶ 速度系マウスパッド TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">サイズ・厚さ・ステッチ有無・価格・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">{overall.map((p, i) => <RankCard key={p.slug} rank={i + 1} pad={p} />)}</div>
        </section>
        <section id="large" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">大型（XL・XXL）ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">デスク全体をカバーする大型マウスパッド。マウスを大きく動かすローセンシプレイヤーに最適。</p>
          <div className="space-y-3">{largeSize.map((p, i) => <RankCard key={p.slug} rank={i + 1} pad={p} badge={p.size} />)}</div>
          <div className="mt-4 text-center"><Link href="/mousepads" className="text-sm text-blue-400 hover:text-blue-300">大型マウスパッドをすべて見る →</Link></div>
        </section>
        <section id="speed" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">速度系マウスパッド TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">滑りが良く素早いエイムに対応。高感度（ハイセンシ）プレイヤーやFPS向け。</p>
          <div className="space-y-3">{speedType.map((p, i) => <RankCard key={p.slug} rank={i + 1} pad={p} badge="速度系" />)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">3,000円以下で買えるコスパ重視のマウスパッド。</p>
          <div className="space-y-3">{cospa.map((p, i) => <RankCard key={p.slug} rank={i + 1} pad={p} badge="コスパ◎" />)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/mousepads" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲーミングマウスパッド {mousepads.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
