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
    openGraph: { title, description, type: "website", url: `${BASE_URL}/mousepads/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function MousepadDetailPage({ params }: Props) {
  const { slug } = await params;
  const pad = getMousepadBySlug(slug);
  if (!pad) notFound();

  const sizeLabel = pad.size === "S" ? "小型（Sサイズ）" : pad.size === "M" ? "中型（Mサイズ）" : pad.size === "L" ? "大型（Lサイズ）" : pad.size === "XL" ? "特大（XLサイズ）" : "超大型（XXLサイズ）";
  const tags = pad.recommendFor.map((t) => t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技" : "カジュアルゲーム").join("・");
  const description = `${pad.name}は${pad.brand}が${pad.releaseYear}年にリリースした${sizeLabel}の${pad.material}製ゲーミングマウスパッドです。${pad.surface}タイプで${tags}向けに設計されており、サイズは${pad.width}×${pad.height}mm・厚さ${pad.thickness}mm。${pad.stitchedEdge ? "ほつれを防ぐステッチ加工済みで" : ""}参考価格は¥${pad.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (pad.surface === "速度系") forWhom.push("滑らかな動きで素早いエイム操作を重視する方");
  if (pad.surface === "コントロール系") forWhom.push("マウスの止まりを重視してエイムを安定させたい方");
  if (pad.size === "XL" || pad.size === "XXL") forWhom.push("マウスとキーボードをまとめて置ける広いデスク環境を整えたい方");
  if (pad.size === "S" || pad.size === "M") forWhom.push("限られたデスクスペースでもしっかりしたパッドを使いたい方");
  if (pad.stitchedEdge) forWhom.push("端のほつれを防いで長期間きれいに使い続けたい方");
  if (pad.rgb) forWhom.push("デスクのRGBセットアップに統一感を出したい方");
  if (pad.price <= 3000) forWhom.push("コストを抑えながらクオリティの高いマウスパッドを探している方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームをプレイする方`);

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

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${pad.name}のサイズは？`, a: `${sizeLabel}で、${pad.width}×${pad.height}mmです。` },
    { q: `${pad.name}の表面タイプは？`, a: `${pad.surface}タイプです。${pad.surface === "速度系" ? "マウスが滑らかに動き、素早いエイム操作に向いています。" : pad.surface === "コントロール系" ? "マウスの止まりがよく、エイムを安定させやすい特性です。" : "速度とコントロールのバランスが取れたタイプです。"}` },
    { q: `${pad.name}の素材は？`, a: `${pad.material}製です。` },
    { q: `${pad.name}の厚さは？`, a: `${pad.thickness}mmです。${pad.thickness >= 5 ? "厚みがありクッション性が高く、長時間プレイでも手首への負担を軽減します。" : "薄型設計でデスク上のスペースを取りません。"}` },
    { q: `${pad.name}はステッチ加工されていますか？`, a: pad.stitchedEdge ? "はい、縁部分はステッチ加工されており、ほつれを防いで長期間使用できます。" : "ステッチ加工はされていません。" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pad.name,
      "brand": { "@type": "Brand", "name": pad.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": pad.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": pad.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングマウスパッド", "item": `${BASE_URL}/mousepads` },
        { "@type": "ListItem", "position": 3, "name": pad.name, "item": `${BASE_URL}/mousepads/${pad.slug}` },
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

          {/* 使用感タグ */}
          {pad.feelTags && pad.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {pad.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

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
          <p className="text-sm text-gray-400">{pad.name}をランキングで比較する</p>
          <Link href="/mousepads/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            マウスパッド ランキングを見る →
          </Link>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同用途のマウスパッド</h2>
              <Link href={`/mousepads/compare?a=${pad.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/mousepads/compare?a=${pad.slug}&b=${p.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.size}サイズ</p>
                  <p className="text-xs text-white font-bold">¥{p.price.toLocaleString()}</p>
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
