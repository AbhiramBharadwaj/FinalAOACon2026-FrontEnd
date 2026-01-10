import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  User,
  Mail,
  Award,
  CheckCircle,
  Clock,
  ArrowLeft,
  Hotel,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  MapPin,
  Download,
  Star,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import {
  registrationAPI,
  accommodationAPI,
  abstractAPI,
  feedbackAPI,
  API_BASE_URL,
  userAPI,
} from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const WORKSHOP_LABELS = {
    'labour-analgesia': 'Labour Analgesia',
    'critical-incidents': 'Critical Incidents in Obstetric Anaesthesia',
    pocus: 'POCUS in Obstetric Anaesthesia',
    'maternal-collapse': 'Maternal Resuscitation and Regional Blocks in Obstetric Anaesthesia',
  };

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    registration: null,
    accommodations: [],
    abstract: null,
    feedback: null,
  });
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const { user, updateUser } = useAuth();
  const {
    setRegistration,
    setAccommodationBookings,
    setAbstract,
    setFeedback,
  } = useApp();
  const navigate = useNavigate();

  const steps = [
    { key: 'profile', label: 'Profile', short: 'Profile' },
    { key: 'registration', label: 'Registration', short: 'Reg' },
    { key: 'accommodation', label: 'Accommodation', short: 'Stay' },
    { key: 'abstract', label: 'Abstract', short: 'Abs' },
    { key: 'feedback', label: 'Feedback', short: 'Fb' },
  ];

  const getRoleText = (role) => {
    const texts = {
      AOA: 'AOA Member',
      NON_AOA: 'Non-AOA Member',
      PGS: 'PGS & Fellows',
    };
    return texts[role] || role;
  };

  const getRegistrationTypeText = (registration) => {
    const labels = [];
    if (registration?.addWorkshop || registration?.selectedWorkshop) labels.push('Workshop');
    if (registration?.addAoaCourse) labels.push('AOA Certified Course');
    if (registration?.addLifeMembership) labels.push('AOA Life Membership');
    return labels.length ? `Conference + ${labels.join(' + ')}` : 'Conference Only';
  };

  const getBookingPhaseText = (phase) => {
    const texts = {
      EARLY_BIRD: 'Early Bird',
      REGULAR: 'Regular',
      SPOT: 'Spot Booking',
    };
    return texts[phase] || phase;
  };

  const getWorkshopLabel = (workshopId) =>
    WORKSHOP_LABELS[workshopId] || workshopId || 'N/A';

  const getBookingPhaseBadge = (phase) => {
    const map = {
      EARLY_BIRD: 'bg-[#9c3253]/10 text-[#9c3253] border-[#9c3253]/30',
      REGULAR: 'bg-[#ff8a1f]/10 text-[#ff8a1f] border-[#ff8a1f]/30',
      SPOT: 'bg-[#7cb342]/10 text-[#7cb342] border-[#7cb342]/30',
    };
    return map[phase] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getStatusBadge = (status) => {
    const map = {
      PAID: {
        color: 'bg-[#7cb342]/20 text-[#7cb342] border border-[#7cb342]/30',
        icon: CheckCircle,
      },
      PENDING: {
        color: 'bg-[#ff8a1f]/20 text-[#ff8a1f] border border-[#ff8a1f]/30',
        icon: Clock,
      },
      FAILED: {
        color: 'bg-red-500/20 text-red-400 border border-red-400/30',
        icon: Clock,
      },
    };
    const badge = map[status] || { color: 'bg-slate-500/20 text-slate-500 border border-slate-400/30', icon: Clock };
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const abstractFileUrl = stats.abstract?.filePath
    ? `${API_BASE_URL}/${stats.abstract.filePath}`
    : null;
  const profileRole = profile?.role || user?.role;
  const isProfileComplete = !!profile?.isProfileComplete;
  const stepCompletion = {
    profile: isProfileComplete,
    registration: !!stats.registration,
    accommodation: stats.accommodations.length > 0,
    abstract: !!stats.abstract,
    feedback: !!stats.feedback,
  };
  const completedCount = steps.reduce(
    (count, step) => count + (stepCompletion[step.key] ? 1 : 0),
    0
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      try {
        setProfileLoading(true);
        const profileResponse = await userAPI.getMe();
        const profileData = profileResponse.data.user;
        setProfile(profileData);
        updateUser(profileData);
      } catch {
      } finally {
        setProfileLoading(false);
      }

      try {
        const regResponse = await registrationAPI.getMyRegistration();
        setStats((prev) => ({ ...prev, registration: regResponse.data }));
        setRegistration(regResponse.data);
      } catch {}

      try {
        const accResponse = await accommodationAPI.getMyBookings();
        setStats((prev) => ({ ...prev, accommodations: accResponse.data }));
        setAccommodationBookings(accResponse.data);
      } catch {}

      try {
        const abstractResponse = await abstractAPI.getMyAbstract();
        setStats((prev) => ({ ...prev, abstract: abstractResponse.data }));
        setAbstract(abstractResponse.data);
      } catch {}

      try {
        const feedbackResponse = await feedbackAPI.getMyFeedback();
        setStats((prev) => ({ ...prev, feedback: feedbackResponse.data }));
        setFeedback(feedbackResponse.data);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20">
        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700 hover:bg-white backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[11px] font-medium text-[#9c3253] uppercase tracking-wide">
                AOACON 2026 dashboard
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-[#ff8a1f]" />
            <span>Oct 30 – Nov 1, 2026 • Shivamogga</span>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#9c3253] to-[#ff8a1f] text-white">
              <User className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-semibold truncate text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs text-slate-600">
                {getRoleText(user?.role)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9c3253]" />
                <h2 className="text-sm font-semibold text-slate-900">Overall progress</h2>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Completed {completedCount} of {steps.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map((step) => {
                const active = stepCompletion[step.key];
                const isProfileStep = step.key === 'profile';
                const activeStyles = isProfileStep
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-[#9c3253]/20 bg-[#9c3253]/10 text-[#9c3253]';
                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      active ? activeStyles : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active
                          ? isProfileStep
                            ? 'bg-emerald-500'
                            : 'bg-[#9c3253]'
                          : 'bg-slate-300'
                      }`}
                    />
                    <span className="truncate">
                      {window.innerWidth < 640 ? step.short : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {}
        {!isProfileComplete && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-xl">
            Complete your profile to unlock registration, accommodation, abstract submission, and feedback.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {!stats.registration && (
            <button
              onClick={() => navigate('/registration')}
              disabled={!isProfileComplete}
              className="group bg-white/90 backdrop-blur-xl border border-[#9c3253]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#9c3253]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5 mx-auto mb-2 text-[#9c3253] group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-slate-900">Register</p>
              <p className="text-[11px] text-slate-600">Start now</p>
            </button>
          )}
          <button
            onClick={() => navigate('/accommodation')}
            disabled={!isProfileComplete}
            className="group bg-white/90 backdrop-blur-xl border border-[#ff8a1f]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#ff8a1f]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Hotel className="w-5 h-5 mx-auto mb-2 text-[#ff8a1f] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Stay</p>
            <p className="text-[11px] text-slate-600">Book hotel</p>
          </button>
          <button
            onClick={() => navigate('/abstract/rules')}
            disabled={!isProfileComplete}
            className="group bg-white/90 backdrop-blur-xl border border-[#7cb342]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#7cb342]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5 mx-auto mb-2 text-[#7cb342] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Abstract</p>
            <p className="text-[11px] text-slate-600">Submit</p>
          </button>
          <button
            onClick={() => navigate('/feedback')}
            disabled={!isProfileComplete}
            className="group bg-white/90 backdrop-blur-xl border border-[#ff8a1f]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#ff8a1f]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-5 h-5 mx-auto mb-2 text-[#ff8a1f] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Feedback</p>
            <p className="text-[11px] text-slate-600">After event</p>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Profile details</h2>
              <p className="text-[11px] text-slate-600">
                Complete your profile before continuing with registration and bookings.
              </p>
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

          {profileLoading ? (
            <div className="py-6">
              <LoadingSpinner size="sm" text="Loading profile..." />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#9c3253]" />
                  Role: {getRoleText(profileRole)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#ff8a1f]" />
                  Email and phone are locked after registration.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                  <p className="text-[11px] text-slate-500">Full name</p>
                  <p className="font-semibold text-slate-900 truncate">{profile?.name || user?.name || '-'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                  <p className="text-[11px] text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900 truncate">{profile?.email || user?.email || '-'}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                  <p className="text-[11px] text-slate-500">Medical council no.</p>
                  <p className="font-semibold text-slate-900 truncate">
                    {profile?.medicalCouncilNumber || 'Not added'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9c3253] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#8a2b47]"
                >
                  {isProfileComplete ? 'Edit profile' : 'Complete profile'}
                </button>
                {!isProfileComplete && (
                  <span className="text-[11px] text-slate-600">
                    Profile details are required before registration and bookings.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 space-y-5">
            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                  <CreditCard className="w-4 h-4 text-[#9c3253]" />
                  Registration
                  {stats.registration?.registrationNumber && (
                    <span className="text-[11px] font-normal text-slate-600/80">
                      #{stats.registration.registrationNumber}
                    </span>
                  )}
                </h2>
                {stats.registration && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/registration')}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#9c3253] hover:text-[#8a2b47]"
                    >
                      Edit registration
                    </button>
                    <button className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#9c3253] hover:text-[#8a2b47]">
                      <Download className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </div>
                )}
              </div>

              {stats.registration ? (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-[#9c3253]/5 px-3 py-3 border border-[#9c3253]/20">
                    <div>
                      <p className="font-medium text-slate-900">
                        {getRegistrationTypeText(stats.registration)}
                      </p>
                      {stats.registration.addWorkshop && stats.registration.selectedWorkshop && (
                        <p className="text-[11px] text-slate-600 mt-1">
                          Workshop: {getWorkshopLabel(stats.registration.selectedWorkshop)}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-600/80 mt-1">
                        Booking phase: {getBookingPhaseText(stats.registration.bookingPhase)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(stats.registration.paymentStatus)}
                      <p className="text-sm font-bold text-[#9c3253]">
                        ₹{stats.registration.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {}
                  <div className="bg-slate-50/70 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conference Package</span>
                      <span>₹{stats.registration.packageBase.toLocaleString()}</span>
                    </div>
                    {stats.registration.addAoaCourse && (
                      <div className="flex justify-between text-purple-700">
                        <span>AOA Course Add-on</span>
                        <span>₹{stats.registration.aoaCourseBase.toLocaleString()}</span>
                      </div>
                    )}
                    {stats.registration.accompanyingPersons > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Accompanying ({stats.registration.accompanyingPersons})</span>
                        <span>₹{stats.registration.accompanyingBase.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-300 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Base</span>
                        <span>₹{stats.registration.totalBase.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>GST (18%)</span>
                      <span>+₹{stats.registration.totalGST.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>Processing Fee (1.65%)</span>
                      <span>+₹{stats.registration.processingFee.toLocaleString()}</span>
                    </div>
                  </div>

                  {}
                  {stats.registration.paymentStatus === 'PENDING' && (
                  <div>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff8a1f] text-white px-4 py-3 text-sm font-semibold hover:bg-orange-600 transition"
                    >
                      <CreditCard className="w-4 h-4" />
                      Complete Payment
                    </button>

                      <button
                    onClick={() => navigate('/registration')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#9c3253] text-[#9c3253] px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#9c3253]/5 transition"
                  >
                    Edit Registration
                  </button>

                  </div>

                  )}

                  {}
                  
                </div>
              ) : (
                <div className="text-center py-10 rounded-xl bg-slate-50/50 border border-slate-200/50">
                  <CreditCard className="w-10 h-10 text-[#9c3253]/50 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-2">
                    You have not registered yet.
                  </p>
                  <button
                    onClick={() => navigate('/registration')}
                    disabled={!isProfileComplete}
                    className="inline-flex items-center justify-center rounded-xl bg-[#9c3253] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#8a2b47] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Register now
                  </button>
                </div>
              )}
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                  <Hotel className="w-4 h-4 text-[#ff8a1f]" />
                  Accommodation
                  <span className="text-[11px] font-normal text-slate-600/80">
                    ({stats.accommodations.length})
                  </span>
                </h2>
                <button
                  onClick={() => navigate('/accommodation')}
                  disabled={!isProfileComplete}
                  className="text-[11px] sm:text-xs font-medium text-[#ff8a1f] hover:text-[#e67e22] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View all
                </button>
              </div>

              {stats.accommodations.length > 0 ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  {stats.accommodations.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="rounded-xl bg-[#ff8a1f]/5 px-3 py-3 border border-[#ff8a1f]/20">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-medium text-slate-900 truncate">
                          {booking.accommodationId?.name || 'Hotel Booking'}
                        </p>
                        {getStatusBadge(booking.paymentStatus)}
                      </div>
                      <p className="text-[11px] text-slate-600/80 mb-1">
                        Check-in: {new Date(booking.checkInDate).toLocaleDateString('en-IN')}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-900">
                        <span>{booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
                        <span className="font-semibold text-[#ff8a1f]">
                          ₹{booking.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {stats.accommodations.length > 3 && (
                    <p className="text-center text-[11px] text-slate-600/80 pt-1">
                      +{stats.accommodations.length - 3} more bookings
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 rounded-xl bg-[#ff8a1f]/5 border border-[#ff8a1f]/20">
                  <Hotel className="w-10 h-10 text-[#ff8a1f]/50 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-2">
                    No accommodation booked yet.
                  </p>
                  <button
                    onClick={() => navigate('/accommodation')}
                    disabled={!isProfileComplete}
                    className="inline-flex items-center justify-center rounded-xl bg-[#ff8a1f] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#e67e22] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book stay
                  </button>
                </div>
              )}
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900">
                <Clock className="w-4 h-4 text-[#9c3253]" />
                Recent activity
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {stats.registration && (
                  <div className="flex items-center rounded-xl bg-[#9c3253]/5 px-3 py-3 border border-[#9c3253]/20">
                    <CheckCircle className="w-4 h-4 text-[#7cb342] mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        Registration #{stats.registration.registrationNumber}
                      </p>
                      <p className="text-[11px] text-slate-600/80">
                        {stats.registration.paymentStatus} •{' '}
                        {new Date(stats.registration.updatedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
                {stats.accommodations[0] && (
                  <div className="flex items-center rounded-xl bg-[#ff8a1f]/5 px-3 py-3 border border-[#ff8a1f]/20">
                    <Hotel className="w-4 h-4 text-[#ff8a1f] mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {stats.accommodations[0].accommodationId?.name}
                      </p>
                      <p className="text-[11px] text-slate-600/80">
                        Booking created •{' '}
                        {new Date(stats.accommodations[0].createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
                {stats.abstract && (
                  <div className="flex items-center rounded-xl bg-[#7cb342]/5 px-3 py-3 border border-[#7cb342]/20">
                    <FileText className="w-4 h-4 text-[#7cb342] mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {stats.abstract.title}
                      </p>
                      <p className="text-[11px] text-slate-600/80">
                        {stats.abstract.status} •{' '}
                        {new Date(stats.abstract.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
                {!stats.registration && !stats.accommodations.length && !stats.abstract && (
                  <p className="text-[11px] text-slate-600/80 text-center py-4">
                    No recent activity yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {}
          <section className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900">
                <FileText className="w-4 h-4 text-[#7cb342]" />
                Abstract
              </h3>
              {stats.abstract ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600/90">Status</span>
                    {getStatusBadge(stats.abstract.status)}
                  </div>
                  <p className="font-medium text-slate-900 truncate">{stats.abstract.title}</p>
                  <p className="text-[11px] text-slate-600/80">
                    #{stats.abstract.submissionNumber}
                  </p>
                  <button
                    onClick={() => navigate('/abstract/upload')}
                    className="mt-2 w-full rounded-xl bg-[#7cb342] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#68c239]"
                  >
                    View abstract
                  </button>
                  {abstractFileUrl && (
                    <a
                      href={abstractFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center rounded-xl border border-[#7cb342]/40 text-[#7cb342] px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-[#7cb342]/10"
                    >
                      View uploaded file
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-[#7cb342]/60 mx-auto mb-3" />
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">
                    No abstract submitted.
                  </p>
                  <button
                    onClick={() => navigate('/abstract/rules')}
                    disabled={!isProfileComplete}
                    className="w-full rounded-xl bg-[#7cb342] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#68c239] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Submit abstract
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900">
                <MessageSquare className="w-4 h-4 text-[#ff8a1f]" />
                Feedback
              </h3>
              {stats.feedback ? (
                <div className="text-center py-8 text-xs sm:text-sm">
                  <CheckCircle className="w-10 h-10 text-[#7cb342] mx-auto mb-3" />
                  <p className="font-semibold text-slate-900 mb-1">Feedback submitted</p>
                  <p className="text-[11px] text-slate-600">
                    {new Date(stats.feedback.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-xs sm:text-sm">
                  <MessageSquare className="w-10 h-10 text-[#ff8a1f]/70 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">
                    Share your experience after the conference.
                  </p>
                  <button
                    onClick={() => navigate('/feedback')}
                    disabled={!isProfileComplete}
                    className="w-full rounded-xl bg-[#ff8a1f] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#e67e22] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Submit feedback
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 grid grid-cols-2 gap-3 text-center text-xs sm:text-sm">
              <div>
                <p className="text-lg sm:text-xl font-semibold text-[#9c3253]">
                  {stats.registration ? 1 : 0}
                </p>
                <p className="text-[11px] text-slate-600">Registrations</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-semibold text-[#ff8a1f]">
                  {stats.accommodations.length}
                </p>
                <p className="text-[11px] text-slate-600">Stays booked</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default DashboardPage;
