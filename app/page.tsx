import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import CategoryCard from "./components/CategoryGrid";
import FreelancerCard from "./components/FreelancerCard";
import ServiceCard from "./components/ServiceCard";
import { categories, freelancers, services } from "./data/siteData";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 px-6 py-24 text-white">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold backdrop-blur">
            Sri Lanka&apos;s Local Freelancer Marketplace
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Find trusted Sri Lankan freelancers for your next project
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50">
            Search skilled people, view their experience, compare services, and
            hire the right person for your work.
          </p>

          <SearchBar />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-gray-900">
            Popular Categories
          </h2>
          <p className="mt-3 text-gray-600">
            Browse services from talented people around Sri Lanka.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Top Freelancers
              </h2>
              <p className="mt-3 text-gray-600">
                Skilled Sri Lankan workers ready to help you.
              </p>
            </div>

            <a
              href="/freelancers"
              className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              View All Freelancers
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {freelancers.slice(0, 3).map((freelancer) => (
              <FreelancerCard key={freelancer.id} {...freelancer} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-gray-900">
            Featured Services
          </h2>
          <p className="mt-3 text-gray-600">
            Start hiring from popular Sri Lankan services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              category={service.category}
              price={service.price}
              seller={service.freelancer}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-[2rem] bg-gray-900 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-black">
            Are you a freelancer in Sri Lanka?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Create your profile, add your experience, show your skills, and get
            hired by clients.
          </p>

          <a
            href="/register"
            className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
          >
            Create Freelancer Profile
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}