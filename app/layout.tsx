import type { Metadata, Viewport } from "next";
import NavBar from "@/componets/NavBar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "龍谷大学 瀬田キャンパス AR案内",
    template: "%s | 龍谷大学 瀬田キャンパス AR案内",
  },
  description:
    "龍谷大学 瀬田キャンパスの研究室や施設を、マップとARで案内するキャンパスガイドアプリです。",
};

// viewportFit: "cover" がないと iPhone で env(safe-area-inset-*) が 0 のままになる
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
