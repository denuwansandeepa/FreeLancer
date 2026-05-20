type RequestItem = {
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
const defaultHireRequests: RequestItem[] = [
  {
    client: "Saman Enterprises",
    service: "Business Website Development",
    budget: "Rs. 35,000",
    status: "New",
  },
  {
    client: "Nethmi Fashion",
    service: "Social Media Post Design",
    budget: "Rs. 8,000",
    status: "Pending",
  },
  {
    client: "Galle Food Corner",
    service: "Facebook Page Management",
    budget: "Rs. 20,000",
    status: "Accepted",
  },
];

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
}

export default function FreelancerView({
  hireRequests,
  services,
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeRequests.map((request) => (
                <tr key={request.client} className="bg-white">
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {request.client}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{request.service}</td>
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {request.budget}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
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
          <button className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 cursor-pointer">
            Add New Service
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {activeServices.map((service) => (
            <div
              key={service.title}
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
                <button className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-700 hover:bg-white cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
