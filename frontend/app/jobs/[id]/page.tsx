import Link from "next/link";
import { notFound } from "next/navigation";

const services = [
  {
    id: "modern-business-website",
    title: "I will create a modern business website",
    freelancer: "Kasun Perera",
    freelancerId: "kasun-perera",
    category: "Web Development",
    location: "Colombo",
    price: "Rs. 25,000",
    delivery: "7 Days",
    rating: "4.9",
    orders: 32,
    revision: "3 Revisions",
    description:
      "I will create a modern, mobile-friendly, and professional website for your business, shop, portfolio, or service. The website will be clean, fast, responsive, and suitable for Sri Lankan businesses.",
    includes: [
      "Modern responsive website design",
      "Home page, About page, Services page, Contact page",
      "Mobile and desktop friendly layout",
      "Contact form section",
      "Basic SEO-friendly structure",
      "Clean Tailwind CSS design",
    ],
    requirements: [
      "Business name",
      "Logo if available",
      "Website content or details",
      "Contact details",
      "Images if available",
    ],
    tags: ["Next.js", "React", "Tailwind", "Business Website"],
  },
  {
    id: "professional-logo-design",
    title: "I will design a professional logo for your brand",
    freelancer: "Nimali Silva",
    freelancerId: "nimali-silva",
    category: "Graphic Design",
    location: "Kandy",
    price: "Rs. 6,000",
    delivery: "3 Days",
    rating: "4.8",
    orders: 45,
    revision: "5 Revisions",
    description:
      "I will design a clean and professional logo for your brand, shop, business, or social media page. You will receive a high-quality logo suitable for online and print use.",
    includes: [
      "Professional logo concept",
      "Color and black/white versions",
      "PNG and JPG files",
      "Social media friendly version",
      "Simple brand color suggestion",
      "Editable source file if needed",
    ],
    requirements: [
      "Business name",
      "Business type",
      "Preferred colors",
      "Logo examples you like",
      "Slogan if available",
    ],
    tags: ["Logo", "Branding", "Canva", "Photoshop"],
  },
  {
    id: "facebook-page-management",
    title: "I will manage your Facebook business page",
    freelancer: "Ruwan Fernando",
    freelancerId: "ruwan-fernando",
    category: "Digital Marketing",
    location: "Gampaha",
    price: "Rs. 18,000",
    delivery: "30 Days",
    rating: "4.7",
    orders: 21,
    revision: "Monthly Support",
    description:
      "I will manage your Facebook business page with planned content, captions, post designs, and basic ad campaign support to help improve your online presence.",
    includes: [
      "Monthly content plan",
      "Facebook post captions",
      "Basic post designs",
      "Page optimization suggestions",
      "Ad campaign setup support",
      "Monthly performance summary",
    ],
    requirements: [
      "Business page link",
      "Business details",
      "Products or services",
      "Target audience",
      "Monthly goals",
    ],
    tags: ["Facebook Ads", "Content", "Marketing"],
  },
  {
    id: "short-video-editing",
    title: "I will edit reels, TikTok videos, and YouTube shorts",
    freelancer: "Shani Jayasinghe",
    freelancerId: "shani-jayasinghe",
    category: "Video Editing",
    location: "Galle",
    price: "Rs. 8,000",
    delivery: "2 Days",
    rating: "4.9",
    orders: 58,
    revision: "2 Revisions",
    description:
      "I will edit short-form videos for Facebook reels, TikTok, YouTube shorts, and business promotions with clean cuts, captions, transitions, and smooth timing.",
    includes: [
      "Short video editing",
      "Clean transitions",
      "Caption text",
      "Basic sound syncing",
      "Social media export format",
      "Vertical video formatting",
    ],
    requirements: [
      "Raw video clips",
      "Caption or message",
      "Preferred video style",
      "Logo if needed",
      "Background music if available",
    ],
    tags: ["Reels", "CapCut", "Premiere Pro", "YouTube"],
  },
  {
    id: "professional-cv-writing",
    title: "I will write a professional CV and cover letter",
    freelancer: "Tharindu Lakmal",
    freelancerId: "tharindu-lakmal",
    category: "Writing",
    location: "Kurunegala",
    price: "Rs. 3,000",
    delivery: "2 Days",
    rating: "4.6",
    orders: 26,
    revision: "2 Revisions",
    description:
      "I will create a professional CV and cover letter for job applications in Sri Lanka or overseas. The CV will be clean, clear, and suitable for modern job applications.",
    includes: [
      "Professional CV writing",
      "Cover letter writing",
      "Clean layout",
      "Skills section improvement",
      "Experience section rewriting",
      "PDF and Word format",
    ],
    requirements: [
      "Current CV if available",
      "Education details",
      "Work experience",
      "Skills",
      "Target job role",
    ],
    tags: ["CV", "Cover Letter", "LinkedIn"],
  },
  {
    id: "mobile-app-development",
    title: "I will develop a mobile app for your business",
    freelancer: "Mohamed Fazil",
    freelancerId: "mohamed-fazil",
    category: "App Development",
    location: "Jaffna",
    price: "Rs. 30,000",
    delivery: "14 Days",
    rating: "4.8",
    orders: 18,
    revision: "3 Revisions",
    description:
      "I will develop a mobile app for your business, shop, delivery service, booking system, or simple management system using modern mobile app development tools.",
    includes: [
      "Mobile app UI design",
      "Basic app development",
      "Firebase connection",
      "Login system if needed",
      "Business feature setup",
      "Testing support",
    ],
    requirements: [
      "App idea",
      "Required features",
      "Business details",
      "Logo and colors",
      "Example app if available",
    ],
    tags: ["Flutter", "Firebase", "Mobile App"],
  },
];

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/jobs"
            className="mb-8 inline-block text-sm font-semibold text-blue-100 hover:text-white"
          >
            ← Back to services
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="mb-5 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
                {service.category}
              </span>

              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
                {service.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-blue-100">
                <span>👤 {service.freelancer}</span>
                <span>📍 {service.location}</span>
                <span>⭐ {service.rating}</span>
                <span>{service.orders} orders</span>
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50">
                {service.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">
              <p className="text-sm text-gray-500">Service price starts from</p>
              <p className="mt-1 text-4xl font-black">{service.price}</p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="text-gray-500">Delivery Time</span>
                  <span className="font-black">{service.delivery}</span>
                </div>

                <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="text-gray-500">Revision</span>
                  <span className="font-black">{service.revision}</span>
                </div>

                <div className="flex justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-black text-yellow-500">
                    ⭐ {service.rating}
                  </span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">
                Continue to Hire
              </button>

              <button className="mt-3 w-full rounded-full border border-gray-300 px-6 py-4 font-bold text-gray-800 transition hover:bg-gray-100">
                Contact Freelancer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Service Description
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              {service.description}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              What You Will Get
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {service.includes.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <p className="font-bold text-gray-900">✅ {item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Requirements From Client
            </h2>

            <div className="mt-5 space-y-3">
              {service.requirements.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl bg-gray-50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-gray-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              About Seller
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-2xl font-black text-white">
                {service.freelancer.charAt(0)}
              </div>

              <div>
                <h3 className="font-black text-gray-900">
                  {service.freelancer}
                </h3>
                <p className="text-sm text-gray-500">{service.location}</p>
              </div>
            </div>

            <Link
              href={`/freelancers/${service.freelancerId}`}
              className="mt-6 block rounded-full bg-gray-900 px-6 py-4 text-center font-bold text-white hover:bg-blue-600"
            >
              View Freelancer Profile
            </Link>
          </div>

          <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-sm">
            <h2 className="text-2xl font-black">Need custom changes?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              Contact the freelancer and explain your project before hiring.
            </p>

            <button className="mt-6 w-full rounded-full bg-white px-6 py-4 font-bold text-gray-900 hover:bg-blue-50">
              Send Custom Request
            </button>
          </div>
        </aside>
      </section>


    </main>
  );
}