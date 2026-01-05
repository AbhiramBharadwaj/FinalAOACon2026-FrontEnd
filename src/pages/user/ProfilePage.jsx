import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../utils/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    instituteHospital: '',
    designation: '',
    medicalCouncilName: '',
    medicalCouncilNumber: '',
    membershipId: '',
    collegeLetter: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  };

  const profileRole = profile?.role || user?.role;
  const isProfileComplete = !!profile?.isProfileComplete;

  const validateProfileForm = () => {
    const requiredFields = [
      { key: 'name', label: 'your full name' },
      { key: 'email', label: 'your email' },
      { key: 'phone', label: 'your phone number' },
      { key: 'gender', label: 'your gender' },
      { key: 'country', label: 'your country' },
      { key: 'state', label: 'your state' },
      { key: 'city', label: 'your city' },
      { key: 'pincode', label: 'your pincode' },
      { key: 'address', label: 'your address' },
      { key: 'instituteHospital', label: 'your institute/hospital' },
      { key: 'designation', label: 'your designation' },
      { key: 'medicalCouncilName', label: 'medical council name' },
      { key: 'medicalCouncilNumber', label: 'medical council number' },
    ];

    if (profileRole === 'AOA') {
      requiredFields.push({ key: 'membershipId', label: 'your AOA membership ID' });
    }

    if (profileRole === 'PGS') {
      requiredFields.push({ key: 'collegeLetter', label: 'your college letter reference' });
    }

    const missingField = requiredFields.find((field) => !hasValue(profileForm[field.key]));
    return missingField ? `Please enter ${missingField.label}.` : '';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await userAPI.getMe();
        const profileData = response.data.user;
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          gender: profileData.gender || '',
          country: profileData.country || '',
          state: profileData.state || '',
          city: profileData.city || '',
          address: profileData.address || '',
          pincode: profileData.pincode || '',
          instituteHospital: profileData.instituteHospital || '',
          designation: profileData.designation || '',
          medicalCouncilName: profileData.medicalCouncilName || '',
          medicalCouncilNumber: profileData.medicalCouncilNumber || '',
          membershipId: profileData.membershipId || '',
          collegeLetter: profileData.collegeLetter || ''
        });
        updateUser(profileData);
      } catch {
        setProfileError('Unable to load profile right now.');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      const validationMessage = validateProfileForm();
      if (validationMessage) {
        setProfileError(validationMessage);
        return;
      }

      const response = await userAPI.updateProfile(profileForm);
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      setProfileForm({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        gender: updatedUser.gender || '',
        country: updatedUser.country || '',
        state: updatedUser.state || '',
        city: updatedUser.city || '',
        address: updatedUser.address || '',
        pincode: updatedUser.pincode || '',
        instituteHospital: updatedUser.instituteHospital || '',
        designation: updatedUser.designation || '',
        medicalCouncilName: updatedUser.medicalCouncilName || '',
        medicalCouncilNumber: updatedUser.medicalCouncilNumber || '',
        membershipId: updatedUser.membershipId || '',
        collegeLetter: updatedUser.collegeLetter || ''
      });
      updateUser(updatedUser);
      setProfileMessage(
        updatedUser.isProfileComplete
          ? 'Profile updated.'
          : 'Profile saved. Please complete all required fields.'
      );
    } catch (error) {
      if (error.response?.data?.message) {
        setProfileError(error.response.data.message);
      } else {
        setProfileError('Unable to update profile right now.');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />

      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700 hover:bg-white backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[11px] font-medium text-[#9c3253] uppercase tracking-wide">
                Profile settings
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                Manage your details
              </p>
            </div>
          </div>
          {profile && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border ${
                profile.isProfileComplete
                  ? 'bg-[#7cb342]/10 text-[#7cb342] border-[#7cb342]/30'
                  : 'bg-[#ff8a1f]/10 text-[#ff8a1f] border-[#ff8a1f]/30'
              }`}
            >
              {profile.isProfileComplete ? 'Profile complete' : 'Profile incomplete'}
            </span>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 mb-4">
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#9c3253]" />
              Role: {profileRole || 'Attendee'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#ff8a1f]" />
              Email and phone are locked after registration.
            </span>
          </div>

          {profileError && (
            <div className="bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 mb-3">
              {profileError}
            </div>
          )}
          {profileMessage && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 mb-3">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-name">
                  Full Name *
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-email">
                  Email *
                </label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  disabled
                  readOnly
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-slate-100 text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9c3253] disabled:cursor-not-allowed"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-phone">
                  Phone *
                </label>
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  required
                  disabled
                  readOnly
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-slate-100 text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9c3253] disabled:cursor-not-allowed"
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-gender">
                  Gender *
                </label>
                <select
                  id="profile-gender"
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-country">
                  Country *
                </label>
                <input
                  id="profile-country"
                  name="country"
                  type="text"
                  value={profileForm.country}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="India"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-state">
                  State *
                </label>
                <input
                  id="profile-state"
                  name="state"
                  type="text"
                  value={profileForm.state}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Karnataka"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-city">
                  City *
                </label>
                <input
                  id="profile-city"
                  name="city"
                  type="text"
                  value={profileForm.city}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Shimoga"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-pincode">
                  Pincode *
                </label>
                <input
                  id="profile-pincode"
                  name="pincode"
                  type="text"
                  value={profileForm.pincode}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="577201"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-address">
                Address *
              </label>
              <textarea
                id="profile-address"
                name="address"
                rows="2"
                value={profileForm.address}
                onChange={handleProfileChange}
                required
                className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                placeholder="Full address with landmarks"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-instituteHospital">
                  Institute/Hospital *
                </label>
                <input
                  id="profile-instituteHospital"
                  name="instituteHospital"
                  type="text"
                  value={profileForm.instituteHospital}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Shimoga Institute of Medical Sciences"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-designation">
                  Designation *
                </label>
                <input
                  id="profile-designation"
                  name="designation"
                  type="text"
                  value={profileForm.designation}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Consultant, Professor, Resident"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-medicalCouncilName">
                  Medical Council Name *
                </label>
                <input
                  id="profile-medicalCouncilName"
                  name="medicalCouncilName"
                  type="text"
                  value={profileForm.medicalCouncilName}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Ex: KMC, MCI, MMC"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-medicalCouncilNumber">
                  Council Number *
                </label>
                <input
                  id="profile-medicalCouncilNumber"
                  name="medicalCouncilNumber"
                  type="text"
                  value={profileForm.medicalCouncilNumber}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="Ex: KMC12345"
                />
              </div>
            </div>

            {profileRole === 'AOA' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-membershipId">
                  AOA Membership ID *
                </label>
                <input
                  id="profile-membershipId"
                  name="membershipId"
                  type="text"
                  value={profileForm.membershipId}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="AOA123456"
                />
              </div>
            )}

            {profileRole === 'PGS' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="profile-collegeLetter">
                  College Letter Ref *
                </label>
                <input
                  id="profile-collegeLetter"
                  name="collegeLetter"
                  type="text"
                  value={profileForm.collegeLetter}
                  onChange={handleProfileChange}
                  required
                  className="block w-full px-3 py-2 text-xs border border-slate-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#9c3253]"
                  placeholder="SIMS/PGS/2026/001"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#9c3253] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#8a2b47] disabled:opacity-60"
              >
                {profileSaving ? 'Saving...' : isProfileComplete ? 'Update profile' : 'Save profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={profileSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#9c3253]/30 bg-white text-[#9c3253] px-4 py-2.5 text-xs sm:text-sm font-semibold hover:border-[#9c3253]/50 hover:text-[#8a2b47] disabled:opacity-60"
              >
                Go and book registration
              </button>
            </div>
          </form>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default ProfilePage;
