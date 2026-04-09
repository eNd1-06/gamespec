import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングモニター スペック比較【2製品を並べて比較】",
  description: "ゲーミングモニターを2製品選んでスペックを並べて比較。リフレッシュレート・パネル・応答速度・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/monitors/compare` },
  openGraph: {
    title: "ゲーミングモニター スペック比較 | GameSpec",
    description: "2製品のゲーミングモニターを選んでスペックを比較。Hz・パネル・応答速度・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/monitors/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
