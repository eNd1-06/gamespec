import Link from "next/link";
import type { Metadata } from "next";
import { headsets } from "@/data/headsets";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングヘッドセットの選び方2026【初心者向け完全ガイド】",
  description: "ゲーミングヘッドセットの選び方を徹底解説。有線vs無線・ドライバーサイズ・サラウンド・ANC・マイク性能など失敗しない選び方のポイントを初心者にもわかりやすく説明。予算別おすすめも紹介。",
  alternates: { canonical: `${BASE_URL}/headsets/guide` },
  openGraph: {
    title: "ゲーミングヘッドセットの選び方2026【初心者向け完全ガイド】| GameSpec",
    description: "有線vs無線・サラウンド・ANC・マイク性能など選び方のポイントを徹底解説。予算別おすすめも紹介。",
    type: "article",
    url: `${BASE_URL}/headsets/guide`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

const budget = headsets.find((h) => h.slug === "razer-blackshark-v2");
const mid    = headsets.find((h) => h.slug === "hyperx-cloud-alpha-wireless");
const top    = headsets.find((h) => h.slug === "logicool-g-pro-x-2-lightspeed");

function ProductCard({ headset, label }: { headset: (typeof headsets)[0]; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block">{label}</span>
      <h3 className="text-sm font-bold text-white mb-1">{headset.brand} {headset.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.connection === "wireless" ? "無線" : headset.connection === "both" ? "有線/無線" : "有線"}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.driverSize}mmドライバー</span>
        {headset.batteryLife && (
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">最大{headset.batteryLife}時間</span>
        )}
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{headset.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/headsets/${headset.slug}`}
          className="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all"
        >
          スペックを見る
        </Link>
        <a
          href={headset.amazonUrl}
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

export default function HeadsetsGuidePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">選び方ガイド</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングヘッドセットの選び方2026</h1>
        <p className="text-sm text-gray-400 mb-8">初めてゲーミングヘッドセットを買う方・買い替えを検討している方向けに、失敗しない選び方を解説します。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#connection" className="text-sm text-blue-400 hover:text-blue-300">▶ ① 有線 vs 無線 — まず最初に決めること</a></li>
            <li><a href="#driver" className="text-sm text-blue-400 hover:text-blue-300">▶ ② ドライバーサイズと音質</a></li>
            <li><a href="#surround" className="text-sm text-blue-400 hover:text-blue-300">▶ ③ バーチャルサラウンドの必要性</a></li>
            <li><a href="#mic" className="text-sm text-blue-400 hover:text-blue-300">▶ ④ マイク性能の選び方</a></li>
            <li><a href="#anc" className="text-sm text-blue-400 hover:text-blue-300">▶ ⑤ ANC（アクティブノイズキャンセリング）</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ 予算別おすすめ</a></li>
          </ul>
        </nav>

        {/* 有線 vs 無線 */}
        <section id="connection" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">① 有線 vs 無線 — まず最初に決めること</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            ヘッドセット選びで最初に決めるべきは接続方式です。<strong className="text-white">ゲーム用途では2.4GHz無線が主流</strong>になっており、有線と遅延差はほぼありません。ただし価格差があるため、用途と予算で判断しましょう。
          </p>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">有線（3.5mm / USB）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 充電不要・安定した音質</li>
                <li>✓ 価格が安い（同スペックで1万円以下も）</li>
                <li>✓ スマホ・コントローラーにも接続しやすい</li>
                <li>✗ ケーブルの取り回しが必要</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">無線（2.4GHz）</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">現在の主流</span>
              </div>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 動きが自由・ケーブルの煩わしさなし</li>
                <li>✓ 遅延は有線とほぼ同等（2.4GHz）</li>
                <li>✓ バッテリー持続20〜38時間のモデルが多い</li>
                <li>✗ 定期的な充電が必要</li>
                <li>✗ 有線より価格が高い</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">Bluetooth</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ スマホ・PCなど複数デバイスに対応</li>
                <li>△ 遅延が2.4GHzより大きい（ゲームには非推奨）</li>
                <li>△ 2.4GHzと併用できる「両対応」モデルが便利</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500">※ 競技・FPS用途なら2.4GHz無線 or 有線を選びましょう。Bluetoothは通話・音楽用途に向いています。</p>
        </section>

        {/* ドライバーサイズ */}
        <section id="driver" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">② ドライバーサイズと音質</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            ドライバーは音を出す振動板のことで、サイズが大きいほど低音が豊かになる傾向があります。ただし<strong className="text-white">サイズより設計・チューニングのほうが音質への影響が大きい</strong>ため、数値だけで判断しないことが重要です。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold shrink-0 w-12">40mm</span>
                <span className="text-gray-300">コンパクトで軽量なモデルに多い。バランスの良い音質。SteelSeries・Sonyの製品に多く採用。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold shrink-0 w-12">50mm</span>
                <span className="text-gray-300"><strong className="text-white">ゲーミングヘッドセットの標準。</strong> 低音の迫力と中高音のバランスが良く、FPS・アクションゲームに最適。</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold shrink-0 w-12">53mm+</span>
                <span className="text-gray-300">大型ドライバーで低音・臨場感を重視したモデル。没入感重視のゲームに向いている。</span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">※ FPS・APEXなど足音・銃声の定位が重要なゲームでは、低音より中高音の解像度が高いモデルが有利です。</p>
        </section>

        {/* サラウンド */}
        <section id="surround" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">③ バーチャルサラウンドの必要性</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            2chのステレオ音声を7.1chなど多方向に聞こえるよう加工する技術です。<strong className="text-white">FPSゲームで敵の足音の方向を把握しやすくなる</strong>メリットがある一方、音質が変わるため好みが分かれます。
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">サラウンドON</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 音の方向感が強調される</li>
                <li>✓ 足音・環境音の位置把握が向上</li>
                <li>✗ 音質が変わる（好みによる）</li>
                <li>✗ ソフトウェア処理の品質に依存</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">ステレオ（2ch）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 原音に忠実・音質が自然</li>
                <li>✓ 多くのプロが好む設定</li>
                <li>△ 上下方向の定位はやや苦手</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-900 border border-blue-900 rounded-xl p-3">
            <p className="text-xs text-blue-400">💡 プロの多くはサラウンドをOFFにしてステレオで使用しています。バーチャルサラウンドは使えると便利な機能として考え、あれば試してみるのがおすすめです。</p>
          </div>
        </section>

        {/* マイク */}
        <section id="mic" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">④ マイク性能の選び方</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            ボイスチャットをするなら<strong className="text-white">マイクの音質・ノイズキャンセリング性能</strong>が重要です。配信・実況まで考えているなら、別途コンデンサーマイクの購入も視野に入れましょう。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">取り外し可能マイク（着脱式）</p>
              <p className="text-xs text-gray-400">マイクを外してヘッドフォンとして使えるため汎用性が高い。Razer BlackShark V2・Logicool G PRO Xシリーズに採用。音楽鑑賞でも使いたい方に向いている。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">固定マイク（フレキシブルアーム）</p>
              <p className="text-xs text-gray-400">マイクが本体に内蔵されておりいつでも使える。位置調整しやすく、ゲーム中にサッとチャットできる。HyperX Cloud・INZONE H9など多くのモデルで採用。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">AIノイズキャンセリング（マイク側）</p>
              <p className="text-xs text-gray-400">周囲の雑音（キーボード音・換気扇など）をAIがリアルタイムで除去。SteelSeries Arctis Nova・Razer HyperClearなどが採用。配信・テレワーク兼用に便利。</p>
            </div>
          </div>
        </section>

        {/* ANC */}
        <section id="anc" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">⑤ ANC（アクティブノイズキャンセリング）</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            外部の騒音を電気的に打ち消す技術です。<strong className="text-white">競技ゲームには基本的に不要</strong>ですが、カフェ・図書館など騒がしい環境でゲーム・作業する場合には効果的です。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 shrink-0">✓</span>
                <span className="text-gray-300">ANC搭載：Sony INZONE H9、SteelSeries Arctis Nova Pro Wireless など。静かな環境を作りたい方・テレワーク兼用に最適。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500 shrink-0">—</span>
                <span className="text-gray-300">ANC非搭載：ほとんどのゲーミングヘッドセット。自宅でのゲーム用途なら不要。その分価格を音質・マイクに充てられる。</span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">※ ANC搭載モデルは非搭載より1〜2万円高くなる傾向があります。自宅ゲーム専用ならANCなしで十分です。</p>
        </section>

        {/* 予算別おすすめ */}
        <section id="budget" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">予算別おすすめ</h2>
          <div className="space-y-4">
            {budget && <ProductCard headset={budget} label="〜1万円 有線・コスパ最強" />}
            {mid    && <ProductCard headset={mid}    label="1〜2万円 無線・ロングバッテリー" />}
            {top    && <ProductCard headset={top}    label="2万円以上 プロ仕様・無線フラッグシップ" />}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-300 mb-1">スペックで細かく比較したい方はこちら</p>
          <p className="text-xs text-gray-500 mb-4">全{headsets.length}製品を接続方式・ドライバー・バッテリーで絞り込み可能</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/headsets/ranking" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              おすすめランキングを見る
            </Link>
            <Link href="/headsets" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              全製品から絞り込む
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
