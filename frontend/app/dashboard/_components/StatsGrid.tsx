type StatsItem = {
  title: string;
  value: string;
  change: string;
  icon: string;
};

// Fallback mock statistics for Freelancers
const freelancerStats: StatsItem[] = [
  { title: "Profile Views", value: "248", change: "+18 this week", icon: "👀" },
  { title: "Hire Requests", value: "12", change: "4 new requests", icon: "📩" },
  { title: "Active Services", value: "5", change: "2 featured", icon: "💼" },
  { title: "Completed Jobs", value: "42", change: "4.9 rating", icon: "✅" },
];

// Fallback mock statistics for Clients
const clientStats: StatsItem[] = [
  { title: "Jobs Posted", value: "3", change: "1 active", icon: "📋" },
  { title: "Proposals Received", value: "18", change: "+5 new", icon: "✉️" },
  {
    title: "Spent Amount",
    value: "Rs. 45,000",
    change: "This month",
    icon: "💳",
  },
  { title: "Active Hires", value: "2", change: "Ongoing", icon: "🤝" },
];

export default function StatsGrid({
  role,
  stats,
}: {
  role: string;
  stats?: StatsItem[];
}) {
  // Use database stats if available, otherwise fall back to the defaults
  const activeStats =
    stats || (role === "FREELANCER" ? freelancerStats : clientStats);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {activeStats.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              {item.icon}
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {item.change}
            </span>
          </div>
          <p className="mt-5 text-sm font-semibold text-gray-500">
            {item.title}
          </p>
          <h2 className="mt-1 text-3xl font-black text-gray-900">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
