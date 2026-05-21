"use client";

import { useState, useEffect } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset/Set state when modal opens or service/freelancer changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMessage("");
      setSuccess(false);
      setError(null);
      
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

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        message,
        budget,
      };

      if (service) {
        payload.serviceId = service.id;
      } else if (freelancer) {
        payload.freelancerProfileId = freelancer.id;
      } else {
        throw new Error("No service or freelancer selected.");
      }

      const response = await fetch("/api/hire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Hiring error:", err);
      setError(err.message || "Failed to submit hire request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative z-10 w-full max-w-lg transform rounded-3xl bg-white p-8 text-left shadow-2xl transition-all duration-300 border border-gray-100 my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          disabled={loading}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl mb-4 text-emerald-600 animate-bounce">
              ✓
            </div>
            <h3 className="text-2xl font-black text-gray-900">Request Sent!</h3>
            <p className="mt-2 text-gray-600">
              Your hire request has been sent successfully. The freelancer will be notified.
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
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I would like to hire you for this service. My requirements are..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
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
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. Rs. 25,000"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full border border-gray-200 px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
