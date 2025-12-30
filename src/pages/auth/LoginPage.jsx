import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

      login(token, user);
      navigate('/');
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
      {}
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="bg-white">
        <Header />
      </div>
      
      <div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
        <div className="w-full max-w-sm">
          {}
        

          {}
          <div className="bg-white/90 border border-white/30 p-6">
            <div className="flex justify-center mb-6">
            <img src={logo} alt="AOACON 2026" className="w-32 " />
          </div>
            <h1 className="text-center text-lg font-semibold text-slate-900 mb-1">
              AOACON 2026 Login
            </h1>
            <p className="text-center text-xs text-slate-700 mb-6">
              Shimoga Institute of Medical Sciences
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 p-3">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700 mb-2"
                >
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
                    value={formData.email}
                    onChange={handleChange}
                    className="
                      block w-full
                      pl-10 pr-3 py-2.5
                      text-sm
                      border border-slate-300
                      bg-white/70
                      placeholder:text-slate-400
                      text-slate-900
                      focus:outline-none focus:ring-1 focus:ring-[#9c3253] focus:border-[#9c3253]
                      transition-colors
                    "
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="
                      block w-full
                      pl-10 pr-10 py-2.5
                      text-sm
                      border border-slate-300
                      bg-white/70
                      placeholder:text-slate-400
                      text-slate-900
                      focus:outline-none focus:ring-1 focus:ring-[#9c3253] focus:border-[#9c3253]
                      transition-colors
                    "
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center gap-2
                  bg-[#9c3253]
                  hover:bg-[#8a2b47]
                  text-white
                  text-sm font-medium
                  py-2.5
                  border border-[#9c3253]
                  focus:outline-none focus:ring-2 focus:ring-[#9c3253]/30
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <Link
                  to="/admin/login"
                  className="font-medium text-[#9c3253] hover:text-[#8a2b47] transition-colors"
                >
                  Admin Login
                </Link>
                <div className="text-right">
                  <p className="text-slate-600">
                    No account?{' '}
                    <Link
                      to="/register"
                      className="font-medium text-[#9c3253] hover:text-[#8a2b47]"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default LoginPage;
