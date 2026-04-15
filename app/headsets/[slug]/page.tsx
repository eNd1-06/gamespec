import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { headsets, getHeadsetBySlug } from "@/data/headsets";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return headsets.map((h) => ({ slug: h.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const headset = getHeadsetBySlug(slug);
  if (!headset) return {};
  const connectionLabel = headset.connection === "wireless" ? "無線" : headset.connection === "wired" ? "有線" : "有線/無線両対応";
  const title = `${headset.name}（${headset.brand}）スペック・レビュー・価格`;
  const description = `${headset.name}のスペック詳細。${headset.weight}g・${connectionLabel}${headset.batteryLife ? `・バッテリー${headset.batteryLife}時間` : ""}・¥${headset.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/headsets/${slug}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/headsets/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function HeadsetDetailPage({ params }: Props) {
  const { slug } = await params;
  const headset = getHeadsetBySlug(slug);
  if (!headset) notFound();

  const connectionLabel = headset.connection === "wireless" ? "無線" : headset.connection === "wired" ? "有線" : "有線 / 無線両対応";

  const specs = [
    { label: "重さ", value: `${headset.weight}g` },
    { label: "ドライバーサイズ", value: `${headset.driverSize}mm` },
    { label: "接続方式", value: connectionLabel },
    ...(headset.wirelessProtocol ? [{ label: "無線規格", value: headset.wirelessProtocol }] : []),
    ...(headset.batteryLife ? [{ label: "バッテリー持続時間", value: `約${headset.batteryLife}時間` }] : []),
    { label: "マイク", value: headset.microphone ? "あり" : "なし" },
    { label: "マイク取り外し", value: headset.micDetachable ? "可能" : "不可" },
    { label: "バーチャルサラウンド", value: headset.virtualSurround ? "対応" : "非対応" },
    { label: "ANC（ノイキャン）", value: headset.anc ? "搭載" : "非搭載" },
    { label: "発売年", value: `${headset.releaseYear}年` },
  ];

  const weightLabel = headset.weight <= 250 ? "軽量" : headset.weight <= 320 ? "標準" : "重め";
  const ancText = headset.anc ? "アクティブノイズキャンセリング（ANC）搭載、" : "";
  const batteryText = headset.batteryLife ? `バッテリー最大${headset.batteryLife}時間、` : "";
  const tags = headset.recommendFor.map((t) => t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技" : t === "immersive" ? "没入感重視" : t === "console" ? "コンソール" : "カジュアル").join("・");
  const description = `${headset.name}は${headset.brand}が${headset.releaseYear}年に発売した${weightLabel}（${headset.weight}g）の${connectionLabel}ゲーミングヘッドセットです。${headset.driverSize}mmドライバーを搭載し、${ancText}${batteryText}${headset.virtualSurround ? "バーチャルサラウンドに対応。" : ""}${tags}向けに設計されており、参考価格は¥${headset.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (headset.anc) forWhom.push("周囲の騒音を遮断して集中してゲームに臨みたい方");
  if (headset.connection === "wireless") forWhom.push("ケーブルなしで自由に動きながらゲームしたい方");
  if (headset.batteryLife && headset.batteryLife >= 40) forWhom.push("充電を気にせず長時間プレイしたい方");
  if (headset.virtualSurround) forWhom.push("FPS・APEXで敵の足音・銃声の方向を正確に把握したい方");
  if (headset.weight <= 280) forWhom.push("軽量設計で長時間装着しても頭・首が疲れにくい環境を求める方");
  if (headset.price <= 15000) forWhom.push("コストを抑えながら無線ゲーミングヘッドセットを始めたい方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームを楽しむ方`);

  const related = headsets
    .filter((h) => {
      if (h.slug === headset.slug) return false;
      const sameConn = h.connection === headset.connection;
      const similarPrice = h.price >= headset.price * 0.6 && h.price <= headset.price * 1.6;
      return sameConn || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - headset.price) - Math.abs(b.price - headset.price))
    .slice(0, 4);

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${headset.name}の重さは？`, a: `${headset.weight}gです。${weightLabel}クラスのヘッドセットです。` },
    { q: `${headset.name}は無線対応ですか？`, a: headset.connection === "wireless" ? `はい、無線に対応しています。${headset.batteryLife ? `バッテリー持続時間は最大${headset.batteryLife}時間です。` : ""}` : headset.connection === "both" ? `有線・無線両対応です。${headset.batteryLife ? `無線時のバッテリー持続時間は最大${headset.batteryLife}時間です。` : ""}` : "有線接続のみ対応しています。" },
    { q: `${headset.name}にマイクはありますか？`, a: headset.microphone ? `はい、マイクを搭載しています。${headset.micDetachable ? "マイクは取り外し可能です。" : ""}` : "マイクは搭載していません。" },
    { q: `${headset.name}はバーチャルサラウンドに対応していますか？`, a: headset.virtualSurround ? "はい、バーチャルサラウンドに対応しています。FPS・APEXで敵の足音の方向を把握しやすくなります。" : "バーチャルサラウンドには対応していません。" },
    { q: `${headset.name}はFPS向けですか？`, a: headset.recommendFor.some((t) => t === "fps" || t === "competitive") ? `はい、${tags}向けに設計されています。` : `主に${tags}向けです。` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": headset.name,
      "brand": { "@type": "Brand", "name": headset.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": headset.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": headset.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングヘッドセット", "item": `${BASE_URL}/headsets` },
        { "@type": "ListItem", "position": 3, "name": headset.name, "item": `${BASE_URL}/headsets/${headset.slug}` },
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
            <Link href="/headsets" className="hover:text-white">ゲーミングヘッドセット</Link>
            <span>›</span>
            <span className="text-gray-300">{headset.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{headset.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{headset.name}</h1>

          {/* キースペックバッジ */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{headset.weight}g</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{connectionLabel}</span>
            {headset.batteryLife && (
              <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{headset.batteryLife}時間</span>
            )}
            {headset.anc && (
              <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">ANC搭載</span>
            )}
            {headset.virtualSurround && (
              <span className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">バーチャルサラウンド</span>
            )}
            {headset.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技向け" : t === "immersive" ? "没入感重視" : t === "console" ? "コンソール" : "カジュアル"}向け
              </span>
            ))}
          </div>

          {/* 使用感タグ */}
          {headset.feelTags && headset.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {headset.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{headset.price.toLocaleString()}</p>
            </div>
            <a
              href={headset.amazonUrl}
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
          <p className="text-sm text-gray-400">{headset.name}をランキングで比較する</p>
          <Link href="/headsets/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            ヘッドセット ランキングを見る →
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

        {/* 関連ヘッドセット */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同接続方式のヘッドセット</h2>
              <Link href={`/headsets/compare?a=${headset.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((h) => (
                <Link
                  key={h.slug}
                  href={`/headsets/compare?a=${headset.slug}&b=${h.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{h.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{h.name}</p>
                  <p className="text-xs text-gray-400">{h.weight}g</p>
                  <p className="text-xs text-white font-bold">¥{h.price.toLocaleString()}</p>
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
