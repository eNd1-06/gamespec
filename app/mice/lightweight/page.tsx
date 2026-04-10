import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "軽いゲーミングマウスおすすめ2026【60g以下・超軽量モデル比較】",
  description: "軽量ゲーミングマウスのおすすめを60g以下・70g以下に分けて比較。APEX・FPS向けの超軽量モデルから無線軽量マウスまでスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/mice/lightweight` },
  openGraph: {
    title: "軽いゲーミングマウスおすすめ2026 | GameSpec",
    description: "60g以下・70g以下の軽量ゲーミングマウスをスペックで比較。APEX・FPS向け超軽量モデルを厳選。",
    type: "website",
    url: `${BASE_URL}/mice/lightweight`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "軽いゲーミングマウスおすすめ2026 | GameSpec",
    description: "60g以下・70g以下の軽量ゲーミングマウスをスペックで比較。",
  },
};

const ultraLight = [...mice]
  .filter((m) => m.weight <= 60)
  .sort((a, b) => a.weight - b.weight);

const light = [...mice]
  .filter((m) => m.weight > 60 && m.weight <= 70)
  .sort((a, b) => a.weight - b.weight);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function MouseCard({ mouse, rank }: { mouse: (typeof mice)[0]; rank?: number }) {
  return (
    <Link
      href={`/mice/${mouse.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      {rank !== undefined && (
        <div
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
          style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}
        >
          {rank}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{mouse.brand}</p>
          {mouse.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{mouse.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-bold">{mouse.weight}g</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate.toLocaleString()}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function LightweightMousePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">軽量マウス</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">軽いゲーミングマウスおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          60g以下の超軽量モデルと70g以下の軽量モデルに分けて掲載。全{mice.length}製品中、超軽量（〜60g）{ultraLight.length}製品・軽量（61〜70g）{light.length}製品を重さ順で比較できます。
        </p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#ultralight" className="text-sm text-blue-400 hover:text-blue-300">▶ 超軽量マウス（60g以下）</a></li>
            <li><a href="#light" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量マウス（61〜70g）</a></li>
            <li><a href="#howto" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量マウスの選び方</a></li>
          </ul>
        </nav>

        {/* 超軽量 */}
        <section id="ultralight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">超軽量マウス（60g以下）</h2>
          <p className="text-xs text-gray-500 mb-4">60g以下は「超軽量」クラス。APEX・Valorantのトッププロが最も多く使用するゾーン。</p>
          {ultraLight.length > 0 ? (
            <div className="space-y-3">
              {ultraLight.map((mouse, i) => (
                <MouseCard key={mouse.slug} mouse={mouse} rank={i + 1} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">現在このカテゴリの製品はありません。</p>
          )}
        </section>

        {/* 軽量 */}
        <section id="light" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量マウス（61〜70g）</h2>
          <p className="text-xs text-gray-500 mb-4">61〜70gは「軽量」クラス。多機能ボタンやRGBを搭載しながらも軽さを両立したモデルが揃う。</p>
          {light.length > 0 ? (
            <div className="space-y-3">
              {light.map((mouse, i) => (
                <MouseCard key={mouse.slug} mouse={mouse} rank={i + 1} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">現在このカテゴリの製品はありません。</p>
          )}
        </section>

        {/* 選び方 */}
        <section id="howto" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">軽量マウスの選び方</h2>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">軽量化の方式に注目する</h3>
              <p>ハニカム（穴あき）構造は軽くなる代わりに内部にホコリが入りやすい。ソリッド（穴なし）で軽いモデルは設計・素材が高度なため価格が上がる傾向があります。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">60g以下が必ず良いわけではない</h3>
              <p>軽すぎるマウスはコントロールが難しくなる場合も。手の大きさや持ち方によって最適な重さは異なります。60〜70gが最も汎用性が高いとされています。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">無線でも軽量モデルが増えている</h3>
              <p>かつては有線のほうが軽量でしたが、現在は無線でも60g以下のモデルが多数あります。コードのドラッグがない分、操作感は無線のほうが軽く感じることもあります。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/mice/apex" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">APEXおすすめマウス</p>
            <p className="text-xs text-gray-400">APEX向け軽量モデルを見る</p>
          </Link>
          <Link href="/mice/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全製品のおすすめ順を見る</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">重さ・価格・接続方式で自分で絞り込む</p>
          <Link href="/mice" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウス {mice.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
