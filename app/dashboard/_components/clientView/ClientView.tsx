import Link from "next/link";

type JobItem = {
  title: string;
  budget: string;
  proposals: number;
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
}

export default function ClientView({ postedJobs }: ClientViewProps) {
  // Use database values if available, otherwise fall back to mock data
  const activeJobs = postedJobs || defaultPostedJobs;

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
    </div>
  );
}
