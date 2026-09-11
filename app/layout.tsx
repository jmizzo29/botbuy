import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { THEME_BG } from "@/lib/ui-tokens";
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
    default: "BotBuy",
    template: "%s · BotBuy",
  },
  description: "Set spend, intent, and vault. BotBuy does the rest.",
  applicationName: "BotBuy",
  metadataBase: new URL("https://botbuyer.ai"),
  appleWebApp: {
    capable: true,
    title: "BotBuy",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "BotBuy",
    description: "Set spend, intent, and vault. BotBuy does the rest.",
    url: "https://botbuyer.ai",
    siteName: "BotBuy",
    images: [
      {
        url: "/brand/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "BotBuy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BotBuy",
    description: "Set spend, intent, and vault. BotBuy does the rest.",
    images: ["https://botbuyer.ai/brand/og-1200x630.png"],
  },
};

export const viewport: Viewport = {
  themeColor: THEME_BG,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
