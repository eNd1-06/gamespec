import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { controllers, getControllerBySlug } from "@/data/controllers";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return controllers.map((c) => ({ slug: c.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ctrl = getControllerBySlug(slug);
  if (!ctrl) return {};
  const title = `${ctrl.name}（${ctrl.brand}）スペック・価格`;
  const description = `${ctrl.name}のスペック詳細。${ctrl.platform}対応・${ctrl.connection === "wireless" ? "無線" : "有線"}・${ctrl.weight}g・¥${ctrl.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/controllers/${slug}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/controllers/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ControllerDetailPage({ params }: Props) {
  const { slug } = await params;
  const ctrl = getControllerBySlug(slug);
  if (!ctrl) notFound();

  const connectionLabel = ctrl.connection === "wireless" ? "無線" : ctrl.connection === "wired" ? "有線" : "有線 / 無線両対応";
  const tags = ctrl.recommendFor.map((t) =>
    t === "fps" ? "FPS" : t === "apex" ? "APEX" : t === "competitive" ? "競技" : t === "rpg" ? "RPG" : t === "casual" ? "カジュアル" : "格闘ゲーム"
  ).join("・");

  const description = `${ctrl.name}は${ctrl.brand}が${ctrl.releaseYear}年にリリースした${ctrl.platform}対応の${connectionLabel}ゲームコントローラーです。重さ${ctrl.weight}gで${tags}向けに設計されています。${ctrl.backButtons ? "背面ボタンを搭載し、" : ""}${ctrl.triggerStop ? "トリガーストップで素早い射撃操作が可能。" : ""}${ctrl.adaptiveTriggers ? "アダプティブトリガーにより臨場感のある触覚フィードバックを実現。" : ""}参考価格は¥${ctrl.price.toLocaleString()}です。`;

  const specs = [
    { label: "プラットフォーム", value: ctrl.platform },
    { label: "接続方式", value: connectionLabel },
    ...(ctrl.batteryLife ? [{ label: "バッテリー持続時間", value: `約${ctrl.batteryLife}時間` }] : []),
    { label: "重さ", value: `${ctrl.weight}g` },
    { label: "背面ボタン", value: ctrl.backButtons ? "あり" : "なし" },
    { label: "トリガーストップ", value: ctrl.triggerStop ? "あり" : "なし" },
    { label: "ハプティクス", value: ctrl.haptic ? "あり" : "なし" },
    { label: "アダプティブトリガー", value: ctrl.adaptiveTriggers ? "あり" : "なし" },
    { label: "ジャイロセンサー", value: ctrl.gyro ? "あり" : "なし" },
    { label: "発売年", value: `${ctrl.releaseYear}年` },
  ];

  const related = controllers
    .filter((c) => {
      if (c.slug === ctrl.slug) return false;
      const samePlatform = c.platform === ctrl.platform;
      const similarPrice = c.price >= ctrl.price * 0.6 && c.price <= ctrl.price * 1.6;
      return samePlatform || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - ctrl.price) - Math.abs(b.price - ctrl.price))
    .slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": ctrl.name,
      "brand": { "@type": "Brand", "name": ctrl.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": ctrl.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": ctrl.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲームコントローラー", "item": `${BASE_URL}/controllers` },
        { "@type": "ListItem", "position": 3, "name": ctrl.name, "item": `${BASE_URL}/controllers/${ctrl.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">GameSpec</Link>
            <span>›</span>
            <Link href="/controllers" className="hover:text-white">ゲームコントローラー</Link>
            <span>›</span>
            <span className="text-gray-300">{ctrl.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{ctrl.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{ctrl.name}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{ctrl.platform}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{connectionLabel}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{ctrl.weight}g</span>
            {ctrl.backButtons && <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full">背面ボタン</span>}
            {ctrl.triggerStop && <span className="bg-orange-900 text-orange-300 text-sm px-3 py-1 rounded-full">トリガーストップ</span>}
            {ctrl.adaptiveTriggers && <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">アダプティブトリガー</span>}
            {ctrl.isNew && <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">NEW</span>}
            {ctrl.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "fps" ? "FPS" : t === "apex" ? "APEX" : t === "competitive" ? "競技向け" : t === "rpg" ? "RPG" : t === "casual" ? "カジュアル" : "格闘ゲーム"}向け
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{ctrl.price.toLocaleString()}</p>
            </div>
            <a
              href={ctrl.amazonUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Amazonで確認する →
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        </div>

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

        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同プラットフォームのコントローラー</h2>
              <Link href={`/controllers/compare?a=${ctrl.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/controllers/compare?a=${ctrl.slug}&b=${c.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{c.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.platform}</p>
                  <p className="text-xs text-white font-bold">¥{c.price.toLocaleString()}</p>
                  <p className="text-xs text-blue-400 group-hover:text-blue-300 mt-1">比較 →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
