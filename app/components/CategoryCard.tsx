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
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">
      <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-blue-100 opacity-60 blur-2xl transition group-hover:bg-emerald-100"></div>

      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 text-4xl shadow-sm transition duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      <h3 className="relative text-xl font-black text-slate-950">{title}</h3>

      <p className="relative mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-600 transition group-hover:translate-x-1">
        Explore <span>→</span>
      </div>
    </div>
  );
}