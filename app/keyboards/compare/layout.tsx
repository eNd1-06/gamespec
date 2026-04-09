import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングキーボード スペック比較【2製品を並べて比較】",
  description: "ゲーミングキーボードを2製品選んでスペックを並べて比較。スイッチ・サイズ・ポーリングレート・価格など全スペックを一覧で確認できます。",
  alternates: { canonical: `${BASE_URL}/keyboards/compare` },
  openGraph: {
    title: "ゲーミングキーボード スペック比較 | GameSpec",
    description: "2製品のゲーミングキーボードを選んでスペックを比較。スイッチ・レイアウト・価格を一覧で確認。",
    type: "website",
    url: `${BASE_URL}/keyboards/compare`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
