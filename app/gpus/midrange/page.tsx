import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ミドルレンジGPUおすすめ2026【RTX 4060・RX 7700比較・コスパ最強】",
  description: "ミドルレンジゲーミングGPUのおすすめをNVIDIA・AMD別に比較。RTX 4060・RTX 4070・RX 7700 XTなどコスパ最強のミドルGPUをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/gpus/midrange` },
  openGraph: {
    title: "ミドルレンジGPUおすすめ2026 | GameSpec",
    description: "RTX 4060・RX 7700など性能と価格のバランスが優れたミドルGPUをスペックで比較。",
    type: "website",
    url: `${BASE_URL}/gpus/midrange`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ミドルレンジGPUおすすめ2026 | GameSpec",
    description: "RTX 4060・RX 7700などミドルGPUをスペックで比較。",
  },
};

function calcScore(g: (typeof gpus)[0]): number {
  const perfScore = Math.min(g.boostClock / 3000, 1) * 30;
  const vramScore = Math.min(g.vram / 16, 1) * 25;
  const tdpScore = Math.max(0, (300 - g.tdp) / 300) * 20;
  const priceScore = Math.max(0, (100000 - g.price) / 100000) * 25;
  return perfScore + vramScore + tdpScore + priceScore;
}

const midrangeGpus = [...gpus]
  .filter((g) => g.tier === "ミドル")
  .sort((a, b) => calcScore(b) - calcScore(a));

const nvidiaMiddle = midrangeGpus.filter((g) => g.gpuBrand === "NVIDIA").slice(0, 5);
const amdMiddle = midrangeGpus.filter((g) => g.gpuBrand === "AMD").slice(0, 5);

function GpuCard({ gpu, rank, badge }: { gpu: (typeof gpus)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/gpus/${gpu.slug}`}
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
          <p className="text-xs text-gray-500">{gpu.brand}</p>
          {badge && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {gpu.isNew && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{gpu.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${gpu.gpuBrand === "NVIDIA" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>{gpu.chipset}</span>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">VRAM {gpu.vram}GB</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">TDP {gpu.tdp}W</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.memoryType}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{gpu.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function MidrangeGpuPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">ゲーミングGPU</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">ミドルレンジおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ミドルレンジGPUおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          性能と価格のバランスが最も優れるミドルレンジGPUを厳選。NVIDIA・AMD別に掲載。全{gpus.length}製品中、ミドルクラス{midrangeGpus.length}製品を比較。
        </p>

        {/* ミドルGPUの選び方 */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">ミドルレンジGPUを選ぶポイント</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">①</span>
              <span><span className="text-white font-bold">VRAM 12GB以上を目安に</span> — フルHD・WQHD環境なら12GBで十分。最新タイトル・高解像度テクスチャ・AI機能を使うなら16GB以上が安心。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">②</span>
              <span><span className="text-white font-bold">TDP（消費電力）と電源容量の確認</span> — ミドルGPUは150〜250W前後。既存の電源ユニット容量（750W以上推奨）を確認してから購入を。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold shrink-0">③</span>
              <span><span className="text-white font-bold">DLSS（NVIDIA）vs FSR（AMD）</span> — DLSSはAIアップスケーリングで画質・フレームレート両立が優秀。FSRはオープンソースで幅広いGPU対応。どちらもFPSを大幅に底上げできる。</span>
            </li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            <li><a href="#overall" className="text-sm text-blue-400 hover:text-blue-300">▶ ミドルGPU 総合ランキング</a></li>
            {nvidiaMiddle.length > 0 && <li><a href="#nvidia" className="text-sm text-blue-400 hover:text-blue-300">▶ NVIDIA ミドルレンジ TOP5</a></li>}
            {amdMiddle.length > 0 && <li><a href="#amd" className="text-sm text-blue-400 hover:text-blue-300">▶ AMD ミドルレンジ TOP5</a></li>}
            <li><a href="#faq" className="text-sm text-blue-400 hover:text-blue-300">▶ よくある質問</a></li>
          </ul>
        </nav>

        {/* 総合 */}
        <section id="overall" className="mb-12">
          <h2 className="text-lg font-bold text-white mb-1">ミドルGPU 総合ランキング</h2>
          <p className="text-xs text-gray-500 mb-4">クロック・VRAM・TDP・価格を総合スコア化（NVIDIA・AMD混合）</p>
          <div className="space-y-3">
            {midrangeGpus.slice(0, 10).map((g, i) => (
              <GpuCard key={g.slug} gpu={g} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* NVIDIA */}
        {nvidiaMiddle.length > 0 && (
          <section id="nvidia" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">NVIDIA ミドルレンジ TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">DLSS・レイトレーシング対応。FPS向けフレーム生成（DLSS 3）も利用可能。</p>
            <div className="space-y-3">
              {nvidiaMiddle.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="NVIDIA" />)}
            </div>
          </section>
        )}

        {/* AMD */}
        {amdMiddle.length > 0 && (
          <section id="amd" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">AMD ミドルレンジ TOP5</h2>
            <p className="text-xs text-gray-500 mb-4">同価格帯でVRAMが多いモデルが多い。FSR対応で幅広いタイトルに対応。</p>
            <div className="space-y-3">
              {amdMiddle.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="AMD" />)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">APEXでミドルGPUで240fps出る？</h3>
              <p className="text-sm text-gray-400">フルHD・低〜中設定であればRTX 4060以上で240fps以上が安定して出せます。1440pでも最低設定なら240fps近くを狙えます。DLSS品質モードを使えばさらに余裕が生まれます。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-1">RTX 4060とRX 7600どちらがおすすめ？</h3>
              <p className="text-sm text-gray-400">DLSSを活用するゲームが多いならRTX 4060。VRAM容量を重視するならRX 7600（8GB）よりRX 7700 XT（12GB）が将来性で有利です。予算が同じなら性能比較サイトも参考にしてください。</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">チップセット・VRAM・価格で自分で絞り込む</p>
          <Link href="/gpus" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングGPU {gpus.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
