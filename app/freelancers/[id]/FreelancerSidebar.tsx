"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HireModal from "../../components/HireModal";

interface FreelancerSidebarProps {
  freelancer: {
    id: string;
    name: string;
    price: string;
    rating: string;
    completedJobs: number;
    experience: string;
    responseTime: string;
  };
}

export default function FreelancerSidebar({ freelancer }: FreelancerSidebarProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
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

  const handleHireClick = () => {
    if (!userRole) {
      router.push(`/login?redirect=/freelancers/${freelancer.id}`);
      return;
    }
    setIsHireModalOpen(true);
  };

  return (
    <>
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
            <p className="mt-1 font-black">{freelancer.completedJobs}</p>
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

        {(userRole === "CLIENT" || !userRole) && (
          <button
            onClick={handleHireClick}
            className="mt-6 w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 cursor-pointer shadow-sm hover:shadow-md"
          >
            Hire This Freelancer
          </button>
        )}

        <button className="mt-3 w-full rounded-full border border-gray-300 px-6 py-4 font-bold text-gray-800 transition hover:bg-gray-100 cursor-pointer">
          Send Message
        </button>
      </div>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        freelancer={freelancer}
      />
    </>
  );
}
