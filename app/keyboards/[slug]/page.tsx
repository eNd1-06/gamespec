import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { keyboards, getKeyboardBySlug } from "@/data/keyboards";
import { KEYBOARD_VS_PAIRS } from "@/data/vs-pairs";
import { monitors } from "@/data/monitors";
import { headsets } from "@/data/headsets";

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
    openGraph: { title, description, type: "website", url: `${BASE_URL}/keyboards/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
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

  const switchLabel = kb.switchType === "磁気式" ? "磁気式アナログスイッチ（アクチュエーション可変）" : `${kb.switchType}（${kb.switchName}）`;
  const wirelessText = kb.wireless ? `ワイヤレス対応${kb.batteryLife ? `（最大${kb.batteryLife}時間）` : ""}、` : "有線接続、";
  const hotswapText = kb.hotswap ? "ホットスワップ対応、" : "";
  const tags = kb.recommendFor.map((t) => t === "apex" ? "APEX" : t === "fps" ? "FPS" : t === "competitive" ? "競技" : t === "moba" ? "MOBA" : "タイピング").join("・");
  const description = `${kb.name}は${kb.brand}が${kb.releaseYear}年に発売した${kb.layout}サイズのゲーミングキーボードです。${switchLabel}を採用し、アクチュエーション${kb.actuation}mm・ポーリングレート${kb.pollingRate}Hzに対応。${wirelessText}${hotswapText}${tags}向けに最適化されており、参考価格は¥${kb.price.toLocaleString()}です。`;

  // こんな人におすすめ
  const forWhom: string[] = [];
  if (kb.switchType === "磁気式") forWhom.push("アクチュエーション深さを自由に調整してエイムを最適化したい方");
  if (kb.pollingRate >= 4000) forWhom.push("入力遅延を極限まで削減したい競技プレイヤー");
  if (kb.wireless) forWhom.push("ケーブルなしですっきりしたデスク環境でプレイしたい方");
  if (kb.hotswap) forWhom.push("スイッチを自分好みに交換してカスタマイズしたい方");
  if (kb.layout === "60%" || kb.layout === "65%") forWhom.push("コンパクトなレイアウトでマウス可動域を最大限に確保したい方");
  if (kb.actuation <= 0.2) forWhom.push("超高速アクチュエーションで競技FPSの反応速度を高めたい方");
  if (kb.price <= 15000) forWhom.push("コストを抑えながら競技品質のキーボードを探している方");
  if (forWhom.length === 0) forWhom.push(`${tags}ゲームをプレイする方`);

  // 相性の良いモニター（競技向けなら高Hz優先）
  const relatedMonitors = monitors
    .filter((m) => m.recommendFor.some((t) => (kb.recommendFor as string[]).includes(t)))
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);

  // 相性の良いヘッドセット
  const relatedHeadsets = headsets
    .filter((h) => h.recommendFor.some((t) => (kb.recommendFor as string[]).includes(t)))
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);

  const related = keyboards
    .filter((k) => {
      if (k.slug === kb.slug) return false;
      const sameLayout = k.layout === kb.layout;
      const similarPrice = k.price >= kb.price * 0.6 && k.price <= kb.price * 1.6;
      return sameLayout || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - kb.price) - Math.abs(b.price - kb.price))
    .slice(0, 4);

  const relatedVs = KEYBOARD_VS_PAIRS.filter(([a, b]) => a === kb.slug || b === kb.slug);

  // FAQ生成
  const faqs: { q: string; a: string }[] = [
    { q: `${kb.name}のスイッチは？`, a: `${switchLabel}を採用しています。アクチュエーションは${kb.actuation}mmです。` },
    { q: `${kb.name}は無線対応ですか？`, a: kb.wireless ? `はい、無線（ワイヤレス）に対応しています。${kb.batteryLife ? `バッテリー持続時間は最大${kb.batteryLife}時間です。` : ""}` : "有線接続のみ対応しています。" },
    { q: `${kb.name}のレイアウトは？`, a: `${kb.layout}サイズです。` },
    { q: `${kb.name}はホットスワップ対応ですか？`, a: kb.hotswap ? "はい、ホットスワップに対応しています。はんだなしでスイッチを交換できます。" : "ホットスワップには対応していません。" },
    { q: `${kb.name}のポーリングレートは？`, a: `${kb.pollingRate}Hzです。${kb.pollingRate >= 4000 ? "超高ポーリングレートで入力遅延を極限まで削減できます。" : ""}` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": kb.name,
      "brand": { "@type": "Brand", "name": kb.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": kb.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": kb.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "ゲーミングキーボード", "item": `${BASE_URL}/keyboards` },
        { "@type": "ListItem", "position": 3, "name": kb.name, "item": `${BASE_URL}/keyboards/${kb.slug}` },
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

          {/* 使用感タグ */}
          {kb.feelTags && kb.feelTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {kb.feelTags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

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
          <p className="text-sm text-gray-400">{kb.name}をランキングで比較する</p>
          <Link href="/keyboards/ranking" className="text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5 shrink-0">
            キーボード ランキングを見る →
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

        {/* 関連キーボード */}
        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同サイズのキーボード</h2>
              <Link href={`/keyboards/compare?a=${kb.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((k) => (
                <Link
                  key={k.slug}
                  href={`/keyboards/compare?a=${kb.slug}&b=${k.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{k.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{k.name}</p>
                  <p className="text-xs text-gray-400">{k.switchType}</p>
                  <p className="text-xs text-white font-bold">¥{k.price.toLocaleString()}</p>
                  <p className="text-xs text-blue-400 group-hover:text-blue-300 mt-1">比較 →</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 相性の良いモニター */}
        {relatedMonitors.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">相性の良いモニター</h2>
              <Link href="/monitors" className="text-xs text-blue-400 hover:text-blue-300">一覧を見る →</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {relatedMonitors.map((m) => (
                <Link key={m.slug} href={`/monitors/${m.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group">
                  <p className="text-xs text-gray-500 mb-1">{m.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-1">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.size}型 · {m.refreshRate}Hz</p>
                  <p className="text-xs text-white font-bold">¥{m.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 相性の良いヘッドセット */}
        {relatedHeadsets.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">相性の良いヘッドセット</h2>
              <Link href="/headsets" className="text-xs text-blue-400 hover:text-blue-300">一覧を見る →</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {relatedHeadsets.map((h) => (
                <Link key={h.slug} href={`/headsets/${h.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group">
                  <p className="text-xs text-gray-500 mb-1">{h.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-1">{h.name}</p>
                  <p className="text-xs text-gray-400">{h.weight}g · {h.connection === "wireless" ? "無線" : "有線"}</p>
                  <p className="text-xs text-white font-bold">¥{h.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 他のキーボードと比較する */}
        {relatedVs.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
            <h2 className="text-lg font-bold text-white mb-4">他のキーボードと比較する</h2>
            <div className="space-y-2">
              {relatedVs.map(([a, b]) => {
                const itemA = keyboards.find((x) => x.slug === a)!;
                const itemB = keyboards.find((x) => x.slug === b)!;
                return (
                  <Link
                    key={`${a}-${b}`}
                    href={`/keyboards/vs/${a}-vs-${b}`}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2.5 transition-all group"
                  >
                    <span className="text-sm text-white group-hover:text-blue-400">{itemA.name} vs {itemB.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">比較する →</span>
                  </Link>
                );
              })}
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
