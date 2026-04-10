import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "無線ゲーミングマウスおすすめ2026【遅延なし・FPS向け比較】",
  description: "無線ゲーミングマウスのおすすめを2.4GHzワイヤレスモデルで比較。遅延ゼロのFPS向けワイヤレスマウスをポーリングレート・重さ・バッテリー寿命で厳選紹介。",
  alternates: { canonical: `${BASE_URL}/mice/wireless` },
  openGraph: {
    title: "無線ゲーミングマウスおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングマウスをポーリングレート・重さ・価格で比較。FPS・APEX向けワイヤレスモデルを厳選。",
    type: "website",
    url: `${BASE_URL}/mice/wireless`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "無線ゲーミングマウスおすすめ2026 | GameSpec",
    description: "2.4GHz遅延なし無線ゲーミングマウスをスペックで比較。",
  },
};

function calcScore(m: (typeof mice)[0]): number {
  const weightScore = Math.max(0, (120 - m.weight) / 80) * 30;
  const pollingScore = Math.min(m.pollingRate / 8000, 1) * 25;
  const priceScore = Math.max(0, (30000 - m.price) / 30000) * 25;
  const newScore = m.releaseYear >= 2024 ? 20 : m.releaseYear >= 2023 ? 12 : 6;
  return weightScore + pollingScore + priceScore + newScore;
}

const wirelessMice = [...mice]
  .filter((m) => m.connection === "wireless" || m.connection === "both")
  .sort((a, b) => calcScore(b) - calcScore(a));

const lightWireless = wirelessMice.filter((m) => m.weight <= 70).slice(0, 5);
const budgetWireless = [...wirelessMice]
  .filter((m) => m.price <= 12000)
  .sort((a, b) => a.price - b.price)
  .slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "無線・有線両対応";

function MouseCard({ mouse, rank, badge }: { mouse: (typeof mice)[0]; rank: number; badge?: string }) {
  const weightLabel = mouse.weight <= 55 ? "超軽量" : mouse.weight <= 70 ? "軽量" : mouse.weight <= 90 ? "標準" : "重め";
  return (
    <Link
      href={`/mice/${mouse.slug}`}
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
          <p className="text-xs text-gray-500">{mouse.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {mouse.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{mouse.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g · {weightLabel}</span>
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate.toLocaleString()}Hz</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function WirelessMousePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">無線おすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">無線ゲーミングマウスおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          2.4GHzワイヤレス対応のゲーミングマウスを総合スコアで順位付け。全{mice.length}製品中、無線対応{wirelessMice.length}製品を掲載。軽量・コスパ別にも厳選しています。
        </p>

        {/* 無線と有線の違い */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">無線ゲーミングマウスは遅延するの？</h2>
          <p className="text-sm text-gray-400 mb-3">
            2.4GHz専用受信機（USBドングル）を使うモデルは<span className="text-white font-bold">遅延がほぼ有線と同等</span>です。Logicool LIGHTSPEED・Razer HyperSpeed・SteelSeries Quantum 2.0などの独自技術は1ms以下の遅延を実現しています。
          </p>
          <p className="text-sm text-gray-400">
            Bluetoothは消費電力が低く汎用性が高い反面、遅延が数ms〜数十ms発生するためFPS・APEXの競技プレイには不向きです。ゲーム用途には必ず<span className="text-white font-bold">2.4GHz接続対応</span>を選びましょう。
          </p>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線マウス 総合おすすめランキング TOP{wirelessMice.slice(0, 10).length}</a></li>
            <li><a href="#light" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量無線マウス（70g以下）TOP5</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ コスパ無線マウス（〜12,000円）TOP5</a></li>
          </ul>
        </nav>

        {/* 総合ランキング */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">無線マウス 総合おすすめランキング</h2>
          <p className="text-xs text-gray-500 mb-4">重さ・ポーリングレート・価格・発売年を総合スコア化</p>
          <div className="space-y-3">
            {wirelessMice.slice(0, 10).map((mouse, i) => (
              <MouseCard key={mouse.slug} mouse={mouse} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 軽量無線 */}
        <section id="light" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量無線マウス（70g以下）TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">コードの引っかかりなし＋軽量で最も操作しやすいカテゴリ</p>
          <div className="space-y-3">
            {lightWireless.map((mouse, i) => (
              <MouseCard key={mouse.slug} mouse={mouse} rank={i + 1} badge="軽量無線" />
            ))}
          </div>
        </section>

        {/* コスパ無線 */}
        {budgetWireless.length > 0 && (
          <section id="budget" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">コスパ無線マウス（〜12,000円）TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">12,000円以下で買える無線ゲーミングマウスを価格順に掲載</p>
            <div className="space-y-3">
              {budgetWireless.map((mouse, i) => (
                <MouseCard key={mouse.slug} mouse={mouse} rank={i + 1} badge="コスパ◎" />
              ))}
            </div>
          </section>
        )}

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/mice/apex" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">APEXおすすめマウス</p>
            <p className="text-xs text-gray-400">APEX向け軽量モデルを見る</p>
          </Link>
          <Link href="/mice/lightweight" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">軽量マウス一覧</p>
            <p className="text-xs text-gray-400">60g以下・70g以下で絞り込む</p>
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
