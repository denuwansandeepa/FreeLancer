"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Footer from "../components/Footer";

type JobRequest = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline?: string | null;
  location?: string | null;
  skills?: string | null;
  status: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    location?: string | null;
  };
};

export default function JobsPage() {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  useEffect(() => {
    async function loadJobRequests() {
      try {
        const response = await fetch("/api/job-requests", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok) {
          setJobRequests(data.jobRequests || []);
        }
      } catch {
        setJobRequests([]);
      } finally {
        setLoading(false);
      }
    }

    loadJobRequests();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobRequests.filter((job) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchValue) ||
        job.description.toLowerCase().includes(searchValue) ||
        job.category.toLowerCase().includes(searchValue) ||
        (job.skills || "").toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All Categories" || job.category === category;

      const matchesLocation =
        location === "All Locations" || job.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [jobRequests, searchText, category, location]);

  return (
    <main className="min-h-screen bg-gray-50">
     

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
            Browse Sri Lankan Job Requests
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Find posted jobs from Sri Lankan clients
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
            Freelancers can browse client job requests, compare budgets,
            deadlines, skills, and send offers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 md:col-span-2"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option>All Categories</option>
              <option>IT & Software</option>
              <option>Graphic Design & Creative</option>
              <option>Sales & Marketing</option>
              <option>Video & Photography</option>
              <option>Writing & Translation</option>
              <option>Education & Tutoring</option>
              <option>Construction & Architecture</option>
              <option>Skilled Labour & Technicians</option>
              <option>Local Services</option>
            </select>

            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option>All Locations</option>
              <option>Any location</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Gampaha</option>
              <option>Galle</option>
              <option>Kurunegala</option>
              <option>Jaffna</option>
              <option>Remote only</option>
            </select>

            <Link
              href="/post-job"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Post Job
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Available Job Requests
            </h2>
            <p className="mt-1 text-gray-600">
              {loading
                ? "Loading jobs..."
                : `${filteredJobs.length} job requests found`}
            </p>
          </div>

          <Link
            href="/post-job"
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600"
          >
            + Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-gray-900">Loading...</h3>
            <p className="mt-3 text-gray-600">Fetching job requests.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-gray-900">
              No job requests found
            </h3>
            <p className="mt-3 text-gray-600">
              Post a job request first, then it will appear here.
            </p>

            <Link
              href="/post-job"
              className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100">
                  <div className="text-6xl">📌</div>

                  <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
                    {job.category}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                    {job.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <p className="font-semibold text-gray-600">
                      By {job.client?.name || "Client"}
                    </p>
                    <p className="font-bold text-blue-600">
                      {job.budget}
                    </p>
                  </div>

                  <h3 className="text-xl font-black leading-7 text-gray-900">
                    {job.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {job.description}
                  </p>

                  {job.skills && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.split(",").map((skill) => (
                        <span
                          key={skill.trim()}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 text-sm">
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-gray-500">Location</p>
                      <p className="font-bold text-gray-900">
                        {job.location || "Any location"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-gray-500">Deadline</p>
                      <p className="font-bold text-gray-900">
                        {job.deadline || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <button className="mt-5 block w-full rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600">
                    Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}