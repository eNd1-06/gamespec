import Link from "next/link";
import type { Metadata } from "next";
import { earphones } from "@/data/earphones";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホンおすすめ2026【有線・無線・APEX向け比較】",
  description: "ゲーミングイヤホンのおすすめを有線・無線・APEX向け別に比較。足音が聞こえやすい低遅延・高定位感モデルをスペックデータで厳選紹介。ヘッドセットとの違いも解説。",
  alternates: { canonical: `${BASE_URL}/earphones/gaming` },
  openGraph: {
    title: "ゲーミングイヤホンおすすめ2026 | GameSpec",
    description: "有線・無線のゲーミングイヤホンを定位感・重さ・価格で比較。APEX・FPS向け低遅延モデルを厳選。",
    type: "website",
    url: `${BASE_URL}/earphones/gaming`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングイヤホンおすすめ2026 | GameSpec",
    description: "有線・無線ゲーミングイヤホンを定位感・価格で比較。",
  },
};

function calcScore(e: (typeof earphones)[0]): number {
  const weightScore = Math.max(0, (50 - e.weight) / 50) * 30;
  const priceScore = Math.max(0, (30000 - e.price) / 30000) * 30;
  const latencyScore = e.latency ? Math.max(0, (50 - e.latency) / 50) * 20 : 15;
  const newScore = e.releaseYear >= 2024 ? 20 : e.releaseYear >= 2023 ? 12 : 6;
  return weightScore + priceScore + latencyScore + newScore;
}

const fpsModes = [...earphones]
  .filter((e) => e.recommendFor.includes("fps") || e.recommendFor.includes("competitive") || e.recommendFor.includes("apex"))
  .sort((a, b) => calcScore(b) - calcScore(a));

const wiredEarphones = fpsModes.filter((e) => e.connection === "wired" || e.connection === "both").slice(0, 6);
const wirelessEarphones = fpsModes.filter((e) => e.connection === "wireless" || e.connection === "both").slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "有線・無線両対応";

function EarphoneCard({ ep, rank, badge }: { ep: (typeof earphones)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/earphones/${ep.slug}`}
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
          <p className="text-xs text-gray-500">{ep.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {ep.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{ep.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ep.weight}g</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(ep.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ep.driver}</span>
          {ep.latency && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">遅延{ep.latency}ms</span>}
          {ep.batteryLife && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ep.batteryLife}h</span>}
          {ep.microphone && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">マイク付き</span>}
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{ep.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function GamingEarphonePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">おすすめ・有線・無線比較</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングイヤホンおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          APEX・FPS向けのゲーミングイヤホンを有線・無線別に厳選。足音・銃声の定位感と低遅延を重視してスコア化。全{earphones.length}製品から掲載。
        </p>

        {/* ヘッドセットとの違い */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">イヤホン vs ヘッドセット：FPSにはどちら？</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p className="font-bold text-white mb-1">ゲーミングイヤホンのメリット</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>軽量（10〜30g）で長時間装着でも疲れにくい</li>
                <li>耳への密閉度が高く定位感が優れる機種も</li>
                <li>ヘッドホンと組み合わせて音質を極める使い方もある</li>
                <li>持ち運びが容易でオフ大会向き</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-1">ゲーミングヘッドセットのメリット</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>マイクが一体型で手軽に始められる</li>
                <li>バーチャルサラウンド対応が多い</li>
                <li>ドライバーが大きく低音・臨場感が豊か</li>
                <li>ボイスチャット用マイク品質が高い</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {wiredEarphones.length > 0 && <li><a href="#wired" className="text-sm text-blue-400 hover:text-blue-300">▶ 有線ゲーミングイヤホン（遅延ゼロ）</a></li>}
            {wirelessEarphones.length > 0 && <li><a href="#wireless" className="text-sm text-blue-400 hover:text-blue-300">▶ 無線ゲーミングイヤホン（低遅延モデル）</a></li>}
            <li><a href="#faq" className="text-sm text-blue-400 hover:text-blue-300">▶ よくある質問</a></li>
          </ul>
        </nav>

        {/* 有線 */}
        {wiredEarphones.length > 0 && (
          <section id="wired" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">有線ゲーミングイヤホン（遅延ゼロ）</h2>
            <p className="text-xs text-gray-500 mb-4">遅延が一切ない有線モデル。競技プレイ・音質重視の方に。3.5mmジャック・USB-C対応モデルが中心。</p>
            <div className="space-y-3">
              {wiredEarphones.map((ep, i) => <EarphoneCard key={ep.slug} ep={ep} rank={i + 1} badge="有線" />)}
            </div>
          </section>
        )}

        {/* 無線 */}
        {wirelessEarphones.length > 0 && (
          <section id="wireless" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">無線ゲーミングイヤホン（低遅延モデル）</h2>
            <p className="text-xs text-gray-500 mb-4">2.4GHz対応の低遅延ワイヤレスモデル。コードなしで自由に動ける。</p>
            <div className="space-y-3">
              {wirelessEarphones.map((ep, i) => <EarphoneCard key={ep.slug} ep={ep} rank={i + 1} badge="無線" />)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">ゲーミングイヤホンに別途マイクは必要？</h3>
              <p className="text-sm text-gray-400">マイクなしモデルが多いため、ボイスチャットにはPC・コンソールのコントローラーマイク、または別途クリップマイク（1,000〜3,000円）を用意するのが一般的です。マイク付きモデルも一部存在します。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXでイヤホンを使うメリットは？</h3>
              <p className="text-sm text-gray-400">耳道をしっかり塞ぐカナル型イヤホンは周囲の音を遮断し、ゲーム音への集中度が上がります。ヘッドセットより軽いため長時間セッションでの疲労が少なく、プロ選手のサブデバイスとして使われることもあります。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">Bluetoothでもゲームに使える？</h3>
              <p className="text-sm text-gray-400">PC・PS5でBluetoothイヤホンを使うと遅延が20〜100ms発生し、足音のタイミングがずれる場合があります。競技プレイには有線か2.4GHz専用モデルを強く推奨します。カジュアルプレイなら問題ないことが多いです。</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">接続方式・ドライバー・価格で自分で絞り込む</p>
          <Link href="/earphones" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングイヤホン {earphones.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
