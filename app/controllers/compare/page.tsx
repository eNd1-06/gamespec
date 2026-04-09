"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { controllers } from "@/data/controllers";

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const cA = slugA ? controllers.find((c) => c.slug === slugA) : null;
  const cB = slugB ? controllers.find((c) => c.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: cA?.brand, b: cB?.brand },
    { label: "対応プラットフォーム", a: cA?.platform, b: cB?.platform },
    { label: "接続方式", a: cA ? connLabel(cA.connection) : undefined, b: cB ? connLabel(cB.connection) : undefined },
    { label: "重さ", a: cA ? `${cA.weight}g` : undefined, b: cB ? `${cB.weight}g` : undefined, winLow: true },
    { label: "バッテリー", a: cA?.batteryLife ? `${cA.batteryLife}h` : "—", b: cB?.batteryLife ? `${cB.batteryLife}h` : "—", winHigh: true },
    { label: "背面ボタン", a: cA ? (cA.backButtons ? "あり" : "なし") : undefined, b: cB ? (cB.backButtons ? "あり" : "なし") : undefined },
    { label: "トリガーストップ", a: cA ? (cA.triggerStop ? "あり" : "なし") : undefined, b: cB ? (cB.triggerStop ? "あり" : "なし") : undefined },
    { label: "ハプティック", a: cA ? (cA.haptic ? "高度" : "標準") : undefined, b: cB ? (cB.haptic ? "高度" : "標準") : undefined },
    { label: "アダプティブトリガー", a: cA ? (cA.adaptiveTriggers ? "対応" : "非対応") : undefined, b: cB ? (cB.adaptiveTriggers ? "対応" : "非対応") : undefined },
    { label: "ジャイロ", a: cA ? (cA.gyro ? "対応" : "非対応") : undefined, b: cB ? (cB.gyro ? "対応" : "非対応") : undefined },
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
          <p className="text-sm text-gray-400 mb-4">比較したいコントローラーを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {controllers.map((c) => (
              <button key={c.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", c.slug); else if (!slugB && c.slug !== slugA) p.set("b", c.slug); else p.set("a", c.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{c.brand} · {c.platform}</p>
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-xs text-gray-400">{connLabel(c.connection)} · ¥{c.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {cA && cB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/controllers/${cA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{cA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{cA.name}</p></Link>
            <Link href={`/controllers/${cB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{cB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{cB.name}</p></Link>
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
      {cA && cB && <div className="mb-8 text-center"><Link href="/controllers/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のコントローラーを比較する</Link></div>}
    </>
  );
}

export default function ControllersComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/controllers" className="text-gray-400 hover:text-white text-sm">ゲームコントローラー</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲームコントローラー 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのコントローラーのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
