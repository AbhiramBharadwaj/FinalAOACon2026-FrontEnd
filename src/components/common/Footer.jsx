import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';
import mainLogo from '../../images/main-logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src={mainLogo} alt="AOACON 2026" className="h-12 w-auto" />
            <p className="text-sm text-slate-300 leading-relaxed">
              AOACON 2026 at Shimoga Institute of Medical Sciences brings together
              obstetric anaesthesia experts, researchers, and learners from across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>30 Oct - 1 Nov 2026</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/" className="text-slate-300 hover:text-white">
                Home
              </Link>
              <Link to="/venue" className="text-slate-300 hover:text-white">
                Venue
              </Link>
              <Link to="/committee" className="text-slate-300 hover:text-white">
                Committee
              </Link>
              <Link to="/office-bearers" className="text-slate-300 hover:text-white">
                Office Bearers
              </Link>
              <Link to="/register-details" className="text-slate-300 hover:text-white">
                Registration
              </Link>
              <Link to="/download" className="text-slate-300 hover:text-white">
                Brochure
              </Link>
              <Link to="/contact" className="text-slate-300 hover:text-white">
                Contact
              </Link>
              <Link to="/register" className="text-slate-300 hover:text-white">
                Register Now
              </Link>
              <Link
                to="/register-details#terms-conditions"
                className="text-slate-300 hover:text-white"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/register-details#privacy-policy"
                className="text-slate-300 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/register-details#refund-policy"
                className="text-slate-300 hover:text-white"
              >
                Refund Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Secretariat
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-300 mt-0.5" />
                <span>
                  Department of Anaesthesiology, SIMS
                  <br />
                  Shivamogga, Karnataka, India
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-300" />
                <span>Dr. Champa BV • +91 97400 73702</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300" />
                <a
                  href="mailto:regaoacon2026@gmail.com"
                  className="hover:text-white"
                >
                  regaoacon2026@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-300">
              Follow conference updates for registration deadlines, program schedules, and
              workshop highlights.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/register-details"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                View Registration Fees
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Contact Secretariat
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>AOACON 2026 - Association of Obstetric Anaesthesiologists</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
