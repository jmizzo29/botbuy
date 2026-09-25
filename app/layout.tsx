import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkAppProvider } from "@/components/clerk-app-provider";
import { PwaRegister } from "@/components/pwa-register";
import { BRAND, LAND_PRODUCT_SUPPORT } from "@/lib/brand";
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
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: LAND_PRODUCT_SUPPORT,
  applicationName: BRAND.name,
  metadataBase: new URL("https://botbuyer.ai"),
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black-translucent",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": BRAND.name,
  },
  icons: {
    icon: [
      { url: "/brand/logo-soft-spine/favicon/favicon.ico", sizes: "any" },
      {
        url: "/brand/logo-soft-spine/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/brand/logo-soft-spine/app-icon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/brand/logo-soft-spine/favicon/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    url: "https://botbuyer.ai",
    siteName: BRAND.name,
    images: [
      {
        url: "/brand/logo-soft-spine/og/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    images: ["https://botbuyer.ai/brand/logo-soft-spine/og/og-1200x630.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ClerkAppProvider>
          <PwaRegister />
          {children}
        </ClerkAppProvider>
      </body>
    </html>
  );
}
