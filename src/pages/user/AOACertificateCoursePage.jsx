import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users2 } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import ProgrammeFlyer from '../../components/common/ProgrammeFlyer';
import WorkshopFlyerModal from '../../components/common/WorkshopFlyerModal';
import { CERTIFICATE_COURSE_COORDINATORS } from '../../data/workshopsData';
import certifiedCourseFullHouseFlyer from '../../images/Announcements/aoa-certified-course-full-house-2026.png';
import criticalCareProgrammePage1 from '../../images/Workshops/critical-care-course-programme-page-1.jpg';
import criticalCareProgrammePage2 from '../../images/Workshops/critical-care-course-programme-page-2.jpg';

const COURSE_PROGRAMME = [
  { src: criticalCareProgrammePage1, alt: 'AOA Certified Obstetric Critical Care Course programme day 1' },
  { src: criticalCareProgrammePage2, alt: 'AOA Certified Obstetric Critical Care Course programme day 2' },
];

const AOACertificateCoursePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <WorkshopFlyerModal
        title="AOA Certified Obstetric Critical Care Course"
        image={certifiedCourseFullHouseFlyer}
        imageAlt="AOA Certified Obstetric Critical Care Course full house and registration closed announcement"
      />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
              return;
            }
            navigate('/workshops');
          }}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-base font-semibold hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <section className="mt-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#f59e0b] to-[#f97316]" />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              AOA Certified Course in Obstetric Critical Care
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
              Dedicated certificate-track academic module under AOACON 2026 with limited seats and mandatory conference
              registration.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold tracking-wide uppercase text-slate-500">Key Details</p>
              <ul className="mt-3 space-y-2 text-base text-slate-800">
                <li>Dates: 29th and 30th October 2026</li>
                <li>Conference + AOA Certified Course bundle: Rs 13,000 / 16,000 + GST (AOA / Non-AOA)</li>
                <li>Applicable only for practitioners (AOA and Non-AOA)</li>
                <li>Limited to 50 participants</li>
                <li>Conference registration is mandatory</li>
                <li>No spot registration</li>
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <p className="text-sm font-semibold tracking-wide uppercase text-amber-700">How This Is Different</p>
              <ul className="mt-3 space-y-2 text-base text-slate-800">
                <li>This is a separate certificate track, not a workshop slot.</li>
                <li>You must choose either the Workshop track or the AOA Certified Course during registration.</li>
                <li>Seats are limited and managed independently.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <p className="text-sm font-semibold tracking-wide uppercase text-amber-700">National Co-Ordinators</p>
              <ul className="mt-3 space-y-2 text-base text-slate-800">
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

        <ProgrammeFlyer
          title="AOA Certified Course in Obstetric Critical Care"
          images={COURSE_PROGRAMME}
          accent="from-[#4f46a5] via-[#6158c7] to-[#f59e0b]"
        />
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default AOACertificateCoursePage;
