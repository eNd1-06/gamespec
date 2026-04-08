"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { chairs } from "@/data/chairs";
import type { ChairType, ChairMaterial, ChairTag } from "@/data/chairs";

export default function ChairPage() {
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [type, setType] = useState<ChairType | "all">("all");
  const [material, setMaterial] = useState<ChairMaterial | "all">("all");
  const [tag, setTag] = useState<ChairTag | "all">("all");
  const [backButtonsOnly, setBackButtonsOnly] = useState(false);
  const [footrestOnly, setFootrestOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "load">("price");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("type")) setType(p.get("type") as ChairType | "all");
    if (p.get("mat")) setMaterial(p.get("mat") as ChairMaterial | "all");
    if (p.get("tag")) setTag(p.get("tag") as ChairTag | "all");
    if (p.get("lumbar")) setBackButtonsOnly(p.get("lumbar") === "1");
    if (p.get("foot")) setFootrestOnly(p.get("foot") === "1");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "load");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 200000) p.set("price", String(maxPrice));
    if (type !== "all") p.set("type", type);
    if (material !== "all") p.set("mat", material);
    if (tag !== "all") p.set("tag", tag);
    if (backButtonsOnly) p.set("lumbar", "1");
    if (footrestOnly) p.set("foot", "1");
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, type, material, tag, backButtonsOnly, footrestOnly, search, sortBy]);

  const filtered = useMemo(() => {
    return chairs
      .filter((c) => {
        if (c.price > maxPrice) return false;
        if (type !== "all" && c.type !== type) return false;
        if (material !== "all" && c.material !== material) return false;
        if (tag !== "all" && !c.recommendFor.includes(tag)) return false;
        if (backButtonsOnly && !c.lumbarSupport) return false;
        if (footrestOnly && !c.footrest) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        return b.maxLoadWeight - a.maxLoadWeight;
      });
  }, [maxPrice, type, material, tag, backButtonsOnly, footrestOnly, search, sortBy]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🪑 ゲーミングチェア</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-gray-400">タイプ・素材・価格でゲーミングチェアを絞り込めるスペックデータベース。レーシング型・エルゴノミクス型・座椅子型、AKRacing・Secretlab・Herman Millerまで<span className="text-white font-medium">{chairs.length}製品</span>を掲載。</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5 sticky top-4">
            <h2 className="text-sm font-bold text-gray-300">絞り込み</h2>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">価格：¥{maxPrice.toLocaleString()} 以下</label>
              <input type="range" min={15000} max={200000} step={5000} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs text-gray-600 mt-1"><span>¥15,000</span><span>¥200,000</span></div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">タイプ</label>
              <div className="space-y-1">
                {(["all", "レーシング型", "エルゴノミクス型", "ゲーミング座椅子", "ロッカー型"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${type === t ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {t === "all" ? "すべて" : t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">素材</label>
              <div className="space-y-1">
                {(["all", "PUレザー", "ファブリック", "メッシュ", "本革"] as const).map((m) => (
                  <button key={m} onClick={() => setMaterial(m)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${material === m ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {m === "all" ? "すべて" : m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "fps", "long-session", "back-pain", "casual", "office"] as const).map((t) => (
                  <button key={t} onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${tag === t ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {t === "all" ? "すべて" : t === "fps" ? "FPS向け" : t === "long-session" ? "長時間プレイ" : t === "back-pain" ? "腰痛対策" : t === "casual" ? "カジュアル" : "オフィス兼用"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={backButtonsOnly} onChange={(e) => setBackButtonsOnly(e.target.checked)} className="accent-blue-500" />
                <span className="text-xs text-gray-400">ランバーサポートあり</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={footrestOnly} onChange={(e) => setFootrestOnly(e.target.checked)} className="accent-blue-500" />
                <span className="text-xs text-gray-400">フットレストあり</span>
              </label>
            </div>

            <button onClick={() => { setMaxPrice(200000); setType("all"); setMaterial("all"); setTag("all"); setBackButtonsOnly(false); setFootrestOnly(false); }}
              className="w-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-lg py-1.5 transition-all">
              リセット
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="mb-4">
            <input type="text" placeholder="チェア名・ブランドで検索..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-gray-600" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400"><span className="text-white font-bold">{filtered.length}</span> 件</p>
            <div className="flex gap-2">
              {(["price", "load"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${sortBy === s ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:text-white"}`}>
                  {s === "price" ? "価格順" : "耐荷重順"}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">条件に一致するチェアが見つかりません</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((chair) => (
                <Link key={chair.slug} href={`/chairs/${chair.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{chair.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{chair.name}</h3>
                    </div>
                    {chair.isNew && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.type}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{chair.material}</span>
                    {chair.lumbarSupport && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">ランバー</span>}
                    {chair.footrest && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">フットレスト</span>}
                    {chair.rgb && <span className="text-xs bg-pink-900 text-pink-300 px-2 py-0.5 rounded-full">RGB</span>}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    耐荷重{chair.maxLoadWeight}kg · リクライニング{chair.recliningAngle}° · アームレスト{chair.armrest}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{chair.price.toLocaleString()}</span>
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
