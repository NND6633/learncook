// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push("/recipes");
      router.refresh();
    } else {
      // ✅ Đã dịch
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white">
      {/* ✅ Đã dịch */}
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* ✅ Đã dịch */}
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          {/* ✅ Đã dịch */}
          <label className="font-semibold block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {/* ✅ Đã dịch */}
          Login
        </button>
      </form>

      {/* ✅ Đã dịch */}
      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register now
        </Link>
      </p>

      {/* ✅ Đã thêm nút Back to Home */}
      <Link
        href="/"
        className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-700 hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}