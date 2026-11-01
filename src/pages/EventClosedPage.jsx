import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function EventClosedPage() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-[#005aa9] mb-5">Thank you for being part of AOACON 2026</h1>
          <p className="text-lg text-slate-700 mb-8">The event has concluded. Registrations, payments, bookings, profile changes and submissions are closed. You can continue browsing the website and viewing your existing records.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="rounded-lg bg-[#005aa9] px-6 py-3 text-white">Browse website</Link>
            <Link to="/dashboard" className="rounded-lg border border-[#005aa9] px-6 py-3 text-[#005aa9]">View my records</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
