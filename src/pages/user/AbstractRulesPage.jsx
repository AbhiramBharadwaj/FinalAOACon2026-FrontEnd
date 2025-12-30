import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload,
  ArrowRight,
  Users
} from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';

const AbstractRulesPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (acceptedRules) {
      navigate('/abstract/upload');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20">
        <div className="bg-[#9c3253] text-white rounded-md px-4 py-3 lg:py-4 flex items-center mb-6">
          <div className="ml-3">
            <h1 className="text-lg lg:text-xl font-semibold mb-1">Submission Guidelines</h1>
            <p className="text-xs lg:text-sm opacity-90">AOA Shivamogga 2026 Abstract Rules</p>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {}
          <div className="bg-[#9c3253] text-white rounded-md p-4 lg:p-6">
            <h2 className="text-sm lg:text-base font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
              1. Abstract Format
            </h2>
            <div className="space-y-2 text-xs lg:text-sm leading-relaxed">
              <div>• Max 300 words (excluding title/authors)</div>
              <div>• Title ≤ 20 words</div>
              <div>• All author names + affiliations</div>
              <div>• Structure: Background, Methods, Results, Conclusion</div>
              <div>• Times New Roman, 12pt, 1.5 spacing</div>
              <div>• No images/tables/graphs/references</div>
            </div>
          </div>

          {}
          <div className="bg-[#ff8a1f] text-white rounded-md p-4 lg:p-6">
            <h2 className="text-sm lg:text-base font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
              2. File Requirements
            </h2>
            <div className="space-y-2 text-xs lg:text-sm leading-relaxed">
              <div>• PDF format only</div>
              <div>• Maximum 5MB</div>
              <div>• Filename: LastName_FirstName_Abstract.pdf</div>
              <div>• Single column, A4 size</div>
            </div>
          </div>

          {}
          <div className="bg-[#7cb342] text-white rounded-md p-4 lg:p-6">
            <h2 className="text-sm lg:text-base font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
              3. Important Dates
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-4 bg-white/20 rounded-lg text-xs lg:text-sm">
                <span>Regular Deadline</span>
                <span className="font-bold">Oct 15, 2025</span>
              </div>
              <div className="flex items-center justify-between py-2 px-4 bg-white/20 rounded-lg text-xs lg:text-sm">
                <span>Final Deadline</span>
                <span className="font-bold">Oct 25, 2025</span>
              </div>
              <div className="flex items-center justify-between py-2 px-4 bg-white/20 rounded-lg text-xs lg:text-sm">
                <span>Review Results</span>
                <span className="font-bold">Oct 28, 2025</span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-[#9c3253] text-white rounded-md p-4 lg:p-6">
            <h2 className="text-sm lg:text-base font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              4. Rules & Regulations
            </h2>
            <div className="space-y-3 text-xs lg:text-sm">
              <div className="p-3 bg-white/20 rounded-lg">
                <div className="font-semibold mb-2">Eligibility:</div>
                <div>• Registered participants only</div>
                <div>• First author: medical professional</div>
                <div>• Max 2 abstracts per first author</div>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <div className="font-semibold mb-2">Restrictions:</div>
                <div>• No previously published work</div>
                <div>• No simultaneous submissions</div>
                <div>• Plagiarism = rejection</div>
                <div>• No commercial content</div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-[#ff8a1f] text-white rounded-md p-4 lg:p-6">
            <h2 className="text-sm lg:text-base font-bold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
              Terms & Conditions
            </h2>
            
            <div className="space-y-2 text-xs lg:text-sm mb-6">
              <div>1. <span className="font-semibold">Originality:</span> Unpublished work only. Plagiarism detection required.</div>
              <div>2. <span className="font-semibold">Copyright:</span> Authors retain rights, AOA gets publication rights.</div>
              <div>3. <span className="font-semibold">Review:</span> Double-blind. Committee decision final.</div>
              <div>4. <span className="font-semibold">Presentation:</span> One author must register & present.</div>
              <div>5. <span className="font-semibold">Publication:</span> Accepted abstracts in proceedings.</div>
              <div>6. <span className="font-semibold">Withdrawal:</span> Before review only. No refunds.</div>
            </div>

            <label className="flex items-start gap-3 p-4 lg:p-6 border-2 border-white/30 rounded-md bg-black hover:border-white/50 transition-all cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="mt-1 h-5 w-5 lg:h-6 lg:w-6 text-white border-2 border-white/50 focus:ring-white/50 rounded flex-shrink-0"
              />
              <span className="text-xs lg:text-sm leading-relaxed flex-1">
                I have read, understood, and agree to all guidelines, rules & terms above.
              </span>
            </label>

            <button
              onClick={handleProceed}
              disabled={!acceptedRules}
              className="w-full px-6 py-3 lg:py-4 rounded-md border-2 border-white bg-white text-[#ff8a1f] text-sm lg:text-base font-bold hover:bg-[#ff8a1f]/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4 lg:w-5 lg:h-5" />
              Proceed to Upload
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AbstractRulesPage;
