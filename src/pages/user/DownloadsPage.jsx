import { Download, FileText } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import brochurePdf from '../../files/AOA CON BROCHURE ANNOUNCEMENT.pdf';
import bonafideCertificateTemplate from '../../files/AOACON2026_Bonafide_Certificate.docx';

const DownloadsPage = () => (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <Header />

    <main className="max-w-5xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Downloads</h1>
        <p className="mt-2 text-base text-slate-600">
          Download conference documents and registration templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <a
          href={brochurePdf}
          download="AOA CON BROCHURE ANNOUNCEMENT.pdf"
          className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-6 hover:border-[#005aa9]/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#005aa9]" />
            <div>
              <p className="text-lg font-semibold">Brochure</p>
              <p className="mt-1 text-sm text-slate-600">AOACON 2026 conference brochure (PDF)</p>
            </div>
          </div>
          <Download className="w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-[#005aa9]" />
        </a>

        <a
          href={bonafideCertificateTemplate}
          download="AOACON2026_Bonafide_Certificate.docx"
          className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-6 hover:border-[#9c3253]/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#9c3253]" />
            <div>
              <p className="text-lg font-semibold">Bonafide Certificate for PGs</p>
              <p className="mt-1 text-sm text-slate-600">Editable certificate template (DOCX)</p>
            </div>
          </div>
          <Download className="w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-[#9c3253]" />
        </a>
      </div>
    </main>

    <Footer />
    <MobileNav />
  </div>
);

export default DownloadsPage;
