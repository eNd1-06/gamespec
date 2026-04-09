"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { mice } from "@/data/mice";

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";
const shapeLabel = (s: string) =>
  s === "symmetrical" ? "左右対称" : "エルゴノミクス";

const POPULAR_PAIRS = [
  ["logicool-g-pro-x-superlight-2", "razer-viper-v3-pro"],
  ["logicool-g-pro-x-superlight-2", "finalmouse-starlight-12"],
  ["razer-deathadder-v3", "pulsar-xlite-v3"],
  ["razer-viper-v3-pro", "zowie-ec2-c"],
].filter(([a, b]) => mice.find((m) => m.slug === a) && mice.find((m) => m.slug === b));

function CompareContent() {
  const searchParams = useSearchParams();
  const slugA = searchParams.get("a");
  const slugB = searchParams.get("b");

  const mouseA = slugA ? mice.find((m) => m.slug === slugA) : null;
  const mouseB = slugB ? mice.find((m) => m.slug === slugB) : null;

  const rows = [
    { label: "ブランド", a: mouseA?.brand, b: mouseB?.brand },
    { label: "重さ", a: mouseA ? `${mouseA.weight}g` : undefined, b: mouseB ? `${mouseB.weight}g` : undefined, winLow: true },
    { label: "センサー", a: mouseA?.sensor, b: mouseB?.sensor },
    { label: "最大DPI", a: mouseA ? mouseA.maxDpi.toLocaleString() : undefined, b: mouseB ? mouseB.maxDpi.toLocaleString() : undefined, winHigh: true },
    { label: "ポーリングレート", a: mouseA ? `${mouseA.pollingRate}Hz` : undefined, b: mouseB ? `${mouseB.pollingRate}Hz` : undefined, winHigh: true },
    { label: "接続方式", a: mouseA ? connectionLabel(mouseA.connection) : undefined, b: mouseB ? connectionLabel(mouseB.connection) : undefined },
    { label: "形状", a: mouseA ? shapeLabel(mouseA.shape) : undefined, b: mouseB ? shapeLabel(mouseB.shape) : undefined },
    { label: "ボタン数", a: mouseA ? `${mouseA.buttons}個` : undefined, b: mouseB ? `${mouseB.buttons}個` : undefined },
    { label: "RGB", a: mouseA ? (mouseA.rgb ? "あり" : "なし") : undefined, b: mouseB ? (mouseB.rgb ? "あり" : "なし") : undefined },
    { label: "サイズ", a: mouseA ? `${mouseA.length}×${mouseA.width}×${mouseA.height}mm` : undefined, b: mouseB ? `${mouseB.length}×${mouseB.width}×${mouseB.height}mm` : undefined },
    { label: "発売年", a: mouseA ? `${mouseA.releaseYear}年` : undefined, b: mouseB ? `${mouseB.releaseYear}年` : undefined },
    { label: "価格", a: mouseA ? `¥${mouseA.price.toLocaleString()}` : undefined, b: mouseB ? `¥${mouseB.price.toLocaleString()}` : undefined, winLow: true },
  ];

  const getWinner = (row: typeof rows[0], side: "a" | "b") => {
    if (!mouseA || !mouseB) return false;
    if (row.winHigh) {
      const numA = side === "a" ? mouseA.pollingRate || mouseA.maxDpi : mouseB.pollingRate || mouseB.maxDpi;
      const numB = side === "b" ? mouseA.pollingRate || mouseA.maxDpi : mouseB.pollingRate || mouseB.maxDpi;
      // parse from label
      const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
      const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
      return side === "a" ? valA > valB : valB > valA;
    }
    if (row.winLow) {
      const valA = parseFloat(row.a?.replace(/[^0-9.]/g, "") || "0");
      const valB = parseFloat(row.b?.replace(/[^0-9.]/g, "") || "0");
      return side === "a" ? valA < valB : valB < valA;
    }
    return false;
  };

  return (
    <>
      {/* 製品選択 */}
      {(!mouseA || !mouseB) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4">比較したいマウスを選んでください</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {mice.map((m) => (
              <button
                key={m.slug}
                onClick={() => {
                  const p = new URLSearchParams(window.location.search);
                  if (!slugA) p.set("a", m.slug);
                  else if (!slugB && m.slug !== slugA) p.set("b", m.slug);
                  else p.set("a", m.slug);
                  window.history.replaceState(null, "", `?${p.toString()}`);
                  window.location.reload();
                }}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all"
              >
                <p className="text-xs text-gray-500">{m.brand}</p>
                <p className="text-xs font-bold text-white">{m.name}</p>
                <p className="text-xs text-gray-400">{m.weight}g · ¥{m.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 比較テーブル */}
      {mouseA && mouseB && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
          {/* ヘッダー */}
          <div className="grid grid-cols-3 border-b border-gray-800">
            <div className="p-4 border-r border-gray-800" />
            <Link href={`/mice/${mouseA.slug}`} className="p-4 border-r border-gray-800 hover:bg-gray-800 transition-all group text-center">
              <p className="text-xs text-gray-500 mb-1">{mouseA.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{mouseA.name}</p>
              <p className="text-xs text-gray-400 mt-1">{mouseA.weight}g</p>
            </Link>
            <Link href={`/mice/${mouseB.slug}`} className="p-4 hover:bg-gray-800 transition-all group text-center">
              <p className="text-xs text-gray-500 mb-1">{mouseB.brand}</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{mouseB.name}</p>
              <p className="text-xs text-gray-400 mt-1">{mouseB.weight}g</p>
            </Link>
          </div>

          {/* スペック行 */}
          {rows.map((row) => {
            const winA = getWinner(row, "a");
            const winB = getWinner(row, "b");
            return (
              <div key={row.label} className="grid grid-cols-3 border-b border-gray-800 last:border-b-0">
                <div className="px-4 py-3 border-r border-gray-800 flex items-center">
                  <span className="text-xs text-gray-500">{row.label}</span>
                </div>
                <div className={`px-4 py-3 border-r border-gray-800 flex items-center justify-center ${winA ? "bg-blue-950" : ""}`}>
                  <span className={`text-sm font-medium ${winA ? "text-blue-300" : "text-gray-300"}`}>
                    {winA && "✓ "}{row.a ?? "—"}
                  </span>
                </div>
                <div className={`px-4 py-3 flex items-center justify-center ${winB ? "bg-blue-950" : ""}`}>
                  <span className={`text-sm font-medium ${winB ? "text-blue-300" : "text-gray-300"}`}>
                    {winB && "✓ "}{row.b ?? "—"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Amazonリンク */}
          <div className="grid grid-cols-3 bg-gray-800">
            <div className="p-4 border-r border-gray-700" />
            <div className="p-4 border-r border-gray-700 text-center">
              <a href={mouseA.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
            <div className="p-4 text-center">
              <a href={mouseB.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg transition-all">
                Amazonで見る →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 別の製品と比較 */}
      {mouseA && mouseB && (
        <div className="mb-8 text-center">
          <Link href="/mice/compare" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-2 inline-block">
            別のマウスを比較する
          </Link>
        </div>
      )}

      {/* 人気の比較 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-gray-300 mb-4">人気の比較</h2>
        <div className="space-y-2">
          {POPULAR_PAIRS.map(([a, b]) => {
            const mA = mice.find((m) => m.slug === a)!;
            const mB = mice.find((m) => m.slug === b)!;
            return (
              <Link key={`${a}-${b}`} href={`/mice/compare?a=${a}&b=${b}`}
                className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition-all group">
                <span className="text-sm text-white group-hover:text-blue-400">
                  {mA.name} vs {mB.name}
                </span>
                <span className="text-xs text-gray-500">比較する →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function MiceComparePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウス 比較</h1>
        <p className="text-sm text-gray-400 mb-8">2つのマウスのスペックを並べて比較できます。</p>
        <Suspense fallback={<div className="text-gray-400 text-sm">読み込み中...</div>}>
          <CompareContent />
        </Suspense>
      </main>
    </div>
  );
}
