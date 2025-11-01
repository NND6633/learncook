import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Recipe App",
  description: "Simple Recipe Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen`}
      >
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold">
              🍽️ Recipe App
            </Link>

            <div className="flex gap-6">
              
              <Link
                href="/recipes/new"
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                ➕ Add Recipe
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
