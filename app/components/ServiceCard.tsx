type ServiceCardProps = {
  title: string;
  category: string;
  price: string;
  seller: string;
};

export default function ServiceCard({
  title,
  category,
  price,
  seller,
}: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100 text-5xl">
        💼
      </div>

      <div className="p-5">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {category}
        </span>

        <h3 className="mt-3 text-lg font-bold leading-6 text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">By {seller}</p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">From</p>
          <p className="font-bold text-gray-900">{price}</p>
        </div>
      </div>
    </div>
  );
}