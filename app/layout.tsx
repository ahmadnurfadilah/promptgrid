import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { UpProvider } from "@/components/up-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptGrid - AI Prompt Engineering Marketplace for The Grid",
  description: "A decentralized marketplace that empowers prompt engineers to monetize their expertise by creating, selling, and sharing AI prompts directly through their Universal Profiles on The Grid.",
  keywords: ["LUKSO", "blockchain", "AI", "prompt engineering", "marketplace", "Universal Profiles", "The Grid"],
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
        <UpProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UpProvider>
      </body>
    </html>
  );
}
