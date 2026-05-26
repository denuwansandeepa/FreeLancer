export type ServiceCardData = {
  id?: string;
  title: string;
  category: string;
  price: string;
  seller: string;
  image?: string | null;
  userRole?: string | null;
};

type ServiceCardProps = ServiceCardData & {
  onHire?: (service: ServiceCardData) => void;
};

export default function ServiceCard({
  id,
  title,
  category,
  price,
  seller,
  image,
  userRole,
  onHire,
}: ServiceCardProps) {
  function handleHireClick() {
    if (onHire) {
      onHire({
        id,
        title,
        category,
        price,
        seller,
        image,
        userRole,
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-emerald-100 to-yellow-100">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-5xl">💼</div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          {category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold leading-6 text-gray-900">{title}</h3>

        <p className="mt-2 text-sm text-gray-500">By {seller}</p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">From</p>
          <p className="font-bold text-gray-900">{price}</p>
        </div>

        {onHire && (
          <button
            type="button"
            onClick={handleHireClick}
            className="mt-5 w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            {userRole === "FREELANCER" ? "View Service" : "Hire Service"}
          </button>
        )}
      </div>
    </div>
  );
}