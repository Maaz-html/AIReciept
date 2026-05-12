import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-sans",
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
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
