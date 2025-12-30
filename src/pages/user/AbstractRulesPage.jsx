import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowRight } from 'lucide-react';
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
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 lg:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-lg lg:text-2xl font-semibold text-slate-900">
              Abstract Submission Guidelines
            </h1>
            <p className="text-sm text-slate-600">
              Greetings from Organising Committee AOACON 2026 (Free Paper & E-Poster Presentations only).
              We invite original research and high-quality submissions for Free Paper and E-Poster presentations.
              Kindly read and follow the guidelines below before submitting your abstract.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Abstract Categories</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Broad categories: Free Paper Presentation / E-Poster Presentation. Please mention the chosen category at submission.</li>
              <li>
                Abstracts can be submitted under: Original article, systematic review and meta-analysis, scoping review, audits,
                retrospective studies, cross sectional survey, case series, case report (only related to anesthesia for obstetrics
                and gynecological procedures).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">General Instructions</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Submit abstracts only through the online module via the official AOACON 2026 website.</li>
              <li>Submissions via email or physical copy will not be accepted.</li>
              <li>Abstracts must be original and not published or presented elsewhere.</li>
              <li>Word limits: title max 25 words; abstract text max 300 words (excluding title, references, figure/table/graph).</li>
              <li>MS Word (.doc or .docx) only; English language; Times New Roman, 12 pt.</li>
              <li>Only one figure/table/graph is permitted.</li>
              <li>Use generic names of drugs and standard abbreviations (define non-standard at first mention).</li>
              <li>Use numerals, except when beginning a sentence.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Abstract Structure</h2>
            <p className="text-sm text-slate-600">Submit the abstract under the following headings:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Type of study</li>
              <li>Title: concise and specific</li>
              <li>
                Authors details: list all authors (max 6). Highlight the presenting author in bold and underline. Provide designation,
                institute name, contact number, and email ID of presenting author.
              </li>
              <li>Background: rationale and specific objectives</li>
              <li>Methods: brief description of the study and statistical tests used</li>
              <li>Results: summary of the findings</li>
              <li>Conclusion</li>
              <li>References: limit to two</li>
            </ul>
            <p className="text-sm text-slate-600">
              Note: A maximum of two presentations (Free Paper and/or E-Poster) are allowed per author as presenting author.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Presentation Format</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Free Paper: 5-minute presentation + 2-minute discussion.</li>
              <li>E-Poster: 3-minute presentation + 2-minute discussion.</li>
              <li>Upon acceptance, authors must submit the E-Poster as per the provided format.</li>
              <li>E-Poster: Digital display. Format guidelines will be shared after selection.</li>
            </ul>
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-700">
                <div className="font-semibold text-slate-900">E-Poster Template</div>
                <div>E-posters as per template provided in the website.</div>
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

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Registration Policy</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Conference registration is mandatory for both submission and presentation.</li>
              <li>Unregistered authors will not be permitted to present even if selected.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Review & Selection</h2>
            <p className="text-sm text-slate-600">Abstracts will be reviewed by the Scientific Committee and evaluated on:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Scientific merit</li>
              <li>Originality</li>
              <li>Methodology and analysis</li>
              <li>Relevance and adherence to submission guidelines</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Important Dates</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Abstract Submission Deadline: 25th October</li>
              <li>Notification of Acceptance: 28th October</li>
              <li>Final E-Poster Submission Deadline: 28th October</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm lg:text-base font-semibold text-slate-900">Copyright Policy</h2>
            <p className="text-sm text-slate-700">
              By submitting an abstract, the author grants permission to the AOACON 2026 Organizing Committee to publish or display
              the content in official conference materials.
            </p>
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
                I have read, understood, and agree to all guidelines, rules, and terms above.
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

      <MobileNav />
    </div>
  );
};

export default AbstractRulesPage;
