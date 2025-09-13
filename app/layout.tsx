import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moonlight Reader",
  description:
    "Close your eyes. We’ll read the rest. We store voices, not texts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="mx-auto max-w-6xl px-8 py-12">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
              <Link href="/" className="text-xl font-semibold">Moonlight Reader</Link>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/tts" className="hover:underline">Generate</Link>
              <Link href="/voices/new" className="hover:underline">Save a voice</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
