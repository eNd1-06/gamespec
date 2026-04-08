"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { controllers } from "@/data/controllers";
import type { ControllerPlatform, ControllerConnection, ControllerTag } from "@/data/controllers";

export default function ControllerPage() {
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [platform, setPlatform] = useState<ControllerPlatform | "all">("all");
  const [connection, setConnection] = useState<ControllerConnection | "all">("all");
  const [tag, setTag] = useState<ControllerTag | "all">("all");
  const [backButtonsOnly, setBackButtonsOnly] = useState(false);
  const [triggerStopOnly, setTriggerStopOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "weight">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("platform")) setPlatform(p.get("platform") as ControllerPlatform | "all");
    if (p.get("conn")) setConnection(p.get("conn") as ControllerConnection | "all");
    if (p.get("tag")) setTag(p.get("tag") as ControllerTag | "all");
    if (p.get("back")) setBackButtonsOnly(p.get("back") === "1");
    if (p.get("trigger")) setTriggerStopOnly(p.get("trigger") === "1");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "weight");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 30000) p.set("price", String(maxPrice));
    if (platform !== "all") p.set("platform", platform);
    if (connection !== "all") p.set("conn", connection);
    if (tag !== "all") p.set("tag", tag);
    if (backButtonsOnly) p.set("back", "1");
    if (triggerStopOnly) p.set("trigger", "1");
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, platform, connection, tag, backButtonsOnly, triggerStopOnly, search, sortBy]);

  const filtered = useMemo(() => {
    return controllers
      .filter((c) => {
        if (c.price > maxPrice) return false;
        if (platform !== "all" && c.platform !== platform) return false;
        if (connection !== "all" && c.connection !== connection) return false;
        if (tag !== "all" && !c.recommendFor.includes(tag)) return false;
        if (backButtonsOnly && !c.backButtons) return false;
        if (triggerStopOnly && !c.triggerStop) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        return a.weight - b.weight;
      });
  }, [maxPrice, platform, connection, tag, backButtonsOnly, triggerStopOnly, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🎮 ゲームコントローラー</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-sm text-gray-400">プラットフォーム・背面ボタン・接続方式・価格でゲームコントローラーを絞り込めるスペックデータベース。PS5・Xbox・PC対応から競技向けプロコンまで<span className="text-white font-medium">{controllers.length}製品</span>を掲載。</p>
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
                min={2000} max={30000} step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥2,000</span><span>¥30,000</span>
              </div>
            </div>

            {/* プラットフォーム */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">プラットフォーム</label>
              <div className="space-y-1">
                {(["all", "PS5", "Xbox", "Switch", "PC", "マルチ"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      platform === p
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {p === "all" ? "すべて" : p}
                  </button>
                ))}
              </div>
            </div>

            {/* 接続方式 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">接続方式</label>
              <div className="space-y-1">
                {(["all", "wireless", "wired", "both"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConnection(c)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      connection === c
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {c === "all" ? "すべて" : c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応"}
                  </button>
                ))}
              </div>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "fps", "apex", "competitive", "rpg", "casual", "fighting"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "fps" ? "FPS全般" : t === "apex" ? "APEX" : t === "competitive" ? "競技向け" : t === "rpg" ? "RPG/アドベンチャー" : t === "casual" ? "カジュアル" : "格闘ゲーム"}
                  </button>
                ))}
              </div>
            </div>

            {/* トグル */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={backButtonsOnly}
                  onChange={(e) => setBackButtonsOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">背面ボタンあり</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggerStopOnly}
                  onChange={(e) => setTriggerStopOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">トリガーストップあり</span>
              </label>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(30000);
                setPlatform("all");
                setConnection("all");
                setTag("all");
                setBackButtonsOnly(false);
                setTriggerStopOnly(false);
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
              placeholder="コントローラー名・ブランドで検索..."
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
              {(["price", "weight"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : "軽い順"}
                </button>
              ))}
            </div>
          </div>

          {/* コントローラー一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するコントローラーが見つかりません</p>
              <button onClick={() => { setMaxPrice(30000); setPlatform("all"); setConnection("all"); setTag("all"); setBackButtonsOnly(false); setTriggerStopOnly(false); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((ctrl) => (
                <Link
                  key={ctrl.slug}
                  href={`/controllers/${ctrl.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{ctrl.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{ctrl.name}</h3>
                    </div>
                    {ctrl.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ctrl.platform}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                      {ctrl.connection === "wireless" ? "無線" : ctrl.connection === "wired" ? "有線" : "両対応"}
                    </span>
                    {ctrl.backButtons && (
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">背面ボタン</span>
                    )}
                    {ctrl.triggerStop && (
                      <span className="text-xs bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full">トリガーストップ</span>
                    )}
                    {ctrl.adaptiveTriggers && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">アダプティブ</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {ctrl.weight}g
                    {ctrl.batteryLife ? ` · バッテリー${ctrl.batteryLife}h` : ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{ctrl.price.toLocaleString()}</span>
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
