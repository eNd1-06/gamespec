import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングモニター スペック・比較・価格",
  description: "Hz・解像度・パネル種類・画面サイズ・価格でゲーミングモニターを絞り込めるスペックデータベース。1080p〜4K、144Hz〜390Hz、IPS・OLED・QD-OLEDまで掲載。",
  alternates: { canonical: `${BASE_URL}/monitors` },
  openGraph: {
    title: "ゲーミングモニター スペック・比較・価格 | GameSpec",
    description: "Hz・解像度・パネル種類・価格でゲーミングモニターを絞り込めるスペックデータベース。IPS・OLED・QD-OLEDまで掲載。",
    type: "website",
    url: `${BASE_URL}/monitors`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングモニター スペック・比較・価格 | GameSpec",
    description: "Hz・解像度・パネル種類・価格でゲーミングモニターを絞り込めるスペックデータベース。",
  },
};

export default function MonitorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
