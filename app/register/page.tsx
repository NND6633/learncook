// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Đã dịch
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInResult?.ok) {
          router.push("/recipes");
          router.refresh();
        } else {
          // ✅ Đã dịch
          setError("Registration successful, but auto-login failed.");
        }
      } else if (res.status === 409) {
        // ✅ Đã dịch
        setError("This email is already in use.");
      } else {
        const data = await res.json();
        // ✅ Đã dịch (sẽ lấy lỗi từ API)
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      // ✅ Đã dịch
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 mt-10 border rounded-lg shadow-md bg-white">
      {/* ✅ Đã dịch */}
      <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
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
            minLength={6}
          />
        </div>
        <div>
          {/* ✅ Đã dịch */}
          <label className="font-semibold block mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {/* ✅ Đã dịch */}
          {loading ? "Processing..." : "Create Account"}
        </button>
      </form>

      {/* ✅ Đã dịch */}
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
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