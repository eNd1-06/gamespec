"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mousepads } from "@/data/mousepads";
import type { MousepadSurface, MousepadMaterial, MousepadSize, MousepadTag } from "@/data/mousepads";

export default function MousepadPage() {
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [size, setSize] = useState<MousepadSize | "all">("all");
  const [surface, setSurface] = useState<MousepadSurface | "all">("all");
  const [material, setMaterial] = useState<MousepadMaterial | "all">("all");
  const [tag, setTag] = useState<MousepadTag | "all">("all");
  const [stitchedOnly, setStitchedOnly] = useState(false);
  const [rgbOnly, setRgbOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "size">("price");

  const filtered = useMemo(() => {
    return mousepads
      .filter((p) => {
        if (p.price > maxPrice) return false;
        if (size !== "all" && p.size !== size) return false;
        if (surface !== "all" && p.surface !== surface) return false;
        if (material !== "all" && p.material !== material) return false;
        if (tag !== "all" && !p.recommendFor.includes(tag)) return false;
        if (stitchedOnly && !p.stitchedEdge) return false;
        if (rgbOnly && !p.rgb) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        const sizeOrder: MousepadSize[] = ["S", "M", "L", "XL", "XXL"];
        return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
      });
  }, [maxPrice, size, surface, material, tag, stitchedOnly, rgbOnly, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🖱️ ゲーミングマウスパッド</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-gray-400">サイズ・滑り感・素材・価格でゲーミングマウスパッドを絞り込めるスペックデータベース。速度系・コントロール系・ガラス製まで<span className="text-white font-medium">{mousepads.length}製品</span>を掲載。</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* フィルターパネル */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5 sticky top-4">
            <h2 className="text-sm font-bold text-gray-300">絞り込み</h2>

            {/* 価格 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                価格：¥{maxPrice.toLocaleString()} 以下
              </label>
              <input
                type="range"
                min={1000} max={20000} step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥1,000</span><span>¥20,000</span>
              </div>
            </div>

            {/* サイズ */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">サイズ</label>
              <div className="space-y-1">
                {(["all", "S", "M", "L", "XL", "XXL"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      size === s
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {s === "all" ? "すべて" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* 滑り感 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">滑り感</label>
              <div className="space-y-1">
                {(["all", "速度系", "バランス系", "コントロール系"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSurface(s)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      surface === s
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {s === "all" ? "すべて" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* 素材 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">素材</label>
              <div className="space-y-1">
                {(["all", "布", "ガラス", "ハイブリッド"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMaterial(m)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      material === m
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {m === "all" ? "すべて" : m}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "apex", "fps", "competitive", "casual"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "apex" ? "APEX" : t === "fps" ? "FPS全般" : t === "competitive" ? "競技向け" : "カジュアル"}
                  </button>
                ))}
              </div>
            </div>

            {/* トグル */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stitchedOnly}
                  onChange={(e) => setStitchedOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">ステッチ縁のみ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rgbOnly}
                  onChange={(e) => setRgbOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">RGB搭載のみ</span>
              </label>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(20000);
                setSize("all");
                setSurface("all");
                setMaterial("all");
                setTag("all");
                setStitchedOnly(false);
                setRgbOnly(false);
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-lg py-1.5 transition-all"
            >
              リセット
            </button>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          {/* 検索バー */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="マウスパッド名・ブランドで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-gray-600"
            />
          </div>

          {/* ソートと件数 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              <span className="text-white font-bold">{filtered.length}</span> 件
            </p>
            <div className="flex gap-2">
              {(["price", "size"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : "小さい順"}
                </button>
              ))}
            </div>
          </div>

          {/* マウスパッド一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              条件に一致するマウスパッドが見つかりません
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((pad) => (
                <Link
                  key={pad.slug}
                  href={`/mousepads/${pad.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{pad.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{pad.name}</h3>
                    </div>
                    {pad.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{pad.size}サイズ</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      pad.surface === "速度系" ? "bg-blue-900 text-blue-300" :
                      pad.surface === "コントロール系" ? "bg-orange-900 text-orange-300" :
                      "bg-green-900 text-green-300"
                    }`}>{pad.surface}</span>
                    {pad.material !== "布" && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">{pad.material}</span>
                    )}
                    {pad.stitchedEdge && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">ステッチ縁</span>
                    )}
                    {pad.rgb && (
                      <span className="text-xs bg-pink-900 text-pink-300 px-2 py-0.5 rounded-full">RGB</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{pad.width} × {pad.height} mm · 厚さ{pad.thickness}mm</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{pad.price.toLocaleString()}</span>
                    <span className="text-xs text-blue-400 group-hover:text-blue-300">詳細 →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
