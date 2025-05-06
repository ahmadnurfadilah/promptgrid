import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
// import { NavHeader } from "@/components/nav-header";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "./config";
import { headers } from "next/headers";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

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
  description:
    "A decentralized marketplace that empowers prompt engineers to monetize their expertise by creating, selling, and sharing AI prompts directly through their Universal Profiles on The Grid.",
  keywords: [
    "LUKSO",
    "blockchain",
    "AI",
    "prompt engineering",
    "marketplace",
    "Universal Profiles",
    "The Grid",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialState={initialState}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* <NavHeader /> */}
            {children}

            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
