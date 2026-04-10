import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "無線ゲーミングキーボードおすすめ2026【遅延なし・FPS向け・TKL比較】",
  description: "無線ゲーミングキーボードのおすすめを2.4GHz・TKL・ホットスワップ別に比較。遅延なしワイヤレスのFPS向けモデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/keyboards/wireless` },
  openGraph: {
    title: "無線ゲーミングキーボードおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングキーボードをレイアウト・スイッチ・価格で比較。",
    type: "website",
    url: `${BASE_URL}/keyboards/wireless`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "無線ゲーミングキーボードおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングキーボードをスペックで比較。",
  },
};

function calcScore(k: (typeof keyboards)[0]): number {
  const pollingScore = Math.min(k.pollingRate / 8000, 1) * 35;
  const actuationScore = Math.max(0, (3 - k.actuation) / 3) * 25;
  const priceScore = Math.max(0, (30000 - k.price) / 30000) * 20;
  const batteryScore = k.batteryLife ? Math.min(k.batteryLife / 200, 1) * 10 : 0;
  const newScore = k.releaseYear >= 2024 ? 10 : k.releaseYear >= 2023 ? 6 : 3;
  return pollingScore + actuationScore + priceScore + batteryScore + newScore;
}

const wirelessKbs = [...keyboards]
  .filter((k) => k.wireless)
  .sort((a, b) => calcScore(b) - calcScore(a));

const wirelessTkl = wirelessKbs.filter((k) => k.layout === "テンキーレス").slice(0, 5);
const wirelessCompact = wirelessKbs.filter((k) => k.layout !== "テンキーレス" && k.layout !== "フルサイズ").slice(0, 5);

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
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">無線</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.layout}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.switchName}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.pollingRate.toLocaleString()}Hz</span>
          {kb.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">バッテリー{kb.batteryLife}h</span>}
          {kb.hotswap && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ホットスワップ</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{kb.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function WirelessKeyboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">無線おすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">無線ゲーミングキーボードおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          2.4GHzワイヤレス対応のゲーミングキーボードをポーリングレート・レイアウト・スイッチでスコア化して厳選。全{keyboards.length}製品中、無線対応{wirelessKbs.length}製品を掲載。
        </p>

        {/* ゲーム用無線キーボードの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">ゲーム用に無線キーボードを選ぶポイント</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">2.4GHz専用ドングル接続</span> — Bluetoothより遅延が少なく安定。LIGHTSPEED・HyperSpeed・Quantum 2.0などのブランド独自無線規格が競技向き。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">バッテリー寿命は40h以上</span> — 毎日数時間プレイするなら40〜100h以上が現実的。RGB点灯時はバッテリー消費が増えるので注意。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">有線モードも使えるモデルが安心</span> — バッテリー切れ時に有線で続けられる両対応モデルなら充電しながらプレイ可能。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線キーボード 総合おすすめランキング</a></li>
            {wirelessTkl.length > 0 && <li><a href="#tkl" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線TKL（テンキーレス）TOP5</a></li>}
            {wirelessCompact.length > 0 && <li><a href="#compact" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線コンパクト（75%・65%・60%）TOP5</a></li>}
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線キーボード 総合おすすめランキング</h2>
          <p className="text-xs text-gray-500 mb-4">ポーリングレート・アクチュエーション・価格・バッテリーを総合スコア化</p>
          <div className="space-y-3">
            {wirelessKbs.slice(0, 10).map((kb, i) => (
              <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 無線TKL */}
        {wirelessTkl.length > 0 && (
          <section id="tkl" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線TKL（テンキーレス）TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">FPS・APEXプレイヤーに最も人気のサイズ。マウス可動域確保＋コードレスの最強構成。</p>
            <div className="space-y-3">
              {wirelessTkl.map((kb, i) => (
                <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="無線TKL" />
              ))}
            </div>
          </section>
        )}

        {/* コンパクト無線 */}
        {wirelessCompact.length > 0 && (
          <section id="compact" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線コンパクト（75%・65%・60%）TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">さらなるマウス可動域確保や持ち運びを優先したい方向け。</p>
            <div className="space-y-3">
              {wirelessCompact.map((kb, i) => (
                <KeyboardCard key={kb.slug} kb={kb} rank={i + 1} badge="コンパクト" />
              ))}
            </div>
          </section>
        )}

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/keyboards/tkl" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">TKLキーボード一覧</p>
            <p className="text-xs text-gray-400">有線・無線のTKLを全部見る</p>
          </Link>
          <Link href="/keyboards/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全キーボードのおすすめ順を見る</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">スイッチ・レイアウト・価格で自分で絞り込む</p>
          <Link href="/keyboards" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングキーボード {keyboards.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
