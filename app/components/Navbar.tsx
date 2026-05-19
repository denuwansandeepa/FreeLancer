import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50  border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-black text-gray-900">
          Skill<span className="text-blue-600">Lanka</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link href="/freelancers" className="hover:text-blue-600">
            Find Freelancers
          </Link>

          <Link href="/jobs" className="hover:text-blue-600">
            Services
          </Link>

          <Link href="/post-job" className="hover:text-blue-600">
            Post Job
          </Link>

          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}