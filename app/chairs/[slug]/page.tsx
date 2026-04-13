import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { chairs, getChairBySlug } from "@/data/chairs";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return chairs.map((c) => ({ slug: c.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chair = getChairBySlug(slug);
  if (!chair) return {};
  const title = `${chair.name}（${chair.brand}）スペック・価格`;
  const description = `${chair.name}のスペック詳細。${chair.type}・${chair.material}・耐荷重${chair.maxLoadWeight}kg・¥${chair.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/chairs/${slug}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/chairs/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ChairDetailPage({ params }: Props) {
  const { slug } = await params;
  const chair = getChairBySlug(slug);
  if (!chair) notFound();

  const tags = chair.recommendFor.map((t) =>
    t === "fps" ? "FPS" : t === "long-session" ? "長時間プレイ" : t === "back-pain" ? "腰痛対策" : t === "casual" ? "カジュアル" : "オフィス兼用"
  ).join("・");

  const description = `${chair.name}は${chair.brand}が${chair.releaseYear}年にリリースした${chair.type}のゲーミングチェアです。${chair.material}素材を採用し、耐荷重${chair.maxLoadWeight}kg・最大リクライニング${chair.recliningAngle}°に対応。アームレストは${chair.armrest}で${chair.lumbarSupport ? "ランバーサポートクッション付き、" : ""}${chair.footrest ? "フットレスト付きで長時間のプレイも快適、" : ""}${tags}向けに設計されています。参考価格は¥${chair.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (chair.lumbarSupport) forWhom.push("長時間プレイ中の腰の負担を軽減して腰痛を予防したい方");
  if (chair.armrest === "4D") forWhom.push("アームレストを細かく調整して肩・腕の疲れを最小化したい方");
  if (chair.material === "メッシュ") forWhom.push("通気性の高いメッシュ素材で夏でも蒸れずに快適にプレイしたい方");
  if (chair.footrest) forWhom.push("フットレストを使って足を伸ばしながらリラックスしてプレイしたい方");
  if (chair.recliningAngle >= 160) forWhom.push("プレイ後にしっかりリクライニングして体を休めたい方");
  if (chair.price <= 40000) forWhom.push("コスパ重視で機能充実のゲーミングチェアを探している方");
  if (forWhom.length === 0) forWhom.push(`${tags}を楽しむ方`);

  const specs = [
    { label: "タイプ", value: chair.type },
    { label: "素材", value: chair.material },
    { label: "耐荷重", value: `${chair.maxLoadWeight}kg` },
    { label: "最大リクライニング", value: `${chair.recliningAngle}°` },
    { label: "アームレスト", value: chair.armrest },
    { label: "座面幅", value: `${chair.seatWidth}cm` },
    { label: "ランバーサポート", value: chair.lumbarSupport ? "付属" : "なし" },
    { label: "ネックピロー", value: chair.neckSupport ? "付属" : "なし" },
    { label: "フットレスト", value: chair.footrest ? "付属" : "なし" },
    { label: "RGB", value: chair.rgb ? "あり" : "なし" },
    { label: "発売年", value: `${chair.releaseYear}年` },
  ];

  const related = chairs
    .filter((c) => {
      if (c.slug === chair.slug) return false;
      const sameType = c.type === chair.type;
      const similarPrice = c.price >= chair.price * 0.6 && c.price <= chair.price * 1.6;
      return sameType || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - chair.price) - Math.abs(b.price - chair.price))
    .slice(0, 4);

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${chair.name}の耐荷重は何kgですか？`, a: `最大${chair.maxLoadWeight}kgです。` },
    { q: `${chair.name}のリクライニング角度は？`, a: `最大${chair.recliningAngle}°までリクライニング可能です。` },
    { q: `${chair.name}にランバーサポートはありますか？`, a: chair.lumbarSupport ? "はい、ランバーサポートクッションが付属しています。腰への負担を軽減します。" : "ランバーサポートは付属していません。" },
    { q: `${chair.name}のアームレストは調整できますか？`, a: chair.armrest === "なし" ? "アームレストは付属していません。" : `${chair.armrest}アームレストを搭載しています。${chair.armrest === "4D" ? "上下・前後・左右・回転の4方向に調整できます。" : chair.armrest === "3D" ? "上下・前後・左右の3方向に調整できます。" : "上下・左右の2方向に調整できます。"}` },
    { q: `${chair.name}はフットレスト付きですか？`, a: chair.footrest ? "はい、フットレストが付属しています。足を伸ばしてリラックスしながらプレイできます。" : "フットレストは付属していません。" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": chair.name,
      "brand": { "@type": "Brand", "name": chair.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": chair.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": chair.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングチェア", "item": `${BASE_URL}/chairs` },
        { "@type": "ListItem", "position": 3, "name": chair.name, "item": `${BASE_URL}/chairs/${chair.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
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
            <Link href="/chairs" className="hover:text-white">ゲーミングチェア</Link>
            <span>›</span>
            <span className="text-gray-300">{chair.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{chair.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{chair.name}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{chair.type}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{chair.material}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">耐荷重{chair.maxLoadWeight}kg</span>
            {chair.lumbarSupport && <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full">ランバーサポート</span>}
            {chair.footrest && <span className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">フットレスト</span>}
            {chair.isNew && <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">NEW</span>}
            {chair.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "fps" ? "FPS" : t === "long-session" ? "長時間プレイ" : t === "back-pain" ? "腰痛対策" : t === "casual" ? "カジュアル" : "オフィス兼用"}向け
              </span>
            ))}
          </div>

          {/* 使用感タグ */}
          {chair.feelTags && chair.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {chair.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{chair.price.toLocaleString()}</p>
            </div>
            <a href={chair.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all text-sm">
              Amazonで確認する →
            </a>
          </div>
        </div>

        {/* 説明文 + こんな人におすすめ */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{description}</p>
          {forWhom.length > 0 && (
            <>
              <h2 className="text-sm font-bold text-white mb-2">こんな方におすすめ</h2>
              <ul className="space-y-1">
                {forWhom.map((item) => (
                  <li key={item} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ランキングへの導線 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">{chair.name}をランキングで比較する</p>
          <Link href="/chairs/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            チェア ランキングを見る →
          </Link>
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
              <h2 className="text-lg font-bold text-white">同価格帯・同タイプのチェア</h2>
              <Link href={`/chairs/compare?a=${chair.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((c) => (
                <Link key={c.slug} href={`/chairs/compare?a=${chair.slug}&b=${c.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group">
                  <p className="text-xs text-gray-500 mb-1">{c.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.type}</p>
                  <p className="text-xs text-white font-bold">¥{c.price.toLocaleString()}</p>
                  <p className="text-xs text-blue-400 group-hover:text-blue-300 mt-1">比較 →</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
          <h2 className="text-lg font-bold text-white mb-4">よくある質問</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-800 pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm font-bold text-white mb-1">Q. {q}</p>
                <p className="text-sm text-gray-400">A. {a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
