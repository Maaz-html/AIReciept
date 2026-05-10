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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://spendsmart.ai'

export const metadata: Metadata = {
  title: "SpendSmart AI — Free AI Spend Audit for Startups",
  description: "See exactly where your team is overpaying on AI tools. Free 2-minute audit.",
  openGraph: {
    title: "SpendSmart AI — Free AI Spend Audit for Startups",
    description: "See exactly where your team is overpaying on AI tools. Free 2-minute audit.",
    url: baseUrl,
    siteName: "SpendSmart AI",
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: 'SpendSmart AI — Free AI Spend Audit',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SpendSmart AI — Free AI Spend Audit for Startups",
    description: "See exactly where your team is overpaying on AI tools. Free 2-minute audit.",
    images: [`${baseUrl}/api/og`],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
