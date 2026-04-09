"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { earphones } from "@/data/earphones";

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const eA = slugA ? earphones.find((e) => e.slug === slugA) : null;
  const eB = slugB ? earphones.find((e) => e.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: eA?.brand, b: eB?.brand },
    { label: "接続方式", a: eA ? connLabel(eA.connection) : undefined, b: eB ? connLabel(eB.connection) : undefined },
    { label: "ドライバー", a: eA?.driver, b: eB?.driver },
    { label: "重さ", a: eA ? `${eA.weight}g` : undefined, b: eB ? `${eB.weight}g` : undefined, winLow: true },
    { label: "インピーダンス", a: eA?.impedance ? `${eA.impedance}Ω` : "—", b: eB?.impedance ? `${eB.impedance}Ω` : "—" },
    { label: "感度", a: eA?.sensitivity ? `${eA.sensitivity}dB` : "—", b: eB?.sensitivity ? `${eB.sensitivity}dB` : "—" },
    { label: "バッテリー", a: eA?.batteryLife ? `${eA.batteryLife}h` : "—", b: eB?.batteryLife ? `${eB.batteryLife}h` : "—", winHigh: true },
    { label: "遅延", a: eA?.latency ? `${eA.latency}ms` : "—", b: eB?.latency ? `${eB.latency}ms` : "—", winLow: true },
    { label: "マイク", a: eA ? (eA.microphone ? "あり" : "なし") : undefined, b: eB ? (eB.microphone ? "あり" : "なし") : undefined },
    { label: "ANC", a: eA ? (eA.anc ? "対応" : "非対応") : undefined, b: eB ? (eB.anc ? "対応" : "非対応") : undefined },
    { label: "価格", a: eA ? `¥${eA.price.toLocaleString()}` : undefined, b: eB ? `¥${eB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!eA || !eB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? (valA < valB && valA > 0) : (valB < valA && valB > 0);
    return false;
  };

  return (
    <>
      {(!eA || !eB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいイヤホンを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {earphones.map((e) => (
              <button key={e.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", e.slug); else if (!slugB && e.slug !== slugA) p.set("b", e.slug); else p.set("a", e.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{e.brand}</p>
                <p className="text-xs font-bold text-white">{e.name}</p>
                <p className="text-xs text-gray-400">{connLabel(e.connection)} · {e.driver} · ¥{e.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {eA && eB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/earphones/${eA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{eA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{eA.name}</p></Link>
            <Link href={`/earphones/${eB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{eB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{eB.name}</p></Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={eA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={eB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {eA && eB && <div className="mb-8 text-center"><Link href="/earphones/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のイヤホンを比較する</Link></div>}
    </>
  );
}

export default function EarphonesComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングイヤホン 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのイヤホンのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
