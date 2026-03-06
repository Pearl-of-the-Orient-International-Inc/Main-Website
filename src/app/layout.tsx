import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/providers/Query";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://pearlchaplaincy.org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.",
  description:
    "Bring national-transformation and nation-building through bible-based values education to different sectors of our society.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/main/logo.png",
  },
  authors: {
    name: "Kyle Andre Lim",
    url: "https://www.facebook.com/kyleandre.lim29/",
  },
  openGraph: {
    title:
      "Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.",
    description:
      "Bring national-transformation and nation-building through bible-based values education to different sectors of our society.",
    url: "/",
    siteName: "Pearl Chaplaincy",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/main/landing.jpg",
        width: 1200,
        height: 630,
        alt: "Pearl Chaplaincy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.",
    description:
      "Bring national-transformation and nation-building through bible-based values education to different sectors of our society.",
    images: ["/main/landing.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
