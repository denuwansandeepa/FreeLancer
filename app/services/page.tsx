"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ServiceCard from "../components/ServiceCard";

import AddServiceModal from "../dashboard/_components/AddServiceModal";
import HireModal from "../components/HireModal";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  async function loadServices() {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      console.error("Error loading services:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();

    const savedUser = localStorage.getItem("skillLankaUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserRole(user.role);
      } catch (err) {
        console.error("Error parsing user role:", err);
      }
    }
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        service.title.toLowerCase().includes(searchValue) ||
        service.description.toLowerCase().includes(searchValue) ||
        service.seller.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All Categories" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchText, category]);

  function clearFilters() {
    setSearchText("");
    setCategory("All Categories");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 px-6 py-20 text-white animate-fade-in">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            Explore Services
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Find the perfect service for your business
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
            Browse and buy pre-packaged services offered by top Sri Lankan
            freelancers.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search services..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option>All Categories</option>
              <option>IT & Software</option>
              <option>Graphic Design & Creative</option>
              <option>Sales & Marketing</option>
              <option>Video & Photography</option>
              <option>Writing & Translation</option>
              <option>Education & Tutoring</option>
            </select>

            <button
              onClick={clearFilters}
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Services List Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Available Services
            </h2>
            <p className="mt-1 text-gray-600">
              {loading
                ? "Loading services..."
                : `${filteredServices.length} services found`}
            </p>
          </div>

          {userRole === "FREELANCER" && (
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 cursor-pointer transition-all duration-200"
            >
              + Add New Service
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-gray-200 bg-white h-72 shadow-sm"
              >
                <div className="h-40 bg-gray-200 rounded-t-3xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-gray-900">
              No services found
            </h3>
            <p className="mt-3 text-gray-600">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                category={service.category}
                price={service.price}
                seller={service.seller}
                userRole={userRole}
                onHire={(s) => {
                  if (!userRole) {
                    router.push("/login?redirect=/services");
                    return;
                  }
                  setSelectedService(s);
                  setIsHireModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <AddServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={loadServices}
      />

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        service={selectedService}
      />

     
    </main>
  );
}
