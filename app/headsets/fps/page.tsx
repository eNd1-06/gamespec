import Link from "next/link";
import type { Metadata } from "next";
import { headsets } from "@/data/headsets";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "FPS向けゲーミングヘッドセットおすすめ2026【定位感・軽量・無線比較】",
  description: "FPS・APEX向けゲーミングヘッドセットのおすすめを定位感・軽さ・接続方式別に比較。足音が聞こえやすい空間オーディオ対応モデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/headsets/fps` },
  openGraph: {
    title: "FPS向けゲーミングヘッドセットおすすめ2026 | GameSpec",
    description: "足音・銃声の定位感が優れるFPS向けゲーミングヘッドセットを重さ・接続方式・価格で比較。",
    type: "website",
    url: `${BASE_URL}/headsets/fps`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "FPS向けゲーミングヘッドセットおすすめ2026 | GameSpec",
    description: "定位感重視のFPS向けゲーミングヘッドセットをスペックで比較。",
  },
};

function calcScore(h: (typeof headsets)[0]): number {
  const weightScore = Math.max(0, (400 - h.weight) / 350) * 35;
  const priceScore = Math.max(0, (50000 - h.price) / 50000) * 30;
  const surroundScore = h.virtualSurround ? 20 : 0;
  const newScore = h.releaseYear >= 2024 ? 15 : h.releaseYear >= 2023 ? 9 : 4;
  return weightScore + priceScore + surroundScore + newScore;
}

const fpsHeadsets = [...headsets]
  .filter((h) => h.recommendFor.includes("fps") || h.recommendFor.includes("competitive") || h.recommendFor.includes("apex"))
  .sort((a, b) => calcScore(b) - calcScore(a));

const wirelessFps = fpsHeadsets.filter((h) => h.connection === "wireless" || h.connection === "both").slice(0, 5);
const lightFps = [...fpsHeadsets].sort((a, b) => a.weight - b.weight).slice(0, 5);

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
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.weight}g</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(headset.connection)}</span>
          {headset.virtualSurround && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">バーチャルサラウンド</span>}
          {headset.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">バッテリー{headset.batteryLife}h</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{headset.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FpsHeadsetPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">FPS向けおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">FPS向けゲーミングヘッドセットおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX・Valorant・CS2など競技FPS向けのヘッドセットを厳選。定位感・軽さ・接続方式でスコア化。全{headsets.length}製品中{fpsHeadsets.length}製品を掲載。
        </p>

        {/* FPS向けの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">FPSに最適なヘッドセットの3条件</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">定位感（サウンドステージ）が広い</span> — 足音・銃声の方向を正確に把握できるかが勝敗に直結。バーチャルサラウンド対応や広いサウンドステージのモデルを選ぼう。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">長時間装着に耐える軽さ</span> — 300g以下が理想。ヘッドセットは重いと首・耳への負担が大きく、長時間プレイで集中力が低下する。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">2.4GHzワイヤレスか有線</span> — Bluetoothは遅延があるためFPSには不向き。2.4GHz専用ドングルで遅延なし無線、またはUSB/3.5mm有線が競技向き。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ FPS向け総合ランキング TOP{Math.min(fpsHeadsets.length, 10)}</a></li>
            {wirelessFps.length > 0 && <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線FPSヘッドセット TOP5</a></li>}
            <li><a href="#lightweight" className="text-sm text-blue-400 hover:text-blue-300">▶ 軽量FPSヘッドセット TOP5</a></li>
            <li><a href="#faq" className="text-sm text-blue-400 hover:text-blue-300">▶ よくある質問</a></li>
          </ul>
        </nav>

        {/* 総合ランキング */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">FPS向け総合ランキング</h2>
          <p className="text-xs text-gray-500 mb-4">軽さ・バーチャルサラウンド・価格・発売年を総合スコア化</p>
          <div className="space-y-3">
            {fpsHeadsets.slice(0, 10).map((h, i) => (
              <HeadsetCard key={h.slug} headset={h} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 無線FPS */}
        {wirelessFps.length > 0 && (
          <section id="wireless" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線FPSヘッドセット TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">2.4GHz対応の遅延なしワイヤレスモデル。コードの煩わしさなしでFPSに集中。</p>
            <div className="space-y-3">
              {wirelessFps.map((h, i) => (
                <HeadsetCard key={h.slug} headset={h} rank={i + 1} badge="無線" />
              ))}
            </div>
          </section>
        )}

        {/* 軽量FPS */}
        <section id="lightweight" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">軽量FPSヘッドセット TOP5</h2>
          <p className="text-xs text-gray-500 mb-4">長時間プレイに向く軽量モデル。重さ順に掲載。</p>
          <div className="space-y-3">
            {lightFps.map((h, i) => (
              <HeadsetCard key={h.slug} headset={h} rank={i + 1} badge={`${h.weight}g`} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXでヘッドセットは必要？</h3>
              <p className="text-sm text-gray-400">足音と銃声の方向把握がAPEXでは勝敗に大きく影響します。スピーカーよりヘッドセットのほうが定位感が圧倒的に優れるため、競技プレイには必須級のアイテムです。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">イヤホンとヘッドセットどちらがFPS向き？</h3>
              <p className="text-sm text-gray-400">プロゲーマーは耳保護のためイヤホン+防音ヘッドホンの組み合わせを使うケースも多いです。一般プレイヤーにはヘッドセット1台のほうが手軽。音質・定位感を追求するならイヤホン＋外部マイクが最強です。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">バーチャルサラウンドはオンにすべき？</h3>
              <p className="text-sm text-gray-400">ゲームによります。APEXではバーチャルサラウンドより高品質なステレオのほうが定位感が優れるという意見も多い。まずはオフ（ステレオ）で試し、好みに応じて切り替えましょう。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
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
