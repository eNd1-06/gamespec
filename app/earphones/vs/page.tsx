import Link from "next/link";
import type { Metadata } from "next";
import { earphones } from "@/data/earphones";
import { VS_PAIRS } from "@/app/earphones/vs/[pair]/page";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホン 比較一覧【2025年】人気モデルを徹底比較",
  description: "final VR3000 vs Razer Moray など、人気ゲーミングイヤホンの2製品比較ページ一覧。ドライバー・接続方式・重さ・価格を並べて確認できます。",
  alternates: { canonical: `${BASE_URL}/earphones/vs` },
  openGraph: {
    title: "ゲーミングイヤホン 比較一覧【2025年】",
    description: "人気ゲーミングイヤホンの2製品比較ページ一覧。ドライバー・価格を徹底比較。",
    type: "website",
    url: `${BASE_URL}/earphones/vs`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングイヤホン 比較一覧【2025年】",
    description: "人気ゲーミングイヤホンの2製品比較ページ一覧。",
  },
};

export default function EarphonesVsIndexPage() {
  const pairs = VS_PAIRS.filter(
    ([a, b]) => earphones.find((e) => e.slug === a) && earphones.find((e) => e.slug === b)
  ).map(([slugA, slugB]) => {
    const eA = earphones.find((e) => e.slug === slugA)!;
    const eB = earphones.find((e) => e.slug === slugB)!;
    return { slugA, slugB, eA, eB };
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/earphones" className="text-gray-400 hover:text-white text-sm">ゲーミングイヤホン</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較一覧</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングイヤホン 比較一覧</h1>
        <p className="text-sm text-gray-400 mb-8">
          人気ゲーミングイヤホンの2製品比較。ドライバー・接続方式・重さ・価格を並べて確認できます。
        </p>

        <div className="space-y-2 mb-10">
          {pairs.map(({ slugA, slugB, eA, eB }) => (
            <Link
              key={`${slugA}-${slugB}`}
              href={`/earphones/vs/${slugA}-vs-${slugB}`}
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl px-4 py-3.5 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{eA.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{eA.name}</p>
                <p className="text-xs text-gray-500">{eA.driver} · ¥{eA.price.toLocaleString()}</p>
              </div>
              <div className="shrink-0 text-xs font-bold text-gray-500 px-2">vs</div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-gray-500">{eB.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{eB.name}</p>
                <p className="text-xs text-gray-500">{eB.driver} · ¥{eB.price.toLocaleString()}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-600 group-hover:text-blue-400 ml-1">→</span>
            </Link>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-gray-300 mb-2">自分で選んで比較する</h2>
          <p className="text-xs text-gray-400 mb-3">上記以外の組み合わせも自由に比較できます。</p>
          <Link href="/earphones/compare"
            className="inline-block bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs px-4 py-2 rounded-lg transition-all">
            カスタム比較ツールを使う →
          </Link>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/earphones/ranking"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all">
            ランキングを見る →
          </Link>
          <Link href="/earphones"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all">
            全製品一覧を見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
