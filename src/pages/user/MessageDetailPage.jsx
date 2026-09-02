import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import anjuGrewalImg from '../../images/AOAOfficeBearers/Anju-Grewal-President.png';
import sunandaGuptaImg from '../../images/AOAOfficeBearers/Sunanda-Gupta-Founder-President.png';

export const MESSAGES_DATA = {
  president: {
    slug: 'president',
    headerTitle: 'LETTER FROM PRESIDENT, AOA',
    name: 'Dr. Anju Grewal',
    role: 'President, AOA India',
    image: anjuGrewalImg,
    greeting: 'Respected members of the Association of Obstetric Anaesthesiologists (AOA) India,',
    paragraphs: [
      `As President of AOA India, I extend my heartfelt congratulations to Team Shivamogga, ably led by Dr. G. L. Ravindra and Dr. Champa, for graciously hosting the 19th Annual National Conference of AOA India. My best wishes for the success of this conference, thoughtfully curated around the pertinent real-world theme, "Safe Motherhood Everywhere: Bridging the Urban–Rural Gap in Obstetric Anaesthesia."`,
      `I humbly appeal to all anaesthesiologists with an interest in obstetric anaesthesia and critical care to register in large numbers, contribute to insightful deliberations, develop skills that help bridge gaps in care, and collaborate with AOA India in its mission to enhance safe maternal care across our country.`,
      `The conference highlights include the Obstetric Critical Care Course and four interactive, day-long pre-conference workshops focused on the early recognition and management of obstetric emergencies, structured approaches to safe practice, the management of critical incidents, and simulation-based learning of both technical and non-technical skills.`,
      `Leading international and national experts in obstetric anaesthesia will join us for the conference talks and deliberations.`,
      `This Annual National Conference will exemplify our commitment to advancing obstetric anaesthesia through cutting-edge education and hands-on training, empowering us to deliver even better care to mothers and newborns across India.`,
    ],
    closingQuote: 'Together, let us join hands towards reducing maternal morbidity and mortality!',
    signoff: 'Kind regards,',
  },
  'founder-president': {
    slug: 'founder-president',
    headerTitle: 'LETTER FROM FOUNDER PRESIDENT, AOA',
    name: 'Dr. Sunanda Gupta',
    role: 'Founder President, AOA India',
    image: sunandaGuptaImg,
    greeting: 'Dear Colleagues, Friends and Delegates,',
    paragraphs: [
      `Reflecting on our journey since we sowed the seeds of the Association of Obstetric Anaesthesiologists in 2005, it brings me immense joy, pride, and a deep sense of fulfillment to welcome you all to AOACON 2026, being hosted at Shimoga Institute of Medical Sciences (SIMS).`,
      `Our primary mission at AOA was to build a dedicated subspecialty focused entirely on the safety, care, and dignity of mothers across India. Looking at this vibrant community today, I can confidently say that our shared passion has transformed obstetric anesthesia from a routine clinical task into a cornerstone of maternal healthcare nationwide.`,
      `What began as a vital vision to standardize maternal care has evolved into a powerhouse of academic excellence. Through countless successful national conferences, extensive educational webinars, specialized Fellowship programs, and the release of robust clinical guidelines, AOA has reshaped obstetric anesthesia in India. Today, our reach extends well beyond our borders; our members are regularly invited as faculty at premier international Conferences, from the World Congress to the Obstetric anaesthesia conferences of USA, Russia, China, Germany, UK, Indonesia, to name a few, putting AOA India on the global map of maternal health. Alongside these achievements, our official publication, the Journal of Obstetric Anaesthesia and Critical Care (JOACC), continues to give our research a loud, global voice.`,
      `As we gather for our 19th National Conference, our focus turns towards our greatest challenge: Bridging the Urban–Rural Gap in Obstetric Anaesthesia which hits at the very core of why we established this association. True progress is not measured solely by the advanced techniques we deploy in well equipped medical centers, but by the safety and standards of care we can guarantee to a mother in the most remote, resource-limited corners of our country. Your presence here is a testament to your commitment to safer maternal healthcare, to reduce the incidence of maternal morbidity and mortality, across our country.`,
      `Thanks to the dynamic organizing team at SIMS, Shivamogga, and thank you to each one of you for keeping the AOA banner flying high!`,
    ],
    closingQuote: 'I wish AOACON 2026 a grand and resounding success!',
    signoff: 'Warm regards,',
  },
};

const MessageDetailPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const data = MESSAGES_DATA[type] || MESSAGES_DATA['president'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          {/* Letter Card */}
          <article className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-10 lg:p-12">
            {/* Header Title */}
            <div className="border-b-2 border-red-500/20 pb-4 mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#d9232d] uppercase tracking-wide">
                {data.headerTitle}
              </h1>
              <div className="w-20 h-1 bg-[#ff8a1f] mt-3 rounded-full"></div>
            </div>

            {/* Letter Body */}
            <div className="space-y-6 text-slate-700 text-[16px] sm:text-[18px] leading-relaxed text-justify">
              <p className="font-bold text-slate-900 text-[17px] sm:text-[19px]">
                {data.greeting}
              </p>

              {data.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {data.closingQuote && (
                <p className="font-bold text-slate-900 pt-2">
                  {data.closingQuote}
                </p>
              )}
            </div>

            {/* Sign-off section */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <p className="text-slate-600 font-medium mb-5">{data.signoff}</p>

              <div className="flex items-center gap-4 sm:gap-5">
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-red-500 object-cover shadow-sm"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {data.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-600">
                    {data.role}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default MessageDetailPage;
