import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balkly - Modern Marketplace Platform",
  description: "A comprehensive marketplace platform with paid listings, forum, events, and AI assistants",
  keywords: ["marketplace", "classifieds", "events", "tickets", "forum"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

