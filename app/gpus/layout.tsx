import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "グラフィックボード（GPU）スペック・比較・価格",
  description: "VRAM・チップセット・価格・TDPでゲーミングGPUを絞り込めるスペックデータベース。RTX 40/50シリーズ・RX 7000/9000シリーズまで掲載。",
  alternates: { canonical: `${BASE_URL}/gpus` },
  openGraph: {
    title: "グラフィックボード（GPU）スペック・比較・価格 | GameSpec",
    description: "VRAM・チップセット・価格・TDPでゲーミングGPUを絞り込めるスペックデータベース。RTX・RX両シリーズを掲載。",
    type: "website",
    url: `${BASE_URL}/gpus`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "グラフィックボード（GPU）スペック・比較・価格 | GameSpec",
    description: "VRAM・チップセット・価格・TDPでゲーミングGPUを絞り込めるスペックデータベース。",
  },
};

export default function GpusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
