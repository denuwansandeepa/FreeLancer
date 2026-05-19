type CategoryCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function CategoryCard({
  icon,
  title,
  description,
}: CategoryCardProps) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}