import type { Metadata } from "next";
import {
  Figtree,
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Manrope,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400"],
});

const figTree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IDRA Admin Dashboard",
  description:
    "Internal console for monitoring users, transactions, liquidity, and audit logs across the IDRA network.",
  openGraph: {
    title: "IDRA Admin Dashboard",
    description:
      "Internal console for monitoring users, transactions, liquidity, and audit logs across the IDRA network.",
    url: "https://idra-admin.vercel.app/",
    siteName: "IDRA Admin Dashboard",
    images: "/images/logo-mobile.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${figTree.variable} ${manrope.variable} antialiased font-figtree`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
