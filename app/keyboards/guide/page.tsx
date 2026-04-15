import Link from "next/link";
import type { Metadata } from "next";
import { keyboards } from "@/data/keyboards";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングキーボードの選び方2026【初心者向け完全ガイド】",
  description: "ゲーミングキーボードの選び方を徹底解説。軸（スイッチ）の種類・レイアウト・有線vs無線・ポーリングレートなど失敗しない選び方のポイントを初心者にもわかりやすく説明。予算別おすすめも紹介。",
  alternates: { canonical: `${BASE_URL}/keyboards/guide` },
  openGraph: {
    title: "ゲーミングキーボードの選び方2026【初心者向け完全ガイド】| GameSpec",
    description: "軸の種類・レイアウト・有線vs無線など選び方のポイントを徹底解説。予算別おすすめも紹介。",
    type: "article",
    url: `${BASE_URL}/keyboards/guide`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

const budget = keyboards.find((k) => k.slug === "logicool-g413-tkl-se");
const mid    = keyboards.find((k) => k.slug === "asus-rog-falchion-ace");
const top    = keyboards.find((k) => k.slug === "logicool-g-pro-x-tkl-lightspeed");

function ProductCard({ keyboard, label }: { keyboard: (typeof keyboards)[0]; label: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mb-2 inline-block">{label}</span>
      <h3 className="text-sm font-bold text-white mb-1">{keyboard.brand} {keyboard.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.layout}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.switchType}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{keyboard.connection === "wireless" ? "無線" : keyboard.connection === "both" ? "有線/無線" : "有線"}</span>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{keyboard.price.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/keyboards/${keyboard.slug}`}
          className="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all"
        >
          スペックを見る
        </Link>
        <a
          href={keyboard.amazonUrl}
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

export default function KeyboardsGuidePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">選び方ガイド</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングキーボードの選び方2026</h1>
        <p className="text-sm text-gray-400 mb-8">初めてゲーミングキーボードを買う方・買い替えを検討している方向けに、失敗しない選び方を解説します。</p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-10">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#switch" className="text-sm text-blue-400 hover:text-blue-300">▶ ① 軸（スイッチ）— キーボード選びの核心</a></li>
            <li><a href="#layout" className="text-sm text-blue-400 hover:text-blue-300">▶ ② レイアウト — フルサイズ・TKL・60%の違い</a></li>
            <li><a href="#connection" className="text-sm text-blue-400 hover:text-blue-300">▶ ③ 有線 vs 無線</a></li>
            <li><a href="#polling" className="text-sm text-blue-400 hover:text-blue-300">▶ ④ ポーリングレートとNキーロールオーバー</a></li>
            <li><a href="#build" className="text-sm text-blue-400 hover:text-blue-300">▶ ⑤ ビルドクオリティ・打鍵感</a></li>
            <li><a href="#budget" className="text-sm text-blue-400 hover:text-blue-300">▶ 予算別おすすめ</a></li>
          </ul>
        </nav>

        {/* 軸 */}
        <section id="switch" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">① 軸（スイッチ）— キーボード選びの核心</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            軸はキーを押したときの感触・音・反応速度を決める最重要パーツです。<strong className="text-white">ゲーム用途では静音・速反応の赤軸・銀軸・光学式が主流</strong>です。自分の好みに合った軸を選ぶことで、長時間のプレイでも疲れにくくなります。
          </p>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">赤軸（リニア）</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">ゲーム定番・初心者向け</span>
              </div>
              <p className="text-xs text-gray-400">クリック感なし・静音で、まっすぐ押し込む感触。引っかかりがなく素早いキー入力ができる。FPS・競技ゲームで最もよく使われる軸。迷ったらこれ。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">銀軸（スピード）</p>
              <p className="text-xs text-gray-400">赤軸より浅いアクチュエーションポイント（1.2mm）で、さらに素早い入力が可能。ゲームの反応速度を極限まで高めたい上級者向け。誤入力しやすいため慣れが必要。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">茶軸（タクタイル）</p>
              <p className="text-xs text-gray-400">押し込む途中に軽いバンプ（引っかかり）がある。クリック音はないが押したフィードバックがある。ゲームとタイピング両方に使いたい人向けのバランス型。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">青軸（クリッキー）</p>
              <p className="text-xs text-gray-400">カチカチとした明確なクリック感と音が特徴。タイピングの満足感は高いが音が大きく、ゲームでの連打には向かない。深夜プレイや配信には不向き。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">光学式・磁気式（アナログ）</p>
                <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded">最新・高性能</span>
              </div>
              <p className="text-xs text-gray-400">メカニカルスイッチを使わず光や磁気でキー入力を検出。接触不良がなく耐久性が高い。磁気式（アナログ）はアクチュエーションポイントをソフトウェアで自由に変更でき、2026年の最先端技術。Razer・SteelSeriesの上位モデルに採用。</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-blue-900 rounded-xl p-3">
            <p className="text-xs text-blue-400">💡 まず試すなら：量販店でキースイッチサンプラー（テスター）を触ってみるのが一番確実。購入前に実際の感触を確かめよう。</p>
          </div>
        </section>

        {/* レイアウト */}
        <section id="layout" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">② レイアウト — フルサイズ・TKL・60%の違い</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            キーボードのサイズはデスクスペースとマウスの可動域に直結します。<strong className="text-white">FPSゲーマーはテンキーレス（TKL）以下が主流</strong>で、マウスの動かせる範囲が広がります。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">フルサイズ（100%）</p>
              <p className="text-xs text-gray-400">テンキー付きの標準サイズ。数字の入力が多い作業や、MMO・RPGゲームでよく使う。マウスの可動域が狭くなるためFPSには不向き。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">テンキーレス（TKL / 80%）</p>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded">FPS定番・最もバランス良い</span>
              </div>
              <p className="text-xs text-gray-400">テンキーを省いたサイズ。矢印キーやファンクションキーは残るため使い勝手が良く、マウス可動域も確保できる。初めてのゲーミングキーボードとして最もおすすめ。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">75%</p>
              <p className="text-xs text-gray-400">TKLよりさらにコンパクト。矢印キーとファンクションキーを残しながら小型化。デスクが狭い方や持ち運びする方に向いている。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">65%</p>
              <p className="text-xs text-gray-400">矢印キーを残しつつ最小化。ゲーム特化レイアウト。ファンクションキーはFnキーとの組み合わせで入力。コンパクト志向のゲーマーに人気。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-1">60%</p>
              <p className="text-xs text-gray-400">最小レイアウト。矢印キーも省略されFnキーとの組み合わせが必要。マウス可動域は最大。慣れるまで時間がかかるが、デスクをすっきりさせたい方に人気。</p>
            </div>
          </div>
        </section>

        {/* 有線 vs 無線 */}
        <section id="connection" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">③ 有線 vs 無線</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            キーボードの場合、<strong className="text-white">マウスほど遅延の差は問題になりません</strong>。入力デバイスの中でキーボードは反応速度よりも打鍵感や使い勝手が重視されることが多いです。ただし競技シーンのトッププレイヤーは有線を選ぶ傾向があります。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">有線</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ 充電不要・安定動作</li>
                <li>✓ 価格が安い</li>
                <li>✓ 遅延ゼロで安心</li>
                <li>✗ ケーブル管理が必要</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-bold text-white mb-2">無線（2.4GHz）</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ デスクがすっきりする</li>
                <li>✓ 遅延はほぼ有線と同等</li>
                <li>✓ 持ち運びに便利</li>
                <li>✗ 定期的な充電が必要</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">※ Bluetooth接続は遅延が大きく競技用途には不向きです。無線を選ぶなら2.4GHzドングル対応モデルを選びましょう。</p>
        </section>

        {/* ポーリングレート・Nキーロールオーバー */}
        <section id="polling" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">④ ポーリングレートとNキーロールオーバー</h2>

          <h3 className="text-base font-bold text-white mb-2">ポーリングレート</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            1秒間にキー入力の状態をPCに送信する回数です。ほとんどのゲーミングキーボードは<strong className="text-white">1000Hz（1ms）</strong>を搭載しており、ゲーム用途では十分です。8000Hz対応モデルも存在しますが、体感差は小さいです。
          </p>

          <h3 className="text-base font-bold text-white mb-2">Nキーロールオーバー（NKRO）</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            複数のキーを同時に押したときに、すべての入力を正確に認識する機能です。ゲーミングキーボードは基本的にNキーロールオーバーに対応しているため、<strong className="text-white">複数キーを同時押ししても取りこぼしがありません</strong>。対応していない安価なキーボードでは、一部のキー操作が無視されることがあります。
          </p>
          <div className="bg-gray-900 border border-blue-900 rounded-xl p-3">
            <p className="text-xs text-blue-400">💡 ゲーミングキーボードと記載されている製品は基本的にNキーロールオーバーに対応しています。心配な場合は仕様欄の「NKRO」または「Nキーロールオーバー」の記載を確認しましょう。</p>
          </div>
        </section>

        {/* ビルドクオリティ */}
        <section id="build" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3">⑤ ビルドクオリティ・打鍵感</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            高価格帯のキーボードほどボディの剛性が高く、打鍵音が静かでしっかりした打鍵感になります。特に長時間のタイピング・ゲームでは<strong className="text-white">底打ち音・キーのたわみ・安定性</strong>が快適さに大きく影響します。
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-500 font-bold shrink-0">〜1万円</span>
                <span className="text-gray-300">プラスチックボディが多い。ゲーム用途には十分だが、打鍵感は価格なり。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold shrink-0">1〜2万円</span>
                <span className="text-gray-300">アルミフレーム採用モデルが増え始める。剛性・打鍵感ともに満足度が高い。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold shrink-0">2万円以上</span>
                <span className="text-gray-300"><strong className="text-white">競技向けフラッグシップ。</strong> 打鍵感・耐久性・機能性すべてが揃う。長く使うなら投資する価値あり。</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 予算別おすすめ */}
        <section id="budget" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3">予算別おすすめ</h2>
          <div className="space-y-4">
            {budget && <ProductCard keyboard={budget} label="〜1万円 入門・コスパ最強" />}
            {mid    && <ProductCard keyboard={mid}    label="1〜2万円 コンパクト・高性能" />}
            {top    && <ProductCard keyboard={top}    label="2万円以上 プロ仕様・無線TKL" />}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-900 border border-blue-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-300 mb-1">スペックで細かく比較したい方はこちら</p>
          <p className="text-xs text-gray-500 mb-4">全{keyboards.length}製品を軸・レイアウト・接続方式で絞り込み可能</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/keyboards/ranking" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              おすすめランキングを見る
            </Link>
            <Link href="/keyboards" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              全製品から絞り込む
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
