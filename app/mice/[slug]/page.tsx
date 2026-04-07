import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mice, getMouseBySlug } from "@/data/mice";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return mice.map((m) => ({ slug: m.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mouse = getMouseBySlug(slug);
  if (!mouse) return {};
  const title = `${mouse.name}（${mouse.brand}）スペック・レビュー・価格`;
  const description = `${mouse.name}のスペック詳細。重さ${mouse.weight}g・${mouse.sensor}・${mouse.connection === "wireless" ? "無線" : mouse.connection === "wired" ? "有線" : "有線/無線両対応"}・¥${mouse.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mice/${slug}` },
  };
}

export default async function MousePage({ params }: Props) {
  const { slug } = await params;
  const mouse = getMouseBySlug(slug);
  if (!mouse) notFound();

  const connectionLabel = mouse.connection === "wireless" ? "無線" : mouse.connection === "wired" ? "有線" : "有線 / 無線両対応";
  const shapeLabel = mouse.shape === "symmetrical" ? "左右対称" : "エルゴノミクス（右手用）";

  const specs = [
    { label: "重さ", value: `${mouse.weight}g` },
    { label: "センサー", value: mouse.sensor },
    { label: "最大DPI", value: mouse.maxDpi.toLocaleString() },
    { label: "ポーリングレート", value: `${mouse.pollingRate}Hz` },
    { label: "接続方式", value: connectionLabel },
    { label: "形状", value: shapeLabel },
    { label: "ボタン数", value: `${mouse.buttons}個` },
    { label: "RGB", value: mouse.rgb ? "あり" : "なし" },
    { label: "サイズ", value: `${mouse.length} × ${mouse.width} × ${mouse.height} mm` },
    { label: "発売年", value: `${mouse.releaseYear}年` },
  ];

  const related = mice
    .filter((m) => m.slug !== mouse.slug && m.recommendFor.some((t) => mouse.recommendFor.includes(t)))
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">GameSpec</Link>
            <span>›</span>
            <Link href="/mice" className="hover:text-white">ゲーミングマウス</Link>
            <span>›</span>
            <span className="text-gray-300">{mouse.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{mouse.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{mouse.name}</h1>

          {/* キースペックバッジ */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{mouse.weight}g</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{connectionLabel}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{mouse.pollingRate}Hz</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{mouse.sensor}</span>
            {mouse.recommendFor.map((tag) => (
              <span key={tag} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {tag === "apex" ? "APEX" : tag === "fps" ? "FPS" : tag === "moba" ? "MOBA" : "カジュアル"}向け
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{mouse.price.toLocaleString()}</p>
            </div>
            <a
              href={mouse.amazonUrl}
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

        {/* 関連マウス */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">同じ用途のマウス</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((m) => (
                <Link
                  key={m.slug}
                  href={`/mice/${m.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.weight}g</p>
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
