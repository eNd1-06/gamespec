"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { gpus } from "@/data/gpus";
import type { GpuBrand, GpuTier, GpuTag } from "@/data/gpus";

export default function GpuPage() {
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [gpuBrand, setGpuBrand] = useState<GpuBrand | "all">("all");
  const [tier, setTier] = useState<GpuTier | "all">("all");
  const [minVram, setMinVram] = useState<number>(0);
  const [tag, setTag] = useState<GpuTag | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "vram" | "tdp">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("brand")) setGpuBrand(p.get("brand") as GpuBrand | "all");
    if (p.get("tier")) setTier(p.get("tier") as GpuTier | "all");
    if (p.get("vram")) setMinVram(Number(p.get("vram")));
    if (p.get("tag")) setTag(p.get("tag") as GpuTag | "all");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "vram" | "tdp");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 400000) p.set("price", String(maxPrice));
    if (gpuBrand !== "all") p.set("brand", gpuBrand);
    if (tier !== "all") p.set("tier", tier);
    if (minVram > 0) p.set("vram", String(minVram));
    if (tag !== "all") p.set("tag", tag);
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, gpuBrand, tier, minVram, tag, search, sortBy]);

  const filtered = useMemo(() => {
    return gpus
      .filter((g) => {
        if (g.price > maxPrice) return false;
        if (gpuBrand !== "all" && g.gpuBrand !== gpuBrand) return false;
        if (tier !== "all" && g.tier !== tier) return false;
        if (g.vram < minVram) return false;
        if (tag !== "all" && !g.recommendFor.includes(tag)) return false;
        if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.brand.toLowerCase().includes(search.toLowerCase()) && !g.chipset.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "vram") return b.vram - a.vram;
        return a.tdp - b.tdp;
      });
  }, [maxPrice, gpuBrand, tier, minVram, tag, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🖥️ グラフィックボード</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">VRAM・チップセット・価格・TDPでゲーミングGPUを絞り込めるスペックデータベース。RTX 40/50シリーズ・RX 7000/9000シリーズまで<span className="text-white font-medium">{gpus.length}製品</span>を掲載。</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/gpus/compare" className="text-xs border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all">⚖️ 比較する</Link>
            <Link href="/gpus/ranking" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all">🏆 ランキング</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* フィルターパネル */}
        <aside className={`w-full lg:w-56 shrink-0 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5 lg:sticky lg:top-16">
            <h2 className="text-sm font-bold text-gray-300">絞り込み</h2>

            {/* 価格 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                価格：¥{maxPrice.toLocaleString()} 以下
              </label>
              <input
                type="range"
                min={30000} max={400000} step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥30,000</span><span>¥400,000</span>
              </div>
            </div>

            {/* メーカー */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">GPUメーカー</label>
              <div className="space-y-1">
                {(["all", "NVIDIA", "AMD"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setGpuBrand(b)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      gpuBrand === b
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {b === "all" ? "すべて" : b}
                  </button>
                ))}
              </div>
            </div>

            {/* グレード */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">グレード</label>
              <div className="space-y-1">
                {(["all", "エントリー", "ミドル", "ハイエンド", "フラッグシップ"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tier === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* 最低VRAM */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">最低VRAM</label>
              <div className="space-y-1">
                {([0, 8, 12, 16, 24] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setMinVram(v)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      minVram === v
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {v === 0 ? "すべて" : `${v}GB以上`}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "1080p", "1440p", "4k", "competitive", "fps", "apex"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "competitive" ? "競技向け" : t === "fps" ? "FPS全般" : t === "apex" ? "APEX" : t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(400000);
                setGpuBrand("all");
                setTier("all");
                setMinVram(0);
                setTag("all");
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-lg py-1.5 transition-all"
            >
              リセット
            </button>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          {/* モバイル用フィルタートグル */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-xl px-4 py-2.5">
              <span>{isFilterOpen ? "▲ フィルターを閉じる" : "▼ 絞り込みフィルター"}</span>
              <span className="text-xs text-gray-500">{filtered.length}件</span>
            </button>
          </div>

          {/* 検索バー */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="GPU名・チップセット・ブランドで検索..."
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
              {(["price", "vram", "tdp"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : s === "vram" ? "VRAM多い順" : "省電力順"}
                </button>
              ))}
            </div>
          </div>

          {/* GPU一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するGPUが見つかりません</p>
              <button onClick={() => { setMaxPrice(400000); setGpuBrand("all"); setTier("all"); setMinVram(0); setTag("all"); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((gpu) => (
                <Link
                  key={gpu.slug}
                  href={`/gpus/${gpu.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{gpu.brand} / {gpu.gpuBrand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{gpu.chipset}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{gpu.name}</p>
                    </div>
                    {gpu.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-medium">{gpu.vram}GB VRAM</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      gpu.gpuBrand === "NVIDIA" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}>{gpu.gpuBrand}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{gpu.tier}</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{gpu.memoryType} · {gpu.tdp}W · {gpu.boostClock.toLocaleString()}MHz</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{gpu.price.toLocaleString()}</span>
                    <span className="text-xs text-blue-400 group-hover:text-blue-300">詳細 →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* SEOフッター */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-800 mt-4">
        <h2 className="text-base font-bold text-gray-300 mb-6">ゲーミングGPUの選び方</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h3 className="font-bold text-gray-300 mb-2">VRAM容量で選ぶ</h3>
            <p>フルHDゲームなら8GB、WQHD・4Kや高解像度テクスチャには16GB以上推奨。VRAMが多いほど高解像度・高品質設定でのフレームレート低下を防げます。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">チップセット（NVIDIA vs AMD）で選ぶ</h3>
            <p>NVIDIAはDLSS・レイトレーシング対応が充実しFPS重視向け。AMDはコスパに優れRadeon RX 7000シリーズがおすすめ。用途と予算で選び分けましょう。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">TDP・消費電力で選ぶ</h3>
            <p>ハイエンドGPUは300W超えも。電源ユニットの容量確認が必須です。ミドルレンジは150〜200W程度でコスパ・静音性のバランスが良く人気です。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
