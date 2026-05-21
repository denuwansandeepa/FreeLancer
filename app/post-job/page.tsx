"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "../components/Footer";

export default function PostJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("Any location");
  const [skills, setSkills] = useState("");
  const [contactMethod, setContactMethod] = useState("Website message");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("skillLankaUser");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      if (user.role !== "CLIENT") {
        router.push("/dashboard");
      } else {
        setIsClient(true);
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
          <h1 className="text-2xl font-black text-gray-900">Loading...</h1>
          <p className="mt-2 text-gray-600">Verifying authorization.</p>
        </div>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (!title || !category || !description || !budget) {
      setIsError(true);
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/job-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          category,
          description,
          budget,
          deadline,
          location,
          skills,
          contactMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Job post failed.");
        return;
      }

      setIsError(false);
      setMessage(
        "✅ Job request posted successfully. You can now see it on the Services page.",
      );

      setTitle("");
      setCategory("");
      setDescription("");
      setBudget("");
      setDeadline("");
      setLocation("Any location");
      setSkills("");
      setContactMethod("Website message");
    } catch {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-blue-700 px-6 py-16 text-white animate-fade-in">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            Post a Job Request
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            Tell freelancers what work you need
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Describe your project, budget, deadline, and required skills.
            Freelancers can review your request and contact you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">
            Job Request Details
          </h2>

          <p className="mt-2 text-gray-600">
            Add clear details so freelancers can understand your work properly.
          </p>

          {message && (
            <div
              className={`mt-6 rounded-2xl p-5 text-center font-semibold ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                required
                placeholder="Example: I need a website for my shop"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category
              </label>
              <select
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select category</option>
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Project Description
              </label>
              <textarea
                rows={7}
                required
                placeholder="Explain what you need, your business type, required features, and expected result..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              ></textarea>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Budget
                </label>
                <input
                  type="text"
                  required
                  placeholder="Example: Rs. 25,000"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Deadline
                </label>
                <input
                  type="text"
                  placeholder="Example: Within 7 days"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option>Any location</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Gampaha</option>
                  <option>Galle</option>
                  <option>Kurunegala</option>
                  <option>Jaffna</option>
                  <option>Remote only</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Contact Method
                </label>
                <select
                  value={contactMethod}
                  onChange={(event) => setContactMethod(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option>Website message</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Phone call</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Required Skills
              </label>
              <input
                type="text"
                placeholder="Example: Next.js, Logo Design, Facebook Ads"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Separate skills using commas.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Job Request"}
            </button>
          </form>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Tips for a good job post
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
              <p>✅ Explain the work clearly.</p>
              <p>✅ Add your budget range.</p>
              <p>✅ Mention deadline and expected delivery.</p>
              <p>✅ Add required skills.</p>
              <p>✅ Tell whether the work is online or location-based.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-sm">
            <h2 className="text-2xl font-black">Example Job Post</h2>

            <p className="mt-4 text-sm leading-7 text-gray-300">
              I need a modern website for my clothing shop. It should have home,
              about, products, contact page, WhatsApp button, and
              mobile-friendly design. Budget is around Rs. 30,000 and I need it
              within 10 days.
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
