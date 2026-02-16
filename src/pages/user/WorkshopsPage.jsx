import { Link } from 'react-router-dom';
import { ChevronRight, Stethoscope, GraduationCap, Users2 } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import { WORKSHOPS } from '../../data/workshopsData';

const WorkshopsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        <section className="mt-6 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  'url(https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1800)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#003b73]/90 via-[#005aa9]/90 to-[#0d9488]/85" />

            <div className="relative px-6 sm:px-8 py-10 sm:py-12 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/30 text-xs font-semibold tracking-wide">
                <Stethoscope className="w-4 h-4" />
                AOA CON 2026 WORKSHOPS
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-3xl">
                Four Focused Hands-On Workshops for Obstetric Anaesthesia Excellence
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-100/95 max-w-3xl">
                Explore expert-led sessions with dedicated national coordinators. Select a workshop card to view details.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {WORKSHOPS.map((workshop) => (
            <Link
              key={workshop.slug}
              to={`/workshops/${workshop.slug}`}
              className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${workshop.accent}`} />
              <div className="p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-[#005aa9] transition-colors">
                  {workshop.name}
                </h2>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{workshop.description}</p>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 mt-0.5 text-slate-500" />
                    <span>
                      <span className="font-semibold text-slate-900">Mentor:</span> {workshop.mentor}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Users2 className="w-4 h-4 mt-0.5 text-slate-500" />
                    <span>
                      <span className="font-semibold text-slate-900">National Coordinators:</span>{' '}
                      {workshop.coordinators.join(', ')}
                    </span>
                  </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#005aa9]">
                  View Workshop
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </section>

      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default WorkshopsPage;
