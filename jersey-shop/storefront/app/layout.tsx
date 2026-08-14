import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/context/CartContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { StoreDataProvider } from "@/lib/context/StoreDataContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NINETY KITS — Premium Sports Jerseys | Bangladesh",
  description:
    "Bangladesh's premier destination for authentic football and sports jerseys. Tournament heat printing, team roster orders, fast nationwide delivery across Bangladesh.",
  keywords: [
    "jerseys",
    "football jerseys",
    "sports jerseys",
    "Bangladesh",
    "custom jerseys",
    "team kits",
    "NINETY KITS",
  ],
  openGraph: {
    title: "NINETY KITS — Official Sports Jerseys Bangladesh",
    description:
      "Authentic football jerseys with live custom name & number printing studio and nationwide delivery.",
    type: "website",
    locale: "en_BD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <StoreDataProvider>
          <AuthProvider>
            <LanguageProvider>
              <WishlistProvider>
                <CartProvider>
                  <TopBanner />
                  <Navbar />
                  <main>{children}</main>
                  <Footer />
                </CartProvider>
              </WishlistProvider>
            </LanguageProvider>
          </AuthProvider>
        </StoreDataProvider>
      </body>
    </html>
  );
}

