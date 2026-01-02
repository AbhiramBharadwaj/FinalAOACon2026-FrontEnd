import { Phone, Building2, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        {}
        <section className="mt-4 mb-6 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'url(https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#005aa9]/90 via-sky-700/85 to-[#009688]/90" />

            <div className="relative px-5 sm:px-8 py-7 sm:py-8 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/30 text-xs font-medium">
                    <Users className="w-4 h-4" />
                    AOACON 2026 • Contact
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
                      Conference Secretariat
                    </h1>
                    <p className="mt-2 text-sm sm:text-[15px] text-slate-100/90">
                      Shimoga Institute of Medical Sciences (SIMS), Shivamogga, Karnataka
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="mb-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 sm:px-5 py-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Conference Secretariat
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/80 text-emerald-800 border border-emerald-200">
                SIMS, Shivamogga
              </span>
            </div>

            {}
            <div className="text-sm text-slate-800 space-y-1">
              <p className="font-semibold text-slate-900">Office Address</p>
              <p>
                3rd Floor, Department of Anaesthesiology,
                <br />
                Operation Theatre Complex,
                <br />
                Shimoga Institute of Medical Sciences (SIMS),
                <br />
                Shivamogga, Karnataka, India
              </p>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-800">
              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3">
                <p className="font-semibold text-slate-900">Dr. Champa BV</p>
                <p className="text-[12px] text-slate-600">(Organizing Secretary)</p>
                <p className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  9740073702
                </p>
              </div>
              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3">
                <p className="font-semibold text-slate-900">Dr. Ashwini S</p>
                <p className="text-[12px] text-slate-600">(Treasurer)</p>
                <p className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  9980812398
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ContactPage;
