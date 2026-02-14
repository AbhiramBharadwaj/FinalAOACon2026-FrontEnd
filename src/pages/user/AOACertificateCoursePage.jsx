import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Clock3, Users2 } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import { CERTIFICATE_COURSE_COORDINATORS } from '../../data/workshopsData';

const AOACertificateCoursePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
              return;
            }
            navigate('/workshops');
          }}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <section className="mt-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
          <div className="p-5 sm:p-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              AOA Certificate Course
            </h1>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Dedicated certificate-track academic module under AOACON 2026.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-wide uppercase text-amber-700">National Co-Ordinators</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                {CERTIFICATE_COURSE_COORDINATORS.map((name) => (
                  <li key={name} className="flex items-start gap-2">
                    <Users2 className="w-4 h-4 mt-0.5 text-slate-600" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-5 sm:p-6 shadow-sm">
          <p className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Clock3 className="w-4 h-4" />
            Coming Soon
          </p>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Complete course structure, eligibility details, learning objectives, and certificate criteria will be announced here shortly.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-700" />
            Stay tuned for official module release.
          </p>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default AOACertificateCoursePage;
