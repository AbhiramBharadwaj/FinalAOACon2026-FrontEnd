import { Link } from 'react-router-dom';

const feeRows = [
  {
    label: 'AOA Member',
    early: { conf: '8000', ws: '10000', combo: null },
    regular: { conf: '10000', ws: '12000', combo: null },
    spot: { conf: '13000' },
  },
  {
    label: 'Non-Member',
    early: { conf: '11000', ws: '13000', combo: '16000' },
    regular: { conf: '13000', ws: '15000', combo: '18000' },
    spot: { conf: '16000' },
  },
  {
    label: 'PGs & Fellows',
    early: { conf: '7000', ws: '9000', combo: '12000' },
    regular: { conf: '9000', ws: '11000', combo: '14000' },
    spot: { conf: '12000' },
  },
];

const renderCell = (value) => value ?? '—';
const cellBaseClass =
  'border border-slate-300 px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#005aa9] focus-visible:outline-offset-[-2px]';
const headerClass = 'bg-[#e4e7ff] text-slate-900 text-center font-semibold';

const RegistrationFeesSection = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-10 space-y-10">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            AOA Shivamogga 2026
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#a21d71]">
            AOACON 2026 – Registration Details
          </h2>
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">EARLY BIRD</h3>
              <p className="text-sm font-semibold text-slate-700">
                UP TO 15TH AUGUST 2026
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[680px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Category
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Conference Only
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Workshop + Conference
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Combo (AOA Life Membership + Conference)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`early-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">
                        {row.label}
                      </th>
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

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">REGULAR</h3>
              <p className="text-sm font-semibold text-slate-700">
                16TH AUGUST 2026 – 15TH OCTOBER 2026
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[680px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Category
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Conference Only
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Workshop + Conference
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Combo (AOA Life Membership + Conf)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`regular-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">
                        {row.label}
                      </th>
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

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-[#a21d71]">SPOT REGISTRATION</h3>
              <p className="text-sm font-semibold text-slate-700">
                FROM 16TH OCTOBER 2026 ONWARDS
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[420px]">
                <thead>
                  <tr className={headerClass}>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Category
                    </th>
                    <th className="border border-slate-300 px-3 py-2" scope="col">
                      Conference Only
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {feeRows.map((row, index) => (
                    <tr key={`spot-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th className="border border-slate-300 px-3 py-3 font-semibold text-slate-800" scope="row">
                        {row.label}
                      </th>
                      <td className={`${cellBaseClass} font-semibold`}>{renderCell(row.spot.conf)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 text-right">GST extra as applicable</p>
          </section>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#a21d71]">
              AOA Certified Course in Obstetric Critical Care
            </h3>
            <p className="text-sm font-semibold text-slate-700">
              To be held on 29th and 30th October 2026
            </p>
            <ul className="list-disc list-inside text-sm text-slate-800 space-y-1">
              <li>Fee: ₹5,000 + GST</li>
              <li>Applicable only for practitioners</li>
              <li>Limited to 40 participants</li>
              <li>No spot registration</li>
            </ul>
          </div>
          <div className="rounded-full bg-slate-100 text-slate-900 text-sm font-semibold italic px-6 py-8 text-center shadow-sm">
            * Attractive masterclass sessions will be announced shortly.
          </div>
        </section>

        <section className="rounded-2xl bg-[#f6e8b6] px-6 py-6 border border-[#e8d28a]">
          <h3 className="text-base font-semibold text-slate-900 mb-3">Notes</h3>
          <ul className="list-disc list-inside text-sm text-slate-900 space-y-1">
            <li>Conference registration is mandatory for workshop registration.</li>
            <li>Workshops and AOA Certified Course registrations are limited to 40 participants each.</li>
            <li>PGs &amp; Fellows must submit a valid Bonafide Certificate issued by the Head of the Department.</li>
            <li>GST applicable as per rules.</li>
            <li>Accompanying person fee: ₹7,000 + GST.</li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-[#005aa9]">Accompanying person - Rs 7000/-</p>
            <p className="text-red-600 font-semibold">* GST Extra</p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#005aa9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004b8f] transition-colors"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegistrationFeesSection;
