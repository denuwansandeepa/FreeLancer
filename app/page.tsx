import Link from "next/link";
import SearchBar from "./components/SearchBar";
import CategoryGrid from "./components/CategoryGrid";
import FreelancerCard from "./components/FreelancerCard";
import ServiceCard from "./components/ServiceCard";
import { prisma } from "../lib/prisma";

export default async function Home() {
  const profiles = await prisma.freelancerProfile.findMany({
    take: 3,
    include: {
      user: {
        select: {
          name: true,
          image: true,
          receivedReviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  const dbFreelancers = profiles.map((profile) => {
    const reviews = profile.user.receivedReviews;

    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "5.0";

    return {
      id: profile.id,
      name: profile.user.name,
      title: profile.title,
      location: profile.location,
      skills: profile.skills
        ? profile.skills.split(",").map((skill) => skill.trim())
        : [],
      price: profile.startingPrice || "Negotiable",
      rating: avgRating,
      image: profile.user.image || profile.profileImage || undefined,
    };
  });

  const dbServices = await prisma.service.findMany({
    take: 3,
    include: {
      freelancerProfile: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const formattedServices = dbServices.map((service) => ({
    id: service.id,
    title: service.title,
    category: service.category,
    price: service.price,
    seller: service.freelancerProfile.user.name,
    image: service.image,
  }));

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] overflow-hidden bg-[radial-gradient(circle_at_top_left,#2563eb_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#10b981_0%,transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#1e3a8a_100%)] px-6 py-24 text-white">
        <div className="absolute inset-0 opacity-30 hero-grid"></div>

        <div className="absolute left-[-8rem] top-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl animate-blob"></div>
        <div className="absolute right-[-8rem] top-40 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl animate-blob-delay"></div>
        <div className="absolute bottom-[-7rem] left-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-blob-slow"></div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-semibold text-blue-50 shadow-2xl backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_#34d399]"></span>
              Sri Lanka&apos;s modern freelancer marketplace
            </p>

            <h1 className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Hire skilled Sri Lankan talent with a{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
                smooth digital experience
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Find freelancers, post jobs, compare services, and connect with
              trusted local professionals across Sri Lanka.
            </p>

            <div className="mt-9">
              <SearchBar />
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-blue-950/30 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Browse Jobs
              </Link>

              <Link
                href="/post-job"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                Post a Job
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <h3 className="text-3xl font-black">30+</h3>
                <p className="mt-1 text-xs font-semibold text-slate-300">
                  Categories
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <h3 className="text-3xl font-black">LK</h3>
                <p className="mt-1 text-xs font-semibold text-slate-300">
                  Local Talent
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center shadow-xl backdrop-blur-xl">
                <h3 className="text-3xl font-black">24/7</h3>
                <p className="mt-1 text-xs font-semibold text-slate-300">
                  Online Access
                </p>
              </div>
            </div>
          </div>

          {/* 3D FLOATING VISUAL */}
          <div className="relative hidden min-h-[560px] lg:block perspective-1000">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"></div>

            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/10 animate-spin-slow"></div>

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 p-1 shadow-[0_40px_120px_rgba(37,99,235,0.55)] animate-float transform-3d rotate-card">
              <div className="flex h-full w-full flex-col justify-between rounded-[2.8rem] bg-slate-950/85 p-8 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-bold text-cyan-200">
                    SkillLanka Match
                  </p>

                  <h2 className="mt-3 text-4xl font-black leading-tight">
                    Find your perfect freelancer
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl">💻</p>
                    <p className="mt-2 text-xs font-bold">IT</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl">🎨</p>
                    <p className="mt-2 text-xs font-bold">Design</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl">📢</p>
                    <p className="mt-2 text-xs font-bold">Marketing</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl">🛠️</p>
                    <p className="mt-2 text-xs font-bold">Services</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-4 top-24 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl animate-float-delay">
              <p className="text-3xl">👨‍💻</p>
              <p className="mt-2 text-sm font-black">Top Developers</p>
              <p className="text-xs text-slate-300">Web, apps, systems</p>
            </div>

            <div className="absolute right-0 top-32 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl animate-float-slow">
              <p className="text-3xl">📌</p>
              <p className="mt-2 text-sm font-black">Post Jobs</p>
              <p className="text-xs text-slate-300">Hire in minutes</p>
            </div>

            <div className="absolute bottom-20 left-8 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl animate-float-slow">
              <p className="text-3xl">⭐</p>
              <p className="mt-2 text-sm font-black">Verified Ratings</p>
              <p className="text-xs text-slate-300">Trusted workers</p>
            </div>

            <div className="absolute bottom-28 right-8 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl animate-float-delay">
              <p className="text-3xl">💬</p>
              <p className="mt-2 text-sm font-black">Fast Contact</p>
              <p className="text-xs text-slate-300">Message freelancers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50">
        <CategoryGrid />
      </section>

      {/* TOP FREELANCERS */}
      <section className="relative overflow-hidden bg-white px-6 py-24">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 inline-block rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700">
                Featured Talent
              </p>

              <h2 className="text-4xl font-black text-slate-950">
                Top Freelancers
              </h2>

              <p className="mt-3 max-w-xl text-slate-600">
                Skilled Sri Lankan workers ready to help your project grow.
              </p>
            </div>

            <Link
              href="/freelancers"
              className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-black text-slate-700 transition hover:-translate-y-1 hover:bg-slate-100"
            >
              View All Freelancers
            </Link>
          </div>

          {dbFreelancers.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <h3 className="text-2xl font-black text-slate-900">
                No freelancers yet
              </h3>

              <p className="mt-3 text-slate-600">
                Create freelancer profiles from the dashboard to show them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-3">
              {dbFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="animate-card-hover">
                  <FreelancerCard {...freelancer} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="relative overflow-hidden bg-slate-50 px-6 py-24">
        <div className="absolute left-[-8rem] top-20 h-96 w-96 rounded-full bg-emerald-100 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 inline-block rounded-full bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700">
              Popular Services
            </p>

            <h2 className="text-4xl font-black text-slate-950">
              Featured Services
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Start hiring from professional Sri Lankan services.
            </p>
          </div>

          {formattedServices.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-2xl font-black text-slate-900">
                No services yet
              </h3>

              <p className="mt-3 text-slate-600">
                Add services from freelancer dashboard to show them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-3">
              {formattedServices.map((service) => (
                <div key={service.id} className="animate-card-hover">
                  <ServiceCard
                    title={service.title}
                    category={service.category}
                    price={service.price}
                    seller={service.seller}
                    image={service.image}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[radial-gradient(circle_at_top_left,#2563eb_0%,transparent_35%),linear-gradient(135deg,#020617_0%,#172554_50%,#064e3b_100%)] px-8 py-20 text-center text-white shadow-2xl">
          <p className="mx-auto mb-4 w-fit rounded-full bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
            Join the marketplace
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            Are you ready to work or hire in Sri Lanka?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-300">
            Create your profile, post services, publish job requests, and build
            trusted local connections.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-white px-8 py-4 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Create Account
            </Link>

            <Link
              href="/services"
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              Post Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}