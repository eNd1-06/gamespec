import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { gpus, getGpuBySlug } from "@/data/gpus";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return gpus.map((g) => ({ slug: g.slug }));
}

const BASE_URL = "https://gamespec.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gpu = getGpuBySlug(slug);
  if (!gpu) return {};
  const title = `${gpu.chipset}（${gpu.brand}）スペック・VRAM・価格`;
  const description = `${gpu.name}のスペック詳細。VRAM ${gpu.vram}GB・${gpu.memoryType}・TDP ${gpu.tdp}W・¥${gpu.price.toLocaleString()}。`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/gpus/${slug}` },
    openGraph: { title, description, type: "website", url: `${BASE_URL}/gpus/${slug}`, siteName: "GameSpec", locale: "ja_JP" },
    twitter: { card: "summary", title, description },
  };
}

export default async function GpuDetailPage({ params }: Props) {
  const { slug } = await params;
  const gpu = getGpuBySlug(slug);
  if (!gpu) notFound();

  const tags = gpu.recommendFor.map((t) =>
    t === "1080p" ? "1080p環境" : t === "1440p" ? "1440p環境" : t === "4k" ? "4K環境" :
    t === "competitive" ? "競技ゲーム" : t === "fps" ? "FPS" : t === "apex" ? "APEX" : "配信"
  ).join("・");

  const description = `${gpu.name}は${gpu.brand}製の${gpu.gpuBrand} ${gpu.chipset}搭載グラフィックボードです。VRAM ${gpu.vram}GB（${gpu.memoryType}）を${gpu.memoryBus}bitバスで搭載し、ブーストクロックは${gpu.boostClock.toLocaleString()}MHz。TDPは${gpu.tdp}Wで${tags}向けの性能を持ちます。参考価格は¥${gpu.price.toLocaleString()}です。`;

  const specs = [
    { label: "チップセット", value: gpu.chipset },
    { label: "GPUメーカー", value: gpu.gpuBrand },
    { label: "ボードメーカー", value: gpu.brand },
    { label: "VRAM", value: `${gpu.vram}GB` },
    { label: "メモリタイプ", value: gpu.memoryType },
    { label: "メモリバス", value: `${gpu.memoryBus}bit` },
    { label: "ブーストクロック", value: `${gpu.boostClock.toLocaleString()}MHz` },
    { label: "TDP", value: `${gpu.tdp}W` },
    { label: "グレード", value: gpu.tier },
    { label: "出力端子", value: gpu.outputs },
    { label: "発売年", value: `${gpu.releaseYear}年` },
  ];

  const related = gpus
    .filter((g) => {
      if (g.slug === gpu.slug) return false;
      const sameTier = g.tier === gpu.tier;
      const similarPrice = g.price >= gpu.price * 0.6 && g.price <= gpu.price * 1.6;
      return sameTier || similarPrice;
    })
    .sort((a, b) => Math.abs(a.price - gpu.price) - Math.abs(b.price - gpu.price))
    .slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": gpu.name,
      "brand": { "@type": "Brand", "name": gpu.brand },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": gpu.price.toString(),
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": gpu.amazonUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "GameSpec", "item": `${BASE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "グラフィックボード", "item": `${BASE_URL}/gpus` },
        { "@type": "ListItem", "position": 3, "name": gpu.name, "item": `${BASE_URL}/gpus/${gpu.slug}` },
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
            <Link href="/gpus" className="hover:text-white">グラフィックボード</Link>
            <span>›</span>
            <span className="text-gray-300">{gpu.chipset}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">{gpu.brand} / {gpu.gpuBrand}</p>
          <h1 className="text-2xl font-bold text-white mb-1">{gpu.chipset}</h1>
          <p className="text-sm text-gray-400 mb-4">{gpu.name}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-900 text-blue-300 text-sm px-3 py-1 rounded-full font-medium">{gpu.vram}GB VRAM</span>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${gpu.gpuBrand === "NVIDIA" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>{gpu.gpuBrand}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{gpu.tier}</span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full">{gpu.tdp}W</span>
            {gpu.isNew && <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">NEW</span>}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amazon参考価格</p>
              <p className="text-3xl font-bold text-white">¥{gpu.price.toLocaleString()}</p>
            </div>
            <a
              href={gpu.amazonUrl}
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
                <span className="text-sm text-white font-medium text-right max-w-xs">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">同価格帯・同グレードのGPU</h2>
              <Link href={`/gpus/compare?a=${gpu.slug}`} className="text-xs text-blue-400 hover:text-blue-300 border border-gray-700 rounded-lg px-3 py-1.5">比較する</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/gpus/compare?a=${gpu.slug}&b=${g.slug}`}
                  className="border border-gray-800 hover:border-blue-500 rounded-xl p-3 text-center transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{g.brand}</p>
                  <p className="text-xs font-medium text-white group-hover:text-blue-400 leading-tight mb-2">{g.chipset}</p>
                  <p className="text-xs text-gray-400">{g.vram}GB</p>
                  <p className="text-xs text-white font-bold">¥{g.price.toLocaleString()}</p>
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
