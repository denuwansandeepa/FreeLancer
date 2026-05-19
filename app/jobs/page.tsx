import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  {
    id: "modern-business-website",
    title: "I will create a modern business website",
    freelancer: "Kasun Perera",
    category: "Web Development",
    location: "Colombo",
    price: "Rs. 25,000",
    delivery: "7 Days",
    rating: "4.9",
    orders: 32,
    description:
      "Professional responsive website for small businesses, shops, portfolios, and service providers.",
    tags: ["Next.js", "React", "Tailwind", "Business Website"],
  },
  {
    id: "professional-logo-design",
    title: "I will design a professional logo for your brand",
    freelancer: "Nimali Silva",
    category: "Graphic Design",
    location: "Kandy",
    price: "Rs. 6,000",
    delivery: "3 Days",
    rating: "4.8",
    orders: 45,
    description:
      "Clean and modern logo design suitable for shops, brands, social media pages, and companies.",
    tags: ["Logo", "Branding", "Canva", "Photoshop"],
  },
  {
    id: "facebook-page-management",
    title: "I will manage your Facebook business page",
    freelancer: "Ruwan Fernando",
    category: "Digital Marketing",
    location: "Gampaha",
    price: "Rs. 18,000",
    delivery: "30 Days",
    rating: "4.7",
    orders: 21,
    description:
      "Monthly Facebook page handling with content planning, post design, captions, and ad support.",
    tags: ["Facebook Ads", "Content", "Marketing"],
  },
  {
    id: "short-video-editing",
    title: "I will edit reels, TikTok videos, and YouTube shorts",
    freelancer: "Shani Jayasinghe",
    category: "Video Editing",
    location: "Galle",
    price: "Rs. 8,000",
    delivery: "2 Days",
    rating: "4.9",
    orders: 58,
    description:
      "Smooth short-form video editing with captions, transitions, music timing, and clean export.",
    tags: ["Reels", "CapCut", "Premiere Pro", "YouTube"],
  },
  {
    id: "professional-cv-writing",
    title: "I will write a professional CV and cover letter",
    freelancer: "Tharindu Lakmal",
    category: "Writing",
    location: "Kurunegala",
    price: "Rs. 3,000",
    delivery: "2 Days",
    rating: "4.6",
    orders: 26,
    description:
      "Professional CV, cover letter, and LinkedIn profile writing for local and foreign job applications.",
    tags: ["CV", "Cover Letter", "LinkedIn"],
  },
  {
    id: "mobile-app-development",
    title: "I will develop a mobile app for your business",
    freelancer: "Mohamed Fazil",
    category: "App Development",
    location: "Jaffna",
    price: "Rs. 30,000",
    delivery: "14 Days",
    rating: "4.8",
    orders: 18,
    description:
      "Mobile app development for shops, booking systems, delivery systems, and business services.",
    tags: ["Flutter", "Firebase", "Mobile App"],
  },
];

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
            Browse Sri Lankan Services
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Find the right service for your next project
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
            Search services from Sri Lankan freelancers. Compare price,
            delivery time, skills, ratings, and hire the best person.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            <input
              type="text"
              placeholder="Search services..."
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 md:col-span-2"
            />

            <select className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500">
              <option>All Categories</option>
              <option>Web Development</option>
              <option>Graphic Design</option>
              <option>Digital Marketing</option>
              <option>Video Editing</option>
              <option>Writing</option>
            </select>

            <select className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500">
              <option>All Locations</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Gampaha</option>
              <option>Galle</option>
              <option>Jaffna</option>
            </select>

            <button className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Available Services
            </h2>
            <p className="mt-1 text-gray-600">
              {services.length} services found
            </p>
          </div>

          <select className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none">
            <option>Sort by Best Rating</option>
            <option>Lowest Price</option>
            <option>Fastest Delivery</option>
            <option>Most Orders</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100">
                <div className="text-6xl">💼</div>

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
                  {service.category}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <p className="font-semibold text-gray-600">
                    By {service.freelancer}
                  </p>
                  <p className="font-bold text-yellow-500">
                    ⭐ {service.rating}
                  </p>
                </div>

                <h3 className="text-xl font-black leading-7 text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {service.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 text-sm">
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-gray-500">Location</p>
                    <p className="font-bold text-gray-900">
                      {service.location}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-gray-500">Delivery</p>
                    <p className="font-bold text-gray-900">
                      {service.delivery}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-xl font-black text-gray-900">
                      {service.price}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {service.orders} orders
                  </p>
                </div>

                <Link
                  href={`/jobs/${service.id}`}
                  className="mt-5 block rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  View Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2rem] bg-gray-900 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-black">Need custom work?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Post your project requirement and let Sri Lankan freelancers contact
            you with offers.
          </p>

          <button className="mt-8 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700">
            Post a Job Request
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}