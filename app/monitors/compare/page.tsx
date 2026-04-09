"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { monitors } from "@/data/monitors";

const POPULAR_PAIRS = [
  ["lg-27gp850-b", "asus-tuf-vg27aq"],
  ["benq-zowie-xl2546k", "asus-rog-swift-pg259qn"],
].filter(([a, b]) => monitors.find((m) => m.slug === a) && monitors.find((m) => m.slug === b));

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a");
  const slugB = searchParams.get("b");
  const mA = slugA ? monitors.find((m) => m.slug === slugA) : null;
  const mB = slugB ? monitors.find((m) => m.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: mA?.brand, b: mB?.brand },
    { label: "画面サイズ", a: mA ? `${mA.size}インチ` : undefined, b: mB ? `${mB.size}インチ` : undefined },
    { label: "解像度", a: mA?.resolution, b: mB?.resolution },
    { label: "リフレッシュレート", a: mA ? `${mA.refreshRate}Hz` : undefined, b: mB ? `${mB.refreshRate}Hz` : undefined, winHigh: true },
    { label: "応答速度", a: mA ? `${mA.responseTime}ms` : undefined, b: mB ? `${mB.responseTime}ms` : undefined, winLow: true },
    { label: "パネル", a: mA?.panelType, b: mB?.panelType },
    { label: "HDR", a: mA ? (mA.hdr ? "対応" : "非対応") : undefined, b: mB ? (mB.hdr ? "対応" : "非対応") : undefined },
    { label: "G-Sync", a: mA ? (mA.gsync ? "対応" : "—") : undefined, b: mB ? (mB.gsync ? "対応" : "—") : undefined },
    { label: "FreeSync", a: mA ? (mA.freesync ? "対応" : "—") : undefined, b: mB ? (mB.freesync ? "対応" : "—") : undefined },
    { label: "曲面", a: mA ? (mA.curved ? "あり" : "なし") : undefined, b: mB ? (mB.curved ? "あり" : "なし") : undefined },
    { label: "価格", a: mA ? `¥${mA.price.toLocaleString()}` : undefined, b: mB ? `¥${mB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!mA || !mB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!mA || !mB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいモニターを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {monitors.map((m) => (
              <button key={m.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", m.slug); else if (!slugB && m.slug !== slugA) p.set("b", m.slug); else p.set("a", m.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{m.brand}</p>
                <p className="text-xs font-bold text-white">{m.name}</p>
                <p className="text-xs text-gray-400">{m.refreshRate}Hz · {m.resolution} · ¥{m.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {mA && mB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/monitors/${mA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center">
              <p className="text-xs text-gray-500 mb-1">{mA.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{mA.name}</p>
            </Link>
            <Link href={`/monitors/${mB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center">
              <p className="text-xs text-gray-500 mb-1">{mB.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{mB.name}</p>
            </Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={mA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={mB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {mA && mB && <div className="mb-8 text-center"><Link href="/monitors/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のモニターを比較する</Link></div>}
      {POPULAR_PAIRS.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-300 mb-4">人気の比較</h2>
          <div className="space-y-2">
            {POPULAR_PAIRS.map(([a, b]) => {
              const ma = monitors.find((m) => m.slug === a)!; const mb = monitors.find((m) => m.slug === b)!;
              return <Link key={`${a}-${b}`} href={`/monitors/compare?a=${a}&b=${b}`} className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-all group"><span className="text-sm text-white group-hover:text-blue-400">{ma.name} vs {mb.name}</span><span className="text-xs text-gray-500">比較する →</span></Link>;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function MonitorsComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングモニター 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのモニターのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
