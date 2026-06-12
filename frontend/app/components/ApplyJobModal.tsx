"use client";

import { useState } from "react";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    budget: string;
    clientName: string;
  } | null;
  onSuccess?: () => void;
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  job,
  onSuccess,
}: ApplyJobModalProps) {
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please explain your skills and how you can help.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/job-requests/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRequestId: job.id,
          message,
          budget: budget || job.budget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send application");
      }

      setMessage("");
      setBudget("");
      if (onSuccess) onSuccess();
      onClose();
      alert("Application sent successfully! You can track it in your dashboard.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-10">
        <div
          className="relative w-full max-w-lg transform rounded-[2rem] border border-white/20 bg-white p-8 text-left shadow-[0_30px_90px_rgba(15,23,42,0.35)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-950">Apply for Job</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Applying to <span className="text-slate-800">{job.title}</span> by {job.clientName}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">
                Why are you the best fit for this? *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I have 5 years of experience in..."
                className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">
                Your Proposed Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={`e.g. Rs. ${job.budget === 'Negotiable' ? '5000' : job.budget.replace(/[^0-9]/g, '') || '5000'}`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Leave empty to match the client's budget: {job.budget}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/40 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Sending Application..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
