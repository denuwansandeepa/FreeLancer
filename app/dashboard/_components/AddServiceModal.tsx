"use client";

import { useState, useEffect } from "react";

const categories = [
  "IT & Software",
  "Graphic Design & Creative",
  "Sales & Marketing",
  "Video & Photography",
  "Writing & Translation",
  "Education & Tutoring",
  "Skilled Labour & Technicians",
  "Other",
];

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  onSuccess,
}: AddServiceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("IT & Software");
  const [price, setPrice] = useState("Rs. ");
  const [delivery, setDelivery] = useState("3 Days");
  const [revision, setRevision] = useState("3 Revisions");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
    // Reset form fields
    setTitle("");
    setDescription("");
    setCategory("IT & Software");
    setPrice("Rs. ");
    setDelivery("3 Days");
    setRevision("3 Revisions");
    setTags("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim() || !description.trim() || !price.trim() || !delivery.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          price,
          delivery,
          revision,
          tags,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg("🎉 Service added successfully!");
        onSuccess();
        // Auto close modal after 1.5 seconds
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to add service. Please try again.");
      }
    } catch (err) {
      console.error("Error creating service:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-2xl transform rounded-3xl bg-white p-8 text-left shadow-2xl transition-all duration-300 border border-gray-100 my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
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

        {/* Modal Header */}
        <div className="mb-6">
          <h3 className="text-3xl font-black text-gray-900">Add New Service</h3>
          <p className="mt-1.5 text-sm text-gray-500">
            Offer a pre-packaged gig service to Sri Lankan clients.
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-600 border border-emerald-100">
            {successMsg}
          </div>
        )}

        {/* Modal Scrollable Content Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Service Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., I will create a responsive Next.js business website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Starting Price *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Rs. 25,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Delivery Time *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 5 Days"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Revisions
              </label>
              <input
                type="text"
                placeholder="e.g., 3 Revisions"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Next.js, React, Web Development"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your service package details, what you deliver, and what technology you use..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Publish Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
