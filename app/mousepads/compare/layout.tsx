import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウスパッド スペック比較【2製品を並べて比較】",
  description: "ゲーミングマウスパッドを2製品選んでスペックを並べて比較。サイズ・素材・表面素材・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/mousepads/compare` },
  openGraph: {
    title: "ゲーミングマウスパッド スペック比較 | GameSpec",
    description: "2製品のゲーミングマウスパッドを選んでスペックを比較。サイズ・素材・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/mousepads/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
