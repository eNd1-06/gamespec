"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { monitors } from "@/data/monitors";
import type { Resolution, PanelType, MonitorTag } from "@/data/monitors";

export default function MonitorPage() {
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [resolution, setResolution] = useState<Resolution | "all">("all");
  const [minHz, setMinHz] = useState<number>(60);
  const [panelType, setPanelType] = useState<PanelType | "all">("all");
  const [tag, setTag] = useState<MonitorTag | "all">("all");
  const [sortBy, setSortBy] = useState<"price" | "hz">("price");

  const PANEL_TYPES: Array<PanelType | "all"> = ["all", "IPS", "Fast IPS", "Nano IPS", "OLED", "QD-OLED", "VA", "TN", "Fast TN"];

  const filtered = useMemo(() => {
    return monitors
      .filter((m) => {
        if (m.price > maxPrice) return false;
        if (resolution !== "all" && m.resolution !== resolution) return false;
        if (m.refreshRate < minHz) return false;
        if (panelType !== "all" && m.panelType !== panelType) return false;
        if (tag !== "all" && !m.recommendFor.includes(tag)) return false;
        return true;
      })
      .sort((a, b) => sortBy === "price" ? a.price - b.price : b.refreshRate - a.refreshRate);
  }, [maxPrice, resolution, minHz, panelType, tag, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🖥️ ゲーミングモニター</h1>
        </div>
      </header>

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
                min={15000} max={170000} step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥15,000</span><span>¥170,000</span>
              </div>
            </div>

            {/* リフレッシュレート */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                最低Hz：{minHz}Hz 以上
              </label>
              <input
                type="range"
                min={60} max={360} step={60}
                value={minHz}
                onChange={(e) => setMinHz(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>60Hz</span><span>360Hz</span>
              </div>
            </div>

            {/* 解像度 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">解像度</label>
              <div className="space-y-1">
                {(["all", "1080p", "1440p", "4K"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setResolution(r)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      resolution === r
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {r === "all" ? "すべて" : r}
                  </button>
                ))}
              </div>
            </div>

            {/* パネル */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">パネル種類</label>
              <select
                value={panelType}
                onChange={(e) => setPanelType(e.target.value as PanelType | "all")}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              >
                {PANEL_TYPES.map((p) => (
                  <option key={p} value={p}>{p === "all" ? "すべて" : p}</option>
                ))}
              </select>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "apex", "fps", "competitive", "rpg"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "apex" ? "APEX" : t === "fps" ? "FPS全般" : t === "competitive" ? "競技向け" : "RPG/MMO"}
                  </button>
                ))}
              </div>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(150000);
                setResolution("all");
                setMinHz(60);
                setPanelType("all");
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
          {/* ソートと件数 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              <span className="text-white font-bold">{filtered.length}</span> 件
            </p>
            <div className="flex gap-2">
              {(["price", "hz"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : "Hz高い順"}
                </button>
              ))}
            </div>
          </div>

          {/* モニター一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              条件に一致するモニターが見つかりません
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((monitor) => (
                <Link
                  key={monitor.slug}
                  href={`/monitors/${monitor.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{monitor.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{monitor.name}</h3>
                    </div>
                    {monitor.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.size}型</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{monitor.resolution}</span>
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-medium">{monitor.refreshRate}Hz</span>
                    {(monitor.panelType === "OLED" || monitor.panelType === "QD-OLED") && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">{monitor.panelType}</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{monitor.panelType} · {monitor.responseTime}ms GTG{monitor.curved ? " · 曲面" : ""}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{monitor.price.toLocaleString()}</span>
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
