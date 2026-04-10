import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "60%・65%ゲーミングキーボードおすすめ2026【コンパクト・持ち運び比較】",
  description: "60%・65%コンパクトゲーミングキーボードのおすすめを有線・無線・ホットスワップ別に比較。最大マウス可動域を確保したい方向けの超コンパクトモデルをスペックデータで厳選。",
  alternates: { canonical: `${BASE_URL}/keyboards/60percent` },
  openGraph: {
    title: "60%・65%ゲーミングキーボードおすすめ2026 | GameSpec",
    description: "60%・65%コンパクトゲーミングキーボードを有線・無線・スイッチ別に比較。",
    type: "website",
    url: `${BASE_URL}/keyboards/60percent`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "60%・65%ゲーミングキーボードおすすめ2026 | GameSpec",
    description: "60%・65%コンパクトゲーミングキーボードをスペックで比較。",
  },
};

function calcScore(k: (typeof keyboards)[0]): number {
  const pollingScore = Math.min(k.pollingRate / 8000, 1) * 35;
  const actuationScore = Math.max(0, (3 - k.actuation) / 3) * 25;
  const priceScore = Math.max(0, (30000 - k.price) / 30000) * 25;
  const newScore = k.releaseYear >= 2024 ? 15 : k.releaseYear >= 2023 ? 9 : 4;
  return pollingScore + actuationScore + priceScore + newScore;
}

const compact60 = [...keyboards]
  .filter((k) => k.layout === "60%")
  .sort((a, b) => calcScore(b) - calcScore(a));

const compact65 = [...keyboards]
  .filter((k) => k.layout === "65%")
  .sort((a, b) => calcScore(b) - calcScore(a));

const wireless60 = [...compact60, ...compact65].filter((k) => k.wireless).sort((a, b) => calcScore(b) - calcScore(a)).slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "無線・有線両対応";

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
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-bold">{kb.layout}</span>
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

export default function CompactKeyboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">60%・65%コンパクト</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">60%・65%ゲーミングキーボードおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          60%（61キー前後）・65%（67〜68キー前後）の超コンパクトゲーミングキーボードを厳選。マウス可動域を最大限確保したい方向け。全{keyboards.length}製品中、60%が{compact60.length}製品・65%が{compact65.length}製品。
        </p>

        {/* 60%・65%の特徴 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">60%・65%レイアウトの特徴と違い</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-bold text-white mb-1">60%（約61キー）</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>F列・矢印キーなし</li>
                <li>最もコンパクトでマウス可動域が広い</li>
                <li>矢印キーはFnキー組み合わせで操作</li>
                <li>持ち運び・省スペース最優先の方向け</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-1">65%（約67〜68キー）</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>矢印キーが独立配置</li>
                <li>DeleteキーなどもコンパクトながらF列なし</li>
                <li>60%より使いやすく、TKLより小さい</li>
                <li>バランス重視で最も人気のコンパクトサイズ</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {compact65.length > 0 && <li><a href="#65" className="text-sm text-blue-400 hover:text-blue-300">▶ 65%キーボードおすすめ</a></li>}
            {compact60.length > 0 && <li><a href="#60" className="text-sm text-blue-400 hover:text-blue-300">▶ 60%キーボードおすすめ</a></li>}
            {wireless60.length > 0 && <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線コンパクトキーボード</a></li>}
          </ul>
        </nav>

        {compact65.length > 0 && (
          <section id="65" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">65%キーボードおすすめ</h2>
            <p className="text-xs text-gray-500 mb-4">矢印キー独立配置で使いやすさとコンパクトさを両立。コンパクト初心者にも入りやすい。</p>
            <div className="space-y-3">{compact65.map((kb, i) => <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="65%" />)}</div>
          </section>
        )}

        {compact60.length > 0 && (
          <section id="60" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">60%キーボードおすすめ</h2>
            <p className="text-xs text-gray-500 mb-4">最もコンパクト。マウス可動域を極限まで広げたい競技プレイヤー向け。</p>
            <div className="space-y-3">{compact60.map((kb, i) => <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="60%" />)}</div>
          </section>
        )}

        {wireless60.length > 0 && (
          <section id="wireless" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線コンパクトキーボード</h2>
            <p className="text-xs text-gray-500 mb-4">コンパクト＋ワイヤレスの組み合わせ。デスクをすっきりさせたい方に最適。</p>
            <div className="space-y-3">{wireless60.map((kb, i) => <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="無線" />)}</div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/keyboards/tkl" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">TKL（テンキーレス）</p>
            <p className="text-xs text-gray-400">F列・矢印キーありの87キー</p>
          </Link>
          <Link href="/keyboards/wireless" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">無線キーボード全般</p>
            <p className="text-xs text-gray-400">全レイアウトの無線モデルを見る</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">レイアウト・スイッチ・価格で自分で絞り込む</p>
          <Link href="/keyboards" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングキーボード {keyboards.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
