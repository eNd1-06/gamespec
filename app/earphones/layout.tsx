import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングイヤホン スペック・比較・価格",
  description: "ドライバー・接続方式・価格でゲーミングイヤホンを絞り込めるスペックデータベース。有線IEM・低遅延ワイヤレス・ANC搭載モデルまで掲載。",
  alternates: { canonical: `${BASE_URL}/earphones` },
  openGraph: {
    title: "ゲーミングイヤホン スペック・比較・価格 | GameSpec",
    description: "ドライバー・接続方式・価格でゲーミングイヤホンを絞り込めるスペックデータベース。有線IEM・低遅延ワイヤレス・ANC搭載モデルまで掲載。",
    type: "website",
    url: `${BASE_URL}/earphones`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングイヤホン スペック・比較・価格 | GameSpec",
    description: "ドライバー・接続方式・価格でゲーミングイヤホンを絞り込めるスペックデータベース。",
  },
};

export default function EarphonesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
