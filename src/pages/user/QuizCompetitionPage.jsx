import {
  Award,
  CalendarDays,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Trophy,
  Users,
} from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';
import quizFlyer from '../../images/QuizCompetition/quiz-competition-2026.jpeg';

const quizRegistrationUrl = 'https://forms.gle/zpfjm6yDdrrqSDD6';

const QuizCompetitionPage = () => {
  const rules = [
    'Only postgraduates and fellows are eligible to participate.',
    'Conference registration is mandatory.',
    'Quiz registration closes on 31st October 2026 before 11:00 AM.',
    'The preliminary round will be conducted as MCQs through Google Forms.',
    'Google Form access for prelims will be shared only with registered quiz participants.',
    'Ten finalists with the fastest submission and highest score will be selected for the final round.',
    'All finalists will receive participation certificates.',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-3 pb-20 pt-6 sm:px-4 lg:px-6 lg:pt-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-gradient-to-br from-[#08234f] via-[#005aa9] to-[#0f766e] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                <Trophy className="h-4 w-4" />
                AOACON 2026 Quiz Competition
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Think. Compete. Win.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                A conference quiz competition for postgraduates and fellows at the 19th National Conference of the Association of Obstetric Anaesthesiologists.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/25 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarDays className="h-4 w-4" />
                    Preliminary Round
                  </div>
                  <p className="mt-2 text-2xl font-bold">31st October 2026</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Award className="h-4 w-4" />
                    Final Round
                  </div>
                  <p className="mt-2 text-2xl font-bold">1st November 2026</p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={quizRegistrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#08234f] transition hover:bg-slate-100"
                >
                  Register for Quiz
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="/register-details"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Conference Registration
                </a>
              </div>
            </div>

            <div className="bg-[#eef7fb] p-3 sm:p-5 lg:p-6">
              <figure className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <img
                  src={quizFlyer}
                  alt="AOACON 2026 quiz competition flyer"
                  className="w-full object-contain"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <GraduationCap className="h-5 w-5 text-[#005aa9]" />
                Eligibility and Rules
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {rules.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#7cb342]" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Trophy className="h-5 w-5 text-amber-600" />
                Prizes and Certificates
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Exciting prizes will be awarded. All finalists will receive participation certificates.
              </p>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock className="h-4 w-4 text-[#9c3253]" />
                Key Dates
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Registration closes</p>
                  <p className="mt-1 font-semibold text-slate-900">31st October 2026 before 11:00 AM</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Prelims</p>
                  <p className="mt-1 font-semibold text-slate-900">31st October 2026</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Finals</p>
                  <p className="mt-1 font-semibold text-slate-900">1st November 2026</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Users className="h-4 w-4 text-[#005aa9]" />
                Contact
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p><strong>Dr Namratha L</strong>: +91 98866 54054</p>
                <p><strong>Dr Shobha D</strong>: +91 99728 68611</p>
              </div>
            </section>
          </aside>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default QuizCompetitionPage;
