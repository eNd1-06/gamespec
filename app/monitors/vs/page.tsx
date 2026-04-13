import Link from "next/link";
import type { Metadata } from "next";
import { monitors } from "@/data/monitors";
import { VS_PAIRS } from "@/app/monitors/vs/[pair]/page";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングモニター 比較一覧【2025年】人気モデルを徹底比較",
  description: "LG vs ASUS など、人気ゲーミングモニターの2製品比較ページ一覧。リフレッシュレート・解像度・パネル・価格を並べて確認できます。",
  alternates: { canonical: `${BASE_URL}/monitors/vs` },
  openGraph: {
    title: "ゲーミングモニター 比較一覧【2025年】",
    description: "人気ゲーミングモニターの2製品比較ページ一覧。リフレッシュレート・解像度・価格を徹底比較。",
    type: "website",
    url: `${BASE_URL}/monitors/vs`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function MonitorsVsIndexPage() {
  const pairs = VS_PAIRS.filter(([a, b]) =>
    monitors.find((m) => m.slug === a) && monitors.find((m) => m.slug === b)
  ).map(([slugA, slugB]) => ({
    slugA, slugB,
    mA: monitors.find((m) => m.slug === slugA)!,
    mB: monitors.find((m) => m.slug === slugB)!,
  }));

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/monitors" className="text-gray-400 hover:text-white text-sm">ゲーミングモニター</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較一覧</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングモニター 比較一覧</h1>
        <p className="text-sm text-gray-400 mb-8">
          人気ゲーミングモニターの2製品比較。リフレッシュレート・解像度・パネル・価格を並べて確認できます。
        </p>

        <div className="space-y-2 mb-10">
          {pairs.map(({ slugA, slugB, mA, mB }) => (
            <Link key={`${slugA}-${slugB}`} href={`/monitors/vs/${slugA}-vs-${slugB}`}
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl px-4 py-3.5 transition-all group">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{mA.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{mA.name}</p>
                <p className="text-xs text-gray-500">{mA.refreshRate}Hz · {mA.resolution} · ¥{mA.price.toLocaleString()}</p>
              </div>
              <div className="shrink-0 text-xs font-bold text-gray-500 px-2">vs</div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-gray-500">{mB.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{mB.name}</p>
                <p className="text-xs text-gray-500">{mB.refreshRate}Hz · {mB.resolution} · ¥{mB.price.toLocaleString()}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-600 group-hover:text-blue-400 ml-1">→</span>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-gray-300 mb-2">自分で選んで比較する</h2>
          <p className="text-xs text-gray-400 mb-3">上記以外の組み合わせも自由に比較できます。</p>
          <Link href="/monitors/compare"
            className="inline-block bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs px-4 py-2 rounded-lg transition-all">
            カスタム比較ツールを使う →
          </Link>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/monitors/ranking"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all">
            ランキングを見る →
          </Link>
          <Link href="/monitors"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all">
            全製品一覧を見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
