import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackingScript from "@/components/TrackingScript";
import AutoTranslate from "@/components/AutoTranslate";
import Script from "next/script";

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
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
    shortcut: "/logo-icon.png",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E63FF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <TrackingScript />
        {/* <AutoTranslate /> - DISABLED: Slows down page, will implement better later */}
        <Header />
        <main>{children}</main>
        <Footer />
        
        {/* Register Service Worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registered:', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Crisp Live Chat */}
        <Script id="crisp-chat" strategy="afterInteractive">
          {`
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="f019cb16-f34b-44b5-a6bb-0045e93996d5";
            (function(){
              d=document;
              s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
