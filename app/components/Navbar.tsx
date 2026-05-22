"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  location?: string | null;
  image?: string | null;
};

type NotificationItem = {
  id: string;
  text: string;
  time: string;
  read: boolean;
  link: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalTarget, setModalTarget] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function checkLoginUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return;
        }

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

  useEffect(() => {
    function handleProfileUpdate() {
      const savedUser = localStorage.getItem("skillLankaUser");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("skillLankaUser");
        }
      }
    }

    window.addEventListener("skillLankaUserUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("skillLankaUserUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    function formatTimeAgo(dateString: string) {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications", { signal });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && !signal.aborted) {
          const formatted = data.notifications.map((n: any) => ({
            id: n.id,
            text: n.text,
            link: n.link,
            read: n.read,
            time: formatTimeAgo(n.createdAt),
          }));
          setNotifications(formatted);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          console.warn("Failed to fetch notifications (server may be offline or restarting).");
        } else {
          console.error("Error fetching notifications:", err);
        }
      }
    }

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClose = () => setShowNotifications(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [showNotifications]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout API error for now.
    }

    localStorage.removeItem("skillLankaUser");
    setUser(null);
    setNotifications([]);
    setMobileOpen(false);
    router.push("/login");
    router.refresh();
  }

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, label: string) {
    if (!user && !checkingUser) {
      event.preventDefault();
      setModalTarget(label);
      setShowLoginModal(true);
      setMobileOpen(false);
      return;
    }

    if (user && user.role !== "CLIENT" && label === "Post Job") {
      event.preventDefault();
      setShowRoleModal(true);
      setMobileOpen(false);
    }
  }

  async function handleNotificationClick(notification: NotificationItem) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notification.id }),
      });
    } catch (err) {
      console.error(err);
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    );

    setShowNotifications(false);
    router.push(notification.link);
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (err) {
      console.error(err);
    }

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  }

  function isActiveLink(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const unreadCount = notifications.filter((item) => !item.read).length;

  const navLinkClass = (href: string) =>
    isActiveLink(href)
      ? "rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,0.35)]"
      : "rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-600 hover:shadow-md";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/75 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

        <div className="mx-auto flex max-w-8xl items-center justify-between px-5 py-4 lg:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_16px_35px_rgba(37,99,235,0.35)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6">
              <div className="absolute inset-0 rounded-2xl bg-white/25 blur-sm"></div>
              <span className="relative text-xl font-black text-white">S</span>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                Skill<span className="text-blue-600">Lanka</span>
              </h1>
              <p className="-mt-1 hidden text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">
                Freelance Market
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 shadow-inner shadow-slate-200/70 backdrop-blur-xl md:flex">
            <Link href="/freelancers" className={navLinkClass("/freelancers")}>
              Find Freelancers
            </Link>

            {user?.role !== "CLIENT" && (
              <Link href="/jobs" className={navLinkClass("/jobs")}>
                Jobs
              </Link>
            )}

            {user?.role !== "FREELANCER" && (
              <Link
                href="/post-job"
                onClick={(event) => handleNavClick(event, "Post Job")}
                className={navLinkClass("/post-job")}
              >
                Post Job
              </Link>
            )}

            <Link href="/services" className={navLinkClass("/services")}>
              Services
            </Link>

            <Link
              href="/dashboard"
              onClick={(event) => handleNavClick(event, "Dashboard")}
              className={navLinkClass("/dashboard")}
            >
              Dashboard
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {checkingUser ? (
              <div className="h-12 w-44 animate-pulse rounded-full bg-slate-100"></div>
            ) : user ? (
              <>
                <div
                  className="relative"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-lg"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>

                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-88 max-w-[90vw] overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
                      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="font-black text-slate-950">
                            Notifications
                          </h3>
                          <p className="text-xs font-semibold text-slate-400">
                            {unreadCount} unread updates
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-xs font-black text-blue-600 hover:text-blue-700"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <p className="py-6 text-center text-sm text-slate-500">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`w-full rounded-2xl p-4 text-left transition ${
                                notification.read
                                  ? "bg-slate-50 hover:bg-slate-100"
                                  : "border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100"
                              }`}
                            >
                              <p className="text-sm font-semibold leading-6 text-slate-700">
                                {notification.text}
                              </p>
                              <span className="mt-1 block text-[11px] font-bold text-slate-400">
                                {notification.time}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 py-2 pl-2 pr-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-emerald-400 text-sm font-black uppercase text-white shadow-md">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-black text-blue-700">
                      Hi, {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500">
                      {user.role === "FREELANCER" ? "Freelancer" : "Client"}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/25"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-black text-slate-900 shadow-sm md:hidden"
          >
            {mobileOpen ? "×" : "≡"}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white/95 px-5 py-5 shadow-2xl backdrop-blur-xl md:hidden">
            <div className="grid gap-2">
              <Link
                href="/freelancers"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700"
              >
                Find Freelancers
              </Link>

              {user?.role !== "CLIENT" && (
                <Link
                  href="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700"
                >
                  Jobs
                </Link>
              )}

              {user?.role !== "FREELANCER" && (
                <Link
                  href="/post-job"
                  onClick={(event) => handleNavClick(event, "Post Job")}
                  className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700"
                >
                  Post Job
                </Link>
              )}

              <Link
                href="/services"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700"
              >
                Services
              </Link>

              <Link
                href="/dashboard"
                onClick={(event) => handleNavClick(event, "Dashboard")}
                className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700"
              >
                Dashboard
              </Link>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              {user ? (
                <div className="grid gap-3">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl bg-blue-50 p-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-emerald-400 text-sm font-black text-white">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>

                    <div>
                      <p className="font-black text-blue-700">{user.name}</p>
                      <p className="text-xs font-bold text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-slate-100 px-5 py-3 text-center text-sm font-black text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-black text-white"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setShowLoginModal(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              ×
            </button>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)]">
              🔒
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-950">
                Login Required
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
                You must be logged in to access{" "}
                <span className="font-black text-blue-600">{modalTarget}</span>.
                Please login or create an account to continue.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              <Link
                href="/login"
                onClick={() => setShowLoginModal(false)}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setShowLoginModal(false)}
                className="rounded-2xl bg-slate-100 py-4 text-center text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setShowRoleModal(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
            <button
              type="button"
              onClick={() => setShowRoleModal(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              ×
            </button>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-[0_18px_40px_rgba(245,158,11,0.35)]">
              ⚠️
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-950">
                Client Role Required
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
                Only <span className="font-black text-blue-600">Client</span>{" "}
                accounts can post job requests. Freelancers can apply to jobs
                but cannot post them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRoleModal(false)}
              className="mt-8 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
