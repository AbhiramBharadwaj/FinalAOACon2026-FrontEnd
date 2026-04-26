import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import { CONFERENCE_HALLS } from '../../data/conferenceSchedule';

const formatSingleTime = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length !== 4) return value.trim();

  const hours24 = Number(digits.slice(0, 2));
  const minutes = Number(digits.slice(2, 4));
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const minutesText = String(minutes).padStart(2, '0');

  return `${hours12}.${minutesText}${suffix}`;
};

const formatTimeRange = (range) => {
  const cleaned = range.replace(/\s*Hrs\s*/i, '').trim();
  const singleDigits = cleaned.replace(/\D/g, '');
  if (!cleaned.includes('-') && singleDigits.length === 4) {
    return formatSingleTime(cleaned);
  }

  const parts = cleaned.split('-').map((part) => part.trim());
  if (parts.length !== 2) return cleaned;

  const startDigits = parts[0].replace(/\D/g, '').slice(0, 4);
  const endDigits = parts[1].replace(/\D/g, '').slice(0, 4);
  if (startDigits.length !== 4 || endDigits.length !== 4) return cleaned;

  const startFormatted = formatSingleTime(parts[0]).replace(/AM|PM$/, '');
  const endFormatted = formatSingleTime(parts[1]);

  return `${startFormatted} - ${endFormatted}`;
};

const AgendaContent = ({ day }) => {
  return (
    <div className="border-t border-[#efe7db] bg-[#fffdf9] p-3 sm:p-4">
      <div className="rounded-[1.15rem] border border-[#eadfce] bg-[linear-gradient(135deg,_#fbf6ee_0%,_#f6efe3_100%)] px-4 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2f]">
              {day?.hall ?? 'Schedule'}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-2xl">
              {day ? `${day.dayLabel}: ${day.displayDate}` : 'Select a hall and day'}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{day?.theme}</p>
          </div>
          
        </div>
      </div>

      {day?.agenda?.length ? (
        <div className="mt-3 space-y-3">
          <div className="space-y-2.5">
            {day.agenda.map((item, index) => {
              if (item.type === 'session-header') {
                return (
                  <div
                    key={`${item.type}-${item.time}-${index}`}
                    className="rounded-[1.2rem] border border-[#e7d7b5] bg-[linear-gradient(135deg,_#fff8df_0%,_#f7e8ae_100%)] px-4 py-3 shadow-[0_8px_24px_rgba(180,140,40,0.12)]"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a3b16]">
                          Session Block
                        </p>
                        <h4 className="mt-1 text-base font-semibold leading-snug text-[#7c2d12] sm:text-lg">
                          {item.title}
                        </h4>
                      </div>
                      <div className="rounded-full border border-[#d8b15d] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a2f]">
                        {formatTimeRange(item.time)}
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.type === 'break') {
                return (
                  <div
                    key={`${item.type}-${item.time}-${index}`}
                    className="rounded-[1.1rem] border border-slate-900 bg-slate-900 px-4 py-3 text-white"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                        {item.title}
                      </p>
                      <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        {formatTimeRange(item.time)}
                      </div>
                    </div>
                  </div>
                );
              }

              const isSpecial = item.type === 'special';

              return (
                <article
                  key={`${item.type}-${item.time}-${index}`}
                  className={`rounded-[1.1rem] border px-4 py-3 transition ${
                    isSpecial
                      ? 'border-[#d2d8e5] bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)]'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                    <div className="lg:w-44 lg:flex-none">
                      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {formatTimeRange(item.time)}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-[1.2rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-base font-semibold text-slate-900">Schedule coming next</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This hall and day container is already wired into the page.
          </p>
        </div>
      )}
    </div>
  );
};

const ConferenceDaysPage = () => {
  const [openHallId, setOpenHallId] = useState(CONFERENCE_HALLS[0]?.id ?? '');
  const [activeDayId, setActiveDayId] = useState(CONFERENCE_HALLS[0]?.days[0]?.id ?? '');
  const activeHall =
    CONFERENCE_HALLS.find((hall) => hall.id === openHallId) ?? CONFERENCE_HALLS[0];
  const activeDay =
    activeHall?.days.find((day) => day.id === activeDayId) ?? activeHall?.days?.[0] ?? null;

  const handleHallToggle = (hallId) => {
    if (hallId === openHallId) {
      setOpenHallId('');
      return;
    }

    const selectedHall = CONFERENCE_HALLS.find((hall) => hall.id === hallId);
    setOpenHallId(hallId);
    setActiveDayId(selectedHall?.days[0]?.id ?? '');
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,11,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(12,74,110,0.14),_transparent_28%),linear-gradient(180deg,_#f8f4ec_0%,_#f2ede5_100%)]" />

      <Header />

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
                    Scientific program schedule.
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-justify text-slate-300 sm:text-base">
                    This page shows the day-wise schedule for Hall A and Hall B with session timings,
                    talk titles, breaks, and program sections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.45rem] border border-[#ded2bd] bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-4.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              
              <h2 className="mt-1.5 text-lg font-semibold leading-tight text-slate-900 sm:text-2xl">
                Open a hall, then select a day
              </h2>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {CONFERENCE_HALLS.map((hall) => {
              const isOpen = openHallId === hall.id;
              const Icon = isOpen ? ChevronDown : ChevronRight;

              return (
                <div
                  key={hall.id}
                  className="overflow-hidden rounded-[1.2rem] border border-[#e7ddcf] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => handleHallToggle(hall.id)}
                    className={`w-full bg-gradient-to-r ${hall.accent} px-4 py-3 text-left text-slate-950 transition hover:opacity-95 sm:px-5`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-900/65">
                          Tap to {isOpen ? 'collapse' : 'expand'}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold sm:text-2xl">{hall.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-900/75">{hall.summary}</p>
                      </div>
                      <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-900/15 bg-white/40 sm:h-10 sm:w-10">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#efe7db] p-3">
                      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
                        {hall.days.map((day) => {
                          const isActive = day.id === activeDayId;

                          return (
                            <button
                              key={day.id}
                              type="button"
                              onClick={() => setActiveDayId(day.id)}
                              className={`rounded-[1rem] px-3.5 py-2.5 text-left transition ${
                                isActive
                                  ? 'bg-[#1f2937] text-white shadow-lg'
                                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#8a6a2f]/40 hover:bg-white'
                              }`}
                            >
                              <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                                {day.dayLabel}
                              </div>
                              <div className="mt-1 text-sm font-semibold leading-5 sm:text-base sm:leading-6">{day.displayDate}</div>
                              <div className="mt-0.5 text-xs opacity-70">
                                {day.status === 'live' ? 'Schedule available' : 'Coming next'}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {hall.id === activeHall?.id && activeDay ? (
                        <div className="mt-3">
                          <AgendaContent day={activeDay} />
                        </div>
                      ) : null}
                    </div>
                  )}
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
