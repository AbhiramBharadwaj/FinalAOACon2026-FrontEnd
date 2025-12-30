import { MapPin, Calendar, Building2, Navigation2 } from 'lucide-react';
import Header from '../../components/common/Header';

const VenuePage = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="mx-auto pb-20">
        {}
         <section className="overflow-hidden border border-slate-200 bg-slate-900 text-white">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  'url(https://secureadmissions.in/wp-content/uploads/2025/06/10980_index_20.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-800/90" />

            <div className="relative px-6 lg:px-8 py-10 lg:py-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-semibold leading-tight">
                  Conference Venue – AOACON 2026
                </h1>
              </div>
              <p className="text-base lg:text-lg max-w-4xl text-slate-200/95 leading-relaxed mb-8 lg:mb-10">
                AOACON 2026 will be held at Shivamogga Institute of Medical Sciences (SIMS),
                Shivamogga. The operation theatre complex and academic areas provide a dedicated
                setting for scientific sessions, workshops, and hands‑on training.
              </p>
              <div className="flex flex-wrap gap-4 text-sm lg:text-base">
                <span className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/15 border border-white/30 font-medium">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-200" />
                  30 Oct – 1 Nov 2026
                </span>
                <span className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/15 border border-white/30 font-medium">
                  <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-sky-200" />
                  SIMS, Shivamogga, Karnataka, India
                </span>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="border-b border-slate-300 bg-slate-50 px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 lg:w-7 lg:h-7 text-[#0b60a8]" />
              Shivamogga Institute of Medical Sciences (SIMS), Shivamogga
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[16px]">
              <p className="text-slate-800 leading-relaxed">
                Shivamogga Institute of Medical Sciences is a government medical college and
                teaching hospital that caters to a large population of central Karnataka. The
                institute combines a busy tertiary‑care hospital, modern operation theatre
                complex, and dedicated academic spaces, making it an ideal venue for AOACON 2026.
              </p>
              <p className="text-slate-800 leading-relaxed">
                Scientific sessions, symposia, and workshops will be conducted in lecture halls,
                seminar rooms, and OT‑adjacent areas, closely integrating academic content with
                live clinical practice and case‑based discussions.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="border-b border-[#c4dcff] bg-[#9c3253] px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-white mb-6">
              Conference Secretariat
            </h2>
            <h2 className="text-white">------------------------------------------------------------------</h2>
            <div className="text-[16px] text-white leading-relaxed space-y-4">
              <p className="font-semibold text-[18px]">
                3rd floor, Department of Anaesthesia,
                <br />
                Operation Theatre Complex,
                <br />
                Shivamogga Institute of Medical Sciences (SIMS),
                <br />
                Shivamogga, Karnataka, India.
              </p>
              <p>
                All scientific communication, registration‑related queries, and on‑site
                coordination will be handled through the conference secretariat located in the OT
                complex at SIMS.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="border-b border-[#dcc8ff] bg-[#f3ecff] px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-slate-900 mb-8">
              Campus & Facility Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-[#9c3253] border border-[#dcc8ff] px-5 py-5 lg:px-6 lg:py-6">
                <p className="font-semibold text-[17px] text-white mb-4">
                  Academic spaces
                </p>
                <ul className="space-y-2 text-[15px] text-white">
                  <li>• Lecture theatres with AV support</li>
                  <li>• Seminar rooms for symposia</li>
                  <li>• Break‑out areas for small‑group sessions</li>
                </ul>
              </div>
              <div className="bg-[#f9a825] border border-[#dcc8ff] px-5 py-5 lg:px-6 lg:py-6">
                <p className="font-semibold text-[17px] text-white mb-4">
                  Clinical infrastructure
                </p>
                <ul className="space-y-2 text-[15px] text-white">
                  <li>• Multi‑theatre OT complex</li>
                  <li>• High‑dependency and ICU facilities</li>
                  <li>• Large obstetric & surgical case load</li>
                </ul>
              </div>
              <div className="bg-[#7cb342] border border-[#dcc8ff] px-5 py-5 lg:px-6 lg:py-6">
                <p className="font-semibold text-[17px] text-white mb-4">
                  Delegate comfort
                </p>
                <ul className="space-y-2 text-[15px] text-white">
                  <li>• Easy access from bus stand and station</li>
                  <li>• Nearby hotels & guest houses</li>
                  <li>• Cafeteria, pharmacy & ATM around campus</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="border-b border-[#ffd7a8] bg-[#f9a825] px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-slate-900 mb-8">
              Campus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                'https://secureadmissions.in/wp-content/uploads/2025/06/10980_index_20.gif',
                'https://thecollegesphere.com/wp-content/uploads/2025/09/Shimoga-Institute-of-Medical-Sciences.gif',
                'https://content.jdmagicbox.com/comp/shimoga/k9/9999p8182.8182.221202231357.f7k9/catalogue/shimoga-institute-of-medical-sciences-sagar-road-shimoga-institutes-for-medical-courses-pwuinlqaru.jpg',
                'https://i3c-medical-colleges-assets.blr1.digitaloceanspaces.com/2020/10/28/117b72f6af5344d68ab4fa1e47b758b8.jpg',
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden border border-[#ffd7a8] bg-white"
                >
                  <img
                    src={src}
                    alt="SIMS campus"
                    className="w-full h-32 lg:h-40 object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section className="bg-[#e7f7ef] border border-[#b9e4cf] px-6 lg:px-8 py-10 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Navigation2 className="w-6 h-6 lg:w-7 lg:h-7 text-[#0b60a8]" />
              How to reach SIMS, Shivamogga
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-2 border border-[#b9e4cf] bg-white">
                <iframe
                  title="SIMS Shivamogga Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.24364409746!2d75.5607!3d13.9345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbbaef6b7f5ad4b%3A0x7a27d2c2db4c9f82!2sShimoga%20Institute%20of%20Medical%20Sciences!5e0!3m2!1sen!2sin!4v1700000000001"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="text-[16px] text-slate-800 space-y-6">
                <div>
                  <p className="font-semibold text-[18px] mb-4 text-slate-900">
                    Travel information
                  </p>
                  <ul className="space-y-2 text-[15px]">
                    <li>• Nearest railway stations: Shivamogga Town / Central</li>
                    <li>• KSRTC bus stand within short driving distance</li>
                    <li>• Taxis and auto‑rickshaws easily available</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[18px] mb-4 text-slate-900">
                    Local tips
                  </p>
                  <ul className="space-y-2 text-[15px]">
                    <li>• Keep some time buffer for traffic during peak hours</li>
                    <li>• October–November usually offers comfortable weather</li>
                    <li>• Plan nearby sightseeing before or after the conference</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VenuePage;
