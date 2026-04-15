import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウスの選び方2026【初心者向け完全ガイド】",
  description: "ゲーミングマウスの選び方を徹底解説。センサー・重さ・有線vs無線・形状・ポーリングレートなど選び方のポイントを初心者にもわかりやすく説明。予算別おすすめも紹介。",
  alternates: { canonical: `${BASE_URL}/mice/guide` },
  openGraph: {
    title: "ゲーミングマウスの選び方2026【初心者向け完全ガイド】| GameSpec",
    description: "センサー・重さ・有線vs無線など選び方のポイントを徹底解説。予算別おすすめも紹介。",
    type: "article",
    url: `${BASE_URL}/mice/guide`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

// おすすめ紹介製品
const budget = mice.find((m) => m.slug === "pulsar-xlite-v3");
const mid    = mice.find((m) => m.slug === "logicool-g-pro-x-superlight-2");
const top    = mice.find((m) => m.slug === "razer-viper-v3-pro");

function ProductCard({ mouse, label }: { mouse: (typeof mice)[0]; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block">{label}</span>
      <h3 className="text-sm font-bold text-white mb-1">{mouse.brand} {mouse.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.sensor}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mouse.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/mice/${mouse.slug}`}
          className="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all"
        >
          スペックを見る
        </Link>
        <a
          href={mouse.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs bg-orange-600 hover:bg-orange-500 text-white py-2 rounded-lg transition-all"
        >
          Amazonで見る
        </a>
      </div>
    </div>
  );
}

export default function MiceGuidePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">選び方ガイド</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウスの選び方2026</h1>
        <p className="text-sm text-gray-400 mb-8">初めてゲーミングマウスを買う方・買い替えを検討している方向けに、失敗しない選び方を解説します。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#sensor" className="text-sm text-blue-400 hover:text-blue-300">▶ ① センサー — 精度を決める最重要スペック</a></li>
            <li><a href="#weight" className="text-sm text-blue-400 hover:text-blue-300">▶ ② 重さ — 軽いほど良いのか？</a></li>
            <li><a href="#connection" className="text-sm text-blue-400 hover:text-blue-300">▶ ③ 有線 vs 無線</a></li>
            <li><a href="#shape" className="text-sm text-blue-400 hover:text-blue-300">▶ ④ 形状 — 手の形に合わせる</a></li>
            <li><a href="#polling" className="text-sm text-blue-400 hover:text-blue-300">▶ ⑤ ポーリングレート</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ 予算別おすすめ</a></li>
          </ul>
        </nav>

        {/* センサー */}
        <section id="sensor" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">① センサー — 精度を決める最重要スペック</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            センサーはマウスの動きを読み取る部品で、精度に直結します。現在の競技標準は <strong className="text-white">PAW3395・PAW3950・HERO 2</strong> の3種類です。この3つのどれかが搭載されていれば、センサー起因でエイムが狂うことはまずありません。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">センサー早見表</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold shrink-0">◎</span><span className="text-gray-300"><strong className="text-white">PAW3395 / PAW3950 / HERO 2 / Focus Pro 35K</strong> — 競技標準。迷ったらこれ。</span></li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold shrink-0">○</span><span className="text-gray-300"><strong className="text-white">PAW3370 / HERO 25K / Focus Pro 30K</strong> — 十分な性能。コスパ重視向き。</span></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 font-bold shrink-0">△</span><span className="text-gray-300">それ以外 — カジュアル用途には問題なし。競技には非推奨。</span></li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">※ DPIの数値（16000・32000など）は実用上ほぼ差がありません。センサーの種類を確認することが重要です。</p>
        </section>

        {/* 重さ */}
        <section id="weight" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">② 重さ — 軽いほど良いのか？</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            競技シーンでは<strong className="text-white">60〜70g以下</strong>が主流です。軽いマウスは素早いエイム修正がしやすく、長時間プレイでも疲れにくいメリットがあります。ただし軽すぎると（45g以下）クリックが軽くなり、誤クリックが増えることも。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-400 font-bold shrink-0">〜55g</span><span className="text-gray-300">超軽量。FPS上級者・高感度向け。</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 font-bold shrink-0">55〜70g</span><span className="text-gray-300"><strong className="text-white">競技の標準域。</strong> 迷ったらこのレンジを選ぶべき。</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 font-bold shrink-0">70〜90g</span><span className="text-gray-300">標準的な重さ。安定感があり初心者にも扱いやすい。</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 font-bold shrink-0">90g〜</span><span className="text-gray-300">重め。多ボタン・MMO向けモデルに多い。FPSには不向き。</span></li>
            </ul>
          </div>
        </section>

        {/* 有線 vs 無線 */}
        <section id="connection" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">③ 有線 vs 無線</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            2024年以降、プロの多くが<strong className="text-white">2.4GHz無線</strong>に移行しています。現代のゲーミング無線は有線と遅延差がほぼゼロで、ケーブルドラッグがない分むしろ有利とも言われます。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">有線</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 充電不要</li>
                <li>✓ 価格が安い</li>
                <li>✗ ケーブルドラッグあり</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">無線（2.4GHz）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ ケーブルドラッグなし</li>
                <li>✓ 遅延はほぼ有線と同等</li>
                <li>✗ 価格が高め・充電が必要</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">※ Bluetooth接続のゲーミングマウスは遅延が大きく競技には不向きです。</p>
        </section>

        {/* 形状 */}
        <section id="shape" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">④ 形状 — 手の形に合わせる</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            どんなに高性能なセンサーでも、手に合わない形状では本領を発揮できません。大きく2種類あります。
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">左右対称（シンメトリカル）</p>
              <p className="text-xs text-gray-400">左右どちらの手でも使える形状。持ち方を選ばず汎用性が高い。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">エルゴノミクス</p>
              <p className="text-xs text-gray-400">右手専用の人間工学設計。手にフィットしやすく長時間でも疲れにくい。</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            握り方は<strong className="text-white">かぶせ持ち・つまみ持ち・つかみ持ち</strong>の3種類があり、握り方によって相性の良い形状が変わります。実際に店頭で触って確認できれば理想的です。
          </p>
        </section>

        {/* ポーリングレート */}
        <section id="polling" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">⑤ ポーリングレート</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            マウスの動きをPCに報告する頻度です。数値が高いほど動きが滑らかになります。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-gray-400 font-bold shrink-0">125Hz</span><span className="text-gray-400">旧世代。現在のゲーミングマウスでは見かけない。</span></li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 font-bold shrink-0">1000Hz</span><span className="text-gray-300">現在の標準。これで十分な場面がほとんど。</span></li>
              <li className="flex items-start gap-2"><span className="text-green-400 font-bold shrink-0">2000〜4000Hz</span><span className="text-gray-300"><strong className="text-white">最新世代の競技標準。</strong> 高fpsモニターとの相性が良い。</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 font-bold shrink-0">8000Hz</span><span className="text-gray-300">超高精度。CPU負荷が上がるため環境を選ぶ。</span></li>
            </ul>
          </div>
        </section>

        {/* 予算別おすすめ */}
        <section id="budget" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">予算別おすすめ</h2>
          <div className="space-y-4">
            {budget && <ProductCard mouse={budget} label="〜1万円 コスパ最強" />}
            {mid    && <ProductCard mouse={mid}    label="1〜2万円 定番・安心" />}
            {top    && <ProductCard mouse={top}    label="2万円以上 プロ仕様" />}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-300 mb-1">スペックで細かく比較したい方はこちら</p>
          <p className="text-xs text-gray-500 mb-4">全{mice.length}製品を重さ・価格・センサーで絞り込み可能</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mice/ranking" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              おすすめランキングを見る
            </Link>
            <Link href="/mice" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              全製品から絞り込む
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
