"use client";

type RequestItem = {
  id: string;
  client: string;
  service: string;
  budget: string;
  status: string;
};

type ServiceItem = {
  title: string;
  price: string;
  orders: number;
  status: string;
};

// Fallback mock data if the database returns empty/null
const defaultHireRequests: RequestItem[] = [];

const defaultServices: ServiceItem[] = [
  {
    title: "Modern Business Website",
    price: "Rs. 25,000",
    orders: 32,
    status: "Active",
  },
  {
    title: "Admin Dashboard Development",
    price: "Rs. 45,000",
    orders: 11,
    status: "Active",
  },
  {
    title: "Portfolio Website Design",
    price: "Rs. 15,000",
    orders: 18,
    status: "Draft",
  },
];

interface FreelancerViewProps {
  hireRequests?: RequestItem[];
  services?: ServiceItem[];
  onAddServiceClick?: () => void;
  onManageRequest?: (id: string) => void;
}

export default function FreelancerView({
  hireRequests,
  services,
  onAddServiceClick,
  onManageRequest,
}: FreelancerViewProps) {
  // Use database values if available, otherwise fall back to mock data
  const activeRequests = hireRequests || defaultHireRequests;
  const activeServices = services || defaultServices;

  return (
    <div className="space-y-8">
      {/* Hire Requests Panel */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Hire Requests</h2>
            <p className="mt-1 text-gray-600">
              Review clients who want to hire you.
            </p>
          </div>
          <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
            View All
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No hire requests yet.
                  </td>
                </tr>
              ) : (
                activeRequests.map((request, index) => (
                  <tr key={`${request.client}-${index}`} className="bg-white">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {request.client}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {request.service}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">
                      {request.budget}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          request.status === "PENDING"
                            ? "bg-yellow-50 text-yellow-700"
                            : request.status === "ACCEPTED"
                              ? "bg-emerald-50 text-emerald-700"
                              : request.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          onManageRequest && onManageRequest(request.id)
                        }
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Panel */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">My Services</h2>
            <p className="mt-1 text-gray-600">
              Manage services you offer to clients.
            </p>
          </div>
          <button
            onClick={onAddServiceClick}
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 cursor-pointer transition-all duration-200"
          >
            Add New Service
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {activeServices.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">
                You haven't listed any services yet.
              </p>
              <button
                onClick={onAddServiceClick}
                className="mt-3 text-blue-600 font-bold hover:underline"
              >
                Create your first service
              </button>
            </div>
          ) : (
            activeServices.map((service, index) => (
              <div
                key={`${service.title}-${index}`}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center"
              >
                <div>
                  <h3 className="font-black text-gray-900">{service.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {service.orders} orders · Starting from {service.price}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700">
                    {service.status}
                  </span>
                  <button className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-700 hover:bg-white cursor-pointer transition-all">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
