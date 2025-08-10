import "./globals.css";
import { SiteConfig } from "@/constants/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.url,
  authors: [{ name: SiteConfig.author.name }],
  referrer: "origin-when-cross-origin",
  creator: SiteConfig.author.name,
  publisher: SiteConfig.author.name,
  metadataBase: new URL(SiteConfig.url),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      "/favicon.ico",
      { url: "/image/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/image/favicon.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "/favicon.ico",
      url: "/favicon.ico",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  appleWebApp: {
    capable: true, // ★ iOS standalone
    statusBarStyle: "black-translucent", // or "default" | "black"
    title: SiteConfig.title,
  },
  openGraph: {
    images: [
      {
        url: "/images/mainCard.png",
        width: 1200,
        height: 630,
        alt: "OG Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-b from-[#215078] via-[#395873]  via-[#425C73] to-[#51687C] flex items-center">
        {children}
      </body>
    </html>
  );
}
