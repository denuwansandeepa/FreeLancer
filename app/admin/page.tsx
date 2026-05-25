"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalFreelancers: number;
  totalJobs: number;
  totalServices: number;
  totalHires: number;
  openJobs: number;
  completedHires: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "services" | "jobs">("overview");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // States for DB data
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hires, setHires] = useState<any[]>([]);

  // Detailed selected view inside Overview tab
  const [selectedDetail, setSelectedDetail] = useState<"users" | "jobs" | "services" | "hires" | null>(null);

  // Edit states for Modals
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingJob, setEditingJob] = useState<any | null>(null);

  // Categories list for dropdown selection
  const categories = [
    "IT & Software",
    "Design & Creative",
    "Writing & Translation",
    "Video & Photography",
    "Marketing & Sales",
    "Other",
  ];

  // 1. Verify Authentication & Role on Mount
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        
        if (!authRes.ok || !authData.success || authData.user.role !== "ADMIN") {
          // If not logged in or not an Admin, send back to home/login
          router.push("/login");
          return;
        }

        setAuthorized(true);
        // Load statistics
        fetchStats();
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoad();
  }, [router]);

  // 2. Fetchers
  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    if (data.success) setStats(data.stats);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
  };

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    if (data.success) setServices(data.services);
  };

  const fetchJobs = async () => {
    const res = await fetch("/api/admin/jobs");
    const data = await res.json();
    if (data.success) setJobs(data.jobs);
  };

  const fetchHires = async () => {
    const res = await fetch("/api/admin/hires");
    const data = await res.json();
    if (data.success) setHires(data.hires);
  };

  // Trigger fetches when switching sidebar tabs
  useEffect(() => {
    if (!authorized) return;
    if (activeTab === "overview") fetchStats();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "services") fetchServices();
    if (activeTab === "jobs") fetchJobs();
  }, [activeTab, authorized]);

  // Trigger fetches when selecting details inside Overview tab
  useEffect(() => {
    if (!authorized) return;
    if (selectedDetail === "users") fetchUsers();
    if (selectedDetail === "jobs") fetchJobs();
    if (selectedDetail === "services") fetchServices();
    if (selectedDetail === "hires") fetchHires();
  }, [selectedDetail, authorized]);

  // 3. Admin actions
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This is permanent!")) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("User deleted!");
      // Refresh both list and stats
      if (activeTab === "users" || selectedDetail === "users") fetchUsers();
      fetchStats();
    } else {
      alert("Error: " + data.message);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Role updated!");
      if (activeTab === "users" || selectedDetail === "users") fetchUsers();
      fetchStats();
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service listing?")) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("Service deleted!");
      if (activeTab === "services" || selectedDetail === "services") fetchServices();
      fetchStats();
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;
    const res = await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("Job posting deleted!");
      if (activeTab === "jobs" || selectedDetail === "jobs") fetchJobs();
      fetchStats();
    }
  };

  const handleDeleteHire = async (id: string) => {
    if (!confirm("Delete this hire request transaction?")) return;
    const res = await fetch(`/api/admin/hires?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("Hire request record deleted!");
      fetchHires();
      fetchStats();
    }
  };

  // Update handles
  const handleUpdateServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    
    const res = await fetch("/api/admin/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingService),
    });
    
    const data = await res.json();
    if (data.success) {
      alert("Service listing updated successfully!");
      setEditingService(null);
      if (activeTab === "services" || selectedDetail === "services") fetchServices();
    } else {
      alert("Error updating service: " + data.message);
    }
  };

  const handleUpdateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingJob),
    });

    const data = await res.json();
    if (data.success) {
      alert("Job request updated successfully!");
      setEditingJob(null);
      if (activeTab === "jobs" || selectedDetail === "jobs") fetchJobs();
    } else {
      alert("Error updating job request: " + data.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="text-lg font-bold text-slate-700 mt-4 animate-pulse">Verifying credentials...</div>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-100">
              🛡️ System Administrator
            </span>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Admin Control Center
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-blue-100/80">
                Manage the SkillLanka platform: moderate registrants, approve or remove service gigs, review active job requests, and monitor overall platform growth.
              </p>
            </div>

            <button 
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-white px-6 py-3.5 text-center font-bold text-gray-900 hover:bg-blue-50 transition duration-200 cursor-pointer shadow-md"
            >
              Exit to Dashboard &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl w-full px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Nav */}
          <aside className="space-y-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100/80 flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSelectedDetail(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm cursor-pointer ${
                  activeTab === "overview" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                📊 Platform Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm cursor-pointer ${
                  activeTab === "users" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                👥 User Accounts
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm cursor-pointer ${
                  activeTab === "services" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                💼 Services Listed
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm cursor-pointer ${
                  activeTab === "jobs" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                📌 Job Requests
              </button>
            </div>
          </aside>

          {/* Content Tab Content Area */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100/80">
            {/* Tab 1: Overview */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Platform Health & Stats</h2>
                  <p className="mt-1 text-sm text-gray-500">Click any card below to view detailed records instantly.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Users */}
                  <div 
                    onClick={() => setSelectedDetail(selectedDetail === "users" ? null : "users")}
                    className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                      selectedDetail === "users" 
                        ? "bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/20" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Users</div>
                    <div className="text-4xl font-black mt-1 text-slate-900">{stats.totalUsers}</div>
                    <div className="text-xs font-semibold text-slate-400 mt-2">
                      {stats.totalClients} Clients | {stats.totalFreelancers} Freelancers
                    </div>
                  </div>

                  {/* Card 2: Active Jobs */}
                  <div 
                    onClick={() => setSelectedDetail(selectedDetail === "jobs" ? null : "jobs")}
                    className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                      selectedDetail === "jobs" 
                        ? "bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="text-3xl mb-3">📋</div>
                    <div className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Active Jobs</div>
                    <div className="text-4xl font-black mt-1 text-emerald-950">{stats.openJobs}</div>
                    <div className="text-xs font-semibold text-emerald-700/60 mt-2">
                      Total job postings: {stats.totalJobs}
                    </div>
                  </div>

                  {/* Card 3: Services */}
                  <div 
                    onClick={() => setSelectedDetail(selectedDetail === "services" ? null : "services")}
                    className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                      selectedDetail === "services" 
                        ? "bg-sky-50/40 border-sky-500 ring-2 ring-sky-500/20" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="text-3xl mb-3">💼</div>
                    <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">Services</div>
                    <div className="text-4xl font-black mt-1 text-blue-950">{stats.totalServices}</div>
                    <div className="text-xs font-semibold text-blue-700/60 mt-2">
                      Gigs listed by freelancers
                    </div>
                  </div>

                  {/* Card 4: Total Hires */}
                  <div 
                    onClick={() => setSelectedDetail(selectedDetail === "hires" ? null : "hires")}
                    className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                      selectedDetail === "hires" 
                        ? "bg-purple-50/40 border-purple-500 ring-2 ring-purple-500/20" 
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="text-3xl mb-3">📩</div>
                    <div className="text-sm font-bold text-purple-600 uppercase tracking-wide">Total Hires</div>
                    <div className="text-4xl font-black mt-1 text-purple-950">{stats.totalHires}</div>
                    <div className="text-xs font-semibold text-purple-700/60 mt-2">
                      Completed hires: {stats.completedHires}
                    </div>
                  </div>
                </div>

                {/* Sub Detail Display Section */}
                {selectedDetail && (
                  <div className="mt-10 border-t border-slate-100 pt-8 animate-fade-in">
                    {/* User Details */}
                    {selectedDetail === "users" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Detailed View: User Accounts</h3>
                            <p className="text-sm text-slate-400">Moderating all accounts registered on SkillLanka</p>
                          </div>
                          <button 
                            onClick={() => setSelectedDetail(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
                          >
                            Close Detail View
                          </button>
                        </div>
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                          <table className="w-full text-left border-collapse bg-white">
                            <thead>
                              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="p-5">Name</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Role</th>
                                <th className="p-5">Location</th>
                                <th className="p-5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                              {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-5 font-bold text-slate-900">{user.name}</td>
                                  <td className="p-5 font-semibold text-slate-500">{user.email}</td>
                                  <td className="p-5">
                                    <select
                                      value={user.role}
                                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                      className="bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                    >
                                      <option value="CLIENT">CLIENT</option>
                                      <option value="FREELANCER">FREELANCER</option>
                                      <option value="ADMIN">ADMIN</option>
                                    </select>
                                  </td>
                                  <td className="p-5 font-semibold text-slate-500">{user.location || "N/A"}</td>
                                  <td className="p-5 text-right">
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                                    >
                                      Delete User
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Jobs Details */}
                    {selectedDetail === "jobs" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Detailed View: Active Job Requests</h3>
                            <p className="text-sm text-slate-400">Moderating client-posted job requests</p>
                          </div>
                          <button 
                            onClick={() => setSelectedDetail(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
                          >
                            Close Detail View
                          </button>
                        </div>
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                          <table className="w-full text-left border-collapse bg-white">
                            <thead>
                              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="p-5">Job Title</th>
                                <th className="p-5">Client</th>
                                <th className="p-5">Budget</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                              {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-5 font-bold text-slate-900 max-w-xs truncate" title={job.title}>
                                    {job.title}
                                  </td>
                                  <td className="p-5">
                                    <div className="font-bold text-slate-900">{job.client?.name}</div>
                                    <div className="text-xs text-slate-400">{job.client?.email}</div>
                                  </td>
                                  <td className="p-5 text-emerald-600 font-bold">{job.budget}</td>
                                  <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      job.status === "OPEN" 
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                        : "bg-slate-100 text-slate-500 border border-slate-200"
                                    }`}>
                                      {job.status}
                                    </span>
                                  </td>
                                  <td className="p-5 text-right">
                                    <button
                                      onClick={() => setEditingJob(job)}
                                      className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-100 rounded-full transition-all duration-200 cursor-pointer mr-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteJob(job.id)}
                                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                                    >
                                      Delete Post
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Services Details */}
                    {selectedDetail === "services" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Detailed View: Active Service Listings</h3>
                            <p className="text-sm text-slate-400">Moderating gigs listed by freelancers</p>
                          </div>
                          <button 
                            onClick={() => setSelectedDetail(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
                          >
                            Close Detail View
                          </button>
                        </div>
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                          <table className="w-full text-left border-collapse bg-white">
                            <thead>
                              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="p-5">Title</th>
                                <th className="p-5">Freelancer</th>
                                <th className="p-5">Price</th>
                                <th className="p-5">Category</th>
                                <th className="p-5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                              {services.map((svc) => (
                                <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-5 font-bold text-slate-900 max-w-xs truncate" title={svc.title}>
                                    {svc.title}
                                  </td>
                                  <td className="p-5">
                                    <div className="font-bold text-slate-900">
                                      {svc.freelancerProfile?.user?.name || "Unknown"}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {svc.freelancerProfile?.user?.email}
                                    </div>
                                  </td>
                                  <td className="p-5 text-emerald-600 font-bold">{svc.price}</td>
                                  <td className="p-5">
                                    <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-3 py-1 rounded-full">
                                      {svc.category}
                                    </span>
                                  </td>
                                  <td className="p-5 text-right">
                                    <button
                                      onClick={() => setEditingService(svc)}
                                      className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-100 rounded-full transition-all duration-200 cursor-pointer mr-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteService(svc.id)}
                                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                                    >
                                      Remove Gig
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Hires Details */}
                    {selectedDetail === "hires" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-slate-900">Detailed View: Hire Request Transactions</h3>
                            <p className="text-sm text-slate-400">Auditing and moderating hire requests</p>
                          </div>
                          <button 
                            onClick={() => setSelectedDetail(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
                          >
                            Close Detail View
                          </button>
                        </div>
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                          <table className="w-full text-left border-collapse bg-white">
                            <thead>
                              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="p-5">Client</th>
                                <th className="p-5">Freelancer</th>
                                <th className="p-5">Project / Message</th>
                                <th className="p-5">Budget</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                              {hires.map((hire) => (
                                <tr key={hire.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-5">
                                    <div className="font-bold text-slate-900">{hire.client?.name}</div>
                                    <div className="text-xs text-slate-400">{hire.client?.email}</div>
                                  </td>
                                  <td className="p-5">
                                    <div className="font-bold text-slate-900">{hire.freelancer?.name}</div>
                                    <div className="text-xs text-slate-400">{hire.freelancer?.email}</div>
                                  </td>
                                  <td className="p-5">
                                    <div className="font-semibold text-slate-800 truncate max-w-xs" title={hire.message}>
                                      {hire.message || "No message"}
                                    </div>
                                    {hire.service && (
                                      <span className="block text-xs text-slate-400 mt-0.5">
                                        Service: {hire.service.title}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-5 text-emerald-600 font-bold">{hire.budget || "N/A"}</td>
                                  <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      hire.status === "COMPLETED" 
                                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                                        : hire.status === "PENDING"
                                        ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    }`}>
                                      {hire.status}
                                    </span>
                                  </td>
                                  <td className="p-5 text-right">
                                    <button
                                      onClick={() => handleDeleteHire(hire.id)}
                                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                                    >
                                      Delete Record
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Users Management */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Manage Registrants</h2>
                  <p className="mt-1 text-sm text-gray-500">Update system roles or remove users from the platform.</p>
                </div>
                
                <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="p-5">Name</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Role</th>
                        <th className="p-5">Location</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 font-bold text-slate-900">{user.name}</td>
                          <td className="p-5 font-semibold text-slate-500">{user.email}</td>
                          <td className="p-5">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                              className="bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                              <option value="CLIENT">CLIENT</option>
                              <option value="FREELANCER">FREELANCER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="p-5 font-semibold text-slate-500">{user.location || "N/A"}</td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                            >
                              Delete User
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Services Management */}
            {activeTab === "services" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Manage Service Listings</h2>
                  <p className="mt-1 text-sm text-gray-500">Review and moderate active freelancer gigs.</p>
                </div>
                
                <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="p-5">Title</th>
                        <th className="p-5">Freelancer</th>
                        <th className="p-5">Price</th>
                        <th className="p-5">Category</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {services.map((svc) => (
                        <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 font-bold text-slate-900 max-w-xs truncate" title={svc.title}>
                            {svc.title}
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-slate-900">
                              {svc.freelancerProfile?.user?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-slate-400">
                              {svc.freelancerProfile?.user?.email}
                            </div>
                          </td>
                          <td className="p-5 text-emerald-600 font-bold">{svc.price}</td>
                          <td className="p-5">
                            <span className="bg-slate-100 text-slate-600 font-semibold text-xs px-3 py-1 rounded-full">
                              {svc.category}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => setEditingService(svc)}
                              className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-100 rounded-full transition-all duration-200 cursor-pointer mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                            >
                              Remove Gig
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Job Requests Management */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Manage Job Requests</h2>
                  <p className="mt-1 text-sm text-gray-500">Moderate open client job listings and requests.</p>
                </div>
                
                <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="p-5">Job Title</th>
                        <th className="p-5">Client</th>
                        <th className="p-5">Budget</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 font-bold text-slate-900 max-w-xs truncate" title={job.title}>
                            {job.title}
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-slate-900">{job.client?.name}</div>
                            <div className="text-xs text-slate-400">{job.client?.email}</div>
                          </td>
                          <td className="p-5 text-emerald-600 font-bold">{job.budget}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              job.status === "OPEN" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() => setEditingJob(job)}
                              className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-100 rounded-full transition-all duration-200 cursor-pointer mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-100 rounded-full transition-all duration-200 cursor-pointer"
                            >
                              Delete Post
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.15)] max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-black text-slate-900">Edit Service Listing (Gig)</h3>
              <button 
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateServiceSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Title</label>
                <input 
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price</label>
                  <input 
                    type="text"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Delivery Time</label>
                  <input 
                    type="text"
                    required
                    value={editingService.delivery}
                    onChange={(e) => setEditingService({ ...editingService, delivery: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Revisions</label>
                  <input 
                    type="text"
                    value={editingService.revision || ""}
                    onChange={(e) => setEditingService({ ...editingService, revision: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tags (Comma-separated)</label>
                <input 
                  type="text"
                  value={editingService.tags || ""}
                  onChange={(e) => setEditingService({ ...editingService, tags: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="rounded-full bg-slate-100 px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 transition duration-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white hover:opacity-90 shadow-md shadow-blue-500/10 transition duration-200 cursor-pointer text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.15)] max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-black text-slate-900">Edit Job Request</h3>
              <button 
                onClick={() => setEditingJob(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateJobSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Title</label>
                <input 
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
                  <select
                    value={editingJob.category}
                    onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Budget</label>
                  <input 
                    type="text"
                    required
                    value={editingJob.budget}
                    onChange={(e) => setEditingJob({ ...editingJob, budget: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deadline</label>
                  <input 
                    type="text"
                    value={editingJob.deadline || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location</label>
                  <input 
                    type="text"
                    value={editingJob.location || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills (Comma-separated)</label>
                  <input 
                    type="text"
                    value={editingJob.skills || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, skills: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                  <select
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="rounded-full bg-slate-100 px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 transition duration-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white hover:opacity-90 shadow-md shadow-blue-500/10 transition duration-200 cursor-pointer text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
