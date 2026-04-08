import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウス スペック・比較・価格",
  description: "重さ・センサー・接続方式・価格でゲーミングマウスを絞り込めるスペックデータベース。APEX・FPS向けの軽量マウスから高性能機まで100製品以上を掲載。",
  alternates: { canonical: `${BASE_URL}/mice` },
  openGraph: {
    title: "ゲーミングマウス スペック・比較・価格 | GameSpec",
    description: "重さ・センサー・接続方式・価格でゲーミングマウスを絞り込めるスペックデータベース。APEX・FPS向けの軽量マウスから高性能機まで100製品以上を掲載。",
    type: "website",
    url: `${BASE_URL}/mice`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングマウス スペック・比較・価格 | GameSpec",
    description: "重さ・センサー・接続方式・価格でゲーミングマウスを絞り込めるスペックデータベース。",
  },
};

export default function MiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
