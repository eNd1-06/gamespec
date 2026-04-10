import Link from "next/link";
import type { Metadata } from "next";
import { mice } from "@/data/mice";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "コスパ最強ゲーミングマウスおすすめ2026【5000円・8000円・15000円別】",
  description: "コスパ最強ゲーミングマウスのおすすめを予算別に比較。5000円以下・8000円以下・15000円以下の価格帯でスペックと価格を総合評価して厳選紹介。",
  alternates: { canonical: `${BASE_URL}/mice/cospa` },
  openGraph: {
    title: "コスパ最強ゲーミングマウスおすすめ2026 | GameSpec",
    description: "5000円・8000円・15000円以下のコスパ最強ゲーミングマウスをスペックで比較。",
    type: "website",
    url: `${BASE_URL}/mice/cospa`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "コスパ最強ゲーミングマウスおすすめ2026 | GameSpec",
    description: "予算別コスパ最強ゲーミングマウスをスペックで比較。",
  },
};

function cospaScore(m: (typeof mice)[0]): number {
  const weightScore = Math.max(0, (120 - m.weight) / 80) * 35;
  const pollingScore = Math.min(m.pollingRate / 4000, 1) * 25;
  const priceScore = Math.max(0, (20000 - m.price) / 20000) * 40;
  return weightScore + pollingScore + priceScore;
}

const under5k = [...mice]
  .filter((m) => m.price <= 5000)
  .sort((a, b) => cospaScore(b) - cospaScore(a))
  .slice(0, 5);

const under8k = [...mice]
  .filter((m) => m.price > 5000 && m.price <= 8000)
  .sort((a, b) => cospaScore(b) - cospaScore(a))
  .slice(0, 5);

const under15k = [...mice]
  .filter((m) => m.price > 8000 && m.price <= 15000)
  .sort((a, b) => cospaScore(b) - cospaScore(a))
  .slice(0, 5);

const connectionLabel = (c: string) =>
  c === "wireless" ? "無線" : c === "wired" ? "有線" : "両対応";

function MouseCard({ mouse, rank, badge }: { mouse: (typeof mice)[0]; rank: number; badge?: string }) {
  const weightLabel = mouse.weight <= 55 ? "超軽量" : mouse.weight <= 70 ? "軽量" : mouse.weight <= 90 ? "標準" : "重め";
  return (
    <Link
      href={`/mice/${mouse.slug}`}
      className="flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 transition-all group"
    >
      <div
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg bg-gray-800 text-gray-400"
        style={rank <= 3 ? { background: rank === 1 ? "#b8860b" : rank === 2 ? "#708090" : "#8b4513", color: "#fff" } : {}}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-gray-500">{mouse.brand}</p>
          {badge && <span className="text-xs bg-green-700 text-white px-1.5 py-0.5 rounded">{badge}</span>}
          {mouse.isNew && <span className="text-xs bg-blue-700 text-white px-1.5 py-0.5 rounded">NEW</span>}
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 leading-tight mb-2">{mouse.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-bold">¥{mouse.price.toLocaleString()}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.weight}g · {weightLabel}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{connectionLabel(mouse.connection)}</span>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{mouse.pollingRate.toLocaleString()}Hz</span>
        </div>
      </div>
    </Link>
  );
}

export default function CospaMousePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← GameSpec</Link>
          <span className="text-gray-700">|</span>
          <Link href="/mice" className="text-gray-400 hover:text-white text-sm">ゲーミングマウス</Link>
          <span className="text-gray-700">|</span>
          <span className="text-white text-sm font-bold">コスパ最強</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">コスパ最強ゲーミングマウスおすすめ2026</h1>
        <p className="text-sm text-gray-400 mb-8">
          5,000円・8,000円・15,000円の予算別に「軽さ÷価格」スコアで厳選。安くてもスペックを妥協しないモデルを全{mice.length}製品からピックアップ。
        </p>

        {/* 目次 */}
        <nav className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <p className="text-xs text-gray-500 mb-2">目次</p>
          <ul className="space-y-1">
            {under5k.length > 0 && <li><a href="#under5k" className="text-sm text-blue-400 hover:text-blue-300">▶ 5,000円以下のコスパ最強マウス</a></li>}
            {under8k.length > 0 && <li><a href="#under8k" className="text-sm text-blue-400 hover:text-blue-300">▶ 5,001〜8,000円のコスパ最強マウス</a></li>}
            {under15k.length > 0 && <li><a href="#under15k" className="text-sm text-blue-400 hover:text-blue-300">▶ 8,001〜15,000円のコスパ最強マウス</a></li>}
          </ul>
        </nav>

        {/* 5000円以下 */}
        {under5k.length > 0 && (
          <section id="under5k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">5,000円以下のコスパ最強マウス</h2>
            <p className="text-xs text-gray-500 mb-4">入門・サブ機・予算重視の方へ。有線モデルが中心だが十分な性能を持つ。</p>
            <div className="space-y-3">
              {under5k.map((m, i) => <MouseCard key={m.slug} mouse={m} rank={i + 1} badge="〜5,000円" />)}
            </div>
          </section>
        )}

        {/* 8000円以下 */}
        {under8k.length > 0 && (
          <section id="under8k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">5,001〜8,000円のコスパ最強マウス</h2>
            <p className="text-xs text-gray-500 mb-4">最もコスパの激戦ゾーン。軽量・高ポーリングレートのモデルも多く、初めてのゲーミングマウスに最適。</p>
            <div className="space-y-3">
              {under8k.map((m, i) => <MouseCard key={m.slug} mouse={m} rank={i + 1} badge="〜8,000円" />)}
            </div>
          </section>
        )}

        {/* 15000円以下 */}
        {under15k.length > 0 && (
          <section id="under15k" className="mb-12">
            <h2 className="text-lg font-bold text-white mb-1">8,001〜15,000円のコスパ最強マウス</h2>
            <p className="text-xs text-gray-500 mb-4">無線対応・高ポーリングレートも選べる中級ゾーン。長く使うメインマウスを探している方向け。</p>
            <div className="space-y-3">
              {under15k.map((m, i) => <MouseCard key={m.slug} mouse={m} rank={i + 1} badge="〜15,000円" />)}
            </div>
          </section>
        )}

        {/* コスパの考え方 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">コスパの考え方</h2>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">安いマウスでも十分戦える</h3>
              <p>5,000円台でも1000Hzポーリングレート・光学センサー・60〜80gの軽量モデルは存在します。マウスパッドとセットで揃えるほうが操作精度への影響が大きい場合もあります。</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">有線は無線より安くて高性能</h3>
              <p>無線機能のコストがないため、同価格帯なら有線のほうがセンサー・ポーリングレートが優れるケースが多い。コード問題はマウスバンジーで解決できます（1,000〜3,000円程度）。</p>
            </div>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link href="/mice/apex" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">APEX向け</p>
            <p className="text-xs text-gray-400">競技向きを見る</p>
          </Link>
          <Link href="/mice/lightweight" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">軽量マウス</p>
            <p className="text-xs text-gray-400">60g以下を見る</p>
          </Link>
          <Link href="/mice/ranking" className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-4 text-center transition-all">
            <p className="text-sm font-bold text-white mb-1">総合ランキング</p>
            <p className="text-xs text-gray-400">全製品を順位付け</p>
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">価格・重さ・接続方式で自分で絞り込む</p>
          <Link href="/mice" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            ゲーミングマウス {mice.length}製品をすべて見る →
          </Link>
        </div>
      </main>
    </div>
  );
}
