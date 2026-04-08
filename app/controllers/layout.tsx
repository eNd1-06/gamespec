import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲームコントローラー スペック・比較・価格",
  description: "プラットフォーム・背面ボタン・接続方式・価格でゲームコントローラーを絞り込めるスペックデータベース。PS5・Xbox・PC対応から競技向けプロコンまで掲載。",
  alternates: { canonical: `${BASE_URL}/controllers` },
  openGraph: {
    title: "ゲームコントローラー スペック・比較・価格 | GameSpec",
    description: "プラットフォーム・背面ボタン・接続方式・価格でゲームコントローラーを絞り込めるスペックデータベース。",
    type: "website",
    url: `${BASE_URL}/controllers`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲームコントローラー スペック・比較・価格 | GameSpec",
    description: "プラットフォーム・背面ボタン・接続方式・価格でゲームコントローラーを絞り込めるスペックデータベース。",
  },
};

export default function ControllersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
