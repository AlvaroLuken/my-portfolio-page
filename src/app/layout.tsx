import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Alvaro Luken | Portfolio",
  description:
    "Personal portfolio of Alvaro Luken: creative developer, educator, and community builder sharing projects, talks, writing, gallery moments, and contact details.",
  icons: {
    icon: [{ url: "/avatar/alvaro-avatar-featured.png" }],
    apple: [{ url: "/avatar/alvaro-avatar-featured.png" }],
  },
  openGraph: {
    title: "Alvaro Luken | Portfolio",
    description:
      "Explore Alvaro Luken's projects, bio journey, talks, writing, and gallery moments in an interactive portfolio experience.",
    url: "/",
    siteName: "Alvaro Luken Portfolio",
    type: "website",
    images: [
      {
        url: "/previews/p2-market-real.png",
        width: 1200,
        height: 630,
        alt: "Alvaro Luken portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alvaro Luken | Portfolio",
    description:
      "Creative developer, educator, and community builder. Explore projects, talks, writing, and gallery highlights.",
    images: ["/previews/p2-market-real.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
