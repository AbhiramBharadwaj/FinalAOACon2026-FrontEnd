import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Users2, Clock3 } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import { WORKSHOPS } from '../../data/workshopsData';

const WorkshopDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const workshop = WORKSHOPS.find((item) => item.slug === slug);

  if (!workshop) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Workshop not found</h1>
            <p className="mt-2 text-slate-600">The workshop page you requested does not exist.</p>
            <Link
              to="/workshops"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#005aa9] text-white text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workshops
            </Link>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

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
          <div className={`h-2 bg-gradient-to-r ${workshop.accent}`} />
          <div className="p-5 sm:p-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{workshop.name}</h1>
            <p className="mt-3 text-slate-700 leading-relaxed">{workshop.description}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold tracking-wide uppercase text-sky-700">Workshop Mentor</p>
                <p className="mt-2 text-base font-semibold text-slate-900 flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 mt-1 text-slate-600" />
                  {workshop.mentor}
                </p>
              </div>

              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                <p className="text-xs font-semibold tracking-wide uppercase text-teal-700">National Co-Ordinators</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {workshop.coordinators.map((coordinator) => (
                    <li key={coordinator} className="flex items-start gap-2">
                      <Users2 className="w-4 h-4 mt-0.5 text-slate-600" />
                      <span>{coordinator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-5 sm:p-6 shadow-sm">
          <p className="text-sm font-semibold text-violet-900 flex items-center gap-2">
            <Clock3 className="w-4 h-4" />
            Detailed Workshop Content Coming Soon
          </p>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Full agenda, station-wise topics, case discussions, and session timelines will be published here soon.
          </p>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default WorkshopDetailPage;
