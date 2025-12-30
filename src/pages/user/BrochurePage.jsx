import { Download, FileText, MapPin, Calendar, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';

const BrochurePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        {}
        <section className="mt-4 mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-[#00796b] to-sky-800 text-white shadow-lg">
          <div
            className="relative"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(15,23,42,0.35), rgba(15,23,42,0.15)), url(https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="px-5 sm:px-8 py-8 sm:py-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/30 text-xs font-medium">
                    <Users className="w-4 h-4" />
                    19th Annual Conference • AOA
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-sky-100 mb-1">
                      AOACON 2026 • Shivamogga
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold leading-snug">
                      Welcome to the 19th Annual Conference of Association of Obstetric Anaesthesiologists
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] sm:text-[12px]">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                      <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                      30 Oct – 1 Nov 2026
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                      <MapPin className="w-3.5 h-3.5 text-sky-100" />
                      Shimoga Institute of Medical Sciences, Shivamogga, Karnataka
                    </span>
                  </div>
                </div>

                {}
                <div className="shrink-0">
                  <a
                    href="/assets/AOACON2026-Brochure.pdf"
                    download
                    className="inline-flex items-center gap-2 rounded-2xl bg-white text-[#005aa9] px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all border border-sky-100 hover:border-[#005aa9]/60"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Conference Brochure</span>
                  </a>
                  <p className="mt-2 text-[11px] text-slate-100/90">
                    PDF brochure with program highlights, themes, and venue details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="mb-6 rounded-2xl bg-white border border-slate-200 px-4 sm:px-6 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#00796b]" />
            <h2 className="text-lg font-semibold text-slate-900">Conference Overview</h2>
          </div>

          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              It gives us great pleasure to welcome you to the 19th Annual Conference of Obstetric
              Anaesthesiologists, proudly hosted by the Department of Anaesthesiology, SIMS and the
              ISA City Chapter, Shivamogga. The conference will be held at the Shimoga Institute of
              Medical Sciences, located in the serene, culturally rich city and gateway of Western
              Ghats, Shivamogga, Karnataka.
            </p>
            <p>
              It is concerning to our fraternity that despite advances in the medical field, there
              exists a significant gap between urban and rural perioperative maternal care,
              contributing to maternal deaths in India. This year&apos;s theme highlights the vital
              need to ensure equitable, evidence‑based and safe obstetric anaesthesia services
              across diverse healthcare settings.
            </p>
            <p>
              This prestigious gathering brings together experts, practitioners, and learners in the
              field of obstetric anaesthesia to share knowledge, discuss advances, and explore
              innovations that continue to shape safe motherhood and perioperative care, while
              addressing challenges faced in both resource‑rich and resource‑limited environments.
              The conference promises a vibrant academic program featuring distinguished speakers,
              interactive sessions, hands‑on workshops, and opportunities to engage with peers from
              across the region and beyond.
            </p>
            <p>
              Set amidst the lush landscapes of Karnataka, Shivamogga offers the perfect backdrop
              for academic exchange and rejuvenation. We warmly invite you to join us in Shivamogga
              for an enriching scientific experience amidst a welcoming environment. Together, let
              us work towards narrowing the urban–rural gap and shaping safe motherhood everywhere.
            </p>
            <p className="font-semibold text-slate-900">
              We look forward to your participation!
              <br />
              <span className="font-normal">Regards, Organizing Committee • AOACON 2026</span>
            </p>
          </div>
        </section>

        {}
        <section className="rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50 to-emerald-50 border border-sky-100 px-4 sm:px-6 py-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-sky-200 shadow-sm">
                <Download className="w-5 h-5 text-[#005aa9]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Download AOACON 2026 Brochure
                </h3>
                <p className="mt-1 text-sm text-slate-700">
                  Get the official conference brochure with detailed information on the theme,
                  scientific program, workshops, venue, and travel details in a single PDF.
                </p>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 md:items-end">
              <a
                href="/assets/AOACON2026-Brochure.pdf"
                download="AOACON2026-Brochure.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#005aa9] text-white px-5 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#005aa9]/70"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
              <span className="text-[11px] text-slate-500 md:text-right">
                Approx. 3–5 MB • Optimized for mobile and desktop viewing
              </span>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  );
};

export default BrochurePage;
