"use client";

import { useEffect } from "react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: any;
}

export default function AnalyticsModal({
  isOpen,
  onClose,
  stats,
}: AnalyticsModalProps) {
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

  const handleClose = () => {
    onClose();
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
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-3xl font-black text-gray-900 font-sans tracking-tight">Gig Performance</h3>
          <p className="mt-1.5 text-sm text-gray-500">Analytics, impressions, and order conversion stats for the past 30 days.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100/50">
            <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Impressions</span>
            <span className="block text-3xl font-black text-blue-900 mt-2">1,248</span>
            <span className="block text-[10px] font-semibold text-emerald-600 mt-1">↑ +14.2% vs last week</span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100/50">
            <span className="block text-xs font-bold text-purple-600 uppercase tracking-wider">Gig Clicks</span>
            <span className="block text-3xl font-black text-purple-900 mt-2">342</span>
            <span className="block text-[10px] font-semibold text-emerald-600 mt-1">↑ +8.5% vs last week</span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100/50">
            <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider">Conversion</span>
            <span className="block text-3xl font-black text-emerald-900 mt-2">3.8%</span>
            <span className="block text-[10px] font-semibold text-emerald-600 mt-1">↑ +1.2% vs last week</span>
          </div>
        </div>

        {/* Performance Graph Mock */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800 text-sm">Impressions Trend</h4>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600"></span> Views</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-600"></span> Clicks</span>
            </div>
          </div>

          {/* Graph Visual Bars */}
          <div className="flex items-end justify-between h-36 gap-2 pt-2 border-b border-gray-200">
            {[45, 60, 52, 70, 85, 90, 68, 75, 95, 110, 80, 100].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <div className="w-full bg-blue-600/80 group-hover:bg-blue-600 rounded-t transition-all" style={{ height: `${val}%` }}></div>
                <div className="w-full bg-purple-600/80 group-hover:bg-purple-600 rounded-t transition-all" style={{ height: `${val * 0.3}%` }}></div>
                <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-600 mt-1">W{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t pt-5 flex justify-end">
          <button
            onClick={handleClose}
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
