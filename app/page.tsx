import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-3">GameSpec</h1>
        <p className="text-gray-400 mb-2 text-lg">スペックで絞り込む、ゲーミングデバイスDB</p>
        <p className="text-gray-600 text-sm mb-10 max-w-xl mx-auto">重さ・センサー・接続方式・価格など細かいスペックで絞り込めるゲーミングデバイスのデータベース。マウス・モニター・キーボード・ヘッドセットを日本語で比較できます。</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/mice"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">🖱️</div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">ゲーミングマウス</h2>
            <p className="text-sm text-gray-500">重さ・センサー・接続方式・価格で絞り込み</p>
          </Link>

          <Link
            href="/monitors"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">🖥️</div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">ゲーミングモニター</h2>
            <p className="text-sm text-gray-500">Hz・解像度・パネル・価格で絞り込み</p>
          </Link>

          <Link
            href="/keyboards"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">⌨️</div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">ゲーミングキーボード</h2>
            <p className="text-sm text-gray-500">スイッチ・サイズ・無線・価格で絞り込み</p>
          </Link>

          <Link
            href="/headsets"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">🎧</div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">ゲーミングヘッドセット</h2>
            <p className="text-sm text-gray-500">重さ・無線・ANC・バッテリーで絞り込み</p>
          </Link>
        </div>

        {/* 特徴説明 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-blue-400 text-lg mb-2">🔍</p>
            <h2 className="text-sm font-bold text-white mb-1">細かく絞り込める</h2>
            <p className="text-xs text-gray-500">重さ・Hz・スイッチ・ANCなど、欲しいスペックで正確に絞り込み</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-blue-400 text-lg mb-2">📊</p>
            <h2 className="text-sm font-bold text-white mb-1">200製品以上を掲載</h2>
            <p className="text-xs text-gray-500">マウス100件・モニター32件・キーボード32件・ヘッドセット31件</p>
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
