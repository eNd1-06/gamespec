"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { keyboards } from "@/data/keyboards";
import type { KeyboardLayout, SwitchType, KeyboardTag } from "@/data/keyboards";

const LAYOUTS: Array<KeyboardLayout | "all"> = ["all", "60%", "65%", "75%", "テンキーレス", "フルサイズ"];
const SWITCH_TYPES: Array<SwitchType | "all"> = ["all", "赤軸", "銀軸", "茶軸", "青軸", "光学式", "磁気式", "静電容量式"];

export default function KeyboardPage() {
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [layout, setLayout] = useState<KeyboardLayout | "all">("all");
  const [switchType, setSwitchType] = useState<SwitchType | "all">("all");
  const [tag, setTag] = useState<KeyboardTag | "all">("all");
  const [wirelessOnly, setWirelessOnly] = useState(false);
  const [hotswapOnly, setHotswapOnly] = useState(false);
  const [minPollingRate, setMinPollingRate] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "actuation">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("layout")) setLayout(p.get("layout") as KeyboardLayout | "all");
    if (p.get("sw")) setSwitchType(p.get("sw") as SwitchType | "all");
    if (p.get("tag")) setTag(p.get("tag") as KeyboardTag | "all");
    if (p.get("wireless")) setWirelessOnly(p.get("wireless") === "1");
    if (p.get("hotswap")) setHotswapOnly(p.get("hotswap") === "1");
    if (p.get("poll")) setMinPollingRate(Number(p.get("poll")));
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "actuation");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 35000) p.set("price", String(maxPrice));
    if (layout !== "all") p.set("layout", layout);
    if (switchType !== "all") p.set("sw", switchType);
    if (tag !== "all") p.set("tag", tag);
    if (wirelessOnly) p.set("wireless", "1");
    if (hotswapOnly) p.set("hotswap", "1");
    if (minPollingRate > 0) p.set("poll", String(minPollingRate));
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, layout, switchType, tag, wirelessOnly, hotswapOnly, minPollingRate, search, sortBy]);

  const filtered = useMemo(() => {
    return keyboards
      .filter((k) => {
        if (k.price > maxPrice) return false;
        if (layout !== "all" && k.layout !== layout) return false;
        if (switchType !== "all" && k.switchType !== switchType) return false;
        if (tag !== "all" && !k.recommendFor.includes(tag)) return false;
        if (wirelessOnly && !k.wireless) return false;
        if (hotswapOnly && !k.hotswap) return false;
        if (minPollingRate > 0 && k.pollingRate < minPollingRate) return false;
        if (search && !k.name.toLowerCase().includes(search.toLowerCase()) && !k.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => sortBy === "price" ? a.price - b.price : a.actuation - b.actuation);
  }, [maxPrice, layout, switchType, tag, wirelessOnly, hotswapOnly, minPollingRate, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">⌨️ ゲーミングキーボード</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">スイッチ・サイズ・ポーリングレート・価格でゲーミングキーボードを絞り込めるスペックデータベース。60%〜フルサイズ、赤軸・光学式・磁気式アナログまで<span className="text-white font-medium">{keyboards.length}製品</span>を掲載。</p>
          <Link href="/keyboards/ranking" className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all">🏆 おすすめランキングを見る</Link>
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
                min={3000} max={35000} step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥3,000</span><span>¥35,000</span>
              </div>
            </div>

            {/* サイズ */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">サイズ</label>
              <div className="space-y-1">
                {LAYOUTS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      layout === l
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {l === "all" ? "すべて" : l}
                  </button>
                ))}
              </div>
            </div>

            {/* スイッチ */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">スイッチ</label>
              <select
                value={switchType}
                onChange={(e) => setSwitchType(e.target.value as SwitchType | "all")}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              >
                {SWITCH_TYPES.map((s) => (
                  <option key={s} value={s}>{s === "all" ? "すべて" : s}</option>
                ))}
              </select>
            </div>

            {/* 用途 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "apex", "fps", "competitive", "moba", "typing"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      tag === t
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {t === "all" ? "すべて" : t === "apex" ? "APEX" : t === "fps" ? "FPS全般" : t === "competitive" ? "競技向け" : t === "moba" ? "MOBA" : "タイピング"}
                  </button>
                ))}
              </div>
            </div>

            {/* ポーリングレート */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">最低ポーリングレート</label>
              <div className="space-y-1">
                {([0, 1000, 4000, 8000] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinPollingRate(r)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      minPollingRate === r
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {r === 0 ? "すべて" : `${r.toLocaleString()}Hz以上`}
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
                  checked={hotswapOnly}
                  onChange={(e) => setHotswapOnly(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-400">ホットスワップのみ</span>
              </label>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxPrice(35000);
                setLayout("all");
                setSwitchType("all");
                setTag("all");
                setWirelessOnly(false);
                setHotswapOnly(false);
                setMinPollingRate(0);
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
              placeholder="キーボード名・ブランドで検索..."
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
              {(["price", "actuation"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    sortBy === s
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "price" ? "価格順" : "軽い入力順"}
                </button>
              ))}
            </div>
          </div>

          {/* キーボード一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するキーボードが見つかりません</p>
              <button onClick={() => { setMaxPrice(35000); setLayout("all"); setSwitchType("all"); setTag("all"); setWirelessOnly(false); setHotswapOnly(false); setMinPollingRate(0); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((kb) => (
                <Link
                  key={kb.slug}
                  href={`/keyboards/${kb.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{kb.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{kb.name}</h3>
                    </div>
                    {kb.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.layout}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{kb.switchType}</span>
                    {kb.wireless && (
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">無線</span>
                    )}
                    {kb.hotswap && (
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">ホットスワップ</span>
                    )}
                    {(kb.switchType === "磁気式") && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">アナログ入力</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{kb.switchName} · {kb.actuation}mm · {kb.pollingRate}Hz</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{kb.price.toLocaleString()}</span>
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
