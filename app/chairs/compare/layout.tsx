import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングチェア スペック比較【2製品を並べて比較】",
  description: "ゲーミングチェアを2製品選んでスペックを並べて比較。タイプ・素材・リクライニング角度・アームレスト・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/chairs/compare` },
  openGraph: {
    title: "ゲーミングチェア スペック比較 | GameSpec",
    description: "2製品のゲーミングチェアを選んでスペックを比較。タイプ・素材・リクライニング・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/chairs/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
