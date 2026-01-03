import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../utils/api';
import { USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import logo from '../../images/main-logo.png';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const selectCategory = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setStep(2);
  };

  const goBack = () => {
    setStep(1);
    setSelectedRole('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role
      };

      const response = await authAPI.register(submitData);
      const { token, user } = response.data;
      
      login(token, user);
      alert("registration is successfull");
      navigate('/registration');
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
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
      <div className="absolute inset-0 bg-black/70" />
      
      <Header />
      
      <div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
        <div className="w-full max-w-lg">
          <div className="bg-white/90 border border-white/30 p-6">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="AOACON 2026" className="w-32" />
            </div>

            <h1 className="text-center text-lg font-semibold text-slate-900 mb-1">
              AOACON 2026 Register
            </h1>
            <p className="text-center text-xs text-slate-700 mb-6">
              Shimoga Institute of Medical Sciences
            </p>

            {step === 1 ? (
              // Step 1: Category Selection Cards (ORIGINAL STYLE)
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-xs text-slate-600">Select your registration category</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { role: USER_ROLES.AOA, title: 'AOA Member', desc: 'Association member' },
                    { role: USER_ROLES.NON_AOA, title: 'Non-AOA', desc: 'Other professionals' },
                    { role: USER_ROLES.PGS, title: 'PGS & Fellows', desc: 'Postgraduate students' }
                  ].map(({ role, title, desc }) => (
                    <div 
                      key={role}
                      className={`p-4 border-2 cursor-pointer transition-colors ${
                        selectedRole === role 
                          ? 'border-[#9c3253] bg-[#9c3253]/5' 
                          : 'border-slate-300 hover:border-[#9c3253]'
                      }`}
                      onClick={() => selectCategory(role)}
                    >
                      <div className="w-10 h-10 mx-auto mb-2 bg-[#9c3253]/10 border border-[#9c3253]/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#9c3253]" />
                      </div>
                      <h3 className="font-semibold text-xs text-slate-900 text-center mb-1">{title}</h3>
                      <p className="text-xs text-slate-500 text-center">{desc}</p>
                      {selectedRole === role && (
                        <div className="mt-2 w-full h-1 bg-[#9c3253]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Step 2: Registration Form (ORIGINAL TINY STYLE + NEW FIELDS)
              <>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={goBack}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    ← Back
                  </button>
                  <div className="text-xs text-slate-500">
                    Step 2/2: {selectedRole === USER_ROLES.AOA ? 'AOA Member' : 
                              selectedRole === USER_ROLES.NON_AOA ? 'Non-AOA' : 'PGS'}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 p-2">
                      <p className="text-xs text-red-700">{errors.general}</p>
                    </div>
                  )}

                  {/* Basic Fields - ORIGINAL STYLE */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1`}
                        placeholder="Full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-9 pr-3 py-2.5 text-sm border ${
                            errors.email 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                          } bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1`}
                          placeholder="email@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-9 pr-3 py-2.5 text-sm border ${
                            errors.phone 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                          } bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Password fields - ORIGINAL STYLE */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-9 pr-9 py-2.5 text-sm border ${
                          errors.password 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                  </div>

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
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="flex items-center justify-center pt-4 border-t border-slate-200 text-xs mt-4">
              <p className="text-slate-600">
                Have account?{' '}
                <Link to="/login" className="font-medium text-[#9c3253] hover:text-[#8a2b47]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <MobileNav />
      </div>
    </div>
  );
};

export default RegisterPage;
