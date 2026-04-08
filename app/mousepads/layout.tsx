import type { Metadata } from "next";

const BASE_URL = "https://gamespec.vercel.app";

export const metadata: Metadata = {
  title: "ゲーミングマウスパッド スペック・比較・価格",
  description: "サイズ・滑り感・素材・価格でゲーミングマウスパッドを絞り込めるスペックデータベース。速度系・コントロール系・ガラス製まで掲載。",
  alternates: { canonical: `${BASE_URL}/mousepads` },
  openGraph: {
    title: "ゲーミングマウスパッド スペック・比較・価格 | GameSpec",
    description: "サイズ・滑り感・素材・価格でゲーミングマウスパッドを絞り込めるスペックデータベース。",
    type: "website",
    url: `${BASE_URL}/mousepads`,
    siteName: "GameSpec",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ゲーミングマウスパッド スペック・比較・価格 | GameSpec",
    description: "サイズ・滑り感・素材・価格でゲーミングマウスパッドを絞り込めるスペックデータベース。",
  },
};

export default function MousepadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
