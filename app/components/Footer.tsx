export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-950 px-6 py-10 text-white animate-fade-in ">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-black">
            Skill<span className="text-blue-400">Lanka</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            A Sri Lankan freelancer marketplace for finding trusted local
            talent and services.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Quick Links</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p>Find Freelancers</p>
            <p>Post a Job</p>
            <p>Become a Freelancer</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Contact</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p>Colombo, Sri Lanka</p>
            <p>support@skilllanka.lk</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-gray-500">
        © 2026 SkillLanka. All rights reserved.
      </p>
    </footer>
  );
}