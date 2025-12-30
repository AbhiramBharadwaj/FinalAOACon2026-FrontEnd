import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus, MapPin, Building2, Stethoscope, Award, Home, Hash } from 'lucide-react';
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
    gender: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    membershipId: '',
    collegeLetter: '',
    // Location Details
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    // Professional Details
    instituteHospital: '',
    designation: '',
    medicalCouncilName: '',
    medicalCouncilNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Complete Country List (250+ countries)
  const [countries, setCountries] = useState([]);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load ALL Countries
  useEffect(() => {
    const allCountries = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 
      'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 
      'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
      'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
      'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)',
      'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Denmark', 'Djibouti', 'Dominica',
      'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
      'Eswatini (fmr. Swaziland)', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
      'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
      'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
      'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
      'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
      'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
      'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia (formerly Macedonia)', 'Norway',
      'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
      'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
      'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
      'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
      'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
      'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
      'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
      'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay',
      'Uzbekistan', 'Vanuatu', 'Vatican City (Holy See)', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];
    setCountries(allCountries);
  }, []);

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
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (formData.role === 'AOA' && !formData.membershipId.trim()) {
      newErrors.membershipId = 'Membership ID is required for AOA members';
    }
    
    if (formData.role === 'PGS' && !formData.collegeLetter.trim()) {
      newErrors.collegeLetter = 'College letter is required for PGS users';
    }

    // New fields validation
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.instituteHospital.trim()) newErrors.instituteHospital = 'Institute/Hospital is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.medicalCouncilName.trim()) newErrors.medicalCouncilName = 'Medical Council name is required';

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
        gender: formData.gender,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        country: formData.country,
        state: formData.state.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        pincode: formData.pincode.trim(),
        instituteHospital: formData.instituteHospital.trim(),
        designation: formData.designation.trim(),
        medicalCouncilName: formData.medicalCouncilName.trim(),
        medicalCouncilNumber: formData.medicalCouncilNumber?.trim() || '',
        ...(formData.role === 'AOA' && { membershipId: formData.membershipId.trim() }),
        ...(formData.role === 'PGS' && { collegeLetter: formData.collegeLetter.trim() })
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
              Shivamogga Institute of Medical Sciences
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

                  {/* NEW FIELDS - TINY STYLE */}
                  <div>
                    <label htmlFor="gender" className="block text-xs font-medium text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-sm border bg-white/70 ${
                        errors.gender 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                      } focus:outline-none focus:ring-1`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
                  </div>

                  {/* Location Fields */}
                  <div>
                    <label htmlFor="country" className="block text-xs font-medium text-slate-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-sm border bg-white/70 ${
                        errors.country 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                      } focus:outline-none focus:ring-1`}
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="state" className="block text-xs font-medium text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.state 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="Karnataka"
                      />
                      {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-xs font-medium text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.city 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="Shimoga"
                      />
                      {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-xs font-medium text-slate-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-sm border resize-none ${
                        errors.address 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                      } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                      placeholder="Full address with landmarks"
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="pincode" className="block text-xs font-medium text-slate-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.pincode 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="577201"
                        maxLength="10"
                      />
                      {errors.pincode && <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                    <div>
                      <label htmlFor="instituteHospital" className="block text-xs font-medium text-slate-700 mb-1">
                        Institute/Hospital *
                      </label>
                      <input
                        id="instituteHospital"
                        name="instituteHospital"
                        type="text"
                        value={formData.instituteHospital}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.instituteHospital 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="Shimoga Institute of Medical Sciences"
                      />
                      {errors.instituteHospital && <p className="text-red-600 text-xs mt-1">{errors.instituteHospital}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="designation" className="block text-xs font-medium text-slate-700 mb-1">
                        Designation *
                      </label>
                      <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.designation 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="Consultant, Professor, Resident"
                      />
                      {errors.designation && <p className="text-red-600 text-xs mt-1">{errors.designation}</p>}
                    </div>
                    <div>
                      <label htmlFor="medicalCouncilName" className="block text-xs font-medium text-slate-700 mb-1">
                        Medical Council Name*
                      </label>
                      <input
                        id="medicalCouncilName"
                        name="medicalCouncilName"
                        type="text"
                        value={formData.medicalCouncilName}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.medicalCouncilName 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="Ex: KMC, MCI, MMC"
                      />
                      {errors.medicalCouncilName && <p className="text-red-600 text-xs mt-1">{errors.medicalCouncilName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="medicalCouncilNumber" className="block text-xs font-medium text-slate-700 mb-1">
                      Council Number
                    </label>
                    <input
                      id="medicalCouncilNumber"
                      name="medicalCouncilNumber"
                      type="text"
                      value={formData.medicalCouncilNumber}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 text-sm border border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253] bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1"
                      placeholder="Ex: KMC12345"
                    />
                  </div>

                  {/* Role-specific fields - ORIGINAL STYLE */}
                  {formData.role === 'AOA' && (
                    <div>
                      <label htmlFor="membershipId" className="block text-xs font-medium text-slate-700 mb-1">
                        AOA Membership ID *
                      </label>
                      <input
                        id="membershipId"
                        name="membershipId"
                        type="text"
                        value={formData.membershipId}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.membershipId 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="AOA123456"
                      />
                      {errors.membershipId && <p className="text-red-600 text-xs mt-1">{errors.membershipId}</p>}
                    </div>
                  )}

                  {formData.role === 'PGS' && (
                    <div>
                      <label htmlFor="collegeLetter" className="block text-xs font-medium text-slate-700 mb-1">
                        College Letter Ref *
                      </label>
                      <input
                        id="collegeLetter"
                        name="collegeLetter"
                        type="text"
                        value={formData.collegeLetter}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-sm border ${
                          errors.collegeLetter 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                        } bg-white/70 placeholder:text-slate-400 focus:outline-none focus:ring-1`}
                        placeholder="SIMS/PGS/2026/001"
                      />
                      {errors.collegeLetter && <p className="text-red-600 text-xs mt-1">{errors.collegeLetter}</p>}
                    </div>
                  )}

                  {/* Password fields - ORIGINAL STYLE */}
                  <div className="grid grid-cols-2 gap-3">
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

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-1">
                        Confirm *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-9 pr-9 py-2.5 text-sm border ${
                            errors.confirmPassword 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-slate-300 focus:ring-[#9c3253] focus:border-[#9c3253]'
                          } bg-white/70 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
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
