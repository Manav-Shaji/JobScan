import { Inter } from "next/font/google";
import './globals.css';
import Providers from "@/core/providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JobScan - AI Scam Detector",
  description: "Intelligent analysis for job security. Detect employment fraud instantly.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
