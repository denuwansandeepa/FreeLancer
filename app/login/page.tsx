"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("kasun@test.com");
  const [password, setPassword] = useState("123456");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("skillLankaUser", JSON.stringify(data.user));

      setMessage("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex min-h-[80vh] items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 p-12 text-white lg:block">
            <p className="mb-5 inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
              Welcome Back
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Login and continue your work journey
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-50">
              Access your SkillLanka account, manage your profile, view hire
              requests, and connect with Sri Lankan freelancers or clients.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                ✅ Manage your freelancer profile
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                ✅ View client hire requests
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                ✅ Save and contact freelancers
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                Login to your account
              </h2>
              <p className="mt-2 text-gray-600">
                Enter your email and password to continue.
              </p>
            </div>

            {message && (
              <div
                className={`mb-5 rounded-2xl p-4 text-sm font-semibold ${
                  message.includes("successful")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4" />
                  Remember me
                </label>

                <Link href="#" className="font-semibold text-blue-600">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-blue-600">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}