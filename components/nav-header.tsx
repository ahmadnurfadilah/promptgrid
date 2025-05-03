"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";

export function NavHeader() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              PromptGrid
            </Link>
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/sell"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/sell" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Sell Prompts
              </Link>
              <Link
                href="/browse"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/browse" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Browse
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-sm text-gray-600">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                </span>
                <Button size="sm" variant="outline" className="text-sm">
                  Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => disconnect()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-sm">
                Connect Universal Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
