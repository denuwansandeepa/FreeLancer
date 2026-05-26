"use client";

import Link from "next/link";

type ServiceCardProps = {
  id?: string;
  title: string;
  category: string;
  price: string;
  seller: string;
  userRole?: string | null;
  showError?: boolean;
  onHire?: (service: { id: string; title: string; price: string; seller: string }) => void;
};

export default function ServiceCard({
  id,
  title,
  category,
  price,
  seller,
  userRole,
  showError,
  onHire,
}: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100 text-5xl">
          💼
        </div>

        <div className="p-5">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {category}
          </span>

          <h3 className="mt-3 text-lg font-bold leading-6 text-gray-900 line-clamp-2">
            {title}
          </h3>

          <p className="mt-2 text-sm text-gray-500 font-semibold">By {seller}</p>

          {showError && (
            <p className="mt-2 text-xs font-black text-red-600 animate-pulse">
              ⚠️ To hire a freelancer, you need a client Account.
            </p>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Starting From</p>
            <p className="font-extrabold text-gray-900 text-base">{price}</p>
          </div>
          {onHire && id ? (
            (userRole === "CLIENT" || !userRole) && (
              <button
                onClick={() => onHire({ id, title, price, seller })}
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-black text-white hover:bg-blue-700 transition duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Hire Now
              </button>
            )
          ) : (
            <Link
              href="/services"
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-black text-gray-700 hover:bg-gray-50 transition duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              View Service
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
