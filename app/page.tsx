import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-3">GameSpec</h1>
        <p className="text-gray-400 mb-10 text-lg">スペックで絞り込む、ゲーミングデバイスDB</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/mice"
            className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-6 text-left transition-all group"
          >
            <div className="text-3xl mb-3">🖱️</div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400">ゲーミングマウス</h2>
            <p className="text-sm text-gray-500">重さ・センサー・接続方式・価格で絞り込み</p>
          </Link>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left opacity-40 cursor-not-allowed">
            <div className="text-3xl mb-3">🖥️</div>
            <h2 className="text-lg font-bold text-white mb-1">ゲーミングモニター</h2>
            <p className="text-sm text-gray-500">Hz・解像度・パネル・価格で絞り込み</p>
            <span className="text-xs text-gray-600 mt-2 block">近日公開</span>
          </div>
        </div>
      </div>
    </main>
  );
}
