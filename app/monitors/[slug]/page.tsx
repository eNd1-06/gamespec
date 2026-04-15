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
    openGraph: { title, description, type: "website", url: `${BASE_URL}/monitors/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
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

  const panelLabel = monitor.panelType === "OLED" || monitor.panelType === "QD-OLED" ? `${monitor.panelType}パネル` : `${monitor.panelType}パネル`;
  const hzLabel = monitor.refreshRate >= 360 ? "超高リフレッシュレート" : monitor.refreshRate >= 240 ? "高リフレッシュレート" : "標準リフレッシュレート";
  const tags = monitor.recommendFor.map((t) => t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技" : "RPG/MMO").join("・");
  const description = `${monitor.name}は${monitor.brand}が${monitor.releaseYear}年に発売した${monitor.size}型・${monitor.resolution}・${monitor.refreshRate}Hzの${hzLabel}ゲーミングモニターです。${panelLabel}を採用し、応答速度${monitor.responseTime}ms（GTG）を実現。${monitor.curved ? "曲面パネルで没入感が高く、" : ""}${tags}向けに最適化されており、参考価格は¥${monitor.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (monitor.refreshRate >= 500) forWhom.push("CS2・APEXなど競技FPSでプロレベルの環境を求める方");
  else if (monitor.refreshRate >= 240) forWhom.push("FPS・APEXで高リフレッシュレートによる滑らかな映像を求める方");
  if (monitor.panelType === "OLED" || monitor.panelType === "QD-OLED") forWhom.push("完全な黒と圧倒的なコントラストで没入感を高めたい方");
  if (monitor.responseTime <= 0.1) forWhom.push("残像・ゴーストのない超高速応答を求める方");
  if (monitor.curved) forWhom.push("湾曲パネルで視野角を広げ、包まれるような没入感を得たい方");
  if (monitor.resolution === "4K") forWhom.push("4K高解像度で映像制作・RPGを最高画質で楽しみたい方");
  if (monitor.price <= 35000) forWhom.push("コストを抑えながらゲーミングモニターを始めたい方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームをプレイする方`);

  const related = monitors
    .filter((m) => {
      if (m.slug === monitor.slug) return false;
      const sameRes = m.resolution === monitor.resolution;
      const similarPrice = m.price >= monitor.price * 0.6 && m.price <= monitor.price * 1.6;
      return sameRes || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - monitor.price) - Math.abs(b.price - monitor.price))
    .slice(0, 4);

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${monitor.name}のリフレッシュレートは？`, a: `${monitor.refreshRate}Hzです。${monitor.refreshRate >= 240 ? "高リフレッシュレートでFPS・APEXなど競技ゲームに最適です。" : "標準的なゲーミング用途に十分なリフレッシュレートです。"}` },
    { q: `${monitor.name}のパネルは何ですか？`, a: `${monitor.panelType}パネルを採用しています。応答速度は${monitor.responseTime}ms（GTG）です。` },
    { q: `${monitor.name}の解像度は？`, a: `${monitor.resolution}（${monitor.size}型）です。` },
    { q: `${monitor.name}はHDR対応ですか？`, a: monitor.hdr ? "はい、HDRに対応しています。" : "HDRには対応していません。" },
    { q: `${monitor.name}はFPS向けですか？`, a: monitor.recommendFor.some((t) => t === "fps" || t === "competitive") ? `はい、${tags}向けに設計されています。高リフレッシュレートと低遅延で競技プレイに適しています。` : `主に${tags}向けです。` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": monitor.name,
      "brand": { "@type": "Brand", "name": monitor.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": monitor.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": monitor.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングモニター", "item": `${BASE_URL}/monitors` },
        { "@type": "ListItem", "position": 3, "name": monitor.name, "item": `${BASE_URL}/monitors/${monitor.slug}` },
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

          {/* 使用感タグ */}
          {monitor.feelTags && monitor.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {monitor.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

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
          <p className="text-sm text-gray-400">{monitor.name}をランキングで比較する</p>
          <Link href="/monitors/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            モニター ランキングを見る →
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

        {/* 関連モニター */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同解像度のモニター</h2>
              <Link href={`/monitors/compare?a=${monitor.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((m) => (
                <Link
                  key={m.slug}
                  href={`/monitors/compare?a=${monitor.slug}&b=${m.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.refreshRate}Hz</p>
                  <p className="text-xs text-white font-bold">¥{m.price.toLocaleString()}</p>
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
