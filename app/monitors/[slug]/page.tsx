import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { monitors, getMonitorBySlug } from "@/data/monitors";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return monitors.map((m) => ({ slug: m.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const monitor = getMonitorBySlug(slug);
  if (!monitor) return {};
  const title = `${monitor.name}（${monitor.brand}）スペック・レビュー・価格`;
  const description = `${monitor.name}のスペック詳細。${monitor.size}型・${monitor.resolution}・${monitor.refreshRate}Hz・${monitor.panelType}パネル・¥${monitor.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/monitors/${slug}` },
  };
}

export default async function MonitorDetailPage({ params }: Props) {
  const { slug } = await params;
  const monitor = getMonitorBySlug(slug);
  if (!monitor) notFound();

  const specs = [
    { label: "画面サイズ", value: `${monitor.size}型` },
    { label: "解像度", value: monitor.resolution },
    { label: "リフレッシュレート", value: `${monitor.refreshRate}Hz` },
    { label: "応答速度", value: `${monitor.responseTime}ms（GTG）` },
    { label: "パネル種類", value: monitor.panelType },
    { label: "HDR対応", value: monitor.hdr ? "あり" : "なし" },
    { label: "G-SYNC", value: monitor.gsync ? "対応" : "非対応" },
    { label: "FreeSync", value: monitor.freesync ? "対応" : "非対応" },
    { label: "曲面", value: monitor.curved ? "あり" : "なし" },
    { label: "発売年", value: `${monitor.releaseYear}年` },
  ];

  const related = monitors
    .filter((m) => m.slug !== monitor.slug && m.resolution === monitor.resolution)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">GameSpec</Link>
            <span>›</span>
            <Link href="/monitors" className="hover:text-white">ゲーミングモニター</Link>
            <span>›</span>
            <span className="text-gray-300">{monitor.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{monitor.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{monitor.name}</h1>

          {/* キースペックバッジ */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{monitor.refreshRate}Hz</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{monitor.resolution}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{monitor.size}型</span>
            {(monitor.panelType === "OLED" || monitor.panelType === "QD-OLED") && (
              <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">{monitor.panelType}</span>
            )}
            {monitor.panelType !== "OLED" && monitor.panelType !== "QD-OLED" && (
              <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{monitor.panelType}</span>
            )}
            {monitor.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技向け" : "RPG/MMO"}向け
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{monitor.price.toLocaleString()}</p>
            </div>
            <a
              href={monitor.amazonUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Amazonで確認する →
            </a>
          </div>
        </div>

        {/* スペック一覧 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">スペック詳細</h2>
          <div className="divide-y divide-gray-800">
            {specs.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 関連モニター */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">同じ解像度のモニター</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((m) => (
                <Link
                  key={m.slug}
                  href={`/monitors/${m.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.refreshRate}Hz</p>
                  <p className="text-xs text-white font-bold">¥{m.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
