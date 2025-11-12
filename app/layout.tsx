// app/layout.tsx
// ✅ Bỏ "use client", giữ layout là Server Component

import type { Metadata } from "next"; // ✅ Giữ lại metadata
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { NextAuthProvider } from "./SessionProvider";
import Navbar from "./Navbar"; // ✅ 1. Import component Navbar mới

// ✅ 2. Giữ nguyên định nghĩa font (đây là phần bị thiếu)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ 3. Giữ nguyên metadata
export const metadata: Metadata = {
  title: "Recipe App",
  description: "Simple Recipe Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ❌ Logic 'useSession' và 'usePathname' đã được chuyển
  // sang component Navbar.tsx

  return (
    <html lang="en">
      {/* ✅ 4. Áp dụng font (đây là dòng báo lỗi) */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen`}
      >
        {/* ✅ 5. Bọc provider ở ngoài */}
        <NextAuthProvider>
          {/* ✅ 6. Render Navbar (Client Component) */}
          <Navbar />

          {/* Page Content */}
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}