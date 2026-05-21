import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import FreelancerSidebar from "./FreelancerSidebar";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerProfilePage({ params }: PageProps) {
  const { id } = await params;

  const profile = await prisma.freelancerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          location: true,
          image: true,
          receivedReviews: true,
          receivedHireRequests: {
            where: {
              status: "COMPLETED",
            },
          },
        },
      },
      services: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const reviews = profile.user.receivedReviews;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  const completedJobsCount = profile.user.receivedHireRequests.length;

  const freelancer = {
    id: profile.id,
    name: profile.user.name,
    image: profile.user.image || profile.profileImage,
    title: profile.title,
    location: profile.location || profile.user.location || "Sri Lanka",
    category: profile.category,
    skills: profile.skills ? profile.skills.split(",").map((s) => s.trim()) : [],
    price: profile.startingPrice || "Negotiable",
    rating: avgRating,
    completedJobs: completedJobsCount,
    experience: profile.experience || "Not specified",
    responseTime: profile.responseTime || "N/A",
    description: profile.bio,
    services: profile.services.map((s) => s.title),
    portfolio: ["Project A", "Project B", "Project C"],
  };

  return (
    <main className="min-h-screen bg-gray-50 animate-fade-in">

      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/freelancers"
            className="mb-8 inline-block text-sm font-semibold text-blue-100 hover:text-white"
          >
            ← Back to freelancers
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="mb-6 flex items-center gap-5">
                {freelancer.image ? (
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="h-24 w-24 rounded-3xl object-cover border border-white/20 shadow-xl"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-400 text-4xl font-black text-white shadow-xl">
                    {freelancer.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h1 className="text-4xl font-black md:text-5xl">
                    {freelancer.name}
                  </h1>
                  <p className="mt-2 text-xl font-semibold text-blue-100">
                    {freelancer.title}
                  </p>
                  <p className="mt-2 text-blue-100">
                    📍 {freelancer.location} · {freelancer.category}
                  </p>
                </div>
              </div>

              <p className="max-w-3xl text-lg leading-8 text-blue-50">
                {freelancer.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <FreelancerSidebar freelancer={freelancer} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              About This Freelancer
            </h2>
            <p className="mt-4 leading-8 text-gray-600">
              {freelancer.description}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Services Offered
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {freelancer.services.map((service) => (
                <div
                  key={service}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <p className="font-bold text-gray-900">✅ {service}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">Portfolio</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {freelancer.portfolio.map((item) => (
                <div
                  key={item}
                  className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100 p-5 text-center font-bold text-gray-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Freelancer Details
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Location</span>
                <span className="font-bold text-gray-900">
                  {freelancer.location}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Category</span>
                <span className="font-bold text-gray-900">
                  {freelancer.category}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Experience</span>
                <span className="font-bold text-gray-900">
                  {freelancer.experience}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Completed Jobs</span>
                <span className="font-bold text-gray-900">
                  {freelancer.completedJobs}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Response Time</span>
                <span className="font-bold text-gray-900">
                  {freelancer.responseTime}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-sm">
            <h2 className="text-2xl font-black">Need this skill?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Send a hire request and explain your project requirement clearly.
            </p>

            <button className="mt-6 w-full rounded-full bg-white px-6 py-4 font-bold text-gray-900 hover:bg-blue-50">
              Request a Quote
            </button>
          </div>
        </aside>
      </section>


    </main>
  );
}