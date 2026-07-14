import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BathCrest — Premium Bathroom Hardware & Sanitaryware",
    template: "%s | BathCrest",
  },
  description: "BathCrest offers premium bathroom faucets, rain showers, wash basins, vanity units and sanitaryware. Luxury bathroom hardware for modern living.",
  keywords: ["bathroom faucets", "rain showers", "sanitaryware", "bathroom hardware", "premium bathroom", "BathCrest"],
  authors: [{ name: "BathCrest" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bathcrest.com",
    siteName: "BathCrest",
    title: "BathCrest — Premium Bathroom Hardware & Sanitaryware",
    description: "Experience luxury bathroom hardware. Premium faucets, rain showers, basins, and sanitaryware for modern homes.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0c0a09" />
      </head>
      <body className="bg-[#0c0a09] text-white antialiased" suppressHydrationWarning>
        <Navbar />
        <div className="min-h-screen" style={{ paddingTop: '80px' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
