import Link from "next/link";
import type { Metadata } from "next";
import { headsets } from "@/data/headsets";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "無線ゲーミングヘッドセットおすすめ2026【2.4GHz・遅延なし・FPS向け比較】",
  description: "無線ゲーミングヘッドセットのおすすめを2.4GHz・バッテリー寿命・重さ別に比較。遅延なしワイヤレスのFPS・APEX向けモデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/headsets/wireless` },
  openGraph: {
    title: "無線ゲーミングヘッドセットおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングヘッドセットを重さ・バッテリー・価格で比較。",
    type: "website",
    url: `${BASE_URL}/headsets/wireless`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "無線ゲーミングヘッドセットおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングヘッドセットをスペックで比較。",
  },
};

function calcScore(h: (typeof headsets)[0]): number {
  const weightScore = Math.max(0, (400 - h.weight) / 350) * 30;
  const batteryScore = h.batteryLife ? Math.min(h.batteryLife / 50, 1) * 25 : 0;
  const priceScore = Math.max(0, (50000 - h.price) / 50000) * 25;
  const newScore = h.releaseYear >= 2024 ? 20 : h.releaseYear >= 2023 ? 12 : 5;
  return weightScore + batteryScore + priceScore + newScore;
}

const wirelessHeadsets = [...headsets]
  .filter((h) => h.connection === "wireless" || h.connection === "both")
  .sort((a, b) => calcScore(b) - calcScore(a));

const longBattery = [...wirelessHeadsets]
  .filter((h) => h.batteryLife && h.batteryLife >= 30)
  .sort((a, b) => (b.batteryLife ?? 0) - (a.batteryLife ?? 0))
  .slice(0, 5);

const lightweight = [...wirelessHeadsets]
  .sort((a, b) => a.weight - b.weight)
  .slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "無線・有線両対応";

function HeadsetCard({ headset, rank, badge }: { headset: (typeof headsets)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/headsets/${headset.slug}`}
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
          <p className="text-xs text-gray-500">{headset.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {headset.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{headset.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">無線</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.weight}g</span>
          {headset.wirelessProtocol && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.wirelessProtocol}</span>}
          {headset.batteryLife && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">バッテリー{headset.batteryLife}h</span>}
          {headset.virtualSurround && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">バーチャルサラウンド</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{headset.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function WirelessHeadsetPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">無線おすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">無線ゲーミングヘッドセットおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          2.4GHz対応の遅延なしワイヤレスゲーミングヘッドセットを厳選。重さ・バッテリー寿命・価格でスコア化。全{headsets.length}製品中、無線対応{wirelessHeadsets.length}製品を掲載。
        </p>

        {/* 無線ヘッドセットの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">ゲーム用無線ヘッドセットを選ぶポイント</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">2.4GHz専用ドングル接続</span> — Bluetoothは遅延が大きくFPSには不向き。LIGHTSPEED・QuantumConnect・HyperX 2.4GHzなどの専用規格が低遅延でおすすめ。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">バッテリー寿命は20〜40h以上</span> — 毎日数時間プレイなら20h以上が現実的な目安。急速充電対応モデルなら切れても短時間で復旧できる。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">300g以下の軽量モデルを選ぶ</span> — ヘッドセットは重いほど長時間で首・肩が疲れる。無線モデルは電池分重くなるため、軽量化設計のものを意識して選ぼう。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線ヘッドセット 総合ランキング</a></li>
            {longBattery.length > 0 && <li><a href="#battery" className="text-sm text-blue-400 hover:text-blue-300">▶ バッテリー長持ちモデル（30h以上）</a></li>}
            <li><a href="#lightweight" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量無線ヘッドセット</a></li>
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線ヘッドセット 総合ランキング</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・バッテリー・価格・発売年を総合スコア化</p>
          <div className="space-y-3">
            {wirelessHeadsets.slice(0, 10).map((h, i) => (
              <HeadsetCard key={h.slug} headset={h} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* バッテリー長持ち */}
        {longBattery.length > 0 && (
          <section id="battery" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">バッテリー長持ちモデル（30h以上）</h2>
            <p className="text-xs text-gray-500 mb-4">毎日充電が面倒な方・長時間セッション多い方向け。バッテリー時間順に掲載。</p>
            <div className="space-y-3">
              {longBattery.map((h, i) => (
                <HeadsetCard key={h.slug} headset={h} rank={i + 1} badge={`${h.batteryLife}h`} />
              ))}
            </div>
          </section>
        )}

        {/* 軽量 */}
        <section id="lightweight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量無線ヘッドセット</h2>
          <p className="text-xs text-gray-500 mb-4">無線モデルの中で軽い順に掲載。長時間プレイでの首・肩への負担を軽減。</p>
          <div className="space-y-3">
            {lightweight.map((h, i) => (
              <HeadsetCard key={h.slug} headset={h} rank={i + 1} badge={`${h.weight}g`} />
            ))}
          </div>
        </section>

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/headsets/fps" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">FPS向けヘッドセット</p>
            <p className="text-xs text-gray-400">定位感重視モデルを見る</p>
          </Link>
          <Link href="/headsets/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">有線・無線混合で順位付け</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">重さ・接続方式・価格で自分で絞り込む</p>
          <Link href="/headsets" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングヘッドセット {headsets.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
