import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import logo from '../../images/main-logo.png';
import adminLogo from '../admin/logo.png';

const ForgotPasswordPage = ({ isAdmin = false }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isAdmin) {
        await authAPI.adminForgotPassword(email);
      } else {
        await authAPI.forgotPassword(email);
      }
      setSuccess('If this email is registered, a reset link was sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="w-full max-w-sm">
      <div className={isAdmin ? 'bg-white border border-slate-200 rounded-2xl p-6' : 'bg-white/90 border border-white/30 p-6'}>
        <div className="flex justify-center mb-6">
          <img src={isAdmin ? adminLogo : logo} alt="AOACON 2026" className="w-32" />
        </div>
        <h1 className="text-center text-lg font-semibold text-slate-900 mb-1">
          {isAdmin ? 'Admin Reset' : 'Forgot Password'}
        </h1>
        <p className="text-center text-xs text-slate-700 mb-6">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 p-3">
              <p className="text-xs text-emerald-700">{success}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#9c3253] focus:border-[#9c3253] transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#9c3253] hover:bg-[#8a2b47] text-white text-sm font-medium py-2.5 border border-[#9c3253] focus:outline-none focus:ring-2 focus:ring-[#9c3253]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          <Link
            to={isAdmin ? '/admin/login' : '/login'}
            className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        {content}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="bg-white">
        <Header />
      </div>
      <div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
        {content}
        <MobileNav />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
