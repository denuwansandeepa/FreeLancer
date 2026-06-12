import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 px-6 pt-20 text-white">
      {/* Animated background lights */}
      <div className="footer-grid absolute inset-0 opacity-20"></div>
      <div className="footer-blob absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/30 blur-3xl"></div>
      <div className="footer-blob-delay absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl"></div>
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-8xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            {/* Brand */}
            <div>
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_18px_45px_rgba(37,99,235,0.45)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-6">
                  <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm"></div>
                  <span className="relative text-2xl font-black text-white">
                    S
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    Skill<span className="text-blue-400">Lanka</span>
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    Freelance Market
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                A modern Sri Lankan freelancer marketplace for finding trusted
                local talent, posting jobs, comparing services, and hiring
                skilled professionals.
              </p>

              <div className="mt-6 flex gap-3">
                <div className="footer-mini-card">💻</div>
                <div className="footer-mini-card">🎨</div>
                <div className="footer-mini-card">📢</div>
                <div className="footer-mini-card">🛠️</div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-black text-white">Quick Links</h3>

              <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
                <Link href="/freelancers" className="footer-link">
                  Find Freelancers
                </Link>

                <Link href="/jobs" className="footer-link">
                  Browse Jobs
                </Link>

                <Link href="/post-job" className="footer-link">
                  Post a Job
                </Link>

                <Link href="/register" className="footer-link">
                  Become a Freelancer
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-black text-white">Top Categories</h3>

              <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
                <p className="footer-link">IT & Software</p>
                <p className="footer-link">Graphic Design</p>
                <p className="footer-link">Digital Marketing</p>
                <p className="footer-link">Video Editing</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-black text-white">Contact</h3>

              <div className="mt-5 space-y-4 text-sm text-slate-400">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner">
                  <p className="font-bold text-white">📍 Location</p>
                  <p className="mt-1">Colombo, Sri Lanka</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner">
                  <p className="font-bold text-white">✉️ Email</p>
                  <p className="mt-1">support@skilllanka.lk</p>
                </div>
              </div>
            </div>
          </div>

        
           
            </div>
          </div>
       

        {/* Bottom */}
        <div className="relative flex flex-col items-center justify-between gap-4 py-8 text-center text-xs font-semibold text-slate-500 md:flex-row">
          <p>© 2026 SkillLanka. All rights reserved.</p>

          <div className="flex gap-5">
            <p className="cursor-pointer transition hover:text-blue-400">
              Privacy Policy
            </p>
            <p className="cursor-pointer transition hover:text-blue-400">
              Terms
            </p>
            <p className="cursor-pointer transition hover:text-blue-400">
              Support
            </p>
          </div>
        </div>
    
    </footer>
  );
}