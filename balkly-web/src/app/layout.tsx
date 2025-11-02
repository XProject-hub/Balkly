import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balkly - Modern Marketplace Platform",
  description: "Buy and sell with confidence. Find amazing deals on cars, real estate, events and more.",
  keywords: ["marketplace", "classifieds", "events", "tickets", "forum", "buy", "sell"],
  authors: [{ name: "Balkly" }],
  creator: "Balkly",
  publisher: "Balkly",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Balkly - Modern Marketplace Platform",
    description: "Buy and sell with confidence. Find amazing deals on cars, real estate, events and more.",
    siteName: "Balkly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balkly - Modern Marketplace Platform",
    description: "Buy and sell with confidence. Find amazing deals on cars, real estate, events and more.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
