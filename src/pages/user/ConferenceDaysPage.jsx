import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, X } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import hallADay1Page1 from '../../images/Scientific Program/HALLA-DAY1-Page1.jpg';
import hallADay1Page2 from '../../images/Scientific Program/HALLA-DAY1-Page2.jpg';
import hallADay2 from '../../images/Scientific Program/HALLA-DAY2.jpg';
import hallBDay1 from '../../images/Scientific Program/HALLB-DAY1.jpg';
import hallBDay2 from '../../images/Scientific Program/HALLB-DAY2.jpg';
import hallCDay1 from '../../images/Scientific Program/HALLC-DAY1.jpg';

const PROGRAM_HALLS = [
  {
    id: 'hall-a',
    name: 'Hall A',
    accent: 'from-[#9a6d1f] via-[#d5a63f] to-[#f0d38b]',
    summary: 'Day-wise scientific program flyers for Hall A.',
    days: [
      {
        id: 'hall-a-day-1',
        dayLabel: 'Day 1',
        displayDate: 'Saturday, 31-10-2026',
        images: [
          { src: hallADay1Page1, alt: 'Hall A Day 1 scientific program flyer page 1' },
          { src: hallADay1Page2, alt: 'Hall A Day 1 scientific program flyer page 2' },
        ],
      },
      {
        id: 'hall-a-day-2',
        dayLabel: 'Day 2',
        displayDate: 'Sunday, 01-11-2026',
        images: [{ src: hallADay2, alt: 'Hall A Day 2 scientific program flyer' }],
      },
    ],
  },
  {
    id: 'hall-b',
    name: 'Hall B',
    accent: 'from-[#7b2f46] via-[#b24462] to-[#e49b6c]',
    summary: 'Day-wise scientific program flyers for Hall B.',
    days: [
      {
        id: 'hall-b-day-1',
        dayLabel: 'Day 1',
        displayDate: 'Saturday, 31-10-2026',
        images: [{ src: hallBDay1, alt: 'Hall B Day 1 scientific program flyer' }],
      },
      {
        id: 'hall-b-day-2',
        dayLabel: 'Day 2',
        displayDate: 'Sunday, 01-11-2026',
        images: [{ src: hallBDay2, alt: 'Hall B Day 2 scientific program flyer' }],
      },
    ],
  },
  {
    id: 'hall-c',
    name: 'Hall C',
    accent: 'from-[#334155] via-[#475569] to-[#94a3b8]',
    summary: 'Day-wise scientific program flyers for Hall C.',
    days: [
      {
        id: 'hall-c-day-1',
        dayLabel: 'Day 1',
        displayDate: 'Friday, 30-10-2026',
        images: [{ src: hallCDay1, alt: 'Hall C Day 1 scientific program flyer' }],
      },
    ],
  },
];

const ConferenceDaysPage = () => {
  const [openHallId, setOpenHallId] = useState(PROGRAM_HALLS[0]?.id ?? '');
  const [selectedDayId, setSelectedDayId] = useState('');
  const activeHall = PROGRAM_HALLS.find((hall) => hall.id === openHallId) ?? PROGRAM_HALLS[0];
  const selectedHall = PROGRAM_HALLS.find((hall) => hall.days.some((day) => day.id === selectedDayId)) ?? null;
  const selectedDayBase = selectedHall?.days.find((day) => day.id === selectedDayId) ?? null;
  const selectedDay = selectedDayBase ? { ...selectedDayBase, hall: selectedHall?.name ?? '' } : null;

  const handleHallSelect = (hallId) => {
    const nextHall = PROGRAM_HALLS.find((hall) => hall.id === hallId);
    setOpenHallId(hallId);
    if (!nextHall?.days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,11,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(12,74,110,0.14),_transparent_28%),linear-gradient(180deg,_#f8f4ec_0%,_#f2ede5_100%)]" />

      <Header />

      {selectedDay ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-3 py-6 backdrop-blur-md sm:px-6">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedDayId('')}
            aria-hidden="true"
          />

          <div className="relative z-[81] max-h-full w-full max-w-5xl overflow-hidden border border-white/25 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a2f]">
                  {selectedDay.hall}
                </p>
                <h2 className="text-base font-semibold text-slate-900 sm:text-xl">
                  {selectedDay.dayLabel}: {selectedDay.displayDate}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayId('')}
                className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>

            <div className="max-h-[calc(100vh-7rem)] overflow-y-auto bg-[#f6f1e8] p-3 sm:p-5">
              <div className="space-y-4">
                {selectedDay.images.map((image, index) => (
                  <figure
                    key={`${selectedDay.id}-${index}`}
                    className="overflow-hidden border border-[#ded2bd] bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full object-contain"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-3 pb-24 pt-6 sm:px-4 lg:px-6 lg:pt-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#d8c8a8] bg-[#1f2937] text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.32),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_28%)]" />
            <div className="relative px-5 py-8 sm:px-7 lg:px-10 lg:py-12">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  AOA CON 2026 Scientific Program
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-300">
                    Conference Schedule
                  </p>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                    Scientific Program
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-justify text-slate-300 sm:text-base">
                    Access the day-wise scientific programme for each hall. Select the relevant hall and date to view the schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 border border-[#ded2bd] bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-semibold leading-tight text-slate-900 sm:text-2xl">
              Select a hall, then open a day
            </h2>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {PROGRAM_HALLS.map((hall) => {
              const isOpen = openHallId === hall.id;
              const Icon = isOpen ? ChevronDown : ChevronRight;

              return (
                <div key={hall.id} className="overflow-hidden border border-[#e7ddcf] bg-white">
                  <button
                    type="button"
                    onClick={() => handleHallSelect(hall.id)}
                    className={`w-full bg-gradient-to-r ${hall.accent} px-4 py-3 text-left text-slate-950 transition hover:opacity-95 sm:px-5`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-900/65">
                          Hall
                        </p>
                        <h3 className="mt-1 text-lg font-semibold sm:text-2xl">{hall.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-900/75">{hall.summary}</p>
                      </div>
                      <span className="flex h-8.5 w-8.5 items-center justify-center border border-slate-900/15 bg-white/40 sm:h-10 sm:w-10">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-[#efe7db] p-3">
                      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
                        {hall.days.map((day) => {
                          const isActive = day.id === selectedDayId;

                          return (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => setSelectedDayId(day.id)}
                              className={`px-3.5 py-2.5 text-left transition ${
                                isActive
                                  ? 'bg-[#1f2937] text-white shadow-lg'
                                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#8a6a2f]/40 hover:bg-white'
                              }`}
                            >
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                                {day.dayLabel}
                              </div>
                              <div className="mt-1 text-sm font-semibold leading-5 sm:text-base sm:leading-6">
                                {day.displayDate}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ConferenceDaysPage;
