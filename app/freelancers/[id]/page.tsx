import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const freelancers = [
  {
    id: "kasun-perera",
    name: "Kasun Perera",
    title: "Full Stack Developer",
    location: "Colombo",
    category: "Web Development",
    skills: ["Next.js", "React", "MySQL", "Tailwind", "Node.js"],
    price: "Rs. 15,000",
    rating: "4.9",
    completedJobs: 42,
    experience: "3 Years",
    responseTime: "Within 2 hours",
    description:
      "I build modern websites, business systems, dashboards, and responsive web applications for Sri Lankan businesses. I can create clean, fast, and mobile-friendly websites using Next.js and Tailwind CSS.",
    services: [
      "Business website development",
      "Portfolio website development",
      "Admin dashboard development",
      "Database connected web apps",
    ],
    portfolio: [
      "Restaurant website",
      "Online booking system",
      "Small business dashboard",
    ],
  },
  {
    id: "nimali-silva",
    name: "Nimali Silva",
    title: "Graphic Designer",
    location: "Kandy",
    category: "Graphic Design",
    skills: ["Logo Design", "Canva", "Photoshop", "Branding"],
    price: "Rs. 5,000",
    rating: "4.8",
    completedJobs: 35,
    experience: "4 Years",
    responseTime: "Within 1 hour",
    description:
      "I design logos, posters, social media posts, flyers, business cards, and brand identity designs for small businesses and online shops.",
    services: [
      "Logo design",
      "Social media post design",
      "Flyer and poster design",
      "Business card design",
    ],
    portfolio: ["Cafe logo", "Clothing brand poster", "Facebook ad design"],
  },
  {
    id: "ruwan-fernando",
    name: "Ruwan Fernando",
    title: "Social Media Manager",
    location: "Gampaha",
    category: "Digital Marketing",
    skills: ["Facebook Ads", "Content Creation", "Marketing"],
    price: "Rs. 20,000",
    rating: "4.7",
    completedJobs: 28,
    experience: "2 Years",
    responseTime: "Within 3 hours",
    description:
      "I help businesses grow online using Facebook ads, content planning, page management, and campaign strategy.",
    services: [
      "Facebook page management",
      "Ad campaign setup",
      "Content calendar planning",
      "Monthly social media handling",
    ],
    portfolio: ["Salon page growth", "Gift shop campaign", "Restaurant ads"],
  },
  {
    id: "shani-jayasinghe",
    name: "Shani Jayasinghe",
    title: "Video Editor",
    location: "Galle",
    category: "Video Editing",
    skills: ["Reels", "YouTube", "CapCut", "Premiere Pro"],
    price: "Rs. 8,000",
    rating: "4.9",
    completedJobs: 51,
    experience: "3 Years",
    responseTime: "Within 2 hours",
    description:
      "I edit short videos, reels, TikToks, YouTube videos, and business promotional videos with smooth transitions and clean captions.",
    services: [
      "Facebook reel editing",
      "YouTube video editing",
      "TikTok video editing",
      "Business promo video editing",
    ],
    portfolio: ["Travel reel", "Product video", "YouTube vlog edit"],
  },
  {
    id: "tharindu-lakmal",
    name: "Tharindu Lakmal",
    title: "CV Writer",
    location: "Kurunegala",
    category: "Writing",
    skills: ["CV Writing", "Cover Letters", "LinkedIn"],
    price: "Rs. 3,000",
    rating: "4.6",
    completedJobs: 19,
    experience: "2 Years",
    responseTime: "Within 4 hours",
    description:
      "I write professional CVs, cover letters, LinkedIn summaries, and job application documents for Sri Lankan and overseas job seekers.",
    services: [
      "Professional CV writing",
      "Cover letter writing",
      "LinkedIn profile writing",
      "Job application document editing",
    ],
    portfolio: ["IT CV", "Marketing CV", "Fresher CV"],
  },
  {
    id: "mohamed-fazil",
    name: "Mohamed Fazil",
    title: "Mobile App Developer",
    location: "Jaffna",
    category: "App Development",
    skills: ["Flutter", "Firebase", "UI Design"],
    price: "Rs. 30,000",
    rating: "4.8",
    completedJobs: 23,
    experience: "3 Years",
    responseTime: "Within 2 hours",
    description:
      "I create mobile apps for shops, delivery services, schools, booking systems, and business management systems.",
    services: [
      "Android app development",
      "Flutter mobile apps",
      "Firebase connected apps",
      "Business app development",
    ],
    portfolio: ["Delivery app", "School app", "Shop ordering app"],
  },
];

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FreelancerProfilePage({ params }: PageProps) {
  const { id } = await params;

  const freelancer = freelancers.find((person) => person.id === id);

  if (!freelancer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

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
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-400 text-4xl font-black text-white shadow-xl">
                  {freelancer.name.charAt(0)}
                </div>

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

            <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="mt-1 text-4xl font-black">{freelancer.price}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="mt-1 font-black text-yellow-500">
                    ⭐ {freelancer.rating}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Jobs Done</p>
                  <p className="mt-1 font-black">
                    {freelancer.completedJobs}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="mt-1 font-black">{freelancer.experience}</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Response</p>
                  <p className="mt-1 font-black">{freelancer.responseTime}</p>
                </div>
              </div>

              <button className="mt-6 w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">
                Hire This Freelancer
              </button>

              <button className="mt-3 w-full rounded-full border border-gray-300 px-6 py-4 font-bold text-gray-800 transition hover:bg-gray-100">
                Send Message
              </button>
            </div>
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

      <Footer />
    </main>
  );
}