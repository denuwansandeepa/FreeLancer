export default function SearchBar() {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-xl sm:flex-row">
      <input
        type="text"
        placeholder="Search web developers, designers, video editors..."
        className="flex-1 rounded-2xl px-5 py-4 text-gray-800 outline-none"
      />

      <select className="rounded-2xl bg-gray-50 px-4 py-4 text-gray-700 outline-none">
        <option>All Sri Lanka</option>
        <option>Colombo</option>
        <option>Kandy</option>
        <option>Galle</option>
        <option>Kurunegala</option>
        <option>Jaffna</option>
      </select>

      <button className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700">
        Search
      </button>
    </div>
  );
}