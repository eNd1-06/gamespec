import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "グラフィックボード スペック比較【2製品を並べて比較】",
  description: "グラフィックボードを2製品選んでスペックを並べて比較。VRAM・TDP・ブーストクロック・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/gpus/compare` },
  openGraph: {
    title: "グラフィックボード スペック比較 | GameSpec",
    description: "2製品のGPUを選んでスペックを比較。VRAM・TDP・クロック・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/gpus/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
