type FreelancerCardProps = {
  name: string;
  title: string;
  location: string;
  skills: string[];
  price: string;
  rating: string;
};

export default function FreelancerCard({
  name,
  title,
  location,
  skills,
  price,
  rating,
}: FreelancerCardProps) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-xl font-bold text-white">
          {name.charAt(0)}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-sm text-gray-500">📍 {location}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="font-bold text-gray-900">{price}</p>
        </div>

        <div className="text-sm font-semibold text-yellow-500">⭐ {rating}</div>
      </div>

      <button className="mt-5 w-full rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
        View Profile
      </button>
    </div>
  );
}