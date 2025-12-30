import { MapPin, Phone, Mail, Building2, Navigation2, Users } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';

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
                    AOACON 2026 • Contact & Secretariat
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
                      Contact, Secretariat & Professional Conference Organizer
                    </h1>
                    <p className="mt-2 text-sm sm:text-[15px] text-slate-100/90">
                      Reach out to the Conference Secretariat at SIMS, SHIVAMOGGA  and the
                      Professional Conference Organizer in Shivamogga for all queries on the
                      scientific program, registration and accommodation.
                    </p>
                  </div>
                </div>

                {}
                <div className="shrink-0 rounded-2xl bg-white/10 border border-white/30 px-4 py-3 text-xs sm:text-sm text-slate-100 shadow-md">
                  <p className="font-semibold mb-1">Quick Links</p>
                  <p>Secretariat: SIMS, SHIVAMOGGA , Karnataka</p>
                  <p>PCO Office: Karnataka</p>
                  <p className="mt-1 text-[11px] text-slate-100/80">
                    Phone & email contacts listed below for direct coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 sm:px-5 py-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Conference Secretariat
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/80 text-emerald-800 border border-emerald-200">
                SIMS, SHIVAMOGGA 
              </span>
            </div>

            {}
            <div className="text-sm text-slate-800 space-y-1">
              <p className="font-semibold text-slate-900">Office Address</p>
              <p>
                Room No. 426, Academic Block,
                <br />
                All India Institute of Medical Sciences (AIIMS),
                <br />
                Bhubaneswar, Karnataka, India.
              </p>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-800">
              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3 space-y-2">
                <div>
                  <p className="font-semibold text-slate-900">Prof. (Dr.) Swagata Tripathy</p>
                  <p className="text-[12px] text-slate-600">(Organising Chairperson)</p>
                  <p className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    8763400534
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Prof. (Dr.) Neha Singh</p>
                  <p className="text-[12px] text-slate-600">(Organising Secretary)</p>
                  <p className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    9438884045
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3 space-y-2">
                <div>
                  <p className="font-semibold text-slate-900">Dr. Aparajita Panda</p>
                  <p className="text-[12px] text-slate-600">(Jt. Organising Secretary)</p>
                  <p className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    9438884118
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Dr. Soumya Samal</p>
                  <p className="text-[12px] text-slate-600">(Jt. Organising Secretary)</p>
                  <p className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    7978041867
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3 text-sm text-slate-800">
              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3">
                <p className="font-semibold text-slate-900">Dr. Sritam Swarup Jena</p>
                <p className="text-[12px] text-slate-600">(Treasurer)</p>
                <p className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  8951614718
                </p>
              </div>
              <div className="rounded-xl bg-white/90 border border-emerald-100 px-3 py-3">
                <p className="font-semibold text-[13px] text-slate-900 mb-1">Email</p>
                <p className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <a
                    href="mailto:2025aoa@gmail.com"
                    className="text-[#005aa9] hover:underline break-all"
                  >
                    2025aoa@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 sm:px-5 py-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                Professional Conference Organizer
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/80 text-amber-800 border border-amber-200">
                Meetings n More
              </span>
            </div>

            {}
            <div className="text-sm text-slate-800 space-y-1">
              <p className="font-semibold text-slate-900">Office Address</p>
              <p>
                Unit No. 604, Millennium Plaza, Tower B,
                <br />
                Sector 27, Shivamogga, Haryana – 122002, India.
              </p>
            </div>

            {}
            <div className="rounded-xl bg-white/90 border border-amber-100 px-3 py-3 text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Project Manager</p>
              <p className="text-slate-900">Ms. Pooja Sharma</p>
              <p className="flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 96274 75770
              </p>
              <p className="mt-2 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a
                  href="mailto:corporate@meetingsnmore.com"
                  className="text-[#005aa9] hover:underline break-all"
                >
                  corporate@meetingsnmore.com
                </a>
              </p>
              <p className="mt-1">
                Web:{' '}
                <a
                  href="https://www.meetingsnmore.com/mnm/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#005aa9] hover:underline break-all"
                >
                  www.meetingsnmore.com
                </a>
              </p>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-800">
              <div className="rounded-xl bg-white/90 border border-amber-100 px-3 py-3">
                <p className="font-semibold text-[13px] text-slate-900">Registration Incharge</p>
                <p className="font-semibold text-slate-900">Mr. Rohit Kamra</p>
                <p className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 98189 65679
                </p>
              </div>
              <div className="rounded-xl bg-white/90 border border-amber-100 px-3 py-3">
                <p className="font-semibold text-[13px] text-slate-900">Accommodation Incharge</p>
                <p className="font-semibold text-slate-900">Mr. Shekhar Dhingra</p>
                <p className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 99535 70019
                </p>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-5">
          {}
        

          {}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 sm:px-5 py-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-indigo-700" />
              SHIVAMOGGA INSTITUTE OF MEDICAL SCIENCES
            </h3>
            <div className="rounded-xl overflow-hidden border border-indigo-200 bg-white h-64">
             <iframe
                title="SIMS Shivamogga Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.4355478976645!2d75.56427190859682!3d13.932652586421902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbba8d0bb6c8adf%3A0xc7be084ea62ac67d!2sSHIVAMOGGA%20INSTITUTE%20OF%20MEDICAL%20SCIENCES!5e0!3m2!1sen!2sin!4v1766322471387!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          
          </div>
        </section>
      </div>

      <MobileNav />
    </div>
  );
};

export default ContactPage;
