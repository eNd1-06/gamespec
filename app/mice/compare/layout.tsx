import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウス スペック比較【2製品を並べて比較】",
  description: "ゲーミングマウスを2製品選んでスペックを並べて比較。重さ・センサー・ポーリングレート・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/mice/compare` },
  openGraph: {
    title: "ゲーミングマウス スペック比較 | GameSpec",
    description: "2製品のゲーミングマウスを選んでスペックを比較。重さ・センサー・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/mice/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
