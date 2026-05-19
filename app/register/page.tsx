import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="flex min-h-[80vh] items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                Create your SkillLanka account
              </h2>
              <p className="mt-2 text-gray-600">
                Join as a freelancer or client and start using the platform.
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Account Type
                </label>
                <select className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                  <option>I want to hire freelancers</option>
                  <option>I want to work as a freelancer</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-blue-600">
                Login
              </Link>
            </p>
          </div>

          <div className="hidden bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 p-12 text-white lg:block">
            <p className="mb-5 inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
              Join SkillLanka
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Build your career or hire trusted local talent
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-50">
              Freelancers can show skills, experience, and services. Clients can
              search, compare, and hire the best Sri Lankan talent.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                👨‍💻 Create freelancer profile
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                🔎 Search skilled workers
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                💼 Send hire requests
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}