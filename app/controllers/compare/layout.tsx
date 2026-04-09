import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲームコントローラー スペック比較【2製品を並べて比較】",
  description: "ゲームコントローラーを2製品選んでスペックを並べて比較。プラットフォーム・接続方式・背面ボタン・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/controllers/compare` },
  openGraph: {
    title: "ゲームコントローラー スペック比較 | GameSpec",
    description: "2製品のゲームコントローラーを選んでスペックを比較。プラットフォーム・背面ボタン・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/controllers/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
