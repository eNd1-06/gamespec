import Link from "next/link";
import type { Metadata } from "next";
import { chairs } from "@/data/chairs";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングチェア おすすめランキング2026【腰痛・長時間・コスパ別】",
  description: "2026年版ゲーミングチェアおすすめランキング。腰痛対策TOP5・コスパTOP5・ファブリック素材TOP5・総合TOP10をスペックデータで比較。",
  alternates: { canonical: `${BASE_URL}/chairs/ranking` },
  openGraph: { title: "ゲーミングチェア おすすめランキング2026 | GameSpec", description: "腰痛・長時間・コスパ別のゲーミングチェアランキング。", type: "website", url: `${BASE_URL}/chairs/ranking`, siteName: "GameSpec", locale: "ja_JP" },
  twitter: { card: "summary", title: "ゲーミングチェア おすすめランキング2026 | GameSpec", description: "腰痛・長時間・コスパ別のゲーミングチェアランキング。" },
};

// 総合スコア算出の考え方:
// ① ランバーサポート: 長時間プレイの腰痛予防に最重要。なしは論外レベルの減点。
// ② アームレスト自由度: 4D（高さ・奥行・角度・横）が最高。肩こり・腱鞘炎対策に直結。
// ③ 素材・通気性: メッシュ＝夏に強い。PUレザーは手入れ簡単だが蒸れる。長時間プレイでは通気性が体力消耗に影響。
// ④ ヘッドレスト: 長時間の首・肩サポートとして重要。調整できるモデルを高評価。
// ⑤ リクライニング角度・フットレスト・価格は品質指標に含めない（用途次第のオプション機能）。
function calcScore(c: (typeof chairs)[0]): number {
  // ランバーサポート: 腰痛予防の最重要指標
  const lumbarScore = c.lumbarSupport ? 40 : 0;

  // アームレスト: 自由度が高いほど長時間プレイでの疲労軽減
  const armrestScore =
    c.armrest === "4D" ? 30 :
    c.armrest === "3D" ? 22 :
    c.armrest === "2D" ? 12 :
    0;

  // 素材・通気性: 長時間プレイでの快適性
  const materialScore =
    c.material === "メッシュ" ? 18 :
    c.material === "ファブリック" ? 14 :
    c.material === "PUレザー" ? 10 :
    8;

  // 発売年（最新の人間工学・設計を反映）
  const newScore = c.releaseYear >= 2025 ? 12 : c.releaseYear >= 2024 ? 8 : c.releaseYear >= 2023 ? 4 : 1;

  return lumbarScore + armrestScore + materialScore + newScore;
}

const overall = [...chairs].sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 10);
const backPain = [...chairs].filter((c) => c.lumbarSupport && c.recommendFor.includes("back-pain")).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const cospa = [...chairs].filter((c) => c.price <= 40000).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);
const fabric = [...chairs].filter((c) => c.material === "ファブリック" || c.material === "メッシュ").sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const comments: Record<string, string> = {
  "akracing-wolf": "AKRacingのスタンダードモデル。頑丈なスチールフレームと長時間でも疲れにくいサポート設計。",
  "akracing-premium-v2": "AKRacingの本革仕様プレミアム機。耐久性と高級感を両立した上位モデル。",
  "akracing-nitro-v2": "コスパ重視のエントリー向け。ゲーミングチェア入門として外れのない定番の一台。",
  "secretlab-titan-evo-2022": "世界No.1ゲーミングチェアブランドの主力機。磁気ヘッドピロー等の細部設計が際立つ。",
  "noblechairs-hero": "ドイツ設計の高級ゲーミングチェア。本革の質感とランバーサポートで長時間プレイを支える。",
  "dxracer-formula-series": "ゲーミングチェアの元祖。シリーズ豊富でサイズ展開が広く体型を選ばない安心の定番ブランド。",
  "gt-racing-ace-series": "1万円台で買えるコスパ特化チェア。初めてゲーミングチェアを試す方の入口として最適。",
};

function RankCard({ rank, chair, badge, comment }: { rank: number; chair: (typeof chairs)[0]; badge?: string; comment?: string }) {
  return (
    <Link href={`/chairs/${chair.slug}`} className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
      <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{chair.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {chair.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1.5">{chair.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.type}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.material}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">アームレスト {chair.armrest}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">リクライニング {chair.recliningAngle}°</span>
          {chair.lumbarSupport && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ランバーサポート</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{chair.price.toLocaleString()}</span>
        </div>
        {chair.feelTags && chair.feelTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {chair.feelTags.map((tag) => (
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

export default function ChairsRankingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/chairs" className="text-gray-400 hover:text-white text-sm">ゲーミングチェア</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめランキング</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングチェア おすすめランキング2026</h1>
        <p className="text-sm text-gray-400 mb-8">ランバーサポート・アームレスト自由度・素材・発売年のスペックデータをもとに算出。全{chairs.length}製品から厳選。</p>
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 総合おすすめランキング TOP10</a></li>
            <li><a href="#backpain" className="text-sm text-blue-400 hover:text-blue-300">▶ 腰痛対策・長時間向け TOP5</a></li>
            <li><a href="#cospa" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ最強ランキング TOP5</a></li>
            <li><a href="#fabric" className="text-sm text-blue-400 hover:text-blue-300">▶ ファブリック・メッシュ素材 TOP5</a></li>
          </ul>
        </nav>
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">総合おすすめランキング TOP10</h2>
          <p className="text-xs text-gray-500 mb-4">ランバーサポート・アームレスト自由度・素材・発売年を総合スコア化して順位付け</p>
          <div className="space-y-3">{overall.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="backpain" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">腰痛対策・長時間向け TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">ランバーサポート付きで腰への負担を軽減。長時間のゲームセッションにおすすめ。</p>
          <div className="space-y-3">{backPain.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge="腰痛対策" comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="cospa" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">コスパ最強ランキング TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">4万円以下でしっかりした機能を持つゲーミングチェア。</p>
          <div className="space-y-3">{cospa.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge="コスパ◎" comment={comments[c.slug]}/>)}</div>
        </section>
        <section id="fabric" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ファブリック・メッシュ素材 TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">通気性が高く夏でも蒸れにくい。長時間プレイ時の快適さを重視したい方に。</p>
          <div className="space-y-3">{fabric.map((c, i) => <RankCard key={c.slug} rank={i + 1} chair={c} badge={c.material} comment={comments[c.slug]}/>)}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スペックで細かく絞り込みたい方はこちら</p>
          <Link href="/chairs" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">ゲーミングチェア {chairs.length}製品をすべて見る</Link>
        </div>
      </main>
    </div>
  );
}
