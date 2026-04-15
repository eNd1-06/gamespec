import Link from "next/link";
import type { Metadata } from "next";
import { mousepads } from "@/data/mousepads";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウスパッドの選び方2026【初心者向け完全ガイド】",
  description: "ゲーミングマウスパッドの選び方を徹底解説。速度系vsコントロール系・サイズ・素材・厚さなど失敗しない選び方のポイントを初心者にもわかりやすく説明。予算別おすすめも紹介。",
  alternates: { canonical: `${BASE_URL}/mousepads/guide` },
  openGraph: {
    title: "ゲーミングマウスパッドの選び方2026【初心者向け完全ガイド】| GameSpec",
    description: "速度系vsコントロール系・サイズ・素材・厚さなど選び方のポイントを徹底解説。予算別おすすめも紹介。",
    type: "article",
    url: `${BASE_URL}/mousepads/guide`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

const budget = mousepads.find((m) => m.slug === "steelseries-qck-plus");
const mid    = mousepads.find((m) => m.slug === "logicool-g640");
const top    = mousepads.find((m) => m.slug === "artisan-hien-soft-l");

function ProductCard({ mousepad, label }: { mousepad: (typeof mousepads)[0]; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block">{label}</span>
      <h3 className="text-sm font-bold text-white mb-1">{mousepad.brand} {mousepad.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mousepad.size}サイズ</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mousepad.surface}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mousepad.width}×{mousepad.height}mm</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{mousepad.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/mousepads/${mousepad.slug}`}
          className="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all"
        >
          スペックを見る
        </Link>
        <a
          href={mousepad.amazonUrl}
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

export default function MousepadsGuidePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mousepads" className="text-gray-400 hover:text-white text-sm">ゲーミングマウスパッド</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">選び方ガイド</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウスパッドの選び方2026</h1>
        <p className="text-sm text-gray-400 mb-8">マウスパッドは地味に見えて、エイムの安定性に大きく影響するデバイスです。失敗しない選び方を解説します。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#surface" className="text-sm text-blue-400 hover:text-blue-300">▶ ① 表面素材 — 速度系 vs コントロール系</a></li>
            <li><a href="#size" className="text-sm text-blue-400 hover:text-blue-300">▶ ② サイズ — マウス感度で選ぶ</a></li>
            <li><a href="#material" className="text-sm text-blue-400 hover:text-blue-300">▶ ③ 素材 — 布・ガラス・ハイブリッド</a></li>
            <li><a href="#thickness" className="text-sm text-blue-400 hover:text-blue-300">▶ ④ 厚さとエッジ処理</a></li>
            <li><a href="#tips" className="text-sm text-blue-400 hover:text-blue-300">▶ ⑤ 知っておきたい選び方のコツ</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ 予算別おすすめ</a></li>
          </ul>
        </nav>

        {/* 表面素材 */}
        <section id="surface" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">① 表面素材 — 速度系 vs コントロール系</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            マウスパッド選びで最も重要な要素です。<strong className="text-white">マウスの滑りやすさ（速度）と止めやすさ（コントロール）のバランス</strong>が、プレイスタイルや感度設定によって大きく異なります。
          </p>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">速度系（スピード）</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">低感度・広く振るプレイヤー向け</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">表面が滑らかでマウスが速く動く。素早いエイム移動がしやすい反面、ピタッと止める精度が出にくい。低感度で大きく振るプレイヤーや、スナイパー系のゲームに向いている。</p>
              <p className="text-xs text-gray-500">代表例：Artisan 疾風（HIEN）、Zowie GTF-X、Logicool G840</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">コントロール系</p>
                <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">高感度・精密なエイム向け</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">表面に適度な抵抗があり、狙ったところでピタッと止めやすい。FPS・APEXで細かいエイム調整をしたいプレイヤーに人気。初心者にもおすすめ。</p>
              <p className="text-xs text-gray-500">代表例：SteelSeries QcK Heavy、Logicool G640、Zowie G-SR</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">バランス系</p>
              <p className="text-xs text-gray-400">速度系とコントロール系の中間。どちらのプレイスタイルにも対応しやすく、初めてのゲーミングマウスパッドに最適。SteelSeries QcK+が代表的。</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-blue-900 rounded-xl p-3">
            <p className="text-xs text-blue-400">💡 迷ったらまずコントロール系 or バランス系から試してみるのがおすすめ。速すぎると感じたらコントロール系、もっと滑らせたいなら速度系に移行しよう。</p>
          </div>
        </section>

        {/* サイズ */}
        <section id="size" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">② サイズ — マウス感度で選ぶ</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            マウスパッドのサイズは<strong className="text-white">マウス感度（DPI・ゲーム内感度）と連動して選ぶ</strong>のが基本です。低感度で大きく腕を動かすなら大きいパッドが必須です。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gray-500 font-bold shrink-0 w-10">S/M</span>
                <div>
                  <span className="text-gray-300">〜350×300mm前後。高感度・手首中心のプレイヤー向け。デスクが狭い方にも。</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold shrink-0 w-10">L</span>
                <div>
                  <span className="text-gray-300"><strong className="text-white">最もスタンダードなサイズ（450×400mm前後）。</strong> 中〜低感度のゲーマーに対応。キーボードも一緒に置けるモデルが多い。迷ったらこれ。</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0 w-10">XXL</span>
                <div>
                  <span className="text-gray-300">デスク全体を覆う大型サイズ（900mm以上）。超低感度・腕全体で大きく振るプレイヤーに最適。キーボードもパッドに乗せられる。</span>
                </div>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">※ APEXの400DPI / 感度2.0前後（eDPI800）なら Lサイズ、それ以下の低感度なら XXL も検討しましょう。</p>
        </section>

        {/* 素材 */}
        <section id="material" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">③ 素材 — 布・ガラス・ハイブリッド</h2>
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">布（クロス）</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">最もポピュラー</span>
              </div>
              <p className="text-xs text-gray-400">圧倒的に多数派。クッション性があり手首への負担が少ない。価格も安く、コントロール系から速度系まで幅広いラインナップ。汗で滑りが変わることがあるため定期的な洗濯が必要。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">ガラス</p>
              <p className="text-xs text-gray-400">非常に滑らかな速度系表面で汚れにも強い。汗の影響を受けにくく一定の滑り感を維持できる。ただし硬く手首に負担がかかる。価格が高め（Razer Atlas：¥7,980〜）。好みが分かれる素材。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">ハイブリッド</p>
              <p className="text-xs text-gray-400">布の柔軟性とガラスの滑らかさを組み合わせた素材。Razer Striderが代表的。汗の影響を受けにくく耐久性も高い。布より速く、ガラスより柔らかいバランス型。</p>
            </div>
          </div>
        </section>

        {/* 厚さ・エッジ */}
        <section id="thickness" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">④ 厚さとエッジ処理</h2>

          <h3 className="text-base font-bold text-white mb-2">厚さ</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            厚いほどクッション性が上がり手首への負担が減りますが、マウスの底面との摩擦感も変わります。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 shrink-0 font-bold w-12">1〜2mm</span>
                <span className="text-gray-300">薄型。机の硬さをダイレクトに感じる。デスクとの段差が少なくフラットな環境を好む方向け。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 shrink-0 font-bold w-12">3〜4mm</span>
                <span className="text-gray-300"><strong className="text-white">標準的な厚さ。</strong> クッション性と安定性のバランスが良い。最もよく選ばれる厚さ。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 shrink-0 font-bold w-12">5〜6mm</span>
                <span className="text-gray-300">厚型。手首への負担が少なく長時間プレイに向いている。SteelSeries QcK Heavyが代表的。</span>
              </li>
            </ul>
          </div>

          <h3 className="text-base font-bold text-white mb-2">エッジ処理（ステッチ縫い）</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            パッドの端をステッチ（縫い）で処理しているモデルは<strong className="text-white">端のほつれが防げて耐久性が上がります</strong>。長く使うならステッチ縫い対応モデルがおすすめです。ただし端が若干硬くなるため、マウスを端まで使う方は好みが分かれます。
          </p>
        </section>

        {/* 選び方のコツ */}
        <section id="tips" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">⑤ 知っておきたい選び方のコツ</h2>
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">マウスソールとの相性がある</p>
              <p className="text-xs text-gray-400">マウスパッドと、マウス底面のソール（すべり材）の組み合わせで滑り感が変わります。購入前にレビューで「〇〇マウスとの相性が良い」という情報を確認するのも有効です。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">使い込むと滑りが変わる（エイジング）</p>
              <p className="text-xs text-gray-400">布パッドは使い込むほど表面が馴染み、最初と滑り感が変わることがあります。Artisan製品などはエイジングにより最適な滑り感に育つと言われています。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">定期的な洗濯でパフォーマンスを維持</p>
              <p className="text-xs text-gray-400">布パッドは皮脂・ホコリが蓄積すると滑りが変化します。1〜2ヶ月に1度、ぬるま湯と中性洗剤で手洗いして陰干しすると長く使えます。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">RGB搭載は見た目重視</p>
              <p className="text-xs text-gray-400">RGBライティング搭載モデルはデスク環境を彩れますが、ゲーム性能とは無関係です。配線も増えるため、純粋にゲーム性能を求めるならRGBなしモデルで十分です。</p>
            </div>
          </div>
        </section>

        {/* 予算別おすすめ */}
        <section id="budget" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">予算別おすすめ</h2>
          <div className="space-y-4">
            {budget && <ProductCard mousepad={budget} label="〜3,000円 定番・コスパ最強" />}
            {mid    && <ProductCard mousepad={mid}    label="3,000〜5,000円 バランス・使いやすい" />}
            {top    && <ProductCard mousepad={top}    label="5,000円以上 国産・こだわり派" />}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-300 mb-1">スペックで細かく比較したい方はこちら</p>
          <p className="text-xs text-gray-500 mb-4">全{mousepads.length}製品を表面・サイズ・素材で絞り込み可能</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mousepads/ranking" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              おすすめランキングを見る
            </Link>
            <Link href="/mousepads" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              全製品から絞り込む
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
