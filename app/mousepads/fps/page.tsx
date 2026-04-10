import Link from "next/link";
import type { Metadata } from "next";
import { mousepads } from "@/data/mousepads";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "FPS向けゲーミングマウスパッドおすすめ2026【速度系・大型・APEX向け比較】",
  description: "FPS・APEX向けゲーミングマウスパッドのおすすめを速度系・コントロール系・サイズ別に比較。ローセンシ向け大型マウスパッドをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/mousepads/fps` },
  openGraph: {
    title: "FPS向けゲーミングマウスパッドおすすめ2026 | GameSpec",
    description: "APEX・FPS向け速度系・大型ゲーミングマウスパッドを滑り感・サイズ・価格で比較。",
    type: "website",
    url: `${BASE_URL}/mousepads/fps`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "FPS向けゲーミングマウスパッドおすすめ2026 | GameSpec",
    description: "APEX・FPS向け速度系・大型ゲーミングマウスパッドをスペックで比較。",
  },
};

const fpsPads = [...mousepads]
  .filter((p) => p.recommendFor.includes("fps") || p.recommendFor.includes("apex") || p.recommendFor.includes("competitive"))
  .sort((a, b) => {
    const sizeScore = (s: typeof p.size) => ({ XXL: 5, XL: 4, L: 3, M: 2, S: 1 })[s] ?? 0;
    const p = a; // unused, needed for closure
    return sizeScore(b.size) - sizeScore(a.size);
  });

const speedPads = fpsPads.filter((p) => p.surface === "速度系").slice(0, 6);
const controlPads = fpsPads.filter((p) => p.surface === "コントロール系").slice(0, 5);
const largePads = [...mousepads]
  .filter((p) => p.size === "XL" || p.size === "XXL")
  .sort((a, b) => b.width - a.width)
  .slice(0, 6);

function PadCard({ pad, rank, badge }: { pad: (typeof mousepads)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/mousepads/${pad.slug}`}
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
          <p className="text-xs text-gray-500">{pad.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {pad.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{pad.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.size} ({pad.width}×{pad.height}mm)</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.surface}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.thickness}mm</span>
          {pad.stitchedEdge && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">縫い目あり</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{pad.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FpsMousepadPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mousepads" className="text-gray-400 hover:text-white text-sm">ゲーミングマウスパッド</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">FPS向けおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">FPS向けゲーミングマウスパッドおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX・Valorant・CS2など競技FPS向けのマウスパッドを速度系・コントロール系・大型別に掲載。全{mousepads.length}製品から厳選。
        </p>

        {/* FPS向けの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">FPS向けマウスパッドの選び方</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">速度系 vs コントロール系</span> — ローセンシ・大きくマウスを動かすプレイには速度系（滑りやすい）が向く。ハイセンシ・細かいエイム調整にはコントロール系（止まりやすい）が向く。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">XL〜XXL（ローセンシ向け）</span> — APEX・FPSのローセンシプレイヤーは1回のスワイプで手首から肘まで使うため400mm以上の横幅が必要。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">縫い目（ステッチ）有り</span> — 端がほつれにくく耐久性が上がる。毎日使うなら縫い目ありモデルが長持ちしてコスパが高い。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {speedPads.length > 0 && <li><a href="#speed" className="text-sm text-blue-400 hover:text-blue-300">▶ 速度系マウスパッド（ローセンシ向け）</a></li>}
            {controlPads.length > 0 && <li><a href="#control" className="text-sm text-blue-400 hover:text-blue-300">▶ コントロール系マウスパッド（ハイセンシ向け）</a></li>}
            {largePads.length > 0 && <li><a href="#large" className="text-sm text-blue-400 hover:text-blue-300">▶ 大型マウスパッド（XL・XXL）</a></li>}
          </ul>
        </nav>

        {/* 速度系 */}
        {speedPads.length > 0 && (
          <section id="speed" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">速度系マウスパッド（ローセンシ向け）</h2>
            <p className="text-xs text-gray-500 mb-4">滑りが速くマウスを大きく動かすプレイスタイルに。APEXのローセンシプレイヤーに人気。</p>
            <div className="space-y-3">
              {speedPads.map((p, i) => <PadCard key={p.slug} pad={p} rank={i + 1} badge="速度系" />)}
            </div>
          </section>
        )}

        {/* コントロール系 */}
        {controlPads.length > 0 && (
          <section id="control" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">コントロール系マウスパッド（ハイセンシ向け）</h2>
            <p className="text-xs text-gray-500 mb-4">止まりやすく細かいエイム調整がしやすい。Valorantのスタティックエイムにもおすすめ。</p>
            <div className="space-y-3">
              {controlPads.map((p, i) => <PadCard key={p.slug} pad={p} rank={i + 1} badge="コントロール系" />)}
            </div>
          </section>
        )}

        {/* 大型 */}
        {largePads.length > 0 && (
          <section id="large" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">大型マウスパッド（XL・XXL）</h2>
            <p className="text-xs text-gray-500 mb-4">横幅400mm以上のXL〜XXLサイズ。キーボードを乗せても広々使えるデスクマット代わりにも。</p>
            <div className="space-y-3">
              {largePads.map((p, i) => <PadCard key={p.slug} pad={p} rank={i + 1} badge={p.size} />)}
            </div>
          </section>
        )}

        {/* 関連リンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">サイズ・滑り感・価格で自分で絞り込む</p>
          <Link href="/mousepads" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウスパッド {mousepads.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
