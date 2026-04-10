import Link from "next/link";
import type { Metadata } from "next";
import { controllers } from "@/data/controllers";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "FPS向けゲーミングコントローラーおすすめ2026【背面ボタン・トリガーストップ比較】",
  description: "FPS・APEX向けゲーミングコントローラーのおすすめを背面ボタン・トリガーストップ・プラットフォーム別に比較。競技向けプロコントローラーをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/controllers/fps` },
  openGraph: {
    title: "FPS向けゲーミングコントローラーおすすめ2026 | GameSpec",
    description: "背面ボタン・トリガーストップ搭載のFPS向けコントローラーをプラットフォーム別に比較。",
    type: "website",
    url: `${BASE_URL}/controllers/fps`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "FPS向けゲーミングコントローラーおすすめ2026 | GameSpec",
    description: "背面ボタン・トリガーストップ搭載FPSコントローラーをスペックで比較。",
  },
};

function calcScore(c: (typeof controllers)[0]): number {
  const backScore = c.backButtons ? 30 : 0;
  const triggerScore = c.triggerStop ? 25 : 0;
  const weightScore = Math.max(0, (350 - c.weight) / 300) * 20;
  const priceScore = Math.max(0, (40000 - c.price) / 40000) * 15;
  const newScore = c.releaseYear >= 2024 ? 10 : c.releaseYear >= 2023 ? 6 : 3;
  return backScore + triggerScore + weightScore + priceScore + newScore;
}

const fpsControllers = [...controllers]
  .filter((c) => c.recommendFor.includes("fps") || c.recommendFor.includes("competitive") || c.recommendFor.includes("apex"))
  .sort((a, b) => calcScore(b) - calcScore(a));

const ps5Controllers = fpsControllers.filter((c) => c.platform === "PS5").slice(0, 4);
const xboxControllers = fpsControllers.filter((c) => c.platform === "Xbox" || c.platform === "PC").slice(0, 4);
const multiControllers = fpsControllers.filter((c) => c.platform === "マルチ" || c.platform === "PC").slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "無線・有線両対応";

function ControllerCard({ ctrl, rank, badge }: { ctrl: (typeof controllers)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/controllers/${ctrl.slug}`}
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
          <p className="text-xs text-gray-500">{ctrl.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {ctrl.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{ctrl.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ctrl.platform}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(ctrl.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ctrl.weight}g</span>
          {ctrl.backButtons && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">背面ボタン</span>}
          {ctrl.triggerStop && <span className="text-xs bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full">トリガーストップ</span>}
          {ctrl.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ctrl.batteryLife}h</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{ctrl.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FpsControllerPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/controllers" className="text-gray-400 hover:text-white text-sm">ゲーミングコントローラー</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">FPS向けおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">FPS向けゲーミングコントローラーおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX・Valorant・CoD向けのFPS特化コントローラーを厳選。背面ボタン・トリガーストップ搭載でキーボードマウスに近い操作性を実現。全{controllers.length}製品から掲載。
        </p>

        {/* FPS向けコントローラーの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">FPSコントローラーで差がつく3機能</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">トリガーストップ</span> — トリガーのストローク（押し込み量）を短くする機能。FPSでは半押しでADS・全押しで射撃のため、ストロークを短縮すると射撃速度が上がる。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">背面ボタン</span> — 親指をスティックから離さずにアクションを実行できる。ジャンプ・しゃがみ・リロードを背面に割り当てるとエイムが安定する。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">スティックの張り・交換性</span> — スティックの硬さ・高さが操作精度に直結。カスタマイズ可能なモデルは自分の感度・プレイスタイルに最適化できる。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ FPS向け総合ランキング</a></li>
            {ps5Controllers.length > 0 && <li><a href="#ps5" className="text-sm text-blue-400 hover:text-blue-300">▶ PS5向けFPSコントローラー</a></li>}
            {xboxControllers.length > 0 && <li><a href="#xbox" className="text-sm text-blue-400 hover:text-blue-300">▶ Xbox・PC向けFPSコントローラー</a></li>}
            {multiControllers.length > 0 && <li><a href="#multi" className="text-sm text-blue-400 hover:text-blue-300">▶ マルチ対応（PC・Switch・PS兼用）</a></li>}
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">FPS向け総合ランキング</h2>
          <p className="text-xs text-gray-500 mb-4">背面ボタン・トリガーストップ・重さ・価格を総合スコア化</p>
          <div className="space-y-3">
            {fpsControllers.slice(0, 10).map((c, i) => (
              <ControllerCard key={c.slug} ctrl={c} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* PS5 */}
        {ps5Controllers.length > 0 && (
          <section id="ps5" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">PS5向けFPSコントローラー</h2>
            <p className="text-xs text-gray-500 mb-4">DualSense Edgeをはじめ、PS5での競技プレイに特化したモデル。</p>
            <div className="space-y-3">
              {ps5Controllers.map((c, i) => <ControllerCard key={c.slug} ctrl={c} rank={i + 1} badge="PS5" />)}
            </div>
          </section>
        )}

        {/* Xbox・PC */}
        {xboxControllers.length > 0 && (
          <section id="xbox" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">Xbox・PC向けFPSコントローラー</h2>
            <p className="text-xs text-gray-500 mb-4">Xbox Elite Series 2など、PC・Xbox環境でのFPSに最適なハイエンドモデル。</p>
            <div className="space-y-3">
              {xboxControllers.map((c, i) => <ControllerCard key={c.slug} ctrl={c} rank={i + 1} badge="Xbox/PC" />)}
            </div>
          </section>
        )}

        {/* マルチ */}
        {multiControllers.length > 0 && (
          <section id="multi" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">マルチ対応（PC・Switch・PS兼用）</h2>
            <p className="text-xs text-gray-500 mb-4">複数プラットフォームで使えるサードパーティ製コントローラー。コスパが良くPC環境にも対応。</p>
            <div className="space-y-3">
              {multiControllers.map((c, i) => <ControllerCard key={c.slug} ctrl={c} rank={i + 1} badge="マルチ" />)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXをコントローラーでプレイするメリットは？</h3>
              <p className="text-sm text-gray-400">APEXのコントローラーにはエイムアシストが付いており、適切な感度設定と組み合わせるとキーボードマウスに匹敵するエイム精度を発揮できます。スティック操作に慣れている方はコントローラーのほうが快適なケースも多いです。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">純正コントローラーとプロコンの違いは？</h3>
              <p className="text-sm text-gray-400">純正（DualSense・Xbox標準）は1万円前後でエイムアシストも十分。プロコン（Elite・DualSense Edge・Scuf）は2〜4万円で背面ボタン・トリガーストップ・スティックカスタマイズが可能。本格的に上位を目指すならプロコンへの投資を検討しましょう。</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">プラットフォーム・機能・価格で自分で絞り込む</p>
          <Link href="/controllers" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングコントローラー {controllers.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
