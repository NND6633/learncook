// app/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
// ❌ Đã xóa import 'usePathname'

export default function Navbar() {
  const { data: session, status } = useSession();

  // ❌ Đã XÓA bỏ khối 'if (pathname === ...)'
  // Navbar bây giờ sẽ hiển thị trên TẤT CẢ các trang

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          🍽️ Recipe App
        </Link>

        <div className="flex gap-4 items-center">
          {/* Kiểm tra session */}
          {status === "loading" ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : session ? (
            <>
              {/* Đã đăng nhập */}
              <Link
                href="/recipes/new"
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                ➕ Add Recipe
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Chưa đăng nhập */}
              <Link
                href="/login"
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}