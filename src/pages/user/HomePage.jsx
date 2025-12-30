import { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Stethoscope,
  HeartPulse,
  Building2,
} from 'lucide-react';
import Header from '../../components/common/Header';
import logo from '../../images/main-logo.png';

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
            <div className="lg:col-span-2 space-y-5">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#1976d2] border border-sky-300 text-[18px] font-semibold">
                <Users className="w-5 h-5" />
                19th Annual Conference • AOA
              </div>

              <p className="text-[13px] sm:text-[14px] tracking-[0.3em] uppercase text-sky-100">
                AOACON 2026 • Shivamogga
              </p>
              <h1 className="text-[30px] sm:text-[32px] lg:text-[34px] font-bold leading-snug">
                Association of Obstetric Anaesthesiologists Conference
              </h1>

              <p className="text-[18px] text-slate-100 leading-relaxed">
                Hosted by the Department of Anaesthesiology, Shimoga Institute of Medical
                Sciences (SIMS) and ISA City Chapter, Shivamogga – at the gateway to the
                Western Ghats.
              </p>

              <div className="flex flex-wrap gap-3 text-[15px]">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b3c7d] border border-sky-300">
                  <Calendar className="w-5 h-5" />
                  30 Oct – 1 Nov 2026
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b3c7d] border border-sky-300">
                  <MapPin className="w-5 h-5" />
                  Shimoga Institute of Medical Sciences, Shivamogga
                </span>
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
                Shimoga Institute of Medical Sciences (SIMS), Shivamogga, Karnataka
              </p>
            </div>
          </div>
          <p className="text-[15px]">
            OT complex and academic blocks provide spaces for plenaries, workshops and
            hands‑on training.
          </p>
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-white py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-[26px] lg:text-[28px] font-bold text-slate-900 leading-snug">
              Welcome to the 19th Annual Conference of Association of Obstetric
              Anaesthesiologists
            </h2>
            <div className="space-y-4 text-[18px] text-slate-800 leading-relaxed">
              <p>
                It gives great pleasure to welcome you to the 19th Annual Conference of Obstetric
                Anaesthesiologists, hosted by the Department of Anaesthesiology, SIMS, and the ISA
                City Chapter, Shivamogga.
              </p>
              <p>
                Despite advances, gaps persist between urban and rural perioperative maternal
                care. The meeting focuses on equitable, evidence‑based, and safe obstetric
                anaesthesia across all levels of healthcare.
              </p>
              <p>
                AOACON 2026 brings together experts, practitioners, and learners to share
                knowledge, discuss advances, and explore innovations that shape safe motherhood in
                different practice settings.
              </p>
              <p>
                Amidst the landscapes of Karnataka, Shivamogga offers a balance of academic
                intensity and natural rejuvenation. Join the effort to narrow the urban–rural gap
                and support safe motherhood everywhere.
              </p>
              <p className="font-semibold">
                We look forward to your participation.
                <span className="block mt-2 text-[15px] font-normal">
                  Organising Committee, AOACON 2026
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#7cb342] border border-slate-300 px-6 py-6 space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center bg-white border border-rose-300">
                <HeartPulse className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-[12px] font-semibold tracking-[0.25em] uppercase text-rose-100">
                  Theme 2026
                </p>
                <p className="text-[18px] font-semibold">
                  Bridging the Urban–Rural Gap in Obstetric Anaesthesia
                </p>
              </div>
            </div>
            <p className="text-[15px] text-slate-100 leading-relaxed">
              Emphasis on equitable access, critical care readiness, and context‑appropriate
              protocols for every mother, everywhere.
            </p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxvHBBYogt3GOpiDFNm90puXa7oo2DlPP2Qg&s"
              alt="Theme"
              className="w-full h-44 object-cover border border-rose-200"
            />
          </div>
        </div>
      </section>

      {}
      <section className="border-b border-slate-300 bg-[#880e4f] py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-3 mb-7">
            <Stethoscope className="w-6 h-6 text-rose-100" />
            <h2 className="text-[24px] font-bold text-white">
              Focus Tracks & Hands‑On Workshops
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[18px]">
            <div className="bg-[#e3fcec] border border-emerald-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-emerald-900 mb-2">
                Obstetric Critical Care & Resuscitation
              </p>
              <p className="text-slate-800">
                Protocol‑driven management of haemorrhage, sepsis, shock and peri‑arrest
                scenarios with simulation‑supported learning.
              </p>
            </div>
            <div className="bg-[#e0f2ff] border border-sky-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-sky-900 mb-2">
                Obstetric RA & POCUS
              </p>
              <p className="text-slate-800">
                Neuraxial techniques, peripheral nerve blocks, and bedside ultrasound for
                optimised obstetric anaesthesia and critical care.
              </p>
            </div>
            <div className="bg-[#fff3cd] border border-amber-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-amber-900 mb-2">
                Labour Analgesia
              </p>
              <p className="text-slate-800">
                Practical epidural strategies, combined techniques, and labour analgesia
                pathways tailored to different practice settings.
              </p>
            </div>
            <div className="bg-[#fde4f2] border border-rose-400 px-5 py-5">
              <p className="font-semibold text-[17px] text-rose-900 mb-2">
                Critical Incidences, Simulation & Nursing Track
              </p>
              <p className="text-slate-800">
                High‑impact scenarios, crisis resource management, and obstetric emergencies
                for nurses and allied staff.
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
      <section className="bg-slate-200 border-t border-slate-300 py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-[#0b60a8]" />
            <h2 className="text-[24px] font-bold text-slate-900">
              Organising team highlights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[18px]">
            <div className="bg-white border border-slate-300 px-5 py-5">
              <p className="font-semibold text-[17px] mb-3 text-slate-900">
                Core committee
              </p>
              <p className="text-slate-800 leading-relaxed">
                Organising Chairperson, Secretary, Treasurer and senior SIMS faculty overseeing
                academic content, logistics and delegate experience.
              </p>
            </div>
            <div className="bg-white border border-slate-300 px-5 py-5">
              <p className="font-semibold text-[17px] mb-3 text-slate-900">
                Scientific & workshop committee
              </p>
              <p className="text-slate-800 leading-relaxed">
                Team curating symposia, panels, simulation tracks and hands‑on workshops across
                key themes.
              </p>
            </div>
            <div className="bg-white border border-slate-300 px-5 py-5">
              <p className="font-semibold text-[17px] mb-3 text-slate-900">
                Hospitality & cultural
              </p>
              <p className="text-slate-800 leading-relaxed">
                Reception, travel, food and cultural teams ensuring smooth registrations, stay
                and a memorable flavour of Shivamogga.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
