"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { earphones } from "@/data/earphones";
import type { EarphoneConnection, EarphoneDriver, EarphoneTag } from "@/data/earphones";

export default function EarphonePage() {
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [connection, setConnection] = useState<EarphoneConnection | "all">("all");
  const [driver, setDriver] = useState<EarphoneDriver | "all">("all");
  const [tag, setTag] = useState<EarphoneTag | "all">("all");
  const [micOnly, setMicOnly] = useState(false);
  const [ancOnly, setAncOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "weight">("price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("price")) setMaxPrice(Number(p.get("price")));
    if (p.get("conn")) setConnection(p.get("conn") as EarphoneConnection | "all");
    if (p.get("driver")) setDriver(p.get("driver") as EarphoneDriver | "all");
    if (p.get("tag")) setTag(p.get("tag") as EarphoneTag | "all");
    if (p.get("mic")) setMicOnly(p.get("mic") === "1");
    if (p.get("anc")) setAncOnly(p.get("anc") === "1");
    if (p.get("q")) setSearch(p.get("q")!);
    if (p.get("sort")) setSortBy(p.get("sort") as "price" | "weight");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (maxPrice !== 40000) p.set("price", String(maxPrice));
    if (connection !== "all") p.set("conn", connection);
    if (driver !== "all") p.set("driver", driver);
    if (tag !== "all") p.set("tag", tag);
    if (micOnly) p.set("mic", "1");
    if (ancOnly) p.set("anc", "1");
    if (search) p.set("q", search);
    if (sortBy !== "price") p.set("sort", sortBy);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [maxPrice, connection, driver, tag, micOnly, ancOnly, search, sortBy]);

  const filtered = useMemo(() => {
    return earphones
      .filter((e) => {
        if (e.price > maxPrice) return false;
        if (connection !== "all" && e.connection !== connection) return false;
        if (driver !== "all" && e.driver !== driver) return false;
        if (tag !== "all" && !e.recommendFor.includes(tag)) return false;
        if (micOnly && !e.microphone) return false;
        if (ancOnly && !e.anc) return false;
        if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.brand.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        return a.weight - b.weight;
      });
  }, [maxPrice, connection, driver, tag, micOnly, ancOnly, search, sortBy]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-bold">🎵 ゲーミングイヤホン</h1>
        </div>
      </header>

      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">ドライバー・接続方式・価格でゲーミングイヤホンを絞り込めるスペックデータベース。有線IEM・低遅延ワイヤレス・ANC搭載モデルまで<span className="text-white font-medium">{earphones.length}製品</span>を掲載。</p>
          <div className="flex gap-2 shrink-0">
            <Link href="/earphones/compare" className="text-xs border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all">⚖️ 比較する</Link>
            <Link href="/earphones/ranking" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-all">🏆 ランキング</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className={`w-full lg:w-56 shrink-0 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-5 lg:sticky lg:top-16">
            <h2 className="text-sm font-bold text-gray-300">絞り込み</h2>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">価格：¥{maxPrice.toLocaleString()} 以下</label>
              <input type="range" min={2000} max={40000} step={1000} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs text-gray-600 mt-1"><span>¥2,000</span><span>¥40,000</span></div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">接続方式</label>
              <div className="space-y-1">
                {(["all", "wired", "wireless", "both"] as const).map((c) => (
                  <button key={c} onClick={() => setConnection(c)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${connection === c ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {c === "all" ? "すべて" : c === "wired" ? "有線" : c === "wireless" ? "ワイヤレス" : "両対応"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">ドライバー</label>
              <div className="space-y-1">
                {(["all", "ダイナミック型", "BA型", "ハイブリッド型", "平面磁界型"] as const).map((d) => (
                  <button key={d} onClick={() => setDriver(d)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${driver === d ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {d === "all" ? "すべて" : d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">おすすめ用途</label>
              <div className="space-y-1">
                {(["all", "fps", "apex", "competitive", "music", "casual", "console"] as const).map((t) => (
                  <button key={t} onClick={() => setTag(t)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${tag === t ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                    {t === "all" ? "すべて" : t === "fps" ? "FPS全般" : t === "apex" ? "APEX" : t === "competitive" ? "競技向け" : t === "music" ? "音楽鑑賞" : t === "casual" ? "カジュアル" : "コンソール"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={micOnly} onChange={(e) => setMicOnly(e.target.checked)} className="accent-blue-500" />
                <span className="text-xs text-gray-400">マイク付きのみ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={ancOnly} onChange={(e) => setAncOnly(e.target.checked)} className="accent-blue-500" />
                <span className="text-xs text-gray-400">ANC搭載のみ</span>
              </label>
            </div>

            <button onClick={() => { setMaxPrice(40000); setConnection("all"); setDriver("all"); setTag("all"); setMicOnly(false); setAncOnly(false); }}
              className="w-full text-xs text-gray-500 hover:text-gray-300 border border-gray-700 rounded-lg py-1.5 transition-all">
              リセット
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* モバイル用フィルタートグル */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-xl px-4 py-2.5">
              <span>{isFilterOpen ? "▲ フィルターを閉じる" : "▼ 絞り込みフィルター"}</span>
              <span className="text-xs text-gray-500">{filtered.length}件</span>
            </button>
          </div>

          <div className="mb-4">
            <input type="text" placeholder="イヤホン名・ブランドで検索..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-gray-600" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400"><span className="text-white font-bold">{filtered.length}</span> 件</p>
            <div className="flex gap-2">
              {(["price", "weight"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${sortBy === s ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:text-white"}`}>
                  {s === "price" ? "価格順" : "軽い順"}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>条件に一致するイヤホンが見つかりません</p>
              <button onClick={() => { setMaxPrice(40000); setConnection("all"); setDriver("all"); setTag("all"); setMicOnly(false); setAncOnly(false); setSearch(""); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-4 py-1.5">
                フィルターをリセット
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((ep) => (
                <Link key={ep.slug} href={`/earphones/${ep.slug}`}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 rounded-xl p-4 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">{ep.brand}</p>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight">{ep.name}</h3>
                    </div>
                    {ep.isNew && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded ml-2 shrink-0">NEW</span>}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                      {ep.connection === "wired" ? "有線" : ep.connection === "wireless" ? "ワイヤレス" : "両対応"}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{ep.driver}</span>
                    {ep.microphone && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">マイク付き</span>}
                    {ep.anc && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">ANC</span>}
                    {ep.batteryLife && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">{ep.batteryLife}h</span>}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    {ep.weight}g{ep.latency ? ` · 遅延${ep.latency}ms` : ""}{ep.impedance ? ` · ${ep.impedance}Ω` : ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">¥{ep.price.toLocaleString()}</span>
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
        <h2 className="text-base font-bold text-gray-300 mb-6">ゲーミングイヤホンの選び方</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
          <div>
            <h3 className="font-bold text-gray-300 mb-2">接続方式で選ぶ</h3>
            <p>有線は遅延ゼロで安定、無線は快適な装着感が魅力。2.4GHz帯ワイヤレスは低遅延でFPSにも対応。Bluetooth接続は利便性重視のカジュアルゲーマー向けです。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">ドライバー・音質で選ぶ</h3>
            <p>ダイナミックドライバーは迫力ある低音、バランスドアーマチュアは解像度の高いクリアな音質。足音・銃声の定位感を重視するならフラットな音域のモデルがおすすめです。</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-300 mb-2">ANC・マイクで選ぶ</h3>
            <p>アクティブノイズキャンセリング（ANC）搭載モデルは集中プレイに最適。マイク付きモデルはボイスチャット専用機材不要で手軽。取り外し式マイクは音楽兼用に便利です。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
