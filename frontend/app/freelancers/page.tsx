"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("Sort by Rating");

  useEffect(() => {
    async function loadFreelancers() {
      try {
        const response = await fetch("/api/freelancers");
        const data = await response.json();
        if (data.success) {
          setFreelancers(data.freelancers);
        }
      } catch (err) {
        console.error("Error loading freelancers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFreelancers();
  }, []);

  const filteredFreelancers = useMemo(() => {
    let result = freelancers.filter((freelancer) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        freelancer.name.toLowerCase().includes(searchValue) ||
        freelancer.title.toLowerCase().includes(searchValue) ||
        freelancer.category.toLowerCase().includes(searchValue) ||
        freelancer.skills.some((skill: string) =>
          skill.toLowerCase().includes(searchValue)
        );

      const matchesCategory =
        category === "All Categories" || freelancer.category === category;

      const matchesLocation =
        location === "All Locations" || freelancer.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (sortBy === "Lowest Price") {
      result = [...result].sort((a, b) => {
        const priceA = Number(a.price.replace(/\D/g, ""));
        const priceB = Number(b.price.replace(/\D/g, ""));
        return priceA - priceB;
      });
    }

    if (sortBy === "Most Jobs") {
      result = [...result].sort((a, b) => b.completedJobs - a.completedJobs);
    }

    if (sortBy === "Sort by Rating") {
      result = [...result].sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    }

    return result;
  }, [freelancers, searchText, category, location, sortBy]);

  function clearFilters() {
    setSearchText("");
    setCategory("All Categories");
    setLocation("All Locations");
    setSortBy("Sort by Rating");
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-20 text-white animate-fade-in">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            Find Skilled Sri Lankan Talent
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Browse freelancers ready to work on your project
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Search by skill, location, category, and price. Hire trusted local
            workers from Sri Lanka.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Search skill, name, or title..."
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
              <option>Web Development</option>
              <option>Graphic Design</option>
              <option>Digital Marketing</option>
              <option>Video Editing</option>
              <option>Writing</option>
              <option>App Development</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option>All Locations</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
              <option>Gampaha</option>
              <option>Kurunegala</option>
              <option>Jaffna</option>
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

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Available Freelancers
            </h2>
            <p className="mt-1 text-gray-600">
              {filteredFreelancers.length} freelancers found
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option>Sort by Rating</option>
            <option>Lowest Price</option>
            <option>Most Jobs</option>
          </select>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-20 w-20 shrink-0 rounded-3xl bg-gray-200"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 rounded bg-gray-200 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 rounded bg-gray-200"></div>
                      <div className="h-4 rounded bg-gray-200 w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-gray-900">
              No freelancers found
            </h3>
            <p className="mt-3 text-gray-600">
              Try changing your search text, category, or location.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-1 flex-col gap-5 sm:flex-row">
                  {freelancer.image ? (
                    <img
                      src={freelancer.image}
                      alt={freelancer.name}
                      className="h-20 w-20 shrink-0 rounded-3xl object-cover border border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 text-2xl font-black text-white">
                      {freelancer.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-col justify-between gap-3 md:flex-row">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          {freelancer.name}
                        </h3>
                        <p className="font-medium text-blue-600">
                          {freelancer.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          📍 {freelancer.location} · {freelancer.category}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-lg font-black text-gray-900">
                          {freelancer.price}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {freelancer.description}
                    </p>

                    <div className="mb-5 mt-4 flex flex-wrap gap-2">
                      {freelancer.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>


                    <div className="mt-auto flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
                      <div className="flex gap-5 text-sm">
                        <span className="font-semibold text-yellow-500">
                          ⭐ {freelancer.rating}
                        </span>
                        <span className="text-gray-500">
                          {freelancer.completedJobs} jobs completed
                        </span>
                      </div>

                      <Link
                        href={`/freelancers/${freelancer.id}`}
                        className="rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}