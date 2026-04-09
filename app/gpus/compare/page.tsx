"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { gpus } from "@/data/gpus";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const gA = slugA ? gpus.find((g) => g.slug === slugA) : null;
  const gB = slugB ? gpus.find((g) => g.slug === slugB) : null;

  const rows = [
    { label: "ブランド（ボード）", a: gA?.brand, b: gB?.brand },
    { label: "GPUメーカー", a: gA?.gpuBrand, b: gB?.gpuBrand },
    { label: "チップセット", a: gA?.chipset, b: gB?.chipset },
    { label: "VRAM", a: gA ? `${gA.vram}GB` : undefined, b: gB ? `${gB.vram}GB` : undefined, winHigh: true },
    { label: "メモリタイプ", a: gA?.memoryType, b: gB?.memoryType },
    { label: "メモリバス", a: gA ? `${gA.memoryBus}bit` : undefined, b: gB ? `${gB.memoryBus}bit` : undefined, winHigh: true },
    { label: "ブーストクロック", a: gA ? `${gA.boostClock}MHz` : undefined, b: gB ? `${gB.boostClock}MHz` : undefined, winHigh: true },
    { label: "TDP", a: gA ? `${gA.tdp}W` : undefined, b: gB ? `${gB.tdp}W` : undefined, winLow: true },
    { label: "ティア", a: gA?.tier, b: gB?.tier },
    { label: "出力端子", a: gA?.outputs, b: gB?.outputs },
    { label: "価格", a: gA ? `¥${gA.price.toLocaleString()}` : undefined, b: gB ? `¥${gB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!gA || !gB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!gA || !gB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいGPUを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {gpus.map((g) => (
              <button key={g.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", g.slug); else if (!slugB && g.slug !== slugA) p.set("b", g.slug); else p.set("a", g.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{g.brand} / {g.gpuBrand}</p>
                <p className="text-xs font-bold text-white">{g.chipset}</p>
                <p className="text-xs text-gray-400">VRAM {g.vram}GB · TDP {g.tdp}W · ¥{g.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {gA && gB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/gpus/${gA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{gA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{gA.chipset}</p></Link>
            <Link href={`/gpus/${gB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{gB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{gB.chipset}</p></Link>
          </div>
          {rows.map((row) => {
            const winA = getWinner(row, "a"); const winB = getWinner(row, "b");
            return (
              <div key={row.label} className="grid grid-cols-3 border-b border-gray-800 last:border-b-0">
                <div className="px-4 py-3 border-r border-gray-800"><span className="text-xs text-gray-500">{row.label}</span></div>
                <div className={`px-4 py-3 border-r border-gray-800 flex items-center justify-center ${winA ? "bg-blue-950" : ""}`}><span className={`text-sm font-medium ${winA ? "text-blue-300" : "text-gray-300"}`}>{winA && "✓ "}{row.a ?? "—"}</span></div>
                <div className={`px-4 py-3 flex items-center justify-center ${winB ? "bg-blue-950" : ""}`}><span className={`text-sm font-medium ${winB ? "text-blue-300" : "text-gray-300"}`}>{winB && "✓ "}{row.b ?? "—"}</span></div>
              </div>
            );
          })}
          <div className="grid grid-cols-3 bg-gray-800">
            <div className="p-4 border-r border-gray-700" />
            <div className="p-4 border-r border-gray-700 text-center"><a href={gA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={gB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {gA && gB && <div className="mb-8 text-center"><Link href="/gpus/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のGPUを比較する</Link></div>}
    </>
  );
}

export default function GpusComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/gpus" className="text-gray-400 hover:text-white text-sm">グラフィックボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">グラフィックボード 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのGPUのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
