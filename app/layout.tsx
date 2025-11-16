import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import Providers from "@/providers";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ClerkProviderWrapper } from "@/lib/ClerkProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Joshtri Lenggu Blog - Home",
  description: "A curated collection of thoughts and insights about technology and learning",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Joshtri Lenggu Blog",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  applicationName: "Joshtri Lenggu Blog",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  openGraph: {
    title: "Joshtri Lenggu Blog",
    description: "A curated collection of thoughts and insights about technology and learning",
    type: "website",
    url: BASE_URL,
    siteName: "Joshtri Lenggu Blog",
    images: [
      {
        url: `${BASE_URL}/joshtri-lenggu-solid.png`,
        width: 192,
        height: 192,
        alt: "Joshtri Lenggu Logo",
      },
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Joshtri Lenggu Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshtri Lenggu Blog",
    description: "A curated collection of thoughts and insights about technology and learning",
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          <ScrollToTop />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
