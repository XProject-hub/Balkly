import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackingScript from "@/components/TrackingScript";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Force dynamic rendering for all pages - prevents SSG errors with client hooks
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Balkly - Balkan Community in UAE | Classifieds, Events, Forum",
    template: "%s | Balkly",
  },
  description: "The #1 platform for Balkan community in UAE. Buy & sell cars, real estate, find jobs, events, and connect with fellow Balkans in Dubai, Abu Dhabi & UAE.",
  keywords: [
    "Balkan community UAE",
    "Balkans in Dubai",
    "Serbian community Dubai",
    "Croatian community UAE",
    "Bosnian community Dubai",
    "classifieds Dubai",
    "cars for sale UAE",
    "real estate Dubai",
    "jobs UAE",
    "events Dubai",
    "Balkan events UAE",
    "forum Dubai expats",
    "buy sell UAE",
    "marketplace Dubai",
  ],
  authors: [{ name: "Balkly", url: "https://balkly.live" }],
  creator: "Balkly",
  publisher: "Balkly",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://balkly.live"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "bs-BA": "/bs",
      "sr-RS": "/sr",
      "hr-HR": "/hr",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balkly.live",
    title: "Balkly - Balkan Community in UAE",
    description: "The #1 platform for Balkan community in UAE. Classifieds, events, forum & more.",
    siteName: "Balkly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balkly - Balkan Community Platform in UAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balkly - Balkan Community in UAE",
    description: "The #1 platform for Balkan community in UAE. Classifieds, events, forum & more.",
    images: ["/og-image.png"],
    creator: "@balkly_live",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
    shortcut: "/logo-icon.png",
  },
  category: "marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-19VYR37L5T"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-19VYR37L5T');
            `,
          }}
        />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E63FF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Website Verification */}
        <meta name="fo-verify" content="04638958-aeaa-44ad-b3da-cc17cb88dfb6" />
        
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Balkly",
              "alternateName": "Balkly UAE",
              "url": "https://balkly.live",
              "description": "The #1 platform for Balkan community in UAE. Classifieds, events, forum & more.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://balkly.live/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://facebook.com/balkly",
                "https://instagram.com/balkly_dxb",
                "https://twitter.com/balkly_live"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Balkly",
              "url": "https://balkly.live",
              "logo": "https://balkly.live/logo-icon.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@balkly.live",
                "contactType": "customer service",
                "areaServed": "AE",
                "availableLanguage": ["English", "Serbian", "Croatian", "Bosnian"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AE",
                "addressLocality": "Dubai"
              }
            })
          }}
        />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <TrackingScript />
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        
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
      </body>
    </html>
  );
}
