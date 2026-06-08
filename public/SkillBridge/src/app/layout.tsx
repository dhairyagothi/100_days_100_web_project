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

export const metadata: Metadata = {
  title: "SkillBridge – Career Roadmap Explorer",
  description: "Bridge the gap between learning and career success. Explore technology careers, discover required skills, and follow structured roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full w-full overflow-x-hidden antialiased`}
    >
      <body className="min-h-full w-full overflow-x-hidden flex flex-col bg-background text-foreground selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
