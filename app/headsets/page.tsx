"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { headsets } from "@/data/headsets";
import type { HeadsetConnection, HeadsetTag } from "@/data/headsets";

export default function HeadsetPage() {
  const [maxPrice, setMaxPrice] = useState<number>(55000);
  const [connection, setConnection] = useState<HeadsetConnection | "all">("all");
  const [maxWeight, setMaxWeight] = useState<number>(400);
  const [tag, setTag] = useState<HeadsetTag | "all">("all");
  const [ancOnly, setAncOnly] = useState(false);
  const [wirelessOnly, setWirelessOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "weight" | "battery">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("conn")) setConnection(p.get("conn") as HeadsetConnection | "all");
    if (p.get("weight")) setMaxWeight(Number(p.get("weight")));
    if (p.get("tag")) setTag(p.get("tag") as HeadsetTag | "all");
    if (p.get("anc")) setAncOnly(p.get("anc") === "1");
    if (p.get("wireless")) setWirelessOnly(p.get("wireless") === "1");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "weight" | "battery");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 55000) p.set("price", String(maxPrice));
    if (connection !== "all") p.set("conn", connection);
    if (maxWeight !== 400) p.set("weight", String(maxWeight));
    if (tag !== "all") p.set("tag", tag);
    if (ancOnly) p.set("anc", "1");
    if (wirelessOnly) p.set("wireless", "1");
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, connection, maxWeight, tag, ancOnly, wirelessOnly, search, sortBy]);

  const filtered = useMemo(() => {
    return headsets
      .filter((h) => {
        if (h.price > maxPrice) return false;
        if (h.weight > maxWeight) return false;
        if (connection !== "all" && h.connection !== connection) return false;
        if (tag !== "all" && !h.recommendFor.includes(tag)) return false;
        if (ancOnly && !h.anc) return false;
        if (wirelessOnly && h.connection === "wired") return false;
        if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "weight") return a.weight - b.weight;
        return (b.batteryLife ?? 0) - (a.batteryLife ?? 0);
      });
  }, [maxPrice, maxWeight, connection, tag, ancOnly, wirelessOnly, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🎧 ゲーミングヘッドセット</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">重さ・接続方式・ANC・バッテリーでゲーミングヘッドセットを絞り込めるスペックデータベース。有線・ワイヤレス、競技向けから没入感重視まで<span className="text-white font-medium">{headsets.length}製品</span>を掲載。</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/headsets/compare" className="text-xs border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all">⚖️ 比較する</Link>
            <Link href="/headsets/ranking" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all">🏆 ランキング</Link>
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
                min={5000} max={55000} step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥5,000</span><span>¥55,000</span>
              </div>
            </div>

            {/* 重さ */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                重さ：{maxWeight}g 以下
              </label>
              <input
                type="range"
                min={150} max={400} step={10}
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>150g</span><span>400g</span>
              </div>
            </div>

            {/* 接続方式 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">接続方式</label>
              <div className="space-y-1">
                {(["all", "wireless", "wired"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConnection(c)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      connection === c
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {c === "all" ? "すべて" : c === "wireless" ? "無線" : "有線"}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "apex", "fps", "competitive", "immersive", "console", "casual"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "apex" ? "APEX" : t === "fps" ? "FPS全般" : t === "competitive" ? "競技向け" : t === "immersive" ? "没入感重視" : t === "console" ? "コンソール" : "カジュアル"}
                  </button>
                ))}
              </div>
            </div>

            {/* トグル */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wirelessOnly}
                  onChange={(e) => setWirelessOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">ワイヤレスのみ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ancOnly}
                  onChange={(e) => setAncOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">ANC搭載のみ</span>
              </label>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(55000);
                setMaxWeight(400);
                setConnection("all");
                setTag("all");
                setAncOnly(false);
                setWirelessOnly(false);
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
              placeholder="ヘッドセット名・ブランドで検索..."
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
              {(["price", "weight", "battery"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : s === "weight" ? "軽い順" : "長持ち順"}
                </button>
              ))}
            </div>
          </div>

          {/* ヘッドセット一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するヘッドセットが見つかりません</p>
              <button onClick={() => { setMaxPrice(55000); setMaxWeight(400); setConnection("all"); setTag("all"); setAncOnly(false); setWirelessOnly(false); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((headset) => (
                <Link
                  key={headset.slug}
                  href={`/headsets/${headset.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{headset.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{headset.name}</h3>
                    </div>
                    {headset.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{headset.weight}g</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                      {headset.connection === "wireless" ? "無線" : headset.connection === "wired" ? "有線" : "両対応"}
                    </span>
                    {headset.batteryLife && (
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{headset.batteryLife}h</span>
                    )}
                    {headset.anc && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ANC</span>
                    )}
                    {headset.virtualSurround && (
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">サラウンド</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {headset.driverSize}mmドライバー
                    {headset.wirelessProtocol ? ` · ${headset.wirelessProtocol}` : ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{headset.price.toLocaleString()}</span>
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
