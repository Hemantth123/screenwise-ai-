import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScreenWise — AI Fitment Copilot for Recruiters",
  description:
    "Paste a job description and a batch of resumes. ScreenWise ranks candidates with explainable fitment scores, red flags, and ready-to-send personalized outreach drafts.",
  keywords: [
    "AI recruiting",
    "resume screening",
    "fitment scoring",
    "recruiter copilot",
    "ScreenWise",
    "Embark",
  ],
  authors: [{ name: "ScreenWise Prototype" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
