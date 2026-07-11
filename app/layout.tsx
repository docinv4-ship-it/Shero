import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartBubble from "@/components/cart/CartBubble"; // Dynamic Floating Cart Hub
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopPeak — Millions of Products at Unbeatable Prices",
  description: "Discover phones, electronics, jewelry, home decor, fashion and more. ShopPeak is your AliExpress affiliate marketplace with millions of products and exclusive deals.",
  keywords: "shopping, deals, aliexpress, electronics, phones, jewelry, fashion, home decor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-orange-500/20 selection:text-orange-900">
      <head>
        <Script 
          defer 
          src="https://cloud.umami.is/script.js" 
          data-website-id="62e83baa-a55f-4793-9dd6-c06511d21b94" 
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#f5f5f5] text-gray-900`}>
        {/* Top Sticky & Responsive Navigation Panel */}
        <Header />

        {/* Primary Page Layout Streams */}
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>

        {/* Global Floating High-Conversion Indicator Panel */}
        <CartBubble />

        {/* Footnotes & Marketplace Disclaimers */}
        <Footer />
      </body>
    </html>
  );
}
