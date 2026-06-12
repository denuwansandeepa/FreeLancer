"use client";

import Link from "next/link";

type JobItem = {
  title: string;
  budget: string;
  proposals: number;
  status: string;
};

type SentHireRequestItem = {
  id: string;
  freelancer: string;
  service: string;
  budget: string;
  status: string;
};

// Fallback mock data if the database returns empty/null
const defaultPostedJobs: JobItem[] = [
  {
    title: "Looking for Graphic Designer for Logo",
    budget: "Rs. 5,000",
    proposals: 8,
    status: "Active",
  },
  {
    title: "Need E-commerce Website Developer",
    budget: "Rs. 50,000",
    proposals: 15,
    status: "Reviewing",
  },
  {
    title: "Facebook Page Manager Needed",
    budget: "Rs. 15,000/mo",
    proposals: 3,
    status: "Active",
  },
];

interface ClientViewProps {
  postedJobs?: JobItem[];
  sentHireRequests?: SentHireRequestItem[];
  onManageRequest?: (id: string) => void;
}

export default function ClientView({ postedJobs, sentHireRequests, onManageRequest }: ClientViewProps) {
  // Use database values if available, otherwise fall back to mock data
  const activeJobs = postedJobs || defaultPostedJobs;
  const activeHires = sentHireRequests || [];

  return (
    <div className="space-y-8">
      {/* Posted Jobs Panel */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              My Posted Jobs
            </h2>
            <p className="mt-1 text-gray-600">
              Track and manage jobs you have posted.
            </p>
          </div>
          <Link
            href="/post-job"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            Post a New Job
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Job Title</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Proposals</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeJobs.map((job) => (
                <tr key={job.title} className="bg-white">
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{job.budget}</td>
                  <td className="px-5 py-4 font-bold text-blue-600">
                    {job.proposals} applications
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        job.status === "Active" || job.status === "OPEN"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications & Hire Requests Panel */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Applications & Hire Requests
          </h2>
          <p className="mt-1 text-gray-600">
            Review job applications and track direct hire requests.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          {activeHires.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No job applications or hire requests yet.</p>
              <Link
                href="/services"
                className="mt-3 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Browse Services to Hire
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Freelancer</th>
                  <th className="px-5 py-4">Service / Job</th>
                  <th className="px-5 py-4">Budget</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeHires.map((req, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {req.freelancer}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{req.service}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {req.budget}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          req.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : req.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700"
                            : req.status === "REJECTED"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700 font-bold"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onManageRequest && onManageRequest(req.id)}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

