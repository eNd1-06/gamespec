import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GameSpec | ゲーミングデバイス スペック絞り込みDB",
    template: "%s | GameSpec",
  },
  description: "重さ・Hz・スイッチ・価格などのスペックで絞り込めるゲーミングデバイスDB。マウス・モニター・キーボード・ヘッドセット・GPU・チェアなど9カテゴリ約340製品を日本語で比較。",
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
      <body className={`${notoSansJP.className} bg-gray-950 text-gray-100 min-h-screen antialiased`}>
        {children}
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5MOM9GV1RS"
        strategy="beforeInteractive"
      />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5MOM9GV1RS');
        `}
      </Script>
    </html>
  );
}
