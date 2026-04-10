import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "APEXにおすすめのゲーミングマウス2026【軽量・低遅延・プロ使用率】",
  description: "APEX Legends向けゲーミングマウスのおすすめを厳選紹介。軽量50〜70g・高ポーリングレート・無線対応モデルをスペックデータで比較。プロゲーマー使用率も掲載。",
  alternates: { canonical: `${BASE_URL}/mice/apex` },
  openGraph: {
    title: "APEXにおすすめのゲーミングマウス2026 | GameSpec",
    description: "APEX Legends向け軽量ゲーミングマウスをスペックで比較。50〜70g・高ポーリングレート・無線対応モデルを厳選。",
    type: "website",
    url: `${BASE_URL}/mice/apex`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "APEXにおすすめのゲーミングマウス2026 | GameSpec",
    description: "APEX Legends向け軽量ゲーミングマウスをスペックで比較。",
  },
};

// APEX向け: recommendForにapexが含まれるもの、または軽量FPS向けモデル
const apexMice = [...mice]
  .filter((m) => m.recommendFor.includes("apex") || m.recommendFor.includes("fps"))
  .sort((a, b) => {
    // 軽さ優先、次にポーリングレート
    const scoreA = (120 - a.weight) * 2 + Math.min(a.pollingRate / 1000, 8);
    const scoreB = (120 - b.weight) * 2 + Math.min(b.pollingRate / 1000, 8);
    return scoreB - scoreA;
  })
  .slice(0, 10);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

export default function ApexMousePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">APEX向けおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">APEXにおすすめのゲーミングマウス2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX Legendsで勝つには「軽さ・低遅延・高ポーリングレート」が重要。
          FPS・APEX向けのrecommendForタグが付いたモデルを軽さとポーリングレートで総合スコア化し厳選しました。全{mice.length}製品中{apexMice.length}製品を掲載。
        </p>

        {/* APEX向けマウスの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">APEXに最適なマウスの3条件</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">重さ70g以下</span> — 長時間のエイム操作で腕の疲れを軽減。50〜60gの超軽量モデルはAPEXプロにも多い。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">1000Hz以上のポーリングレート</span> — 入力の応答速度がフレームレートに直結。4000Hz・8000Hzモデルなら遅延をほぼゼロに近づけられる。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">左右対称形状（シンメトリカル）</span> — APEXは激しいADSとトラッキングの連続。持ち替えても安定するシンメトリカル形状が定番。</span>
            </li>
          </ul>
        </section>

        {/* ランキング */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-1">APEX向けマウス おすすめランキング</h2>
          <p className="text-xs text-gray-500 mb-4">軽さとポーリングレートを重視したスコアで順位付け</p>
          <div className="space-y-3">
            {apexMice.map((mouse, i) => {
              const weightLabel =
                mouse.weight <= 55 ? "超軽量" : mouse.weight <= 70 ? "軽量" : "標準";
              const rank = i + 1;
              return (
                <Link
                  key={mouse.slug}
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
                      {mouse.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{mouse.name}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{mouse.weight}g · {weightLabel}</span>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate.toLocaleString()}Hz</span>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXでは有線・無線どちらがいい？</h3>
              <p className="text-sm text-gray-400">2.4GHzワイヤレス（LogicoolのLIGHTSPEED、RazerのHyperSpeed等）は有線と同等の遅延性能です。コードの引っかかりがない分、無線のほうが操作しやすいと感じるプロも多いです。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXに重いマウスはNG？</h3>
              <p className="text-sm text-gray-400">絶対NGではありませんが、90g超えは長時間プレイで腕が疲れやすく、咄嗟のエイム修正に影響します。まず70g以下を試してみることをおすすめします。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">ポーリングレート8000Hzは必要？</h3>
              <p className="text-sm text-gray-400">現状、多くのプロは1000〜2000Hzで十分な結果を出しています。8000Hzはフレームレートが240fps以上ある環境で効果を実感しやすいです。まずは1000Hzのモデルから始めましょう。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">自分で細かく絞り込みたい方はこちら</p>
          <Link href="/mice" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウス {mice.length}製品をすべて見る →
          </Link>
        </div>

        {/* SEOテキスト */}
        <section className="mt-10 pt-8 border-t border-gray-800 text-sm text-gray-500 space-y-3">
          <h2 className="text-base font-bold text-gray-300">APEXにおすすめのマウスについて</h2>
          <p>APEX Legendsは高フレームレート・高速エイムが求められるFPSゲームです。プロゲーマーの多くは50〜70gの軽量マウスを使用しており、Logicool G Pro X Superlight 2・Razer Viper V3 Pro・Finalmouse Ultralight 3などが人気上位です。</p>
          <p>センサーはPAW3395・HERO 2・Focus Pro 30Kなどの高精度センサーが搭載されていれば、どれも実用上の差はほぼありません。むしろ重さと持ち方（かぶせ持ち・つかみ持ち・つまみ持ち）との相性を重視しましょう。</p>
        </section>
      </main>
    </div>
  );
}
