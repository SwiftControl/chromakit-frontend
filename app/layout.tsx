import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/ui/splash-screen";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromakit - Professional Image Processing",
  description:
    "Transform, enhance, and perfect your images with powerful editing tools",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-1024x1024.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    title: "Chromakit - Professional Image Processing",
    description:
      "Transform, enhance, and perfect your images with powerful editing tools",
    url: "https://chromakit.com",
    siteName: "Chromakit",
    images: [
      {
        url: "https://chromakit.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chromakit",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chromakit - Professional Image Processing",
    description:
      "Transform, enhance, and perfect your images with powerful editing tools",
    images: ["https://chromakit.com/og-image.png"],
    creator: "@chromakit",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Suspense fallback={<SplashScreen />}>{children}</Suspense>
            <Toaster />
          </ReduxProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
