"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { chairs } from "@/data/chairs";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const cA = slugA ? chairs.find((c) => c.slug === slugA) : null;
  const cB = slugB ? chairs.find((c) => c.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: cA?.brand, b: cB?.brand },
    { label: "タイプ", a: cA?.type, b: cB?.type },
    { label: "素材", a: cA?.material, b: cB?.material },
    { label: "座面幅", a: cA ? `${cA.seatWidth}cm` : undefined, b: cB ? `${cB.seatWidth}cm` : undefined },
    { label: "アームレスト", a: cA?.armrest, b: cB?.armrest },
    { label: "リクライニング", a: cA ? `${cA.recliningAngle}°` : undefined, b: cB ? `${cB.recliningAngle}°` : undefined, winHigh: true },
    { label: "耐荷重", a: cA ? `${cA.maxLoadWeight}kg` : undefined, b: cB ? `${cB.maxLoadWeight}kg` : undefined, winHigh: true },
    { label: "ランバーサポート", a: cA ? (cA.lumbarSupport ? "あり" : "なし") : undefined, b: cB ? (cB.lumbarSupport ? "あり" : "なし") : undefined },
    { label: "ネックピロー", a: cA ? (cA.neckSupport ? "あり" : "なし") : undefined, b: cB ? (cB.neckSupport ? "あり" : "なし") : undefined },
    { label: "フットレスト", a: cA ? (cA.footrest ? "あり" : "なし") : undefined, b: cB ? (cB.footrest ? "あり" : "なし") : undefined },
    { label: "RGB", a: cA ? (cA.rgb ? "あり" : "なし") : undefined, b: cB ? (cB.rgb ? "あり" : "なし") : undefined },
    { label: "価格", a: cA ? `¥${cA.price.toLocaleString()}` : undefined, b: cB ? `¥${cB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!cA || !cB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!cA || !cB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいチェアを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {chairs.map((c) => (
              <button key={c.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", c.slug); else if (!slugB && c.slug !== slugA) p.set("b", c.slug); else p.set("a", c.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{c.brand} · {c.type}</p>
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-xs text-gray-400">{c.material} · ¥{c.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {cA && cB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/chairs/${cA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{cA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{cA.name}</p></Link>
            <Link href={`/chairs/${cB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{cB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{cB.name}</p></Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={cA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={cB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {cA && cB && <div className="mb-8 text-center"><Link href="/chairs/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のチェアを比較する</Link></div>}
    </>
  );
}

export default function ChairsComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/chairs" className="text-gray-400 hover:text-white text-sm">ゲーミングチェア</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングチェア 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのゲーミングチェアのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
