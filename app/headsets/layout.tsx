import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングヘッドセット スペック・比較・価格",
  description: "重さ・接続方式・ANC・バッテリーでゲーミングヘッドセットを絞り込めるスペックデータベース。有線・ワイヤレス、競技向けから没入感重視まで掲載。",
  alternates: { canonical: `${BASE_URL}/headsets` },
  openGraph: {
    title: "ゲーミングヘッドセット スペック・比較・価格 | GameSpec",
    description: "重さ・接続方式・ANC・バッテリーでゲーミングヘッドセットを絞り込めるスペックデータベース。",
    type: "website",
    url: `${BASE_URL}/headsets`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングヘッドセット スペック・比較・価格 | GameSpec",
    description: "重さ・接続方式・ANC・バッテリーでゲーミングヘッドセットを絞り込めるスペックデータベース。",
  },
};

export default function HeadsetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
