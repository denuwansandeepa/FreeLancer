"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  location?: string | null;
};

const stats = [
  {
    title: "Profile Views",
    value: "248",
    change: "+18 this week",
    icon: "👀",
  },
  {
    title: "Hire Requests",
    value: "12",
    change: "4 new requests",
    icon: "📩",
  },
  {
    title: "Active Services",
    value: "5",
    change: "2 featured",
    icon: "💼",
  },
  {
    title: "Completed Jobs",
    value: "42",
    change: "4.9 rating",
    icon: "✅",
  },
];

const hireRequests = [
  {
    client: "Saman Enterprises",
    service: "Business Website Development",
    budget: "Rs. 35,000",
    status: "New",
  },
  {
    client: "Nethmi Fashion",
    service: "Social Media Post Design",
    budget: "Rs. 8,000",
    status: "Pending",
  },
  {
    client: "Galle Food Corner",
    service: "Facebook Page Management",
    budget: "Rs. 20,000",
    status: "Accepted",
  },
];

const services = [
  {
    title: "Modern Business Website",
    price: "Rs. 25,000",
    orders: 32,
    status: "Active",
  },
  {
    title: "Admin Dashboard Development",
    price: "Rs. 45,000",
    orders: 11,
    status: "Active",
  },
  {
    title: "Portfolio Website Design",
    price: "Rs. 15,000",
    orders: 18,
    status: "Draft",
  },
];

const activities = [
  "New hire request received from Saman Enterprises",
  "Your service received a new profile view",
  "Client accepted your custom offer",
  "You updated your freelancer profile",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("skillLankaUser");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("skillLankaUser");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("skillLankaUser");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">Loading...</h1>
            <p className="mt-2 text-gray-600">Checking your login details.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            {user.role === "FREELANCER" ? "Freelancer Dashboard" : "Client Dashboard"}
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Welcome back, {user.name}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                Manage your account, profile, services, hire requests, and
                messages from one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                  📧 {user.email}
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                  👤 {user.role}
                </span>

                {user.location && (
                  <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                    📍 {user.location}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full bg-white px-6 py-4 text-center font-bold text-gray-900 hover:bg-blue-50"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {item.icon}
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {item.change}
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-gray-500">
                {item.title}
              </p>
              <h2 className="mt-1 text-3xl font-black text-gray-900">
                {item.value}
              </h2>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Hire Requests
                </h2>
                <p className="mt-1 text-gray-600">
                  Review clients who want to hire you.
                </p>
              </div>

              <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
                View All
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Budget</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {hireRequests.map((request) => (
                    <tr key={request.client} className="bg-white">
                      <td className="px-5 py-4 font-bold text-gray-900">
                        {request.client}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {request.service}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        {request.budget}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  My Services
                </h2>
                <p className="mt-1 text-gray-600">
                  Manage services you offer to clients.
                </p>
              </div>

              <button className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600">
                Add New Service
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="font-black text-gray-900">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {service.orders} orders · Starting from {service.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700">
                      {service.status}
                    </span>

                    <button className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-700 hover:bg-white">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              My Account Details
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Name</span>
                <span className="font-bold text-gray-900">{user.name}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Email</span>
                <span className="font-bold text-gray-900">{user.email}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Role</span>
                <span className="font-bold text-gray-900">{user.role}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Phone</span>
                <span className="font-bold text-gray-900">
                  {user.phone || "Not added"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-bold text-gray-900">
                  {user.location || "Not added"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Profile Completion
            </h2>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span className="text-gray-600">Progress</span>
                <span className="text-blue-600">80%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-4/5 rounded-full bg-blue-600"></div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <p>✅ Basic account created</p>
              <p>✅ Email added</p>
              <p>✅ Role selected</p>
              <p>⚠️ Add profile image</p>
              <p>⚠️ Add portfolio details</p>
            </div>

            <button className="mt-6 w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700">
              Improve Profile
            </button>
          </div>

          <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-sm">
            <h2 className="text-2xl font-black">Quick Actions</h2>

            <div className="mt-6 grid gap-3">
              <button className="rounded-2xl bg-white px-5 py-4 text-left font-bold text-gray-900 hover:bg-blue-50">
                ➕ Add New Service
              </button>

              <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15">
                ✏️ Edit Profile
              </button>

              <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15">
                📩 View Messages
              </button>

              <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15">
                📊 View Analytics
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Recent Activity
            </h2>

            <div className="mt-5 space-y-4">
              {activities.map((activity) => (
                <div key={activity} className="flex gap-3">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600"></div>
                  <p className="text-sm leading-6 text-gray-600">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}