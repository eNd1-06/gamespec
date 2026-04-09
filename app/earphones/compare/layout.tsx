import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホン スペック比較【2製品を並べて比較】",
  description: "ゲーミングイヤホンを2製品選んでスペックを並べて比較。ドライバー・接続方式・ANC・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/earphones/compare` },
  openGraph: {
    title: "ゲーミングイヤホン スペック比較 | GameSpec",
    description: "2製品のゲーミングイヤホンを選んでスペックを比較。ドライバー・ANC・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/earphones/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
