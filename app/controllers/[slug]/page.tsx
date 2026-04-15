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

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (ctrl.backButtons) forWhom.push("スティックから親指を離さずにジャンプ・リロードを操作したい方");
  if (ctrl.triggerStop) forWhom.push("FPSで射撃トリガーを最短ストロークで素早く引きたい方");
  if (ctrl.gyro) forWhom.push("ジャイロエイムでより直感的なエイム操作を求める方");
  if (ctrl.adaptiveTriggers) forWhom.push("アダプティブトリガーで没入感のある触覚体験を楽しみたい方");
  if (ctrl.connection === "wireless") forWhom.push("ケーブルなしでソファやベッドから快適にプレイしたい方");
  if (ctrl.price <= 8000) forWhom.push("コストを抑えながらゲームパッドを始めたい方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームを楽しみたい方`);

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

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${ctrl.name}は無線ですか？`, a: ctrl.connection === "wireless" ? `はい、無線（ワイヤレス）対応です。${ctrl.batteryLife ? `バッテリー持続時間は約${ctrl.batteryLife}時間です。` : ""}` : ctrl.connection === "both" ? `有線・無線両対応です。${ctrl.batteryLife ? `無線時のバッテリー持続時間は約${ctrl.batteryLife}時間です。` : ""}` : "有線接続のみ対応しています。" },
    { q: `${ctrl.name}の重さは？`, a: `約${ctrl.weight}gです。` },
    { q: `${ctrl.name}は何のプラットフォームに対応していますか？`, a: `${ctrl.platform}向けのコントローラーです。` },
    { q: `${ctrl.name}に背面ボタンはありますか？`, a: ctrl.backButtons ? "はい、背面ボタンを搭載しています。スティックから親指を離さずに操作できます。" : "背面ボタンは搭載していません。" },
    { q: `${ctrl.name}はFPS・APEXに向いていますか？`, a: ctrl.recommendFor.some((t) => t === "fps" || t === "competitive") ? `はい、${tags}向けに設計されています。${ctrl.triggerStop ? "トリガーストップで素早い射撃が可能です。" : ""}` : `主に${tags}向けです。` },
  ];

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

          {/* 使用感タグ */}
          {ctrl.feelTags && ctrl.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {ctrl.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

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
          <p className="text-sm text-gray-400">{ctrl.name}をランキングで比較する</p>
          <Link href="/controllers/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            コントローラー ランキングを見る →
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
