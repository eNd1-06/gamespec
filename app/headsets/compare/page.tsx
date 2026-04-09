"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { headsets } from "@/data/headsets";

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

const POPULAR_PAIRS = [
  ["steelseries-arctis-nova-pro-wireless", "logicool-g-pro-x-2-lightspeed"],
  ["razer-blackshark-v2-pro-2023", "hyperx-cloud-alpha-wireless"],
].filter(([a, b]) => headsets.find((h) => h.slug === a) && headsets.find((h) => h.slug === b));

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const hA = slugA ? headsets.find((h) => h.slug === slugA) : null;
  const hB = slugB ? headsets.find((h) => h.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: hA?.brand, b: hB?.brand },
    { label: "接続方式", a: hA ? connLabel(hA.connection) : undefined, b: hB ? connLabel(hB.connection) : undefined },
    { label: "無線規格", a: hA?.wirelessProtocol ?? "—", b: hB?.wirelessProtocol ?? "—" },
    { label: "ドライバーサイズ", a: hA ? `${hA.driverSize}mm` : undefined, b: hB ? `${hB.driverSize}mm` : undefined },
    { label: "重さ", a: hA ? `${hA.weight}g` : undefined, b: hB ? `${hB.weight}g` : undefined, winLow: true },
    { label: "バッテリー", a: hA?.batteryLife ? `${hA.batteryLife}h` : "—", b: hB?.batteryLife ? `${hB.batteryLife}h` : "—", winHigh: true },
    { label: "マイク", a: hA ? (hA.microphone ? "あり" : "なし") : undefined, b: hB ? (hB.microphone ? "あり" : "なし") : undefined },
    { label: "着脱式マイク", a: hA ? (hA.micDetachable ? "着脱可" : "固定") : undefined, b: hB ? (hB.micDetachable ? "着脱可" : "固定") : undefined },
    { label: "ANC", a: hA ? (hA.anc ? "対応" : "非対応") : undefined, b: hB ? (hB.anc ? "対応" : "非対応") : undefined },
    { label: "バーチャルサラウンド", a: hA ? (hA.virtualSurround ? "対応" : "非対応") : undefined, b: hB ? (hB.virtualSurround ? "対応" : "非対応") : undefined },
    { label: "価格", a: hA ? `¥${hA.price.toLocaleString()}` : undefined, b: hB ? `¥${hB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!hA || !hB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!hA || !hB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいヘッドセットを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {headsets.map((h) => (
              <button key={h.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", h.slug); else if (!slugB && h.slug !== slugA) p.set("b", h.slug); else p.set("a", h.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{h.brand}</p>
                <p className="text-xs font-bold text-white">{h.name}</p>
                <p className="text-xs text-gray-400">{h.weight}g · {connLabel(h.connection)} · ¥{h.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {hA && hB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/headsets/${hA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{hA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{hA.name}</p></Link>
            <Link href={`/headsets/${hB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{hB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{hB.name}</p></Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={hA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={hB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {hA && hB && <div className="mb-8 text-center"><Link href="/headsets/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のヘッドセットを比較する</Link></div>}
      {POPULAR_PAIRS.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-300 mb-4">人気の比較</h2>
          <div className="space-y-2">
            {POPULAR_PAIRS.map(([a, b]) => { const ha = headsets.find((h) => h.slug === a)!; const hb = headsets.find((h) => h.slug === b)!; return <Link key={`${a}-${b}`} href={`/headsets/compare?a=${a}&b=${b}`} className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-all group"><span className="text-sm text-white group-hover:text-blue-400">{ha.name} vs {hb.name}</span><span className="text-xs text-gray-500">比較する →</span></Link>; })}
          </div>
        </div>
      )}
    </>
  );
}

export default function HeadsetsComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/headsets" className="text-gray-400 hover:text-white text-sm">ゲーミングヘッドセット</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングヘッドセット 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのヘッドセットのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
