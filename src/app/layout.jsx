/**
 * ------------------------------------------------------------
 * File: layout.jsx
 * 
 * Purpose:
 * Root layout component for the entire Next.js application.
 * 
 * Responsibilities:
 * • Define global HTML document structure and standard meta tags
 * • Load base CSS (globals.css) and global context providers
 * • Mount application-wide UI components like Toaster and TopLoader
 * 
 * Used By:
 * • Next.js App Router (Root)
 * ------------------------------------------------------------
 */

import { Inter } from "next/font/google";
import './globals.css';
import Providers from "@/core/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JobScan - AI Scam Detector",
  description: "Intelligent analysis for job security. Detect employment fraud instantly using advanced AI.",
  manifest: "/manifest.json",
  metadataBase: new URL('http://localhost:3000'), // Replace with production URL when deployed
  openGraph: {
    title: "JobScan - AI Scam Detector",
    description: "Intelligent analysis for job security. Detect employment fraud instantly using advanced AI.",
    url: '/',
    siteName: 'JobScan',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JobScan - AI Scam Detector",
    description: "Intelligent analysis for job security. Detect employment fraud instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="jobscan-app" content="true" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
