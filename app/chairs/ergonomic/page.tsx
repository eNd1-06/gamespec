import Link from "next/link";
import type { Metadata } from "next";
import { chairs } from "@/data/chairs";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "エルゴノミクスゲーミングチェアおすすめ2026【腰痛対策・長時間作業向け比較】",
  description: "エルゴノミクスゲーミングチェアのおすすめを腰痛対策・長時間プレイ向けで比較。ランバーサポート・4Dアームレスト対応モデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/chairs/ergonomic` },
  openGraph: {
    title: "エルゴノミクスゲーミングチェアおすすめ2026 | GameSpec",
    description: "腰痛対策・長時間プレイ向けエルゴノミクスチェアをランバーサポート・アームレスト・素材で比較。",
    type: "website",
    url: `${BASE_URL}/chairs/ergonomic`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "エルゴノミクスゲーミングチェアおすすめ2026 | GameSpec",
    description: "腰痛対策エルゴノミクスゲーミングチェアをスペックで比較。",
  },
};

function calcScore(c: (typeof chairs)[0]): number {
  const armrestScore = c.armrest === "4D" ? 30 : c.armrest === "3D" ? 20 : c.armrest === "2D" ? 10 : 0;
  const lumbarScore = c.lumbarSupport ? 20 : 0;
  const priceScore = Math.max(0, (120000 - c.price) / 120000) * 30;
  const newScore = c.releaseYear >= 2024 ? 20 : c.releaseYear >= 2023 ? 12 : 6;
  return armrestScore + lumbarScore + priceScore + newScore;
}

const ergonomicChairs = [...chairs]
  .filter((c) => c.type === "エルゴノミクス型" || c.recommendFor.includes("back-pain") || c.recommendFor.includes("long-session"))
  .sort((a, b) => calcScore(b) - calcScore(a));

const racingChairs = [...chairs]
  .filter((c) => c.type === "レーシング型")
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 5);

const meshChairs = [...chairs]
  .filter((c) => c.material === "メッシュ")
  .sort((a, b) => calcScore(b) - calcScore(a))
  .slice(0, 5);

function ChairCard({ chair, rank, badge }: { chair: (typeof chairs)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/chairs/${chair.slug}`}
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
          <p className="text-xs text-gray-500">{chair.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {chair.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{chair.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.type}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.material}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">アームレスト{chair.armrest}</span>
          {chair.lumbarSupport && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">ランバーサポート</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">耐荷重{chair.maxLoadWeight}kg</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{chair.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ErgonomicChairPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/chairs" className="text-gray-400 hover:text-white text-sm">ゲーミングチェア</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">エルゴノミクス・腰痛対策</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">エルゴノミクスゲーミングチェアおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          腰痛対策・長時間プレイ向けのゲーミングチェアを厳選。ランバーサポート・4Dアームレスト・メッシュ素材などの機能でスコア化。全{chairs.length}製品から掲載。
        </p>

        {/* エルゴノミクスの重要性 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">長時間ゲームで腰を守る3つのポイント</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">ランバーサポート（腰部支持）</span> — 腰のS字カーブを支えることで長時間座っても腰椎への負荷を分散。調整可能なモデルが理想。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">4Dアームレスト</span> — 高さ・前後・左右・角度の4方向調整で肘を自然な位置に置ける。手首・肩・首の疲れを大幅に軽減。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">座面の硬さと幅</span> — 柔らかすぎる座面は長時間で沈み込み姿勢が崩れる。座面幅は体格に合わせて選択。体重+10〜20kgの耐荷重があれば安心。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#ergonomic" className="text-sm text-blue-400 hover:text-blue-300">▶ エルゴノミクス・長時間向けチェア</a></li>
            {meshChairs.length > 0 && <li><a href="#mesh" className="text-sm text-blue-400 hover:text-blue-300">▶ メッシュチェア（通気性重視）</a></li>}
            {racingChairs.length > 0 && <li><a href="#racing" className="text-sm text-blue-400 hover:text-blue-300">▶ レーシング型（没入感重視）</a></li>}
            <li><a href="#faq" className="text-sm text-blue-400 hover:text-blue-300">▶ よくある質問</a></li>
          </ul>
        </nav>

        {/* エルゴノミクス */}
        <section id="ergonomic" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">エルゴノミクス・長時間向けチェア</h2>
          <p className="text-xs text-gray-500 mb-4">腰痛対策・長時間プレイ・在宅ワーク兼用に最適化されたモデル</p>
          {ergonomicChairs.length > 0 ? (
            <div className="space-y-3">
              {ergonomicChairs.slice(0, 8).map((c, i) => (
                <ChairCard key={c.slug} chair={c} rank={i + 1} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">現在このカテゴリの製品はありません。</p>
          )}
        </section>

        {/* メッシュ */}
        {meshChairs.length > 0 && (
          <section id="mesh" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">メッシュチェア（通気性重視）</h2>
            <p className="text-xs text-gray-500 mb-4">夏場・長時間のムレを防ぐメッシュ素材モデル。軽量で移動もしやすい。</p>
            <div className="space-y-3">
              {meshChairs.map((c, i) => (
                <ChairCard key={c.slug} chair={c} rank={i + 1} badge="メッシュ" />
              ))}
            </div>
          </section>
        )}

        {/* レーシング型 */}
        {racingChairs.length > 0 && (
          <section id="racing" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">レーシング型（没入感重視）</h2>
            <p className="text-xs text-gray-500 mb-4">ゲームへの没入感とデザイン重視のスタンダードなゲーミングチェア。</p>
            <div className="space-y-3">
              {racingChairs.map((c, i) => (
                <ChairCard key={c.slug} chair={c} rank={i + 1} badge="レーシング型" />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">エルゴノミクスチェアとゲーミングチェアの違いは？</h3>
              <p className="text-sm text-gray-400">エルゴノミクスチェアは人間工学に基づき長時間の正しい姿勢維持を重視して設計。ゲーミングチェア（レーシング型）は包まれる感覚と見た目を重視。近年は両者の機能を合わせたモデルも増えています。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">腰痛持ちにはどのタイプが向いている？</h3>
              <p className="text-sm text-gray-400">腰痛がある方は調整可能なランバーサポート＋4Dアームレスト搭載モデルを優先。座面の硬さも重要で、柔らかすぎず体重を適切に分散できるものを選びましょう。メッシュ素材は通気性が高く長時間でも快適です。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">予算はどれくらい必要？</h3>
              <p className="text-sm text-gray-400">30,000〜50,000円のゾーンで十分な機能を持つモデルが多数あります。10,000円台の安価なモデルは耐久性・調整機能が不足することが多い。長期間使うものなので、腰への投資として50,000円前後を目安に検討することをおすすめします。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">タイプ・素材・アームレストで自分で絞り込む</p>
          <Link href="/chairs" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングチェア {chairs.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
