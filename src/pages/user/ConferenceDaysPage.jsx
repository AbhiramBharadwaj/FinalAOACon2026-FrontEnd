import { Calendar } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';

const ConferenceDaysPage = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-10 lg:py-16 pb-24">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl p-6 lg:p-10 text-center shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#9c3253]/10 border border-[#9c3253]/20 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-[#9c3253]" />
          </div>
          <h1 className="mt-4 text-2xl lg:text-3xl font-semibold text-slate-900">
            Program Schedule
          </h1>
          <p className="mt-2 text-sm lg:text-base text-slate-600">
            Coming soon. We’ll share the full agenda closer to the conference dates.
          </p>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default ConferenceDaysPage;
