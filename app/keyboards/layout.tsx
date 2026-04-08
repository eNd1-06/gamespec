import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングキーボード スペック・比較・価格",
  description: "スイッチ・サイズ・ポーリングレート・価格でゲーミングキーボードを絞り込めるスペックデータベース。60%〜フルサイズ、赤軸・光学式・磁気式アナログまで掲載。",
  alternates: { canonical: `${BASE_URL}/keyboards` },
  openGraph: {
    title: "ゲーミングキーボード スペック・比較・価格 | GameSpec",
    description: "スイッチ・サイズ・ポーリングレート・価格でゲーミングキーボードを絞り込めるスペックデータベース。",
    type: "website",
    url: `${BASE_URL}/keyboards`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングキーボード スペック・比較・価格 | GameSpec",
    description: "スイッチ・サイズ・ポーリングレート・価格でゲーミングキーボードを絞り込めるスペックデータベース。",
  },
};

export default function KeyboardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
