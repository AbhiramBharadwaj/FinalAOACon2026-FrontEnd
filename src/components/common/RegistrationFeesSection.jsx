import { useState } from 'react';
import { Link } from 'react-router-dom';

const feeRows = [
  {
    label: 'AOA Member',
    early: { conf: '8000', ws: '10000', course: '13000', combo: null },
    regular: { conf: '10000', ws: '12000', course: '15000', combo: null },
    spot: { conf: '13000' },
  },
  {
    label: 'Non-Member',
    early: { conf: '11000', ws: '13000', course: '16000', combo: '16000' },
    regular: { conf: '13000', ws: '15000', course: '18000', combo: '18000' },
    spot: { conf: '16000' },
  },
  {
    label: 'PGs & Fellows',
    early: { conf: '7000', ws: '9000', course: null, combo: '12000' },
    regular: { conf: '9000', ws: '11000', course: null, combo: '14000' },
    spot: { conf: '12000' },
  },
];

const renderCell = (value) => value ?? '—';
const renderCourseNote = (value) =>
  value ? (
    <span className="block text-[10px] text-slate-500 mt-1">+ GST on course</span>
  ) : null;

const cellBaseClass =
  'border border-slate-300 px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#005aa9] focus-visible:outline-offset-[-2px]';

const subHeaderClass = 'bg-[#00a9e0] text-slate-900 text-center font-semibold';
const tabs = [
  { id: 'early', label: 'EARLY BIRD (Upto August 15th)' },
  { id: 'regular', label: 'REGULAR (Aug 15th to Oct 15th)' },
  { id: 'spot', label: 'SPOT (Oct 16th onwards)' },
];

const RegistrationFeesSection = () => {
  const [activeTab, setActiveTab] = useState('early');

  const isSpot = activeTab === 'spot';

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-10 space-y-4">
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <div className="bg-[#a21d71] px-4 py-3 text-white font-semibold tracking-wide">
            REGISTRATION FEES * : AOA Shivamogga - 2026
          </div>
          <div className="px-4 py-4 border-b border-slate-200 bg-white">
            <div role="tablist" aria-label="Registration fee phases" className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`fees-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#a21d71] text-white border-[#a21d71]'
                      : 'bg-white text-[#a21d71] border-[#a21d71] hover:bg-[#fbe7f4]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[720px]" role="tabpanel" id={`fees-panel-${activeTab}`}>
              <thead>
                <tr className={subHeaderClass}>
                  <th
                    className="border border-slate-200 px-3 py-2 text-slate-900 font-semibold"
                    scope="col"
                  >
                    Category
                  </th>
                  <th className="border border-slate-200 px-3 py-2" scope="col">
                    Conference (Conf)
                  </th>
                  {!isSpot && (
                    <>
                      <th className="border border-slate-200 px-3 py-2" scope="col">
                        WS + Conf
                      </th>
                      <th className="border border-slate-200 px-3 py-2" scope="col">
                        <span className="block">Conf + AOA Certified Course</span>
                        <span className="block text-[10px] text-slate-700 font-medium mt-1">
                          ₹5000 + GST • Limited to 40 • Not for PGs
                        </span>
                      </th>
                      <th className="border border-slate-200 px-3 py-2" scope="col">
                        Combo Offers AOA Life Membership + Conf
                      </th>
                    </>
                  )}
                  {isSpot && (
                    <th className="border border-slate-200 px-3 py-2" scope="col">
                      Conference only
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="text-center">
                {feeRows.map((row, index) => (
                  <tr key={`${activeTab}-${row.label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                    <th
                      scope="row"
                      className="border border-slate-200 px-3 py-3 font-semibold text-slate-800"
                    >
                      {row.label}
                    </th>
                    <td className={cellBaseClass} tabIndex={0} aria-label={`${row.label} ${activeTab} conference fee`}>
                      {renderCell(row[activeTab].conf)}
                    </td>
                    {!isSpot && (
                      <>
                        <td className={cellBaseClass} tabIndex={0} aria-label={`${row.label} ${activeTab} workshop plus conference fee`}>
                          {renderCell(row[activeTab].ws)}
                        </td>
                        <td className={cellBaseClass} tabIndex={0} aria-label={`${row.label} ${activeTab} conference plus AOA certified course fee`}>
                          {renderCell(row[activeTab].course)}
                          {renderCourseNote(row[activeTab].course)}
                        </td>
                        <td className={`${cellBaseClass} font-semibold`} tabIndex={0} aria-label={`${row.label} ${activeTab} combo offer fee`}>
                          {renderCell(row[activeTab].combo)}
                        </td>
                      </>
                    )}
                    {isSpot && (
                      <td className={`${cellBaseClass} font-semibold`} tabIndex={0} aria-label={`${row.label} spot conference fee`}>
                        {renderCell(row[activeTab].conf)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white mt-6">
            <div className="bg-[#ff8a1f] text-slate-900 font-semibold px-4 py-3">
              AOA Certified Course only – ₹5000 + GST (limited 40)
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[420px]">
                <thead>
                  <tr className={subHeaderClass}>
                    <th
                      className="border border-slate-200 px-3 py-2 text-slate-800 font-semibold"
                      scope="col"
                    >
                      Category
                    </th>
                    <th className="border border-slate-200 px-3 py-2" scope="col">
                      Course only
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {['AOA Member', 'Non-Member', 'PGs & Fellows'].map((label, index) => (
                    <tr key={`course-only-${label}`} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-100'}>
                      <th
                        scope="row"
                        className="border border-slate-200 px-3 py-3 font-semibold text-slate-800"
                      >
                        {label}
                      </th>
                      <td className={cellBaseClass} tabIndex={0} aria-label={`${label} AOA certified course only fee`}>
                        {label === 'PGs & Fellows' ? 'Not available' : '5000'}
                        {label === 'PGs & Fellows' ? null : (
                          <span className="block text-[10px] text-slate-500 mt-1">+ GST</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
