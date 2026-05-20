import Link from "next/link";

export default function QuickActions({ role }: { role: string }) {
  return (
    <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-sm">
      <h2 className="text-2xl font-black">Quick Actions</h2>
      <div className="mt-6 grid gap-3">
        {role === "FREELANCER" ? (
          <>
            <button className="rounded-2xl bg-white px-5 py-4 text-left font-bold text-gray-900 hover:bg-blue-50 cursor-pointer">
              ➕ Add New Service
            </button>
            <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15 cursor-pointer">
              📊 View Analytics
            </button>
          </>
        ) : (
          <>
            <Link
              href="/post-job"
              className="rounded-2xl bg-white px-5 py-4 text-left font-bold text-gray-900 hover:bg-blue-50 block cursor-pointer"
            >
              ➕ Post a Job Request
            </Link>
            <Link
              href="/freelancers"
              className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15 block cursor-pointer"
            >
              🔍 Find Freelancers
            </Link>
          </>
        )}

        <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15 cursor-pointer">
          ✏️ Edit Profile
        </button>
        <button className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15 cursor-pointer">
          📩 View Messages
        </button>
      </div>
    </div>
  );
}
