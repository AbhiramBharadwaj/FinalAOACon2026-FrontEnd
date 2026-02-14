import { Link } from 'react-router-dom';
import { Ticket, Microscope, Award, CalendarClock, AlertCircle, Stethoscope, ArrowUpRight } from 'lucide-react';

const feeRows = [
  {
    label: 'AOA Member',
    early: { conf: '8000', ws: '10000', combo: null },
    regular: { conf: '10000', ws: '12000', combo: null },
    spot: { conf: '13000' },
  },
  {
    label: 'Non-AOA Member',
    early: { conf: '11000', ws: '13000', combo: '14000' },
    regular: { conf: '13000', ws: '15000', combo: '16000' },
    spot: { conf: '16000' },
  },
  {
    label: 'PGs & Fellows',
    early: { conf: '7000', ws: '9000', combo: null },
    regular: { conf: '9000', ws: '11000', combo: null },
    spot: { conf: '12000' },
  },
];

const renderCell = (value) => value ?? '—';
const cellBaseClass =
  'border border-slate-300 px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#005aa9] focus-visible:outline-offset-[-2px]';
const headerClass = 'bg-[#e4e7ff] text-slate-900 text-center font-semibold';
const workshopPreviewCards = [
  { title: 'Labour Analgesia', accent: 'border-t-4 border-t-amber-400' },
  { title: 'Critical Incidences in Obstetric Anaesthesia', accent: 'border-t-4 border-t-rose-400' },
  { title: 'POCUS in Obstetrics', accent: 'border-t-4 border-t-sky-400' },
  { title: 'Maternal Resuscitation', accent: 'border-t-4 border-t-emerald-400' },
];

const RegistrationFeesSection = () => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-[#fff7fb] via-white to-[#f8fbff]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-10 space-y-8">
        <section className="rounded-3xl overflow-hidden border border-[#f2cde2] bg-gradient-to-r from-[#7f1d5a] via-[#a21d71] to-[#005aa9] shadow-sm">
          <div className="px-6 py-8 sm:px-8 sm:py-10 text-white">
            <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-white/85">AOA Shivamogga 2026</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">AOACON 2026 Registration Details</h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 max-w-3xl">
              Choose your registration path clearly: Conference, Workshop track, or the AOA Certified Course track.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Track 1</p>
            <p className="mt-1 text-base font-semibold text-slate-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#005aa9]" /> Conference Only
            </p>
            <p className="mt-2 text-sm text-slate-600">Attend all core scientific sessions and conference inclusions.</p>
          </article>

          <article className="rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-sky-700">Track 2</p>
            <p className="mt-1 text-base font-semibold text-slate-900 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-sky-700" /> Workshop + Conference
            </p>
            <p className="mt-2 text-sm text-slate-700">Hands-on workshop track. Conference registration remains mandatory.</p>
          </article>

          <article className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-amber-700">Track 3 (Separate)</p>
            <p className="mt-1 text-base font-semibold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" /> AOA Certified Course
            </p>
            <p className="mt-2 text-sm text-slate-700">Dedicated certificate track, separate from workshop selection.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#005aa9]" />
              Pre Conference Workshops (30th Oct 2026)
            </h3>
            <Link
              to="/workshops"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Explore all workshops
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {workshopPreviewCards.map((item) => (
              <Link
                key={item.title}
                to="/workshops"
                className={`group rounded-lg border border-slate-200 bg-white px-4 sm:px-5 py-6 ${item.accent} hover:shadow-md transition-all`}
              >
                <p className="text-lg sm:text-2xl font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:text-[#005aa9]">
                  View details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="space-y-3 rounded-2xl border border-pink-200 bg-white p-4 sm:p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">EARLY BIRD</h3>
              <p className="text-sm font-semibold text-slate-700">UP TO 15TH AUGUST 2026</p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[680px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Category</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Conference Only</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Workshop + Conference</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Combo (AOA Life Membership + Conference)</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`early-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">{row.label}</th>
                      <td className={cellBaseClass}>{renderCell(row.early.conf)}</td>
                      <td className={cellBaseClass}>{renderCell(row.early.ws)}</td>
                      <td className={`${cellBaseClass} font-semibold`}>{renderCell(row.early.combo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 text-right">GST extra as applicable</p>
          </section>

          <section className="space-y-3 rounded-2xl border border-pink-200 bg-white p-4 sm:p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">REGULAR</h3>
              <p className="text-sm font-semibold text-slate-700">16TH AUGUST 2026 - 15TH OCTOBER 2026</p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[680px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Category</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Conference Only</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Workshop + Conference</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Combo (AOA Life Membership + Conf)</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`regular-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">{row.label}</th>
                      <td className={cellBaseClass}>{renderCell(row.regular.conf)}</td>
                      <td className={cellBaseClass}>{renderCell(row.regular.ws)}</td>
                      <td className={`${cellBaseClass} font-semibold`}>{renderCell(row.regular.combo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 text-right">GST extra as applicable</p>
          </section>

          <section className="space-y-3 rounded-2xl border border-pink-200 bg-white p-4 sm:p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">SPOT REGISTRATION</h3>
              <p className="text-sm font-semibold text-slate-700">FROM 16TH OCTOBER 2026 ONWARDS</p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[420px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Category</th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">Conference Only</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`spot-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">{row.label}</th>
                      <td className={`${cellBaseClass} font-semibold`}>{renderCell(row.spot.conf)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 text-right">GST extra as applicable</p>
          </section>
        </div>

        <section className="rounded-2xl border border-amber-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                AOA Certified Course in Obstetric Critical Care
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-700">To be held on 29th and 30th October 2026</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ul className="list-disc list-inside text-sm text-slate-800 space-y-1">
                <li>Conference + AOA Certified Course bundle: Rs 13,000 + GST (AOA / Non-AOA)</li>
                <li>Applicable only for practitioners (AOA and Non-AOA)</li>
                <li>Limited to 40 participants</li>
                <li>Conference registration is mandatory</li>
                <li>No spot registration</li>
              </ul>

              <div>
                <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  How this is different
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li>This is a separate certificate track, not a workshop slot.</li>
                  <li>You select either Workshop track or AOA Certified Course in registration.</li>
                  <li>Seats are limited and managed independently.</li>
                </ul>
              </div>
            </div>

            <Link
              to="/workshops/aoa-certificate-course"
              className="inline-flex items-center rounded-xl bg-[#7a1f5c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#65194d] transition-colors"
            >
              View AOA Certified Course Page
            </Link>
          </div>
        </section>

        <section className="rounded-2xl bg-[#f6e8b6] px-6 py-6 border border-[#e8d28a]">
          <h3 className="text-base font-semibold text-slate-900 mb-3">Notes</h3>
          <ul className="list-disc list-inside text-sm text-slate-900 space-y-1">
            <li>Conference registration is mandatory for workshop registration.</li>
            <li>Workshops and AOA Certified Course registrations are limited to 40 participants each.</li>
            <li>PGs and Fellows must submit a valid Bonafide Certificate issued by the Head of the Department.</li>
            <li>GST applicable as per rules.</li>
            <li>Accompanying person fee: Rs 7,000 + GST.</li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-[#005aa9]">Accompanying person - Rs 7000/-</p>
            <p className="text-red-600 font-semibold">GST Extra</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
              <CalendarClock className="w-3.5 h-3.5" /> Register early for best slab
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#005aa9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004b8f] transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationFeesSection;
