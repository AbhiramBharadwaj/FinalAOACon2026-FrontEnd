import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowRight, Phone, Trophy } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import ePosterTemplate from '../../files/E-Poster-Template.pptx';

const AbstractRulesPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (acceptedRules) {
      navigate('/abstract/upload');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-6 lg:py-10 pb-20">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-gradient-to-r from-[#0f3d7a] via-[#005aa9] to-[#0a7a86] px-5 py-6 lg:px-8 lg:py-8 text-white">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                AOACON 2026 • Shivamogga
              </div>
              <h1 className="text-xl lg:text-3xl font-bold tracking-tight">
              GUIDELINES FOR E-POSTER PRESENTATION
              </h1>
              <p className="text-sm lg:text-base text-white/85 max-w-3xl">
                ASSOCIATION OF OBSTETRIC ANAESTHESIOLOGISTS OF INDIA, ANNUAL CONFERENCE
                (AOACON 2026, SHIVAMOGGA)
              </p>
            </div>
          </div>

          <div className="p-5 lg:p-8 space-y-6">
          <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 space-y-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Important Notes</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
              <li>Please note that all paper presentations during the Annual AOA Conference are e-posters only.</li>
              <li>Top six e-posters will be selected for the podium presentation on Day 2 of the conference from 7:30 AM to 8:30 AM in the Main Hall.</li>
              <li>Please keep a 6-minute PowerPoint presentation ready for the podium round, followed by 2 minutes of questions from the judges.</li>
              <li><strong>During the podium presentation, only the presenter&apos;s name should appear. The name of the institute, guide, and similar identifiers must not be disclosed.</strong></li>
              <li>Please do not leave the hall after your presentation. A group photograph of all presenters with the judges will be taken.</li>
            </ul>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 space-y-2">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">Important Dates</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                <li>Last date for abstract submission: <strong>10th October, 2026</strong></li>
                <li>Last date for final e-poster PDF submission by accepted authors: <strong>15th October, 2026</strong></li>
              </ul>
            </section>

            <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 space-y-2">
              <h2 className="text-sm lg:text-base font-semibold text-slate-900">Enquiries / Paper Related Queries</h2>
              <div className="rounded-xl border border-sky-200 bg-white p-3 text-sm text-slate-700 flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-900 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Dr. Swathi Hegde</div>
                  <div>Phone: 9986444568</div>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Eligibility</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>E-poster submissions are invited from anaesthesiologists, obstetric anaesthesiology trainees, postgraduate students, fellows, and researchers.</li>
              <li>The presenting author must be registered for the conference.</li>
              <li>Each presenting author may present only one e-poster, though they may be co-authors on other submissions.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Categories for Submission</h2>
            <p className="text-sm text-slate-600">Authors may submit posters under the following categories:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Original Research</li>
              <li>Clinical Audit / Quality Improvement</li>
              <li>Case Report / Case Series</li>
              <li>Review / Educational Poster</li>
              <li>Innovations in Labour Analgesia / Obstetric Anaesthesia</li>
              <li>Patient Safety in Obstetric Anaesthesia</li>
              <li>Simulation / Training Initiatives</li>
            </ul>
            <p className="text-sm text-slate-600">
              All submissions should be related to labour analgesia, obstetric anaesthesia, maternal critical care, or peri-partum patient safety.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Abstract Submission Guidelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Abstracts must be submitted through the conference website submission portal.</li>
              <li>Abstract word limit: maximum 300 words.</li>
              <li>Title: UPPER CASE.</li>
              <li>Authors: full names with institutional affiliations.</li>
              <li>The presenting author should be clearly indicated.</li>
              <li>Do not include tables or images in the abstract.</li>
              <li>Abstract file format: MS Word (.doc or .docx).</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Abstract Structure</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Research Abstracts</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  <li>Background</li>
                  <li>Methods</li>
                  <li>Results</li>
                  <li>Conclusion</li>
                </ul>
              </div>
              <div className="rounded-md border border-slate-200 p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Case Reports</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  <li>Introduction</li>
                  <li>Case description</li>
                  <li>Learning points</li>
                  <li>Discussion</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">E-Poster Format Requirements</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>File format: PDF</li>
              <li>Orientation: Landscape</li>
              <li>Aspect ratio: 16:9</li>
              <li>Resolution: 1920 x 1080 up to 3840 x 2160 (4K screens)</li>
              <li>PowerPoint slide size: 36 x 24 inches or 48 x 36 inches</li>
              <li>Title font size: 60 to 80 pt</li>
              <li>Authors font size: 32 to 40 pt</li>
              <li>Headings font size: 36 to 44 pt</li>
              <li>Body text font size: 28 to 30 pt</li>
              <li>Content should be readable from 1.5 to 2 metres distance</li>
              <li>Maximum file size: 10 MB</li>
            </ul>
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-700">
                <div className="font-semibold text-slate-900">E-Poster Template</div>
                <div>Use the official template provided on the website.</div>
              </div>
              <a
                href={ePosterTemplate}
                download
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Download the template
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Recommended Poster Structure</h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
              <li>Title and authors</li>
              <li>Background / Introduction</li>
              <li>Objectives</li>
              <li>Methods</li>
              <li>Results</li>
              <li>Discussion</li>
              <li>Conclusion</li>
              <li>References</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Design Guidelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Use clear headings and bullet points.</li>
              <li>Use high-resolution images and graphs.</li>
              <li>Avoid excessive text.</li>
              <li>Maintain good contrast and readability.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Submission of E-Poster</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Accepted authors must upload the final e-poster PDF before the deadline of <strong>15th October, 2026</strong>.</li>
              <li>Late submissions may not be included in the conference display.</li>
              <li>Posters will be displayed on digital screens during the conference.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Presentation Format</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Authors may be required to give a brief 3 to 5 minute presentation followed by 2 minutes of discussion during the moderated e-poster session.</li>
              <li>Authors should be present physically or virtually, as specified, during their scheduled session.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Judging Criteria</h2>
            <p className="text-sm text-slate-600">E-posters will be evaluated by a panel of judges based on:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Scientific merit</li>
              <li>Relevance to obstetric anaesthesia</li>
              <li>Methodology</li>
              <li>Clinical impact / novelty</li>
              <li>Clarity of presentation</li>
              <li>Visual quality of poster</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 space-y-3">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Awards
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Top six e-posters will be selected for podium presentation on Day 2.</li>
              <li><strong>During the podium presentation, only the presenter&apos;s name should appear. The institute and guide details must not be disclosed.</strong></li>
              <li><strong>1st Prize:</strong> Best Research / Audit Paper - Dr. Sunanda Gupta Gold Medal + complimentary conference registration for AOA 2027</li>
              <li><strong>2nd Prize:</strong> Cash Reward Rs. 8000/-</li>
              <li><strong>3rd Prize:</strong> Cash Reward Rs. 5000/-</li>
              <li>Best Case Report: Cash Reward Rs. 5000/-</li>
              <li>Awards will be announced and presented during the valedictory session of the conference.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Ethical Requirements</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Research involving human participants must have Institutional Ethics Committee approval.</li>
              <li>Patient consent must be obtained for case reports.</li>
              <li>Authors must declare conflicts of interest where applicable.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Acknowledgement</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>By proceeding, you confirm that the submission follows the conference e-poster guidelines.</li>
              <li>
                The uploaded file in this portal is the abstract document. Accepted authors must later submit the final e-poster PDF separately.
              </li>
            </ul>
          </section>

          <div className="border-t border-slate-200 pt-5 space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="mt-1 h-4 w-4 border-slate-300 rounded text-slate-900 focus:ring-slate-400"
              />
              <span className="text-sm text-slate-700">
                I have read, understood, and agree to the e-poster presentation guidelines, rules, and submission requirements above.
              </span>
            </label>

            <button
              onClick={handleProceed}
              disabled={!acceptedRules}
              className="w-full px-5 py-3 rounded-md border border-slate-300 bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Proceed to Upload
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AbstractRulesPage;
