"use client";

import { FormEvent, useEffect, useState } from "react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: {
    id: string;
    title: string;
    price: string;
    seller: string;
  } | null;
  freelancer?: {
    id: string;
    name: string;
    price: string;
  } | null;
  onSuccess?: () => void;
}

type HirePayload = {
  message: string;
  budget: string;
  serviceId?: string;
  freelancerProfileId?: string;
};

export default function HireModal({
  isOpen,
  onClose,
  service,
  freelancer,
  onSuccess,
}: HireModalProps) {
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMessage("");
      setSuccess(false);
      setError("");

      if (service) {
        setBudget(service.price);
      } else if (freelancer) {
        setBudget(freelancer.price);
      } else {
        setBudget("");
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, service, freelancer]);

  if (!isOpen) return null;

  function handleClose() {
    if (!loading) {
      onClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload: HirePayload = {
        message,
        budget,
      };

      if (service) {
        payload.serviceId = service.id;
      } else if (freelancer) {
        payload.freelancerProfileId = freelancer.id;
      } else {
        setError("No service or freelancer selected.");
        return;
      }

      const response = await fetch("/api/hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError("Failed to submit hire request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/70 backdrop-blur-md"
      onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-10">
        <div
          className="relative w-full max-w-lg transform rounded-[2rem] border border-white/20 bg-white p-8 text-left shadow-[0_30px_90px_rgba(15,23,42,0.35)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          disabled={loading}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>

            <h3 className="text-2xl font-black text-gray-900">
              Request Sent!
            </h3>

            <p className="mt-2 text-gray-600">
              Your hire request has been sent successfully. The freelancer will
              be notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">
                Send Hire Request
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {service
                  ? `Hiring ${service.seller} for "${service.title}"`
                  : `Hiring freelancer ${freelancer?.name}`}
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-900">
                Explain Your Requirements
              </label>

              <textarea
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi, I would like to hire you for this service. My requirements are..."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-900">
                Your Proposed Budget
              </label>

              <input
                type="text"
                required
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="e.g. Rs. 25,000"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}