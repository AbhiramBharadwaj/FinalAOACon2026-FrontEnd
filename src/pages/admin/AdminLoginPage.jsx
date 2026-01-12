import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import logo from './logo.png'
const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.adminLogin(formData); 
      const { token, admin } = response.data;
      
      
      login(token, null, admin); 
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center mb-5">
          <img src={logo} alt="AOACON 2026" width="200" />
        </div>
        
        <h1 className="text-center text-base font-semibold text-slate-900">
          AOACON 2026 Admin Login
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative mb-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] transition-colors"
                placeholder="Admin email"
              />
            </div>
          </div>

          <div>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-300 rounded-xl bg-white placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] transition-colors"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/admin/forgot-password"
              className="text-xs font-medium text-[#005aa9] hover:text-[#004684] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-[#005aa9] hover:bg-[#004684] focus:outline-none focus:ring-1 focus:ring-[#005aa9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors border border-[#005aa9]/40"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </button>
           <Link
                      to="/login"
                        type="button"
                        className="text-[11px] text-slate-600 hover:text-slate-800"
                      >
                        user Login
                      </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
