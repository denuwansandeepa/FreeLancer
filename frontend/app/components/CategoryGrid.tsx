"use client";

import { useState } from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "../data/siteData";

export default function CategoryGrid() {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="mb-3 inline-block rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700">
          Explore Categories
        </p>

        <h2 className="text-4xl font-black text-slate-950">
          Popular Categories
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Browse jobs and services from talented people around Sri Lanka.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>

      {categories.length > 6 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-600"
          >
            {showAll ? "Show Less Categories" : "View More Categories"}

            <span
              className={`text-xl transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </section>
  );
}