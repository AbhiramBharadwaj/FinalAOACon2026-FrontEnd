import { useEffect, useState } from 'react';
import { MapPin, Clock, Stethoscope, Building2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import logo from '../../images/main-logo.png';
import virupakshappaImg from '../../images/OrganizingComittee/Virupakshappa.jpg';
import ravindraImg from '../../images/OrganizingComittee/GL-Ravindra.jpg';
import champaImg from '../../images/OrganizingComittee/Champa.jpg';
import ashwiniImg from '../../images/OrganizingComittee/Ashwini.png';

const targetDate = new Date('2026-10-30T09:00:00+05:30');

const HomePage = () => {
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />

      {}
      <section className="relative border-b border-slate-300 bg-[#0d47a1] text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('https://secureadmissions.in/wp-content/uploads/2025/06/10980_index_20.gif')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d47a1] via-[#1976d2] to-[#00838f] opacity-95" />

        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {}
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1976d2] border border-sky-300 text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.22em]">
                AOACON 2026 • SHIVAMOGGA
              </div>

              <h1 className="text-[34px] sm:text-[40px] lg:text-[48px] font-extrabold leading-tight uppercase">
                19 National Conference
                <span className="block">of Association of Obstetric</span>
                <span className="block">Anaesthesiologists</span>
              </h1>

              <p className="text-[20px] sm:text-[20px] text-white font-semibold uppercase tracking-[0.28em] font-serif">
                Theme 2026
              </p>
              <p className="text-[20px] sm:text-[20px] text-slate-100 leading-relaxed max-w-3xl font-serif">
                Safe Motherhood everywhere: Bridging the Urban - Rural Gap in Obstetric
                Anaesthesia
              </p>

              <div className="space-y-3 text-[20px] text-slate-100 leading-relaxed font-serif">
                <p>
                  <span className="font-semibold text-white">Organized and hosted by:</span>{' '}
                  Department of Anaesthesiology, SIMS &amp; ISA City Chapter, Shivamogga
                </p>
              </div>
            </div>

            {}
            <div className="space-y-5">
              <div className="bg-[#0b3c7d] border border-sky-300 px-5 py-5">
                <div className="flex items-center gap-2 mb-3 text-[18px] font-semibold">
                  <Clock className="w-5 h-5" />
                  <span>Conference starts in</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center justify-center bg-[#0d47a1] border border-sky-300 px-3 py-2 text-center"
                    >
                      <span className="text-[20px] font-bold leading-none">
                        {item.value}
                      </span>
                      <span className="text-[12px] uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden sm:block bg-white border border-slate-300">
                <img
                  src={logo}
                  alt="AOACON 2026 Shivamogga"
                  className="w-full h-56 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-[#f9a825] text-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center bg-[#0b7d5f] border border-emerald-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.25em] uppercase">
                Official venue
              </p>
              <p className="text-[18px] font-semibold">
                 Auditorium, 1st Floor, Shimoga Institute of Medical Sciences (SIMS), Shivamogga, Karnataka
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-white py-12 lg:py-14">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="space-y-5">
            <h2 className="text-[26px] lg:text-[28px] font-bold text-slate-900 leading-snug">
              Pranams  and  greetings,
            </h2>
            <div className="space-y-4 text-[18px] text-slate-800 leading-relaxed text-justify">
              <p>
                It gives us great pleasure to welcome you to the 19th National Conference of Obstetric Anaesthesiologists, 
                proudly hosted by the Department of Anaesthesiology, SIMS and the ISA City Chapter, Shivamogga. 
                The conference will be held at the Shimoga Institute of Medical Sciences, located in the serene, 
                culturally rich city and gateway of the Western Ghats, Shivamogga, Karnataka.
              </p>
              <p>
                It is concerning to our fraternity that despite the advances in the medical field, 
                there exists a significant gap between urban and rural perioperative maternal care contributing 
                to maternal morbidity and mortality in India. This year's theme highlights the vital need to ensure equitable, 
                evidence-based and safe obstetric anaesthesia services across diverse healthcare settings. 
                This prestigious gathering brings together experts, practitioners, 
                and learners in the field of obstetric anaesthesia to share knowledge, discuss advances, 
                and explore innovations that continue to shape safe motherhood 
                and perioperative care and address the challenges faced in both 
                resource-rich and resource-limited environments. The conference promises a 
                vibrant academic program featuring distinguished speakers, interactive sessions, 
                hands-on workshops, and opportunities to engage with peers from across the region and beyond.
              </p>
              <p>
                Set amidst the lush landscapes of Karnataka, Shivamogga offers the perfect backdrop for academic exchange and rejuvenation.
              </p>
              <p>
                We warmly invite you to join us in Shivamogga for an enriching scientific experience amidst a welcoming environment. 
                Together, let us work towards narrowing the urban–rural gap and shaping safe motherhood everywhere.
              </p>
              <p className="font-semibold">
                We look forward to your participation.
                <span className="block mt-2 font-normal">
                  Regards,<br/>
The Organizing committee<br/>
AOACON 2026<br/>
Department of Anaesthesiology, Shimoga Institute of Medical Sciences (SIMS) and ISA City Chapter, Shivamogga<br/>
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { name: 'Dr. Virupakshappa V', title: 'Chief Patron', img: virupakshappaImg },
                { name: 'Dr. Ravindra G L', title: 'Organizing Chairperson', img: ravindraImg },
                { name: 'Dr. Champa B V', title: 'Organizing Secretary', img: champaImg },
                { name: 'Dr. Ashwini S', title: 'Treasurer', img: ashwiniImg },
              ].map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-600">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-12 lg:py-14">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="bg-white border border-slate-100 rounded-lg p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-[26px] lg:text-[28px] font-bold text-slate-900">
                Conference Highlights
              </h2>
            </div>

            <div className="space-y-5 text-[16px] text-slate-800">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  1. AOA‑Certified Course in Obstetric Critical Care
                </p>
                <p>
                  An exclusive two‑day workshop on obstetric critical care, designed to empower
                  practitioners with the clinical skills necessary to manage high‑risk obstetric
                  cases in perioperative setups. The course will be held on 29th & 30th Oct 2026.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-900">2. Pre‑Conference Workshops</p>
                <p>
                  <span className="font-semibold">Choose your workshop</span> from our skill‑oriented, hands‑on sessions.
                  These sessions focus on practical training, updated protocols, and real‑life clinical
                  scenarios relevant to obstetric anaesthesia practice.
                </p>
                
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  3. Lectures, Debates & Panel Discussions
                </p>
                <p>
                  Lectures, debates and panel discussions with esteemed national and international
                  faculty, bringing vast clinical experience, academic excellence, and global
                  perspectives in obstetric anaesthesia and critical care.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-900">4. Live Master Classes from Experts</p>
                <p>
                  Interactive live master classes featuring expert demonstrations, advanced
                  techniques, and case‑based discussions to enhance practical understanding and
                  clinical decision‑making.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-900">5. Attractive competitions for delegates</p>
                <p>
                  Partake in our various competitions spread throughout the conference days and win attractive prizes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-[#880e4f] py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-3 mb-7">
            <Stethoscope className="w-6 h-6 text-rose-100" />
            <h2 className="text-[24px] font-bold text-white">
              Pre Conference Workshops (30th Oct 2026 )
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[18px]">
            <div className="bg-[#fff3cd] border border-amber-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-amber-900 mb-2">
                Labour Analgesia
              </p>
            </div>
            <div className="bg-[#fde4f2] border border-rose-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-rose-900 mb-2">
                Critical Incidences in Obstetric Anaesthesia
              </p>
            </div>
            <div className="bg-[#e0f2ff] border border-sky-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-sky-900 mb-2">
                POCUS in Obstetrics
              </p>
            </div>
            <div className="bg-[#e3fcec] border border-emerald-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-emerald-900 mb-2">
                Maternal Resuscitation + Obstetric Regional Blocks
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-[#e3f2fd] py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="bg-white border border-slate-300">
              <img
                src="https://thecollegesphere.com/wp-content/uploads/2025/09/Shimoga-Institute-of-Medical-Sciences.gif"
                alt="Shivamogga campus"
                className="w-full h-60 lg:h-64 object-cover"
                loading="lazy"
              />
            </div>
            <div className="bg-white border border-slate-300">
              <iframe
                title="SIMS Shivamogga Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.4355478976645!2d75.56427190859682!3d13.932652586421902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbba8d0bb6c8adf%3A0xc7be084ea62ac67d!2sSHIVAMOGGA%20INSTITUTE%20OF%20MEDICAL%20SCIENCES!5e0!3m2!1sen!2sin!4v1766322471387!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#0b60a8]" />
              <h2 className="text-[24px] font-bold text-slate-900">
                Shivamogga & Shimoga Institute of Medical Sciences
              </h2>
            </div>
            <p className="text-[18px] text-slate-800 leading-relaxed">
              Shivamogga, known as the gateway to the Western Ghats, offers rivers, waterfalls
              and dense greenery along with a vibrant educational ecosystem.
            </p>
            <p className="text-[18px] text-slate-800 leading-relaxed">
              Shimoga Institute of Medical Sciences (SIMS) is a government medical college with a
              busy tertiary‑care hospital and well‑equipped operation theatre complex – an ideal
              hub for an obstetric anaesthesia conference.
            </p>

            <div className="bg-white border border-lime-400 px-5 py-5 text-[15px]">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-lime-700" />
                <p className="font-semibold text-slate-900 text-[17px]">
                  Venue snapshot
                </p>
              </div>
              <ul className="text-slate-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold mt-[3px]">•</span>
                  Plenary halls, seminar rooms and skills‑lab spaces
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold mt-[3px]">•</span>
                  Proximity to district hospital and critical care areas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold mt-[3px]">•</span>
                  Easy access from bus stand and railway station
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {}
      

      <Footer />
    </div>
  );
};

export default HomePage;
