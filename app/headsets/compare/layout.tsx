import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングヘッドセット スペック比較【2製品を並べて比較】",
  description: "ゲーミングヘッドセットを2製品選んでスペックを並べて比較。重さ・接続方式・ANC・バッテリー・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/headsets/compare` },
  openGraph: {
    title: "ゲーミングヘッドセット スペック比較 | GameSpec",
    description: "2製品のゲーミングヘッドセットを選んでスペックを比較。重さ・ANC・バッテリー・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/headsets/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
