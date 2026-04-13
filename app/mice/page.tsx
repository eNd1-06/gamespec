"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { mice } from "@/data/mice";
import type { Connection, GameTag, Shape } from "@/data/mice";

const SENSORS = [...new Set(mice.map((m) => m.sensor))].sort();

export default function MicePage() {
  const [maxWeight, setMaxWeight] = useState<number>(120);
  const [connection, setConnection] = useState<Connection | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [gameTag, setGameTag] = useState<GameTag | "all">("all");
  const [sensor, setSensor] = useState<string>("all");
  const [shape, setShape] = useState<Shape | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "weight">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // URLパラメータを読み込む（マウント時）
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("weight")) setMaxWeight(Number(p.get("weight")));
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("conn")) setConnection(p.get("conn") as Connection | "all");
    if (p.get("tag")) setGameTag(p.get("tag") as GameTag | "all");
    if (p.get("sensor")) setSensor(p.get("sensor")!);
    if (p.get("shape")) setShape(p.get("shape") as Shape | "all");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "weight");
  }, []);

  // フィルター変更時にURLを更新
  useEffect(() => {
    const p = new URLSearchParams();
    if (maxWeight !== 120) p.set("weight", String(maxWeight));
    if (maxPrice !== 45000) p.set("price", String(maxPrice));
    if (connection !== "all") p.set("conn", connection);
    if (gameTag !== "all") p.set("tag", gameTag);
    if (sensor !== "all") p.set("sensor", sensor);
    if (shape !== "all") p.set("shape", shape);
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxWeight, maxPrice, connection, gameTag, sensor, shape, search, sortBy]);

  const filtered = useMemo(() => {
    return mice
      .filter((m) => {
        if (m.weight > maxWeight) return false;
        if (connection !== "all" && m.connection !== connection) return false;
        if (m.price > maxPrice) return false;
        if (gameTag !== "all" && !m.recommendFor.includes(gameTag)) return false;
        if (sensor !== "all" && m.sensor !== sensor) return false;
        if (shape !== "all" && m.shape !== shape) return false;
        if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => sortBy === "price" ? a.price - b.price : a.weight - b.weight);
  }, [maxWeight, connection, maxPrice, gameTag, sensor, shape, search, sortBy]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🖱️ ゲーミングマウス</h1>
        </div>
      </header>

      {/* 説明文 */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">重さ・センサー・接続方式・価格でゲーミングマウスを絞り込めるスペックデータベース。APEXやFPS向けの軽量マウスから、MOBAやカジュアル向けの多ボタンマウスまで<span className="text-white font-medium">{mice.length}製品</span>を掲載。</p>
          <Link href="/mice/ranking" className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all">🏆 おすすめランキングを見る</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* フィルターパネル */}
        <aside className={`w-full lg:w-56 shrink-0 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5 lg:sticky lg:top-16">
            <h2 className="text-sm font-bold text-gray-300">絞り込み</h2>

            {/* 重さ */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                重さ：{maxWeight}g 以下
              </label>
              <input
                type="range"
                min={40} max={120} step={5}
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>40g</span><span>120g</span>
              </div>
            </div>

            {/* 価格 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                価格：¥{maxPrice.toLocaleString()} 以下
              </label>
              <input
                type="range"
                min={2000} max={45000} step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>¥2,000</span><span>¥45,000</span>
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

            {/* おすすめゲーム */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "apex", "fps", "moba", "casual"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGameTag(g)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      gameTag === g
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {g === "all" ? "すべて" : g === "apex" ? "APEX" : g === "fps" ? "FPS全般" : g === "moba" ? "MOBA" : "カジュアル"}
                  </button>
                ))}
              </div>
            </div>

            {/* 形状 */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">形状</label>
              <div className="space-y-1">
                {(["all", "symmetrical", "ergonomic"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                      shape === s
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {s === "all" ? "すべて" : s === "symmetrical" ? "左右対称" : "エルゴノミクス"}
                  </button>
                ))}
              </div>
            </div>

            {/* センサー */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">センサー</label>
              <select
                value={sensor}
                onChange={(e) => setSensor(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="all">すべて</option>
                {SENSORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* リセット */}
            <button
              onClick={() => {
                setMaxWeight(120);
                setConnection("all");
                setMaxPrice(30000);
                setGameTag("all");
                setSensor("all");
                setShape("all");
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
              placeholder="マウス名・ブランドで検索..."
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

          {/* マウス一覧 */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するマウスが見つかりません</p>
              <button onClick={() => { setMaxWeight(120); setConnection("all"); setMaxPrice(30000); setGameTag("all"); setSensor("all"); setShape("all"); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((mouse) => (
                <Link
                  key={mouse.slug}
                  href={`/mice/${mouse.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{mouse.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{mouse.name}</h3>
                    </div>
                    {mouse.isNew && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>
                    )}
                  </div>

                  {/* スペックバッジ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                      {mouse.connection === "wireless" ? "無線" : mouse.connection === "wired" ? "有線" : "両対応"}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate}Hz</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2">{mouse.sensor}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{mouse.price.toLocaleString()}</span>
                    <span className="text-xs text-blue-400 group-hover:text-blue-300">詳細 →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 比較セクション */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-300">人気の比較</h2>
            <Link href="/mice/vs" className="text-xs text-blue-400 hover:text-blue-300">一覧を見る →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              ["logicool-g-pro-x-superlight-2", "razer-viper-v3-pro", "G Pro X Superlight 2 vs Viper V3 Pro"],
              ["razer-viper-v3-pro", "pulsar-xlite-v3", "Viper V3 Pro vs Xlite V3"],
              ["logicool-g-pro-x-superlight-2", "finalmouse-starlight-12", "G Pro X Superlight 2 vs Starlight-12"],
              ["razer-deathadder-v3", "zowie-ec2-c", "DeathAdder V3 vs EC2-C"],
            ].map(([a, b, label]) => (
              <Link
                key={`${a}-${b}`}
                href={`/mice/vs/${a}-vs-${b}`}
                className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all group"
              >
                <span className="text-xs text-white group-hover:text-blue-400 truncate">{label}</span>
                <span className="text-xs text-gray-500 shrink-0 ml-2">比較 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEOフッター */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-800 mt-4">
        <h2 className="text-base font-bold text-gray-300 mb-6">ゲーミングマウスの選び方</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h3 className="font-bold text-gray-300 mb-2">重さで選ぶ</h3>
            <p>FPS・APEXなど素早いエイムが必要なゲームには50〜70gの軽量マウスが最適です。60g以下の超軽量モデルはHoneycomb構造を採用しており、長時間のプレイでも疲れにくいのが特徴です。MOBAや戦略ゲームなら90〜120gの重めのモデルでも問題ありません。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">接続方式で選ぶ</h3>
            <p>無線マウスはケーブルの引っかかりがなく自由に動かせるため、大きなマウス操作をするFPSプレイヤーに人気です。現在の無線技術は有線と同等の遅延を実現しています。有線はバッテリー管理不要で安定性を重視する競技プレイヤーに選ばれています。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">センサー・ポーリングレートで選ぶ</h3>
            <p>PAW3395・HERO 25K・Razer Focus Pro 35Kなどの高精度センサーは高DPIでも追従性が高く、競技向けに最適です。ポーリングレートは通常1000Hzですが、8000Hz対応モデルはより滑らかな入力が可能です。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
