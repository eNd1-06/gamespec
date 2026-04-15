import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングモニターの選び方2026【初心者向け完全ガイド】",
  description: "ゲーミングモニターの選び方を徹底解説。解像度・リフレッシュレート・パネルタイプ・サイズなど失敗しない選び方のポイントを初心者にもわかりやすく説明。予算別おすすめも紹介。",
  alternates: { canonical: `${BASE_URL}/monitors/guide` },
  openGraph: {
    title: "ゲーミングモニターの選び方2026【初心者向け完全ガイド】| GameSpec",
    description: "解像度・リフレッシュレート・パネルタイプなど選び方のポイントを徹底解説。予算別おすすめも紹介。",
    type: "article",
    url: `${BASE_URL}/monitors/guide`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

const budget = monitors.find((m) => m.slug === "aoc-24g2");
const mid    = monitors.find((m) => m.slug === "lg-27gp850-b");
const top    = monitors.find((m) => m.slug === "lg-27gr95qe");

function ProductCard({ monitor, label }: { monitor: (typeof monitors)[0]; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block">{label}</span>
      <h3 className="text-sm font-bold text-white mb-1">{monitor.brand} {monitor.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.resolution}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.refreshRate}Hz</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.panelType}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{monitor.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/monitors/${monitor.slug}`}
          className="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all"
        >
          スペックを見る
        </Link>
        <a
          href={monitor.amazonUrl}
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

export default function MonitorsGuidePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">選び方ガイド</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングモニターの選び方2026</h1>
        <p className="text-sm text-gray-400 mb-8">初めてゲーミングモニターを買う方・買い替えを検討している方向けに、失敗しない選び方を解説します。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#resolution" className="text-sm text-blue-400 hover:text-blue-300">▶ ① 解像度 — 1080p・1440p・4Kの違い</a></li>
            <li><a href="#refresh" className="text-sm text-blue-400 hover:text-blue-300">▶ ② リフレッシュレート — 144Hz・240Hz・360Hz</a></li>
            <li><a href="#panel" className="text-sm text-blue-400 hover:text-blue-300">▶ ③ パネルタイプ — IPS・TN・VA・OLED</a></li>
            <li><a href="#size" className="text-sm text-blue-400 hover:text-blue-300">▶ ④ サイズ — 24・27・32インチの選び方</a></li>
            <li><a href="#response" className="text-sm text-blue-400 hover:text-blue-300">▶ ⑤ 応答速度とSync技術</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ 予算別おすすめ</a></li>
          </ul>
        </nav>

        {/* 解像度 */}
        <section id="resolution" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">① 解像度 — 1080p・1440p・4Kの違い</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            解像度はゲーム映像の鮮明さに直結します。解像度が高いほどGPUへの負荷も上がるため、<strong className="text-white">自分のGPU性能に合った解像度</strong>を選ぶことが大切です。
          </p>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">FPS・競技向け</span>
                <p className="text-sm font-bold text-white">1080p（Full HD）</p>
              </div>
              <p className="text-xs text-gray-400">GPU負荷が最も低く、高リフレッシュレート（240Hz〜360Hz）を出しやすい。FPS・APEXなど競技ゲームで高fps重視なら今でも現役。ただし27インチ以上では画像が粗く見える。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">現在の主流・バランス最良</span>
                <p className="text-sm font-bold text-white">1440p（QHD / WQHD）</p>
              </div>
              <p className="text-xs text-gray-400">性能と画質のバランスが最も優れた解像度。RTX 3060以上のGPUなら240Hzも狙える。2026年の競技シーンでもメインストリームになりつつある。<strong className="text-white">迷ったらこれ。</strong></p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-yellow-700 text-white px-2 py-0.5 rounded">映像・クリエイター向け</span>
                <p className="text-sm font-bold text-white">4K（Ultra HD）</p>
              </div>
              <p className="text-xs text-gray-400">圧倒的な映像美。ただしFPSゲームで高リフレッシュレートを維持するにはRTX 4080以上が必要。競技目的には基本的に不向き。RPG・映像鑑賞・クリエイター作業に最適。</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">※ RTX 4060〜4070ならまず1440p / 240Hzを目指すのがベストコスパです。</p>
        </section>

        {/* リフレッシュレート */}
        <section id="refresh" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">② リフレッシュレート — 144Hz・240Hz・360Hz</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            1秒間に画面を何回書き換えるかを表す数値です。数値が高いほど映像が滑らかになり、<strong className="text-white">動きの激しいFPSゲームで敵を捉えやすく</strong>なります。フレームレートとセットで考えることが重要です。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gray-500 font-bold shrink-0 w-16">144Hz</span>
                <span className="text-gray-300">ゲーミングモニターの入門ライン。60Hzから買い替えると劇的に滑らかになる。コスパ重視ならここから。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold shrink-0 w-16">165〜180Hz</span>
                <span className="text-gray-300">144Hzと大差ないが、価格差も少ないため同価格帯なら優先的に選びたい。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold shrink-0 w-16">240Hz</span>
                <span className="text-gray-300"><strong className="text-white">競技ゲームの現在標準。</strong> APEXやValorantなど競技FPS勢は最低限ここを目指したい。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0 w-16">360Hz+</span>
                <span className="text-gray-300">プロゲーマー・上位ランク帯向け。240Hzとの差は体感しにくいが、コンマ1秒の勝負には有利。</span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">※ モニターの性能を活かすにはゲーム内のfpsも同等以上出せるPCスペックが必要です。</p>
        </section>

        {/* パネルタイプ */}
        <section id="panel" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">③ パネルタイプ — IPS・TN・VA・OLED</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            パネルは映像品質・応答速度・価格に大きく影響します。<strong className="text-white">現在のゲーミングモニターはIPS系が主流</strong>で、OLEDが高級モデルを席巻しつつあります。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">IPS / Fast IPS / Nano IPS</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">最もおすすめ</span>
              </div>
              <p className="text-xs text-gray-400">色再現性と応答速度のバランスが良い。視野角が広く、斜めから見ても色が変わりにくい。Fast IPS・Nano IPSはさらに応答速度を高めたバリエーション。ゲーミングモニターの定番。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">TN</p>
              <p className="text-xs text-gray-400">かつては最速の応答速度が強みだったが、現在はIPS系に追い抜かれた。色が悪く視野角も狭いため、よほどの理由がない限り選ぶ必要はない旧世代パネル。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">VA</p>
              <p className="text-xs text-gray-400">高コントラスト比で黒が締まって見える。映画・RPGでは映えるが、残像（スミアリング）が出やすくFPS競技には不向き。湾曲モニターに多いパネル。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">OLED / QD-OLED</p>
                <span className="text-xs bg-yellow-700 text-white px-2 py-0.5 rounded">最高性能・高価格</span>
              </div>
              <p className="text-xs text-gray-400">応答速度0.03ms、完全な黒表現で映像美が圧倒的。競技性能も最高クラス。ただし焼き付きリスクがあり、価格も高め（7万円〜）。本気でゲームに取り組むなら検討する価値あり。</p>
            </div>
          </div>
        </section>

        {/* サイズ */}
        <section id="size" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">④ サイズ — 24・27・32インチの選び方</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            モニターのサイズは<strong className="text-white">視座からの距離と用途</strong>で決めます。大きければいいわけではなく、FPS競技では画面全体を素早く認識できる適切なサイズが有利です。
          </p>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">24〜24.5インチ</p>
              <p className="text-xs text-gray-400 mb-1">FPS競技の定番サイズ。視野全体を見渡しやすく、1080p解像度でも十分なドット密度がある。プロの使用率が最も高いサイズ帯。デスクスペースが限られている方にも最適。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">27インチ</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">現在の主流</span>
              </div>
              <p className="text-xs text-gray-400">競技性とゲーム体験のバランスが最も良いサイズ。1440pとの相性が抜群で、普段使い・マルチ用途にも使いやすい。迷ったらこのサイズを選ぶのがおすすめ。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">32インチ以上</p>
              <p className="text-xs text-gray-400">没入感が高くRPG・シミュレーションゲームに最適。FPS競技には視野が広すぎて不利になることも。4K解像度か1440p以上を推奨。作業用・テレビ代わりとしても活躍。</p>
            </div>
          </div>
        </section>

        {/* 応答速度・Sync */}
        <section id="response" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">⑤ 応答速度とSync技術</h2>

          <h3 className="text-base font-bold text-white mb-2">応答速度（GTG）</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            ピクセルが色を変えるまでの時間です。<strong className="text-white">1ms以下が競技向けの目安</strong>。現在の主流IPSパネルはほぼ1ms以下を達成しており、実際の体感差は小さいです。カタログスペックより実測値（rtings.com掲載）を参考にするのが確実です。
          </p>

          <h3 className="text-base font-bold text-white mb-2">G-Sync / FreeSync（可変リフレッシュレート）</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            GPUとモニターの描画タイミングを同期させる技術です。画面のティアリング（横線ズレ）やスタッタリング（引っかかり）を防ぎます。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">G-Sync（NVIDIA）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ NVIDIAのGPUに最適化</li>
                <li>✓ 品質保証が高い</li>
                <li>✗ 対応モニターが高価</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">FreeSync（AMD）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ AMD GPUに対応</li>
                <li>✓ 対応モニターが安価</li>
                <li>△ NVIDIAでも動作するものが多い</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">※ NVIDIAのGPUでFreeSync対応モニターを使う場合、「G-Sync Compatible」として動作するモデルが多くあります。</p>
        </section>

        {/* 予算別おすすめ */}
        <section id="budget" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">予算別おすすめ</h2>
          <div className="space-y-4">
            {budget && <ProductCard monitor={budget} label="〜3万円 入門・コスパ最強" />}
            {mid    && <ProductCard monitor={mid}    label="3〜5万円 定番・ベストバランス" />}
            {top    && <ProductCard monitor={top}    label="5万円以上 OLEDの最高画質" />}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-300 mb-1">スペックで細かく比較したい方はこちら</p>
          <p className="text-xs text-gray-500 mb-4">全{monitors.length}製品を解像度・リフレッシュレート・パネルで絞り込み可能</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/monitors/ranking" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              おすすめランキングを見る
            </Link>
            <Link href="/monitors" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              全製品から絞り込む
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
