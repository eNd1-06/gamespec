import Link from "next/link";
import type { Metadata } from "next";
import { gpus } from "@/data/gpus";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "AMD Radeon ゲーミングGPUおすすめ2026【RX 7000シリーズ全モデル比較】",
  description: "AMD Radeon RXゲーミングGPUのおすすめをRX 7900 XTX・7800 XT・7600などシリーズ別に比較。FSR・高VRAMコスパモデルをスペックデータで厳選紹介。",
  alternates: { canonical: `${BASE_URL}/gpus/amd` },
  openGraph: {
    title: "AMD RadeonゲーミングGPUおすすめ2026 | GameSpec",
    description: "RX 7000シリーズのAMD GPUをVRAM・TDP・価格で比較。FSR対応でコスパ最強モデルを厳選。",
    type: "website",
    url: `${BASE_URL}/gpus/amd`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "AMD RadeonゲーミングGPUおすすめ2026 | GameSpec",
    description: "RX 7000シリーズのAMD GPUをスペックで比較。",
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

const amdGpus = [...gpus]
  .filter((g) => g.gpuBrand === "AMD")
  .sort((a, b) => calcScore(b) - calcScore(a));

const flagship = amdGpus.filter((g) => g.tier === "フラッグシップ");
const highend = amdGpus.filter((g) => g.tier === "ハイエンド");
const midrange = amdGpus.filter((g) => g.tier === "ミドル");
const entry = amdGpus.filter((g) => g.tier === "エントリー");

function GpuCard({ gpu, rank, badge }: { gpu: (typeof gpus)[0]; rank: number; badge?: string }) {
  return (
    <Link
      href={`/gpus/${gpu.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-red-500 rounded-xl p-4 transition-all group"
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
          {badge && <span className="text-xs bg-red-700 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {gpu.isNew && <span className="text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-red-400 leading-tight mb-2">{gpu.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full font-bold">{gpu.chipset}</span>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">VRAM {gpu.vram}GB</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">TDP {gpu.tdp}W</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.tier}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">¥{gpu.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function AmdGpuPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">ゲーミングGPU</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">AMDおすすめ</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">AMD Radeon ゲーミングGPUおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          RX 7000シリーズを中心にAMD Radeon GPUをティア別に比較。全{gpus.length}製品中、AMD{amdGpus.length}製品を掲載。同価格帯でVRAMが多くコスパに優れるモデルを厳選。
        </p>

        {/* AMDの強み */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold text-white mb-3">AMD Radeon RXシリーズの強み</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">同価格帯でVRAMが多い</span> — RTX 4060（8GB）に対してRX 7700 XT（12GB）など、VRAMを多く搭載するモデルが多く将来性が高い。</span></li>
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">FSR（FidelityFX Super Resolution）</span> — オープンソースのアップスケーリング技術で、NVIDIA製を含む幅広いGPUに対応。AMD GPU使用時はより高品質な結果が得られる。</span></li>
            <li className="flex gap-2"><span className="text-red-400 font-bold shrink-0">▶</span><span><span className="text-white font-bold">Radeon Anti-Lagで遅延を最小化</span> — CPUとGPU間のキューを最適化してシステム遅延を削減。FPS・APEXのような競技ゲームで有効。</span></li>
          </ul>
        </section>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {flagship.length > 0 && <li><a href="#flagship" className="text-sm text-blue-400 hover:text-blue-300">▶ フラッグシップ（RX 7900 XTX・XT）</a></li>}
            {highend.length > 0 && <li><a href="#highend" className="text-sm text-blue-400 hover:text-blue-300">▶ ハイエンド（RX 7800 XT・7900 GRE）</a></li>}
            {midrange.length > 0 && <li><a href="#midrange" className="text-sm text-blue-400 hover:text-blue-300">▶ ミドル（RX 7700 XT・7600 XT）</a></li>}
            {entry.length > 0 && <li><a href="#entry" className="text-sm text-blue-400 hover:text-blue-300">▶ エントリー（RX 7600・7500 XT）</a></li>}
          </ul>
        </nav>

        {flagship.length > 0 && (
          <section id="flagship" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">フラッグシップ（RX 7900 XTX・XT）</h2>
            <p className="text-xs text-gray-500 mb-4">4K最高設定・大容量VRAMが強み。クリエイティブ用途にも対応。</p>
            <div className="space-y-3">{flagship.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="最高性能" />)}</div>
          </section>
        )}
        {highend.length > 0 && (
          <section id="highend" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">ハイエンド（RX 7800 XT・7900 GRE）</h2>
            <p className="text-xs text-gray-500 mb-4">1440p高設定・4Kミドル設定をカバー。コスパ重視のパワーユーザー向け。</p>
            <div className="space-y-3">{highend.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="ハイエンド" />)}</div>
          </section>
        )}
        {midrange.length > 0 && (
          <section id="midrange" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">ミドル（RX 7700 XT・7600 XT）</h2>
            <p className="text-xs text-gray-500 mb-4">VRAM重視のコスパゾーン。同価格NVIDIA比でVRAMが多いモデルが多い。</p>
            <div className="space-y-3">{midrange.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="ミドル" />)}</div>
          </section>
        )}
        {entry.length > 0 && (
          <section id="entry" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">エントリー（RX 7600・7500 XT）</h2>
            <p className="text-xs text-gray-500 mb-4">初めてのゲーミングPC・予算重視の方向け。フルHD144Hzを安定して動かせる。</p>
            <div className="space-y-3">{entry.map((g, i) => <GpuCard key={g.slug} gpu={g} rank={i + 1} badge="エントリー" />)}</div>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/gpus/nvidia" className="bg-gray-900 border border-gray-800 hover:border-green-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">NVIDIA GPU一覧</p>
            <p className="text-xs text-gray-400">RTX 50・40シリーズを見る</p>
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
