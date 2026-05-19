"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  location?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    async function checkLoginUser() {
      try {
        // First check secure cookie backend login
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return;
        }

        // Fallback: check localStorage login
        const savedUser = localStorage.getItem("skillLankaUser");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        const savedUser = localStorage.getItem("skillLankaUser");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setCheckingUser(false);
      }
    }

    checkLoginUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore logout API error for now
    }

    localStorage.removeItem("skillLankaUser");
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black text-gray-900">
          Skill<span className="text-blue-600">Lanka</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link href="/freelancers" className="hover:text-blue-600">
            Find Freelancers
          </Link>

          <Link href="/jobs" className="hover:text-blue-600">
            Services
          </Link>

          <Link href="/post-job" className="hover:text-blue-600">
            Post Job
          </Link>

          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {checkingUser ? (
            <div className="h-10 w-32 rounded-full bg-gray-100"></div>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 sm:block"
              >
               Hi, {user.name.split(" ")[0]} ({user.role === "FREELANCER" ? "Freelancer" : "Client"})
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}