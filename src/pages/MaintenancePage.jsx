import { Clock3, Mail, Wrench } from 'lucide-react';
import mainLogo from '../images/main-logo.png';
import { siteMode } from '../config/siteMode';

function MaintenancePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]" />
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-6rem] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <section className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <Wrench className="h-4 w-4 text-cyan-300" />
                Scheduled update in progress
              </div>

              <img
                src={mainLogo}
                alt="AOA Con 2026"
                className="mb-8 h-16 w-auto rounded-2xl bg-white/95 p-3 shadow-2xl shadow-cyan-950/30"
              />

              <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {siteMode.title}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                {siteMode.message}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-100 backdrop-blur">
                  <Clock3 className="h-5 w-5 text-cyan-300" />
                  <span>We will be back soon.</span>
                </div>
                <a
                  href={`mailto:${siteMode.contactEmail}`}
                  className="inline-flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-cyan-100 transition hover:bg-cyan-300/15"
                >
                  <Mail className="h-5 w-5" />
                  <span>{siteMode.contactEmail}</span>
                </a>
              </div>
            </section>

            <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur xl:p-8">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6">
                
                <div className="mt-6 space-y-4 text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="mt-2 text-xl font-semibold text-white">Temporarily unavailable</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Reason</p>
                    <p className="mt-2 text-base text-slate-200">
                      Essential updates, fixes, and content improvements are being applied.
                    </p>
                  </div>
                  
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MaintenancePage;
