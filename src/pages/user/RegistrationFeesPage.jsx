import { Calendar, Info, Phone, Mail } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import RegistrationFeesSection from '../../components/common/RegistrationFeesSection';
import Footer from '../../components/common/Footer';

const RegistrationFeesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <RegistrationFeesSection />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 pb-20">

        {}
        <section className="p-4 border border-emerald-200 rounded-xl bg-emerald-50/80 flex gap-2">
          <Info className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-emerald-900">
            * All the registration fees are exclusive of 18% GST.
          </p>
        </section>

        {}
        <section className="p-5 border border-slate-200 rounded-xl bg-[#fff4cf] space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9c3253]" />
            Important Notes
          </h2>
          <ul className="list-disc list-inside space-y-1 text-[12px] text-slate-800">
            <li>Conference registration is mandatory for workshop registration.</li>
            <li>Workshops and AOA Certified Course registrations are limited to 40 participants each.</li>
            <li>
              PGs &amp; Fellows must submit a valid Bonafide Certificate issued by the Head of the
              Department.
            </li>
            <li>GST applicable as per rules.</li>
            <li>Accompanying person fee: ₹7,000 + GST.</li>
          </ul>
        </section>

        {}
        <section
          id="terms-conditions"
          className="p-5 border border-slate-200 rounded-xl bg-[#8ea731] space-y-4 "
          style={{ color: '#fff !important' }}
        >
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-red-800" />
            Conference Registration Terms and Conditions
          </h2>

          <div className="space-y-3 text-[12px] leading-relaxed text-white text-lg">
            <div>
              <p className="font-semibold text-black mb-1">1. Eligibility</p>
              <p>The conference is open to registered delegates only.</p>
              <p>Delegates must complete the registration process and pay the applicable fees to confirm participation.</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-1">2. Payment Terms</p>
              <p>All registration fees must be paid in full at the time of registration via the available payment methods.</p>
              <p>Registrations will only be confirmed upon receipt of full payment.</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-1">3. Delegate Information</p>
              <p>The information provided during registration must be accurate. Any errors should be reported immediately.</p>
              <p>Transfer of registration is subject to approval and must be requested in writing.</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-1">4. Liability Disclaimer</p>
              <p>The organizers will not be responsible for any personal injury, loss, or damage to personal belongings during the conference.</p>
              <p>Travel and accommodation arrangements are the responsibility of the delegate.</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-1">5. Changes to the Program</p>
              <p>The organizers reserve the right to modify the conference program, including speakers, sessions, and schedules, without prior notice.</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-1">6. Includes</p>
              <p>Registration includes 3 lunches, 1 dinner, delegate kit, and access to scientific halls and exhibition area.</p>
            </div>
          </div>
        </section>

        {}
        <section
          id="privacy-policy"
          className="p-5 border border-slate-200 rounded-xl bg-[#e3f2fd] space-y-4"
        >
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#005aa9]" />
            Privacy Policy
          </h2>

          <div className="space-y-3 text-[12px] leading-relaxed text-slate-800 text-lg">
            <p>
              We collect only the information required for conference registration and communication,
              such as name, contact details, affiliation, and payment references.
            </p>
            <p>
              Your information is used to process registrations, issue receipts, and share essential
              conference updates. Payment processing is handled by the payment gateway and we do not
              store card or bank details on our servers.
            </p>
            <p>
              We do not sell or share your personal information with third parties, except as required
              for processing payments or complying with legal obligations.
            </p>
            <p>
              For any privacy related concerns, contact the conference secretariat at
              regaoacon2026@gmail.com.
            </p>
          </div>
        </section>

        {}
        <section
          id="refund-policy"
          className="p-5 border border-slate-200 rounded-xl bg-[#ff8a1f] space-y-4"
        >
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#005aa9]" />
            Cancellation and Refund Policy
          </h2>

          <div className="space-y-3 text-[12px] leading-relaxed text-white text-lg ">
            <div>
              <p className="font-semibold text-slate-900 mb-1">1. Cancellation by Delegate</p>
              <p>All cancellation requests must be made in writing via email to the conference secretariat.</p>
              <p className="mt-1">Refund schedule:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Up to 120 days before the event: 75% refund of the registration fee.</li>
                <li>Between 119 to 60 days before the event: 50% refund of the registration fee.</li>
                <li>Less than 60 days before the event: No refund will be issued.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">2. Cancellation by the Organizer</p>
              <p>If the conference is canceled due to unforeseen circumstances, all registered delegates will receive a full refund of the registration fee.</p>
              <p>The organizers are not responsible for other costs such as travel or accommodation.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">3. Force Majeure</p>
              <p>
                In case of cancellation or rescheduling due to circumstances beyond control (natural disasters, pandemics, government restrictions, etc.), the organizers will attempt to reschedule and issue revised refund policies.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">4. Refund Processing Time</p>
              <p>Approved refunds will be processed within 30 days of the cancellation request.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">5. No‑Show Policy</p>
              <p>No refunds will be provided for delegates who do not attend the conference without prior cancellation.</p>
            </div>
          </div>
        </section>

        {}
        <section className="p-5 border border-slate-200 rounded-xl bg-[#7cb342] space-y-3 text-md">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#005aa9]" />
            For Registration Related Query
          </h2>
          <div className="text-white space-y-1">
            <p className="font-semibold text-slate-900"> SRS Events and Production</p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              Mobile: +91 9880739285
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-600" />
              Email:{' '}
              <a
                href="mailto:regaoacon2026@gmail.com"
                className="text-[#005aa9] hover:underline"
              >
                regaoacon2026@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default RegistrationFeesPage;
