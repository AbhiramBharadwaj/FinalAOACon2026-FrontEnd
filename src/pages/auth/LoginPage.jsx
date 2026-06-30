import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import logo from '../../images/main-logo.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      const redirectTo = location.state?.from;

      login(token, user);
      if (user?.isProfileComplete === false) {
        navigate('/profile');
      } else if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-slate-950/72" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_38%)]" />

      <div className="relative z-30 bg-white">
        <Header />
      </div>

      <div className="relative z-0 flex min-h-[calc(100vh-64px)] items-start justify-center px-3 pb-24 pt-4 sm:px-4 sm:py-10 md:items-center">
        <div className="w-full max-w-sm">
          <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/96 shadow-[0_24px_70px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <div className="px-5 pb-3 pt-5 sm:px-7 sm:pt-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <img src={logo} alt="AOACON 2026" className="h-14 w-auto sm:h-16" />
                </div>
              </div>
              <h1 className="text-center text-[2rem] font-semibold tracking-tight text-slate-900 sm:text-[2.2rem]">
                AOACON 2026 Login
              </h1>
              <p className="mt-1.5 text-center text-sm font-medium text-white">
                Shimoga Institute of Medical Sciences
              </p>
            </div>

            <div className="px-5 pb-5 pt-3 sm:px-7 sm:pb-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-12 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#9c3253]/10 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-800"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-slate-800 hover:text-slate-950 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-12 py-3.5 pr-12 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#9c3253]/10 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#9c3253] bg-[#9c3253] px-4 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(156,50,83,0.22)] transition-all duration-200 hover:bg-[#8a2b47] focus:outline-none focus:ring-4 focus:ring-[#9c3253]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

                <div className="border-t border-slate-300 pt-4 text-sm">
                  <p className="text-white">
                    No account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-white underline underline-offset-2 hover:text-white/85"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <p className="px-3 pt-4 text-center text-xs leading-5 text-white sm:text-sm">
            Secure delegate login for registration, accommodation, abstract submission, and award video access.
          </p>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default LoginPage;
