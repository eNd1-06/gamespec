import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GameSpec | ゲーミングデバイス スペック絞り込みDB",
    template: "%s | GameSpec",
  },
  description: "重さ・センサー・接続方式・価格でゲーミングマウスを絞り込める日本語データベース。APEXやFPS向けのデバイス選びに。",
  verification: {
    google: "X6orpG-UcJpIZWQ8kOvac6XrXv7_GocQWCtvzKjtPw0",
  },
  openGraph: {
    siteName: "GameSpec",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">{children}</body>
    </html>
  );
}
