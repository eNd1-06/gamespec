import Link from "next/link";
import { mice } from "@/data/mice";
import { monitors } from "@/data/monitors";
import { keyboards } from "@/data/keyboards";
import { headsets } from "@/data/headsets";
import { mousepads } from "@/data/mousepads";
import { gpus } from "@/data/gpus";
import { controllers } from "@/data/controllers";
import { earphones } from "@/data/earphones";
import { chairs } from "@/data/chairs";

const CATEGORIES = [
  { href: "/mice", icon: "🖱️", label: "ゲーミングマウス", desc: "重さ・センサー・接続方式・価格で絞り込み", count: mice.length },
  { href: "/monitors", icon: "🖥️", label: "ゲーミングモニター", desc: "Hz・解像度・パネル・価格で絞り込み", count: monitors.length },
  { href: "/keyboards", icon: "⌨️", label: "ゲーミングキーボード", desc: "スイッチ・サイズ・無線・価格で絞り込み", count: keyboards.length },
  { href: "/headsets", icon: "🎧", label: "ゲーミングヘッドセット", desc: "重さ・無線・ANC・バッテリーで絞り込み", count: headsets.length },
  { href: "/mousepads", icon: "🖱️", label: "ゲーミングマウスパッド", desc: "サイズ・滑り感・素材・価格で絞り込み", count: mousepads.length },
  { href: "/gpus", icon: "🖥️", label: "グラフィックボード", desc: "VRAM・チップセット・TDP・価格で絞り込み", count: gpus.length },
  { href: "/controllers", icon: "🎮", label: "ゲームコントローラー", desc: "プラットフォーム・背面ボタン・価格で絞り込み", count: controllers.length },
  { href: "/earphones", icon: "🎵", label: "ゲーミングイヤホン", desc: "ドライバー・有線/無線・ANC・価格で絞り込み", count: earphones.length },
  { href: "/chairs", icon: "🪑", label: "ゲーミングチェア", desc: "タイプ・素材・ランバーサポート・価格で絞り込み", count: chairs.length },
];

const totalProducts = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

// 注目製品（isNew: true のもの）
const newProducts = [
  ...mice.filter((m) => m.isNew).slice(0, 2).map((m) => ({ name: m.name, brand: m.brand, price: m.price, href: `/mice/${m.slug}`, label: "マウス" })),
  ...gpus.filter((g) => g.isNew).slice(0, 2).map((g) => ({ name: g.chipset, brand: g.brand, price: g.price, href: `/gpus/${g.slug}`, label: "GPU" })),
  ...mousepads.filter((p) => p.isNew).slice(0, 2).map((p) => ({ name: p.name, brand: p.brand, price: p.price, href: `/mousepads/${p.slug}`, label: "マウスパッド" })),
  ...controllers.filter((c) => c.isNew).slice(0, 1).map((c) => ({ name: c.name, brand: c.brand, price: c.price, href: `/controllers/${c.slug}`, label: "コントローラー" })),
  ...earphones.filter((e) => e.isNew).slice(0, 1).map((e) => ({ name: e.name, brand: e.brand, price: e.price, href: `/earphones/${e.slug}`, label: "イヤホン" })),
].slice(0, 6);

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-3">GameSpec</h1>
        <p className="text-gray-400 mb-2 text-lg">スペックで絞り込む、ゲーミングデバイスDB</p>
        <p className="text-gray-600 text-sm mb-10 max-w-xl mx-auto">重さ・センサー・接続方式・価格など細かいスペックで絞り込めるゲーミングデバイスのデータベース。9カテゴリ{totalProducts}製品を日本語で比較できます。</p>

        {/* カテゴリ一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-5 text-left transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{cat.count}製品</span>
              </div>
              <h2 className="text-base font-bold text-white mb-1 group-hover:text-blue-400">{cat.label}</h2>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>

        {/* 新着・注目製品 */}
        {newProducts.length > 0 && (
          <div className="mb-12 text-left">
            <h2 className="text-sm font-bold text-gray-300 mb-4">最新・注目製品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {newProducts.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-3 transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">NEW</span>
                    <span className="text-xs text-gray-500">{p.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{p.brand}</p>
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-1">{p.name}</p>
                  <p className="text-sm font-bold text-white">¥{p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 特徴説明 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-blue-400 text-lg mb-2">🔍</p>
            <h2 className="text-sm font-bold text-white mb-1">細かく絞り込める</h2>
            <p className="text-xs text-gray-500">重さ・Hz・スイッチ・ANCなど、欲しいスペックで正確に絞り込み</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-blue-400 text-lg mb-2">📊</p>
            <h2 className="text-sm font-bold text-white mb-1">{totalProducts}製品以上を掲載</h2>
            <p className="text-xs text-gray-500">9カテゴリにわたるゲーミングデバイスをまとめて比較</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-blue-400 text-lg mb-2">🛒</p>
            <h2 className="text-sm font-bold text-white mb-1">Amazon価格をすぐ確認</h2>
            <p className="text-xs text-gray-500">各製品ページからAmazonの最新価格をワンクリックで確認できます</p>
          </div>
        </div>
      </div>
    </main>
  );
}
