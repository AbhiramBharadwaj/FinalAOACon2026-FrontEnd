import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  CreditCard,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Users as UsersIcon,
  Calendar,
  XCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { registrationAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WORKSHOPS = [
  { id: 'labour-analgesia', name: 'Labour Analgesia', leads: 'Dr Bharath & team' },
  { id: 'critical-incidents', name: 'Critical Incidents in Obstetric Anaesthesia', leads: 'Dr Sandhya & team' },
  { id: 'pocus', name: 'POCUS in Obstetric Anaesthesia', leads: 'Dr Praveen Kumar & team' },
  { id: 'maternal-collapse', name: 'Maternal Collapse & Resuscitation / Obstetric RA Blocks', leads: 'Dr Vikram & team' },
];

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    registrationType: '',
    selectedWorkshop: '',
    accompanyingPersons: 0,
  });
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [collegeLetter, setCollegeLetter] = useState(null);

  const { user, loading: authLoading } = useAuth();
  const { setRegistration } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPricing();
    }
  }, [authLoading, user]);

  const fetchPricing = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await registrationAPI.getPricing();
      setPricing(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to load pricing. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setCollegeLetter(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registrationType) {
      setError('Please select a registration type');
      return;
    }

    const isWorkshopType =
      formData.registrationType === 'WORKSHOP_CONFERENCE' ||
      formData.registrationType === 'COMBO';

    if (isWorkshopType && !formData.selectedWorkshop) {
      setError('Please select a workshop');
      return;
    }

    if (
      formData.registrationType === 'AOA_CERTIFIED_COURSE' &&
      user.role === 'PGS'
    ) {
      setError('AOA Certified Course is only for AOA and Non-AOA members');
      return;
    }

    if (user.role === 'PGS' && !collegeLetter) {
      setError('College letter is required for PGS & Fellows');
      return;
    }

    if (
      pricing?.pricing?.[formData.registrationType]?.totalAmount <= 0
    ) {
      setError('This package is not available in the current booking phase');
      return;
    }

    if (
      formData.registrationType === 'AOA_CERTIFIED_COURSE' &&
      pricing?.meta?.aoaCourseFull
    ) {
      setError('AOA Certified Course seats are full');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('registrationType', formData.registrationType);
      if (
        formData.registrationType === 'WORKSHOP_CONFERENCE' ||
        formData.registrationType === 'COMBO'
      ) {
        submitData.append('selectedWorkshop', formData.selectedWorkshop);
      }
      submitData.append(
        'accompanyingPersons',
        String(formData.accompanyingPersons)
      );

      if (user.role === 'PGS' && collegeLetter) {
        submitData.append('collegeLetter', collegeLetter);
      }

      const response = await registrationAPI.create(submitData);
      setRegistration(response.data.registration);
      navigate('/checkout');
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getBookingPhaseText = (phase) => {
    const texts = {
      EARLY_BIRD: 'Early Bird',
      REGULAR: 'Regular',
      SPOT: 'Spot Booking',
    };
    return texts[phase] || phase;
  };

  const getRoleText = (role) => {
    const texts = {
      AOA: 'AOA Member',
      NON_AOA: 'Non-AOA Member',
      PGS: 'PGS & Fellows',
    };
    return texts[role] || role;
  };

  const getRegistrationTypeDisplay = (type) => {
    const display = {
      CONFERENCE_ONLY: 'Conference Only',
      WORKSHOP_CONFERENCE: 'Workshop + Conference',
      COMBO: 'Combo Package',
      AOA_CERTIFIED_COURSE: 'AOA Certified Course Only',
    };
    return display[type] || type;
  };

  const isWorkshopType =
    formData.registrationType === 'WORKSHOP_CONFERENCE' ||
    formData.registrationType === 'COMBO';

  const isAOACourse = formData.registrationType === 'AOA_CERTIFIED_COURSE';

  // Accompanying persons are now allowed for ALL categories (including AOA Certified Course)
  const getAccompanyingPrice = () =>
    formData.accompanyingPersons * 7000;

  const getTotalAmount = () => {
    if (
      !formData.registrationType ||
      !pricing?.pricing?.[formData.registrationType]
    )
      return 0;
    const baseTotal =
      pricing.pricing[formData.registrationType].totalAmount || 0;
    return baseTotal + getAccompanyingPrice();
  };

  const shouldHideAOACourse = user?.role === 'PGS';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading registration..." />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/70 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20 max-w-6xl">
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#9c3253] uppercase">
                AOACON 2026 • Shivamogga
              </p>
              <h1 className="text-lg font-semibold text-slate-900 mt-1">
                Conference Registration
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Register for the annual AOACON conference, workshops and AOA certified course.
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1 text-xs">
              <div className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9c3253]" />
                <span>Oct 30 – Nov 1, 2026</span>
              </div>
              {pricing && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff8a1f]/10 text-[#ff8a1f] border border-[#ff8a1f]/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {getBookingPhaseText(pricing.bookingPhase)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-400/50 backdrop-blur-sm px-3 py-2 text-xs text-red-100 rounded-lg">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <section className="lg:col-span-2 space-y-5">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#9c3253]" />
                Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 border border-slate-200/50 bg-[#9c3253]/5 px-3 py-2 rounded">
                  <User className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Name</p>
                    <p className="font-medium text-slate-900 truncate">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border border-slate-200/50 bg-[#ff8a1f]/5 px-3 py-2 rounded">
                  <Mail className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Email</p>
                    <p className="font-medium text-slate-900 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border border-slate-200/50 bg-[#7cb342]/5 px-3 py-2 rounded">
                  <Award className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Category</p>
                    <p className="font-medium text-slate-900">{getRoleText(user?.role)}</p>
                  </div>
                </div>
                {user?.membershipId && (
                  <div className="flex items-center gap-3 border border-slate-200/50 bg-[#9c3253]/5 px-3 py-2 rounded">
                    <CreditCard className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Membership ID</p>
                      <p className="font-medium text-slate-900">{user.membershipId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {user?.role === 'PGS' && (
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#ff8a1f]" />
                  College recommendation letter
                  <span className="text-[11px] font-normal text-slate-500">(required for PGS)</span>
                </h2>
                <div className="border border-dashed border-[#7cb342]/30 bg-[#7cb342]/5 px-4 py-6 text-center rounded">
                  <FileText className="w-8 h-8 text-[#7cb342] mx-auto mb-2" />
                  <p className="text-xs text-slate-700 mb-2">
                    Upload signed letter from your institution (PDF, max 5MB).
                  </p>
                  <label className="inline-flex items-center px-4 py-2 rounded border border-[#9c3253] text-[#9c3253] text-xs font-medium bg-[#9c3253]/5 hover:bg-[#9c3253]/10 cursor-pointer transition-colors">
                    Choose PDF file
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  {collegeLetter && (
                    <p className="mt-2 text-xs text-[#7cb342] truncate">
                      Selected: <span className="font-medium">{collegeLetter.name}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Select registration type
                </h2>
                <div className="space-y-3">
                  {pricing ? (
                    Object.entries(pricing.pricing)
                      .filter(([type]) =>
                        shouldHideAOACourse ? type !== 'AOA_CERTIFIED_COURSE' : true
                      )
                      .map(([type, priceData]) => {
                        const isAvailable = priceData.totalAmount > 0;
                        const isSelected = formData.registrationType === type;

                        return (
                          <label
                            key={type}
                            className={`block rounded border px-4 py-3 text-xs cursor-pointer transition-colors ${
                              isAvailable
                                ? isSelected
                                  ? 'border-[#9c3253] bg-[#9c3253]/5'
                                  : 'border-slate-200 hover:border-[#ff8a1f] bg-white hover:bg-[#ff8a1f]/5'
                                : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (isAvailable) {
                                setFormData((prev) => ({
                                  ...prev,
                                  registrationType: type,
                                  selectedWorkshop:
                                    type === 'AOA_CERTIFIED_COURSE'
                                      ? ''
                                      : prev.selectedWorkshop,
                                  // accompanyingPersons remains unchanged (can be >0 now)
                                }));
                                setError('');
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="registrationType"
                                  value={type}
                                  checked={isSelected}
                                  disabled={!isAvailable}
                                  onChange={(e) => {
                                    if (isAvailable) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        registrationType: e.target.value,
                                      }));
                                      setError('');
                                    }
                                  }}
                                  className="mt-0.5 h-4 w-4 text-[#9c3253] border-slate-300"
                                />
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {getRegistrationTypeDisplay(type)}
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-0.5">
                                    {type === 'CONFERENCE_ONLY' &&
                                      'All conference sessions, materials and certificate.'}
                                    {type === 'WORKSHOP_CONFERENCE' &&
                                      'Workshop access plus all conference sessions.'}
                                    {type === 'COMBO' &&
                                      'Conference, workshop and combo benefits.'}
                                    {type === 'AOA_CERTIFIED_COURSE' &&
                                      'Standalone AOA Certified Course only (limited 40 seats).'}
                                  </p>
                                  {type === 'AOA_CERTIFIED_COURSE' && (
                                    <p className="mt-1 text-[11px] text-[#7cb342] flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      ₹5,000 + GST • Only for AOA / Non‑AOA members • No PGS / Fellows
                                    </p>
                                  )}
                                  {!isAvailable && (
                                    <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                                      <XCircle className="w-3 h-3" />
                                      Not available in current phase
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {isAvailable ? (
                                  <>
                                    <p className="text-sm font-semibold text-[#9c3253]">
                                      ₹{priceData.totalAmount.toLocaleString()}
                                    </p>
                                    <p className="text-[11px] text-[#ff8a1f]">
                                      Incl. 18% GST
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm text-slate-500">N/A</p>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })
                  ) : (
                    <div className="rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-600">
                      Pricing is not available.{' '}
                      <button
                        type="button"
                        onClick={fetchPricing}
                        className="text-[#9c3253] font-medium underline underline-offset-2"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isWorkshopType && (
                <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                  <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-[#ff8a1f]" />
                    Select workshop
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {WORKSHOPS.map((workshop) => (
                      <label
                        key={workshop.id}
                        className={`border px-3 py-3 cursor-pointer transition-colors ${
                          formData.selectedWorkshop === workshop.id
                            ? 'border-[#7cb342] bg-[#7cb342]/5'
                            : 'border-slate-200 bg-white hover:border-[#ff8a1f] hover:bg-[#ff8a1f]/5'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            selectedWorkshop: workshop.id,
                          }))
                        }
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="workshop"
                            value={workshop.id}
                            checked={formData.selectedWorkshop === workshop.id}
                            onChange={() => {}}
                            className="mt-0.5 h-4 w-4 text-[#7cb342] border-slate-300"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{workshop.name}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-[#9c3253]" />
                  Accompanying person
                </h2>
                <div className="flex items-center justify-between border border-slate-200 bg-[#ff8a1f]/5 px-3 py-3 text-xs rounded">
                  <div>
                    <p className="font-medium text-slate-900">Add accompanying person(s)</p>
                    <p className="text-[11px] text-[#7cb342]">
                      ₹7,000 per person
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          accompanyingPersons: Math.max(
                            0,
                            prev.accompanyingPersons - 1
                          ),
                        }))
                      }
                      disabled={formData.accompanyingPersons === 0}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 text-sm disabled:opacity-40 hover:bg-[#9c3253]/5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-slate-900">
                      {formData.accompanyingPersons}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          accompanyingPersons: prev.accompanyingPersons + 1,
                        }))
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 text-sm hover:bg-[#9c3253]/5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {formData.accompanyingPersons > 0 && (
                  <p className="mt-2 text-xs text-[#ff8a1f] font-medium">
                    Extra amount: ₹{getAccompanyingPrice().toLocaleString()}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.registrationType}
                className="w-full inline-flex items-center justify-center gap-2 border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8a2b47] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    Proceed to payment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 text-xs rounded-lg">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Order summary
              </h2>

              {formData.registrationType &&
              pricing?.pricing?.[formData.registrationType] ? (
                <>
                  <div className="border border-[#ff8a1f]/20 bg-[#ff8a1f]/5 px-3 py-3 mb-3 rounded">
                    <p className="text-[11px] text-slate-500 mb-1">Selected package</p>
                    <p className="font-medium text-slate-900">
                      {getRegistrationTypeDisplay(formData.registrationType)}
                    </p>
                    {isWorkshopType && formData.selectedWorkshop && (
                      <p className="mt-1 inline-flex items-center rounded-full bg-[#7cb342]/10 px-2 py-0.5 text-[10px] text-[#7cb342] border border-[#7cb342]/30">
                        {
                          WORKSHOPS.find(
                            (w) => w.id === formData.selectedWorkshop
                          )?.name
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Package (incl. GST)</span>
                      <span className="font-medium text-[#9c3253]">
                        ₹
                        {pricing.pricing[
                          formData.registrationType
                        ].totalAmount.toLocaleString()}
                      </span>
                    </div>
                    {formData.accompanyingPersons > 0 && (
                      <div className="flex justify-between text-[#ff8a1f]">
                        <span>Accompanying ({formData.accompanyingPersons})</span>
                        <span>+₹{getAccompanyingPrice().toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-900">Total payable</span>
                      <span className="text-lg font-semibold text-[#9c3253]">
                        ₹{getTotalAmount().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  Select a registration type to view summary.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
