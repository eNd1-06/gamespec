import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { keyboards, getKeyboardBySlug } from "@/data/keyboards";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return keyboards.map((k) => ({ slug: k.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kb = getKeyboardBySlug(slug);
  if (!kb) return {};
  const title = `${kb.name}（${kb.brand}）スペック・レビュー・価格`;
  const description = `${kb.name}のスペック詳細。${kb.layout}・${kb.switchType}（${kb.switchName}）・${kb.wireless ? "無線対応" : "有線"}・¥${kb.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/keyboards/${slug}` },
  };
}

export default async function KeyboardDetailPage({ params }: Props) {
  const { slug } = await params;
  const kb = getKeyboardBySlug(slug);
  if (!kb) notFound();

  const connectionLabel = kb.connection === "wireless" ? "無線" : kb.connection === "wired" ? "有線" : "有線 / 無線両対応";

  const specs = [
    { label: "サイズ", value: kb.layout },
    { label: "スイッチ種類", value: kb.switchType },
    { label: "スイッチ名", value: kb.switchName },
    { label: "アクチュエーション", value: `${kb.actuation}mm` },
    { label: "ポーリングレート", value: `${kb.pollingRate}Hz` },
    { label: "接続方式", value: connectionLabel },
    ...(kb.wireless && kb.batteryLife ? [{ label: "バッテリー持続時間", value: `約${kb.batteryLife}時間` }] : []),
    { label: "RGB", value: kb.rgb ? "あり" : "なし" },
    { label: "ホットスワップ", value: kb.hotswap ? "対応" : "非対応" },
    { label: "発売年", value: `${kb.releaseYear}年` },
  ];

  const related = keyboards
    .filter((k) => k.slug !== kb.slug && k.layout === kb.layout)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">GameSpec</Link>
            <span>›</span>
            <Link href="/keyboards" className="hover:text-white">ゲーミングキーボード</Link>
            <span>›</span>
            <span className="text-gray-300">{kb.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{kb.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{kb.name}</h1>

          {/* キースペックバッジ */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{kb.layout}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{kb.switchType}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{kb.actuation}mm</span>
            {kb.wireless && (
              <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">無線対応</span>
            )}
            {kb.hotswap && (
              <span className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">ホットスワップ</span>
            )}
            {kb.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技向け" : t === "moba" ? "MOBA" : "タイピング"}向け
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{kb.price.toLocaleString()}</p>
            </div>
            <a
              href={kb.amazonUrl}
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

        {/* 関連キーボード */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">同じサイズのキーボード</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((k) => (
                <Link
                  key={k.slug}
                  href={`/keyboards/${k.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{k.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{k.name}</p>
                  <p className="text-xs text-gray-400">{k.switchType}</p>
                  <p className="text-xs text-white font-bold">¥{k.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
