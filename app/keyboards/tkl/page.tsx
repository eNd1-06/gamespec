import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "テンキーレスキーボードおすすめ2026【TKL・ゲーミング比較】",
  description: "テンキーレス（TKL）ゲーミングキーボードのおすすめを有線・無線・ホットスワップ別に比較。赤軸・光学式・磁気式スイッチのTKLモデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/keyboards/tkl` },
  openGraph: {
    title: "テンキーレスキーボードおすすめ2026 | GameSpec",
    description: "TKLゲーミングキーボードを有線・無線・スイッチ別に比較。ホットスワップ対応モデルも掲載。",
    type: "website",
    url: `${BASE_URL}/keyboards/tkl`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "テンキーレスキーボードおすすめ2026 | GameSpec",
    description: "TKLゲーミングキーボードを有線・無線・スイッチ別に比較。",
  },
};

function calcScore(k: (typeof keyboards)[0]): number {
  const pollingScore = Math.min(k.pollingRate / 8000, 1) * 30;
  const actuationScore = Math.max(0, (3 - k.actuation) / 3) * 25;
  const priceScore = Math.max(0, (30000 - k.price) / 30000) * 25;
  const newScore = k.releaseYear >= 2024 ? 20 : k.releaseYear >= 2023 ? 12 : 6;
  return pollingScore + actuationScore + priceScore + newScore;
}

const tklKeyboards = [...keyboards]
  .filter((k) => k.layout === "テンキーレス")
  .sort((a, b) => calcScore(b) - calcScore(a));

const wirelessTkl = tklKeyboards.filter((k) => k.wireless).slice(0, 5);
const hotswapTkl = tklKeyboards.filter((k) => k.hotswap).slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function KeyboardCard({ kb, rank, badge }: { kb: (typeof keyboards)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/keyboards/${kb.slug}`}
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
          <p className="text-xs text-gray-500">{kb.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {kb.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{kb.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">TKL</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.switchName}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(kb.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.pollingRate.toLocaleString()}Hz</span>
          {kb.hotswap && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ホットスワップ</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{kb.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function TklKeyboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">テンキーレス（TKL）</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">テンキーレスキーボードおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          テンキーなし（TKL・87キー）のゲーミングキーボードを厳選。マウス可動域が広がりFPS・APEXに最適なサイズ。全{keyboards.length}製品中、TKLモデル{tklKeyboards.length}製品を掲載。
        </p>

        {/* TKLを選ぶ理由 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">テンキーレスを選ぶ3つの理由</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">マウス可動域が広がる</span> — テンキーがない分キーボードを左に寄せられ、マウスを右側に広く使える。FPS・APEXで低感度ローセンシプレイヤーに特に有効。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">フルサイズと同じキー構成</span> — F1〜F12・矢印キー・Deleteキーをそのまま使える。60%・65%より日常業務もしやすい。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">コンパクトで持ち運びやすい</span> — ゲーム大会・友人宅への持ち込みにも便利。デスクのスペースも節約できる。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ TKL総合おすすめランキング</a></li>
            {wirelessTkl.length > 0 && <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線TKLキーボード TOP5</a></li>}
            {hotswapTkl.length > 0 && <li><a href="#hotswap" className="text-sm text-blue-400 hover:text-blue-300">▶ ホットスワップ対応 TOP5</a></li>}
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">TKL総合おすすめランキング</h2>
          <p className="text-xs text-gray-500 mb-4">ポーリングレート・アクチュエーションポイント・価格・発売年を総合スコア化</p>
          <div className="space-y-3">
            {tklKeyboards.slice(0, 10).map((kb, i) => (
              <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 無線TKL */}
        {wirelessTkl.length > 0 && (
          <section id="wireless" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線TKLキーボード TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">ワイヤレス対応のTKLモデル。コードの煩わしさなくゲームに集中できる。</p>
            <div className="space-y-3">
              {wirelessTkl.map((kb, i) => (
                <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="無線" />
              ))}
            </div>
          </section>
        )}

        {/* ホットスワップ */}
        {hotswapTkl.length > 0 && (
          <section id="hotswap" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">ホットスワップ対応 TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">スイッチを工具なしで交換可能。好みの打鍵感にカスタマイズしたい方向け。</p>
            <div className="space-y-3">
              {hotswapTkl.map((kb, i) => (
                <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="ホットスワップ" />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">TKLと75%の違いは？</h3>
              <p className="text-sm text-gray-400">TKL（87キー）はF列・矢印キーを独立配置しフルサイズと同じ操作感。75%（84キー前後）はさらにコンパクトで矢印キーが右端に詰まっている。持ち運び重視なら75%、慣れ親しんだレイアウトならTKLがおすすめ。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">FPS向けスイッチはどれがいい？</h3>
              <p className="text-sm text-gray-400">アクチュエーションポイントが浅い光学式・磁気式スイッチ（0.1〜1.5mm）が最速入力に有利。赤軸（リニア）はキーを最後まで押さず反応させやすくFPS向き。青軸（クリッキー）はクリック音が大きくゲームには不向きな場合も。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スイッチ・接続方式・価格で自分で絞り込む</p>
          <Link href="/keyboards" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングキーボード {keyboards.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
