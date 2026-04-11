import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { earphones, getEarphoneBySlug } from "@/data/earphones";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return earphones.map((e) => ({ slug: e.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEarphoneBySlug(slug);
  if (!ep) return {};
  const title = `${ep.name}（${ep.brand}）スペック・レビュー・価格`;
  const description = `${ep.name}のスペック詳細。${ep.driver}・${ep.connection === "wired" ? "有線" : ep.connection === "wireless" ? "ワイヤレス" : "両対応"}・${ep.weight}g・¥${ep.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/earphones/${slug}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/earphones/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function EarphoneDetailPage({ params }: Props) {
  const { slug } = await params;
  const ep = getEarphoneBySlug(slug);
  if (!ep) notFound();

  const connectionLabel = ep.connection === "wired" ? "有線" : ep.connection === "wireless" ? "ワイヤレス" : "有線 / ワイヤレス両対応";
  const tags = ep.recommendFor.map((t) =>
    t === "fps" ? "FPS" : t === "apex" ? "APEX" : t === "competitive" ? "競技" : t === "music" ? "音楽鑑賞" : t === "casual" ? "カジュアル" : "コンソール"
  ).join("・");

  const description = `${ep.name}は${ep.brand}の${connectionLabel}ゲーミングイヤホンです。${ep.driver}を採用し、重さ${ep.weight}gの軽量設計。${ep.microphone ? "マイクを搭載し通話・ボイスチャットに対応、" : ""}${ep.anc ? "アクティブノイズキャンセリング（ANC）搭載、" : ""}${ep.batteryLife ? `バッテリー最大${ep.batteryLife}時間（ワイヤレス時）、` : ""}${ep.latency ? `低遅延${ep.latency}ms対応、` : ""}${tags}向けに最適化されています。参考価格は¥${ep.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (ep.anc) forWhom.push("周囲の騒音をカットして集中してゲームに臨みたい方");
  if (ep.connection === "wireless" && ep.latency && ep.latency <= 20) forWhom.push("ワイヤレスでも低遅延を重視してFPS・APEXをプレイしたい方");
  if (ep.weight <= 5) forWhom.push("長時間装着しても耳・頭が疲れにくい超軽量イヤホンを求める方");
  if (ep.microphone) forWhom.push("ゲーム中のボイスチャットやストリーミング配信に使いたい方");
  if (ep.batteryLife && ep.batteryLife >= 30) forWhom.push("充電を気にせず長時間ワイヤレスで使い続けたい方");
  if (ep.price <= 10000) forWhom.push("コスパ重視でゲーミングイヤホンを始めたい方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームを楽しむ方`);

  const specs = [
    { label: "接続方式", value: connectionLabel },
    { label: "ドライバー", value: ep.driver },
    ...(ep.impedance ? [{ label: "インピーダンス", value: `${ep.impedance}Ω` }] : []),
    ...(ep.sensitivity ? [{ label: "感度", value: `${ep.sensitivity}dB` }] : []),
    ...(ep.frequencyResponse ? [{ label: "周波数特性", value: ep.frequencyResponse }] : []),
    ...(ep.batteryLife ? [{ label: "バッテリー持続時間", value: `約${ep.batteryLife}時間` }] : []),
    ...(ep.latency ? [{ label: "遅延", value: `${ep.latency}ms` }] : []),
    { label: "重さ", value: `${ep.weight}g` },
    { label: "マイク", value: ep.microphone ? "あり" : "なし" },
    { label: "ANC", value: ep.anc ? "搭載" : "非搭載" },
    { label: "発売年", value: `${ep.releaseYear}年` },
  ];

  const related = earphones
    .filter((e) => {
      if (e.slug === ep.slug) return false;
      const sameConn = e.connection === ep.connection;
      const similarPrice = e.price >= ep.price * 0.6 && e.price <= ep.price * 1.6;
      return sameConn || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - ep.price) - Math.abs(b.price - ep.price))
    .slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": ep.name,
      "brand": { "@type": "Brand", "name": ep.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": ep.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": ep.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングイヤホン", "item": `${BASE_URL}/earphones` },
        { "@type": "ListItem", "position": 3, "name": ep.name, "item": `${BASE_URL}/earphones/${ep.slug}` },
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
            <Link href="/earphones" className="hover:text-white">ゲーミングイヤホン</Link>
            <span>›</span>
            <span className="text-gray-300">{ep.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{ep.brand}</p>
          <h1 className="text-2xl font-bold text-white mb-4">{ep.name}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{connectionLabel}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{ep.driver}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{ep.weight}g</span>
            {ep.microphone && <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full">マイク付き</span>}
            {ep.anc && <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">ANC</span>}
            {ep.isNew && <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">NEW</span>}
            {ep.recommendFor.map((t) => (
              <span key={t} className="bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {t === "fps" ? "FPS" : t === "apex" ? "APEX" : t === "competitive" ? "競技向け" : t === "music" ? "音楽鑑賞" : t === "casual" ? "カジュアル" : "コンソール"}向け
              </span>
            ))}
          </div>

          {/* 使用感タグ */}
          {ep.feelTags && ep.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {ep.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{ep.price.toLocaleString()}</p>
            </div>
            <a href={ep.amazonUrl} target="_blank" rel="nofollow noopener noreferrer"
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
          <p className="text-sm text-gray-400">{ep.name}をランキングで比較する</p>
          <Link href="/earphones/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            イヤホン ランキングを見る →
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
              <h2 className="text-lg font-bold text-white">同価格帯・同接続方式のイヤホン</h2>
              <Link href={`/earphones/compare?a=${ep.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((e) => (
                <Link key={e.slug} href={`/earphones/compare?a=${ep.slug}&b=${e.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group">
                  <p className="text-xs text-gray-500 mb-1">{e.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.driver}</p>
                  <p className="text-xs text-white font-bold">¥{e.price.toLocaleString()}</p>
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
