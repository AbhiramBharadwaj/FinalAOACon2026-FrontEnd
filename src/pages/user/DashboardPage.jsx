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
} from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    registration: null,
    accommodations: [],
    abstract: null,
    feedback: null,
  });

  const { user } = useAuth();
  const {
    stepperProgress,
    setRegistration,
    setAccommodationBookings,
    setAbstract,
    setFeedback,
  } = useApp();
  const navigate = useNavigate();

  const steps = [
    { key: 'registration', label: 'Registration', short: 'Reg' },
    { key: 'accommodation', label: 'Accommodation', short: 'Stay' },
    { key: 'conferenceDays', label: 'Conference Days', short: 'Days' },
    { key: 'abstractUpload', label: 'Abstract', short: 'Abs' },
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

  const getRegistrationTypeText = (type) => {
    const texts = {
      CONFERENCE_ONLY: 'Conference Only',
      WORKSHOP_CONFERENCE: 'Workshop + Conference',
      COMBO: 'Combo Package',
      AOA_CERTIFIED_COURSE: 'AOA Certified Course Only',
    };
    return texts[type] || type;
  };

  const getBookingPhaseText = (phase) => {
    const texts = {
      EARLY_BIRD: 'Early Bird',
      REGULAR: 'Regular',
      SPOT: 'Spot Booking',
    };
    return texts[phase] || phase;
  };

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

  const getCurrentStep = () => {
    if (!stepperProgress.registration) return 0;
    if (!stepperProgress.accommodation) return 1;
    if (!stepperProgress.conferenceDays) return 2;
    if (!stepperProgress.abstractUpload) return 3;
    return 4;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

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
                Step {getCurrentStep() + 1} of 5
              </span>
            </div>
            <div className="relative flex items-center -space-x-px">
              <div className="absolute inset-x-6 inset-y-1/2 -z-10 h-px bg-slate-200" />
              {steps.map((step, index) => {
                const active = index <= getCurrentStep();
                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center min-w-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#9c3253] border-[#9c3253] text-white shadow-md'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`mt-2 text-[11px] text-center font-medium truncate ${
                      active ? 'text-[#9c3253]' : 'text-slate-500'
                    }`}>
                      {window.innerWidth < 640 ? step.short : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {!stats.registration && (
            <button
              onClick={() => navigate('/registration')}
              className="group bg-white/90 backdrop-blur-xl border border-[#9c3253]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#9c3253]/50 transition-all"
            >
              <CreditCard className="w-5 h-5 mx-auto mb-2 text-[#9c3253] group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-slate-900">Register</p>
              <p className="text-[11px] text-slate-600">Start now</p>
            </button>
          )}
          <button
            onClick={() => navigate('/accommodation')}
            className="group bg-white/90 backdrop-blur-xl border border-[#ff8a1f]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#ff8a1f]/50 transition-all"
          >
            <Hotel className="w-5 h-5 mx-auto mb-2 text-[#ff8a1f] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Stay</p>
            <p className="text-[11px] text-slate-600">Book hotel</p>
          </button>
          <button
            onClick={() => navigate('/abstract/rules')}
            className="group bg-white/90 backdrop-blur-xl border border-[#7cb342]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#7cb342]/50 transition-all"
          >
            <FileText className="w-5 h-5 mx-auto mb-2 text-[#7cb342] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Abstract</p>
            <p className="text-[11px] text-slate-600">Submit</p>
          </button>
          <button
            onClick={() => navigate('/feedback')}
            className="group bg-white/90 backdrop-blur-xl border border-[#ff8a1f]/30 rounded-2xl px-3 py-3 text-center text-xs sm:text-sm hover:border-[#ff8a1f]/50 transition-all"
          >
            <MessageSquare className="w-5 h-5 mx-auto mb-2 text-[#ff8a1f] group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900">Feedback</p>
            <p className="text-[11px] text-slate-600">After event</p>
          </button>
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
                  <button className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#9c3253] hover:text-[#8a2b47]">
                    <Download className="w-3.5 h-3.5" />
                    Invoice
                  </button>
                )}
              </div>

              {stats.registration ? (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-[#9c3253]/5 px-3 py-3 border border-[#9c3253]/20">
                    <div>
                      <p className="font-medium text-slate-900">
                        {getRegistrationTypeText(stats.registration.registrationType)}
                      </p>
                      {stats.registration.addAoaCourse && (
                        <p className="text-[11px] text-purple-700 font-medium mt-1 flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          + AOA Certified Course
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

                  {stats.registration.lifetimeMembershipId && (
                    <div className="rounded-xl bg-[#7cb342]/10 px-3 py-2 flex items-center gap-2 border border-[#7cb342]/20">
                      <Award className="w-4 h-4 text-[#7cb342]" />
                      <span className="text-xs sm:text-sm">
                        Lifetime ID:{' '}
                        <span className="font-semibold text-[#7cb342]">
                          {stats.registration.lifetimeMembershipId}
                        </span>
                      </span>
                    </div>
                  )}

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
                    className="inline-flex items-center justify-center rounded-xl bg-[#9c3253] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#8a2b47]"
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
                  className="text-[11px] sm:text-xs font-medium text-[#ff8a1f] hover:text-[#e67e22]"
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
                    className="inline-flex items-center justify-center rounded-xl bg-[#ff8a1f] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#e67e22]"
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
                    onClick={() => navigate('/abstract')}
                    className="mt-2 w-full rounded-xl bg-[#7cb342] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#68c239]"
                  >
                    View abstract
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-[#7cb342]/60 mx-auto mb-3" />
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">
                    No abstract submitted.
                  </p>
                  <button
                    onClick={() => navigate('/abstract/rules')}
                    className="w-full rounded-xl bg-[#7cb342] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#68c239]"
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
                    className="w-full rounded-xl bg-[#ff8a1f] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#e67e22]"
                  >
                    Submit feedback
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="text-sm font-semibold mb-3 text-slate-900">Conference details</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 rounded-xl bg-[#9c3253]/5 px-3 py-2 border border-[#9c3253]/20">
                  <Calendar className="w-4 h-4 text-[#9c3253]" />
                  <span>Oct 30 – Nov 1, 2026</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#ff8a1f]/5 px-3 py-2 border border-[#ff8a1f]/20">
                  <MapPin className="w-4 h-4 text-[#ff8a1f]" />
                  <span>Hotel Royal Orchid, Shivamogga</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#7cb342]/5 px-3 py-2 border border-[#7cb342]/20">
                  <Users className="w-4 h-4 text-[#7cb342]" />
                  <span>5000+ delegates expected</span>
                </div>
                <button
                  onClick={() => navigate('/program')}
                  className="w-full rounded-xl bg-[#9c3253] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-[#8a2b47]"
                >
                  View full program
                </button>
              </div>
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