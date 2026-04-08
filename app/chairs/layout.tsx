import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングチェア スペック・比較・価格",
  description: "タイプ・素材・価格でゲーミングチェアを絞り込めるスペックデータベース。レーシング型・エルゴノミクス型・座椅子型、AKRacing・Secretlab・Herman Millerまで掲載。",
  alternates: { canonical: `${BASE_URL}/chairs` },
  openGraph: {
    title: "ゲーミングチェア スペック・比較・価格 | GameSpec",
    description: "タイプ・素材・価格でゲーミングチェアを絞り込めるスペックデータベース。AKRacing・Secretlab・Herman Millerまで掲載。",
    type: "website",
    url: `${BASE_URL}/chairs`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングチェア スペック・比較・価格 | GameSpec",
    description: "タイプ・素材・価格でゲーミングチェアを絞り込めるスペックデータベース。",
  },
};

export default function ChairsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
