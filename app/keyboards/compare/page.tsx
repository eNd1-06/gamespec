"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { keyboards } from "@/data/keyboards";

const connLabel = (c: string) => c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

const POPULAR_PAIRS = [
  ["logicool-g-pro-x-tkl-lightspeed", "razer-huntsman-v3-pro-tkl"],
  ["corsair-k100-air-wireless", "logicool-g915-tkl"],
].filter(([a, b]) => keyboards.find((k) => k.slug === a) && keyboards.find((k) => k.slug === b));

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a"); const slugB = searchParams.get("b");
  const kA = slugA ? keyboards.find((k) => k.slug === slugA) : null;
  const kB = slugB ? keyboards.find((k) => k.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: kA?.brand, b: kB?.brand },
    { label: "レイアウト", a: kA?.layout, b: kB?.layout },
    { label: "スイッチ", a: kA?.switchType, b: kB?.switchType },
    { label: "スイッチ名", a: kA?.switchName, b: kB?.switchName },
    { label: "接続方式", a: kA ? connLabel(kA.connection) : undefined, b: kB ? connLabel(kB.connection) : undefined },
    { label: "ポーリングレート", a: kA ? `${kA.pollingRate}Hz` : undefined, b: kB ? `${kB.pollingRate}Hz` : undefined, winHigh: true },
    { label: "アクチュエーション", a: kA ? `${kA.actuation}mm` : undefined, b: kB ? `${kB.actuation}mm` : undefined },
    { label: "ホットスワップ", a: kA ? (kA.hotswap ? "対応" : "非対応") : undefined, b: kB ? (kB.hotswap ? "対応" : "非対応") : undefined },
    { label: "バッテリー", a: kA?.batteryLife ? `${kA.batteryLife}h` : "—", b: kB?.batteryLife ? `${kB.batteryLife}h` : "—" },
    { label: "RGB", a: kA ? (kA.rgb ? "あり" : "なし") : undefined, b: kB ? (kB.rgb ? "あり" : "なし") : undefined },
    { label: "価格", a: kA ? `¥${kA.price.toLocaleString()}` : undefined, b: kB ? `¥${kB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!kA || !kB || (!row.winHigh && !row.winLow)) return false;
    const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
    const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
    if (row.winHigh) return side === "a" ? valA > valB : valB > valA;
    if (row.winLow) return side === "a" ? valA < valB : valB < valA;
    return false;
  };

  return (
    <>
      {(!kA || !kB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいキーボードを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {keyboards.map((k) => (
              <button key={k.slug} onClick={() => { const p = new URLSearchParams(window.location.search); if (!slugA) p.set("a", k.slug); else if (!slugB && k.slug !== slugA) p.set("b", k.slug); else p.set("a", k.slug); window.history.replaceState(null, "", `?${p.toString()}`); window.location.reload(); }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all">
                <p className="text-xs text-gray-500">{k.brand}</p>
                <p className="text-xs font-bold text-white">{k.name}</p>
                <p className="text-xs text-gray-400">{k.layout} · {k.switchType} · ¥{k.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {kA && kB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/keyboards/${kA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{kA.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{kA.name}</p></Link>
            <Link href={`/keyboards/${kB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center"><p className="text-xs text-gray-500 mb-1">{kB.brand}</p><p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{kB.name}</p></Link>
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
            <div className="p-4 border-r border-gray-700 text-center"><a href={kA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
            <div className="p-4 text-center"><a href={kB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg">Amazonで見る →</a></div>
          </div>
        </div>
      )}
      {kA && kB && <div className="mb-8 text-center"><Link href="/keyboards/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">別のキーボードを比較する</Link></div>}
      {POPULAR_PAIRS.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-300 mb-4">人気の比較</h2>
          <div className="space-y-2">
            {POPULAR_PAIRS.map(([a, b]) => { const ka = keyboards.find((k) => k.slug === a)!; const kb = keyboards.find((k) => k.slug === b)!; return <Link key={`${a}-${b}`} href={`/keyboards/compare?a=${a}&b=${b}`} className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-all group"><span className="text-sm text-white group-hover:text-blue-400">{ka.name} vs {kb.name}</span><span className="text-xs text-gray-500">比較する →</span></Link>; })}
          </div>
        </div>
      )}
    </>
  );
}

export default function KeyboardsComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/keyboards" className="text-gray-400 hover:text-white text-sm">ゲーミングキーボード</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングキーボード 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのキーボードのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}><CompareContent /></Suspense>
      </main>
    </div>
  );
}
