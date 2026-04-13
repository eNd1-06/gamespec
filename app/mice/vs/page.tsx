import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";
import { VS_PAIRS } from "@/app/mice/vs/[pair]/page";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウス 比較一覧【2025年】人気モデルを徹底比較",
  description: "G Pro X Superlight 2 vs Viper V3 Pro など、人気ゲーミングマウスの2製品比較ページ一覧。重さ・センサー・ポーリングレート・価格を並べて確認できます。",
  alternates: { canonical: `${BASE_URL}/mice/vs` },
  openGraph: {
    title: "ゲーミングマウス 比較一覧【2025年】",
    description: "人気ゲーミングマウスの2製品比較ページ一覧。重さ・センサー・価格を徹底比較。",
    type: "website",
    url: `${BASE_URL}/mice/vs`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングマウス 比較一覧【2025年】",
    description: "人気ゲーミングマウスの2製品比較ページ一覧。",
  },
};

export default function MiceVsIndexPage() {
  const pairs = VS_PAIRS.map(([slugA, slugB]) => {
    const mA = mice.find((m) => m.slug === slugA)!;
    const mB = mice.find((m) => m.slug === slugB)!;
    return { slugA, slugB, mA, mB };
  });

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">比較一覧</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ゲーミングマウス 比較一覧</h1>
        <p className="text-sm text-gray-400 mb-8">
          人気ゲーミングマウスの2製品比較。重さ・センサー・ポーリングレート・価格を並べて確認できます。
        </p>

        {/* 比較リスト */}
        <div className="space-y-2 mb-10">
          {pairs.map(({ slugA, slugB, mA, mB }) => (
            <Link
              key={`${slugA}-${slugB}`}
              href={`/mice/vs/${slugA}-vs-${slugB}`}
              className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl px-4 py-3.5 transition-all group"
            >
              {/* 製品A */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{mA.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{mA.name}</p>
                <p className="text-xs text-gray-500">{mA.weight}g · ¥{mA.price.toLocaleString()}</p>
              </div>

              <div className="shrink-0 text-xs font-bold text-gray-500 px-2">vs</div>

              {/* 製品B */}
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-gray-500">{mB.brand}</p>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 leading-snug truncate">{mB.name}</p>
                <p className="text-xs text-gray-500">{mB.weight}g · ¥{mB.price.toLocaleString()}</p>
              </div>

              <span className="shrink-0 text-xs text-gray-600 group-hover:text-blue-400 ml-1">→</span>
            </Link>
          ))}
        </div>

        {/* 動的比較ページへのリンク */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-bold text-gray-300 mb-2">自分で選んで比較する</h2>
          <p className="text-xs text-gray-400 mb-3">上記以外の組み合わせも自由に比較できます。</p>
          <Link
            href="/mice/compare"
            className="inline-block bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs px-4 py-2 rounded-lg transition-all"
          >
            カスタム比較ツールを使う →
          </Link>
        </div>

        {/* CTA */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/mice/ranking"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all"
          >
            ランキングを見る →
          </Link>
          <Link
            href="/mice"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all"
          >
            全製品一覧を見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
