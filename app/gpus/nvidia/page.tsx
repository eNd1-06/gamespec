import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "NVIDIAゲーミングGPUおすすめ2026【RTX 50・40シリーズ全モデル比較】",
  description: "NVIDIAゲーミングGPUのおすすめをRTX 5090・5080・4090・4070・4060などシリーズ別に比較。DLSS・レイトレーシング対応モデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/gpus/nvidia` },
  openGraph: {
    title: "NVIDIAゲーミングGPUおすすめ2026 | GameSpec",
    description: "RTX 50・40シリーズのNVIDIA GPUをVRAM・TDP・価格で比較。",
    type: "website",
    url: `${BASE_URL}/gpus/nvidia`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "NVIDIAゲーミングGPUおすすめ2026 | GameSpec",
    description: "RTX 50・40シリーズのNVIDIA GPUをスペックで比較。",
  },
};

function calcScore(g: (typeof gpus)[0]): number {
  const clockScore = Math.min(g.boostClock / 3000, 1) * 30;
  const vramScore = Math.min(g.vram / 32, 1) * 25;
  const tdpScore = Math.max(0, (600 - g.tdp) / 600) * 15;
  const priceScore = Math.max(0, (200000 - g.price) / 200000) * 20;
  const newScore = g.releaseYear >= 2025 ? 10 : g.releaseYear >= 2024 ? 7 : 4;
  return clockScore + vramScore + tdpScore + priceScore + newScore;
}

const nvidiaGpus = [...gpus]
  .filter((g) => g.gpuBrand === "NVIDIA")
  .sort((a, b) => calcScore(b) - calcScore(a));

const flagship = nvidiaGpus.filter((g) => g.tier === "フラッグシップ");
const highend = nvidiaGpus.filter((g) => g.tier === "ハイエンド");
const midrange = nvidiaGpus.filter((g) => g.tier === "ミドル");
const entry = nvidiaGpus.filter((g) => g.tier === "エントリー");

function GpuCard({ gpu, rank, badge }: { gpu: (typeof gpus)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/gpus/${gpu.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-green-500 rounded-xl p-4 transition-all group"
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
          {badge && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {gpu.isNew && <span className="text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-green-400 leading-tight mb-2">{gpu.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-bold">{gpu.chipset}</span>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">VRAM {gpu.vram}GB</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">TDP {gpu.tdp}W</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.tier}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{gpu.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function NvidiaGpuPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">ゲーミングGPU</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">NVIDIAおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">NVIDIAゲーミングGPUおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          RTX 50・RTX 40シリーズのNVIDIA GPUをティア別に比較。全{gpus.length}製品中、NVIDIA{nvidiaGpus.length}製品を掲載。DLSS 4・フレーム生成・レイトレーシング対応モデルを厳選。
        </p>

        {/* NVIDIAの強み */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">NVIDIA RTXシリーズの強み</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-green-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">DLSS 4（マルチフレーム生成）</span> — AIによるアップスケーリング＋フレーム補完で、実際のレンダリング負荷を大幅削減しながらフレームレートを大幅向上。</span></li>
            <li className="flex gap-2"><span className="text-green-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">レイトレーシング性能が最高クラス</span> — リアルタイムレイトレーシングの対応ゲームで圧倒的な画質を実現。RTコアの世代ごとに大幅強化。</span></li>
            <li className="flex gap-2"><span className="text-green-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">GeForce Experienceで録画・配信も簡単</span> — ShadowPlayによる低負荷録画・配信機能が標準搭載。ストリーマーにも人気。</span></li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {flagship.length > 0 && <li><a href="#flagship" className="text-sm text-blue-400 hover:text-blue-300">▶ フラッグシップ（RTX 5090・5080）</a></li>}
            {highend.length > 0 && <li><a href="#highend" className="text-sm text-blue-400 hover:text-blue-300">▶ ハイエンド（RTX 5070 Ti・4090・4080）</a></li>}
            {midrange.length > 0 && <li><a href="#midrange" className="text-sm text-blue-400 hover:text-blue-300">▶ ミドル（RTX 5070・4070・4060 Ti）</a></li>}
            {entry.length > 0 && <li><a href="#entry" className="text-sm text-blue-400 hover:text-blue-300">▶ エントリー（RTX 4060・4050）</a></li>}
          </ul>
        </nav>

        {flagship.length > 0 && (
          <section id="flagship" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">フラッグシップ（RTX 5090・5080）</h2>
            <p className="text-xs text-gray-500 mb-4">妥協なき最高性能。4K・8K・最高画質でのゲーム・クリエイティブ作業向け。</p>
            <div className="space-y-3">{flagship.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="最高性能" />)}</div>
          </section>
        )}
        {highend.length > 0 && (
          <section id="highend" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">ハイエンド（RTX 4090・4080・5070 Ti）</h2>
            <p className="text-xs text-gray-500 mb-4">4K高フレームレート・1440p最高設定を快適に動かせるクラス。</p>
            <div className="space-y-3">{highend.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="ハイエンド" />)}</div>
          </section>
        )}
        {midrange.length > 0 && (
          <section id="midrange" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">ミドル（RTX 5070・4070・4060 Ti）</h2>
            <p className="text-xs text-gray-500 mb-4">FPS・APEX向け1080p〜1440p高フレームレートを実現するコスパゾーン。</p>
            <div className="space-y-3">{midrange.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="ミドル" />)}</div>
          </section>
        )}
        {entry.length > 0 && (
          <section id="entry" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">エントリー（RTX 4060・4050）</h2>
            <p className="text-xs text-gray-500 mb-4">初めてのゲーミングPC・予算重視の方向け。フルHD144Hzを安定して動かせる。</p>
            <div className="space-y-3">{entry.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="エントリー" />)}</div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/gpus/amd" className="bg-gray-900 border border-gray-800 hover:border-red-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">AMD GPU一覧</p>
            <p className="text-xs text-gray-400">RX 7000シリーズを見る</p>
          </Link>
          <Link href="/gpus/midrange" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">ミドルレンジGPU比較</p>
            <p className="text-xs text-gray-400">NVIDIA・AMD混合コスパ比較</p>
          </Link>
        </div>

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
