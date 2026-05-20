"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const pathName = usePathname();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // State to control visibility of the "Login Required" modal/overlay
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Tracks which navigation link the user clicked (e.g., "Post Job" or "Dashboard")
  const [modalTarget, setModalTarget] = useState<string>("");

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

  /**
   * Intercepts navigation to protected pages (like Post Job & Dashboard)
   * if the user is not currently logged in, showing them a login prompt.
   */
  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
  ) {
    if (!user && !checkingUser) {
      e.preventDefault(); // Stop the default navigation behavior
      setModalTarget(label); // Store the page title to display in the modal
      setShowLoginModal(true); // Display the custom modal alert
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w`-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black text-gray-900">
          Skill<span className="text-blue-600">Lanka</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link
            href="/freelancers"
            className={
              pathName == "/freelancers"
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue=600 transition-colors"
            }
          >
            Find Freelancers
          </Link>

          <Link
            href="/jobs"
            className={
              pathName === "/jobs"
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600 transition-colors"
            }
          >
            Services
          </Link>

          <Link
            href="/post-job"
            onClick={(e) => handleNavClick(e, "Post Job")}
            className={
              pathName === "/post-job"
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600 transition-colors"
            }
          >
            Post Job
          </Link>

          <Link
            href="/dashboard"
            onClick={(e) => handleNavClick(e, "Dashboard")}
            className={
              pathName === "/dashboard"
                ? "text-blue-600 font-bold"
                : "text-gray-700 hover:text-blue-600 transition-colors"
            }
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 sm:block"
              >
                Hi, {user.name.split(" ")[0]} (
                {user.role === "FREELANCER" ? "Freelancer" : "Client"})
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

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left shadow-2xl transition-all duration-300 border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Icon Banner */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Title & Desc */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-900">
                Login Required
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                You must be logged in to access the{" "}
                <span className="font-bold text-blue-600">{modalTarget}</span>{" "}
                page. Please log in or create an account to continue.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setShowLoginModal(false)}
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setShowLoginModal(false)}
                className="w-full rounded-2xl bg-gray-100 py-3.5 text-center text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
