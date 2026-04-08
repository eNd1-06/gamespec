import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mousepads, getMousepadBySlug } from "@/data/mousepads";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return mousepads.map((p) => ({ slug: p.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pad = getMousepadBySlug(slug);
  if (!pad) return {};
  const title = `${pad.name}（${pad.brand}）スペック・サイズ・価格`;
  const description = `${pad.name}のスペック詳細。${pad.width}×${pad.height}mm・${pad.surface}・${pad.material}製・¥${pad.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/mousepads/${slug}` },
  };
}

export default async function MousepadDetailPage({ params }: Props) {
  const { slug } = await params;
  const pad = getMousepadBySlug(slug);
  if (!pad) notFound();

  const sizeLabel = pad.size === "S" ? "小型（Sサイズ）" : pad.size === "M" ? "中型（Mサイズ）" : pad.size === "L" ? "大型（Lサイズ）" : pad.size === "XL" ? "特大（XLサイズ）" : "超大型（XXLサイズ）";
  const tags = pad.recommendFor.map((t) => t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技" : "カジュアルゲーム").join("・");
  const description = `${pad.name}は${pad.brand}が${pad.releaseYear}年にリリースした${sizeLabel}の${pad.material}製ゲーミングマウスパッドです。${pad.surface}タイプで${tags}向けに設計されており、サイズは${pad.width}×${pad.height}mm・厚さ${pad.thickness}mm。${pad.stitchedEdge ? "ほつれを防ぐステッチ加工済みで" : ""}参考価格は¥${pad.price.toLocaleString()}です。`;

  const specs = [
    { label: "サイズ区分", value: pad.size },
    { label: "幅 × 高さ", value: `${pad.width} × ${pad.height} mm` },
    { label: "厚さ", value: `${pad.thickness}mm` },
    { label: "滑り感", value: pad.surface },
    { label: "素材", value: pad.material },
    { label: "ステッチ縁", value: pad.stitchedEdge ? "あり" : "なし" },
    { label: "RGB", value: pad.rgb ? "あり" : "なし" },
    { label: "発売年", value: `${pad.releaseYear}年` },
  ];

  const related = mousepads
    .filter((p) => {
      if (p.slug === pad.slug) return false;
      const sameTag = p.recommendFor.some((t) => pad.recommendFor.includes(t));
      const similarPrice = p.price >= pad.price * 0.6 && p.price <= pad.price * 1.6;
      return sameTag || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - pad.price) - Math.abs(b.price - pad.price))
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">GameSpec</Link>
            <span>›</span>
            <Link href="/mousepads" className="hover:text-white">ゲーミングマウスパッド</Link>
            <span>›</span>
            <span className="text-gray-300">{pad.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{pad.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{pad.name}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{pad.size}サイズ</span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              pad.surface === "速度系" ? "bg-blue-900 text-blue-300" :
              pad.surface === "コントロール系" ? "bg-orange-900 text-orange-300" :
              "bg-green-900 text-green-300"
            }`}>{pad.surface}</span>
            {pad.material !== "布" && (
              <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">{pad.material}製</span>
            )}
            {pad.stitchedEdge && (
              <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">ステッチ縁</span>
            )}
            {pad.rgb && (
              <span className="bg-pink-900 text-pink-300 text-sm px-3 py-1 rounded-full">RGB</span>
            )}
            {pad.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技向け" : "カジュアル"}向け
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{pad.price.toLocaleString()}</p>
            </div>
            <a
              href={pad.amazonUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Amazonで確認する →
            </a>
          </div>
        </div>

        {/* 説明文 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
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

        {/* 関連マウスパッド */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">同価格帯・同用途のマウスパッド</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/mousepads/${p.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.size}サイズ</p>
                  <p className="text-xs text-white font-bold">¥{p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
