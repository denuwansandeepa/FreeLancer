"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatsGrid from "./_components/StatsGrid";
import FreelancerView from "./_components/freelancerView/FreelancerView";
import ClientView from "./_components/clientView/ClientView";
import QuickActions from "./_components/QuickActions";
import AddServiceModal from "./_components/AddServiceModal";
import EditProfileModal from "./_components/EditProfileModal";
import MessagesModal from "./_components/MessagesModal";
import AnalyticsModal from "./_components/AnalyticsModal";
import ManageRequestModal from "./_components/ManageRequestModal";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  location?: string | null;
  image?: string | null;
};

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

  // --- ADD STATES FOR REALTIME DATA ---
  const [dbData, setDbData] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [manageRequestId, setManageRequestId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) {
        setDbData(data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("skillLankaUser");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Fetch DB stats & lists
      fetchDashboardData();

      // Check if there is a requestId in the query params to auto-open it
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const reqId = params.get("requestId");
        if (reqId) {
          setManageRequestId(reqId);
        }
      }
    } catch {
      localStorage.removeItem("skillLankaUser");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleCloseManageModal = () => {
    setManageRequestId(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("requestId");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  };

  function handleLogout() {
    localStorage.removeItem("skillLankaUser");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">Loading...</h1>
            <p className="mt-2 text-gray-600">Checking your login details.</p>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // Dynamic Profile Completion Calculation
  const hasBasicAccount = !!user.name;
  const hasEmail = !!user.email;
  const hasRole = !!user.role;
  const hasImage = !!user.image;
  const hasContact = !!(user.phone && user.location);

  let progressPercent = 0;
  if (hasBasicAccount) progressPercent += 20;
  if (hasEmail) progressPercent += 20;
  if (hasRole) progressPercent += 20;
  if (hasImage) progressPercent += 20;
  if (hasContact) progressPercent += 20;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="animate-fade-in">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
              {user.role === "FREELANCER"
                ? "Freelancer Dashboard"
                : "Client Dashboard"}
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
                className="rounded-full bg-white px-6 py-4 text-center font-bold text-gray-900 hover:bg-blue-50 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {/* Dynamic Statistics Cards - Pass dbData stats if loaded */}
          <StatsGrid role={user.role} stats={dbData?.stats} />
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column Content (Role-Specific) - Pass dbData variables if loaded */}
          {user.role === "FREELANCER" ? (
            <FreelancerView
              hireRequests={dbData?.hireRequests}
              services={dbData?.services}
              onAddServiceClick={() => setIsServiceModalOpen(true)}
              onManageRequest={(id) => setManageRequestId(id)}
            />
          ) : (
            <ClientView
              postedJobs={dbData?.postedJobs}
              sentHireRequests={dbData?.sentHireRequests}
              onManageRequest={(id) => setManageRequestId(id)}
            />
          )}

          {/* Right Column Content (Sidebar) */}
          <aside className="space-y-8">
            {/* Account Details */}
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

            {/* Profile Completion */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900">
                Profile Completion
              </h2>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-blue-600">{progressPercent}%</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <p>{hasBasicAccount ? "✅" : "⚠️"} Basic account created</p>
                <p>{hasEmail ? "✅" : "⚠️"} Email added</p>
                <p>{hasRole ? "✅" : "⚠️"} Role selected</p>
                <p>{hasImage ? "✅" : "⚠️"} Add profile image</p>
                <p>
                  {hasContact ? "✅" : "⚠️"} Add contact details (Phone &
                  Location)
                </p>
              </div>

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="mt-6 w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Improve Profile
              </button>
            </div>

            {/* Quick Actions (Role-Specific) */}
            <QuickActions
              role={user.role}
              onAddServiceClick={() => setIsServiceModalOpen(true)}
              onEditProfileClick={() => setIsEditProfileOpen(true)}
              onViewMessagesClick={() => setIsMessagesOpen(true)}
              onViewAnalyticsClick={() => setIsAnalyticsOpen(true)}
            />

            {/* Recent Activity */}
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
      </div>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSuccess={(updatedUser) => {
          setUser(updatedUser);
          fetchDashboardData();
        }}
      />

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        role={user.role}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        stats={dbData?.stats}
      />

      <ManageRequestModal
        isOpen={!!manageRequestId}
        onClose={handleCloseManageModal}
        requestId={manageRequestId}
        role={user.role}
        onUpdate={fetchDashboardData}
      />
    </main>
  );
}
