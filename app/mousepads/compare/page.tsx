"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { mousepads } from "@/data/mousepads";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const pA = slugA ? mousepads.find((p) => p.slug === slugA) : null;
  const pB = slugB ? mousepads.find((p) => p.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: pA?.brand, b: pB?.brand },
    { label: "サイズ区分", a: pA?.size, b: pB?.size },
    { label: "縦×横", a: pA ? `${pA.height}×${pA.width}mm` : undefined, b: pB ? `${pB.height}×${pB.width}mm` : undefined },
    { label: "厚さ", a: pA ? `${pA.thickness}mm` : undefined, b: pB ? `${pB.thickness}mm` : undefined, winHigh: true },
    { label: "滑り感", a: pA?.surface, b: pB?.surface },
    { label: "素材", a: pA?.material, b: pB?.material },
    { label: "ステッチ縁", a: pA ? (pA.stitchedEdge ? "あり" : "なし") : undefined, b: pB ? (pB.stitchedEdge ? "あり" : "なし") : undefined },
    { label: "RGB", a: pA ? (pA.rgb ? "あり" : "なし") : undefined, b: pB ? (pB.rgb ? "あり" : "なし") : undefined },
    { label: "価格", a: pA ? `¥${pA.price.toLocaleString()}` : undefined, b: pB ? `¥${pB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!pA || !pB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!pA || !pB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいマウスパッドを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {mousepads.map((p) => (
              <button key={p.slug} onClick={() => { const params = new URLSearchParams(window.location.search); if (!slugA) params.set("a", p.slug); else if (!slugB && p.slug !== slugA) params.set("b", p.slug); else params.set("a", p.slug); window.history.replaceState(null, "", `?${params.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{p.brand}</p>
                <p className="text-xs font-bold text-white">{p.name}</p>
                <p className="text-xs text-gray-400">{p.size} · {p.surface} · ¥{p.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {pA && pB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/mousepads/${pA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{pA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{pA.name}</p></Link>
            <Link href={`/mousepads/${pB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{pB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{pB.name}</p></Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={pA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={pB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {pA && pB && <div className="mb-8 text-center"><Link href="/mousepads/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のマウスパッドを比較する</Link></div>}
    </>
  );
}

export default function MousepadsComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mousepads" className="text-gray-400 hover:text-white text-sm">ゲーミングマウスパッド</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウスパッド 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのマウスパッドのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
