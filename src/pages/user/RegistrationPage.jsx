// RegistrationPage.jsx - FULL CODE WITH EDIT SUPPORT
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
  Users as UsersIcon,
  Calendar,
  XCircle,
  Plus,
  Minus,
  Edit3,
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
  { id: 'maternal-collapse', name: 'Maternal Resuscitation and Regional Blocks in Obstetric Anaesthesia', leads: 'Dr Vikram & team' },
];


const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    addWorkshop: false,
    addAoaCourse: false,
    addLifeMembership: false,
    selectedWorkshop: '',
    accompanyingPersons: 0,
  });
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user, loading: authLoading } = useAuth();
  const { setRegistration } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPricingAndRegistration();
    }
  }, [authLoading, user]);

  const fetchPricingAndRegistration = async () => {
    setLoading(true);
    setError('');
    try {
      const [pricingRes, regRes] = await Promise.all([
        registrationAPI.getPricing(),
        registrationAPI.getMyRegistration().catch(() => null),
      ]);

      setPricing(pricingRes.data);

      if (regRes?.data) {
        const reg = regRes.data;
        setExistingRegistration(reg);
        setFormData({
          addWorkshop: reg.addWorkshop || false,
          addAoaCourse: reg.addAoaCourse || false,
          addLifeMembership: reg.addLifeMembership || false,
          selectedWorkshop: reg.selectedWorkshop || '',
          accompanyingPersons: reg.accompanyingPersons || 0,
        });
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.addWorkshop && !formData.selectedWorkshop) {
      setError('Please select a workshop');
      return;
    }

    if (formData.addAoaCourse && pricing?.meta?.aoaCourseFull) {
      setError('AOA Certified Course seats are full');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('addWorkshop', String(formData.addWorkshop));
      submitData.append('addAoaCourse', String(formData.addAoaCourse));
      submitData.append('addLifeMembership', String(formData.addLifeMembership));
      if (formData.addWorkshop) submitData.append('selectedWorkshop', formData.selectedWorkshop);
      submitData.append('accompanyingPersons', String(formData.accompanyingPersons));

      const response = await registrationAPI.create(submitData);
      setRegistration(response.data.registration);
      navigate('/checkout');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save registration');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper functions remain same
  const getBookingPhaseText = (phase) => ({ EARLY_BIRD: 'Early Bird', REGULAR: 'Regular', SPOT: 'Spot Booking' }[phase] || phase);
  const getRoleText = (role) => ({ AOA: 'AOA Member', NON_AOA: 'Non-AOA Member', PGS: 'PGS & Fellows' }[role] || role);
  const getSelectedPackageLabel = (data) => {
    const labels = [];
    if (data?.addWorkshop) labels.push('Workshop');
    if (data?.addAoaCourse) labels.push('AOA Certified Course');
    if (data?.addLifeMembership) labels.push('AOA Life Membership');
    return labels.length ? `Conference + ${labels.join(' + ')}` : 'Conference Only';
  };

  const workshopAddOn = pricing?.addOns?.workshop;
  const aoaAddOn = pricing?.addOns?.aoaCourse;
  const lifeMembershipAddOn = pricing?.addOns?.lifeMembership;
  const isPaidRegistration = existingRegistration?.paymentStatus === 'PAID';
  const paidSoFar = existingRegistration?.totalPaid || 0;
  const isAoaMember = user?.role && user.role.toLowerCase().includes('aoa');
  const hasWorkshopLocked = isPaidRegistration && existingRegistration?.addWorkshop;
  const hasCourseLocked = isPaidRegistration && existingRegistration?.addAoaCourse;
  const aoaAddonSelection = formData.addWorkshop
    ? 'workshop'
    : formData.addAoaCourse
      ? 'course'
      : '';

  const packageBase = pricing?.base?.conference?.priceWithoutGST || 0;
  const workshopBase = formData.addWorkshop ? (workshopAddOn?.priceWithoutGST || 0) : 0;
  const aoaBase = formData.addAoaCourse ? (aoaAddOn?.priceWithoutGST || 0) : 0;
  const lifeMembershipBase = formData.addLifeMembership ? (lifeMembershipAddOn?.priceWithoutGST || 0) : 0;
  const accompanyingBase = formData.accompanyingPersons * 7000;
  const totalBaseAmount = packageBase + workshopBase + aoaBase + lifeMembershipBase + accompanyingBase;
  const totalGST = Math.round(totalBaseAmount * 0.18);
  const subtotalWithGST = totalBaseAmount + totalGST;
  const processingFee = Math.round(subtotalWithGST * 0.0165);
  const finalAmount = subtotalWithGST + processingFee;
  const balanceDue = Math.max(0, finalAmount - paidSoFar);


  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
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
                {existingRegistration ? 'Edit Registration' : 'Conference Registration'}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                {existingRegistration
                  ? 'You can update your registration details below.'
                  : 'Register for the annual AOACON conference, workshops and AOA certified course.'}
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
                  <span className="font-medium">{getBookingPhaseText(pricing.bookingPhase)}</span>
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

        {}
        {existingRegistration && (
          <div className="bg-gradient-to-r from-[#9c3253]/10 to-[#ff8a1f]/10 border border-[#9c3253]/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-[#9c3253]" />
                <div>
                  <p className="font-medium text-slate-900">Current Registration</p>
                  <p className="text-xs text-slate-600">
                    {getSelectedPackageLabel(existingRegistration)}
                    {' • '} #{existingRegistration.registrationNumber}
                  </p>
                  {isPaidRegistration && (
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Base registration paid. You will only be charged for new add-ons.
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-[#9c3253]">
                ₹{existingRegistration.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <section className="lg:col-span-2 space-y-5">
            {}
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

            {}
            {}
            <form onSubmit={handleSubmit} className="space-y-5">
              {}
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Conference registration
                </h2>
                <div className="rounded border border-slate-200 bg-white px-4 py-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">Conference Only</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        All conference sessions, materials, certificate, and meals.
                      </p>
                      {isPaidRegistration && (
                        <p className="text-[11px] text-emerald-700 mt-1">
                          Already booked and paid.
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#9c3253]">
                        ₹{packageBase.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#ff8a1f]">
                        + ₹{Math.round(packageBase * 0.18).toLocaleString()} GST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Add-ons
                  </h3>
                  <div className="space-y-2">
                    <label
                      className={`flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs ${
                        workshopAddOn?.priceWithoutGST > 0
                          ? 'border-slate-200 bg-white'
                          : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type={isAoaMember ? 'radio' : 'checkbox'}
                          name={isAoaMember ? 'aoa-addon' : undefined}
                          value={isAoaMember ? 'workshop' : undefined}
                          checked={isAoaMember ? aoaAddonSelection === 'workshop' : formData.addWorkshop}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              addWorkshop:
                                isPaidRegistration && existingRegistration?.addWorkshop
                                  ? true
                                  : isAoaMember
                                    ? true
                                    : e.target.checked,
                              selectedWorkshop:
                                isAoaMember
                                  ? prev.selectedWorkshop
                                  : e.target.checked
                                    ? prev.selectedWorkshop
                                    : '',
                              addAoaCourse:
                                isAoaMember ? false : prev.addAoaCourse,
                            }))
                          }
                          disabled={
                            workshopAddOn?.priceWithoutGST <= 0 ||
                            hasWorkshopLocked ||
                            (isAoaMember && hasCourseLocked)
                          }
                          className="mt-0.5 h-4 w-4 text-[#9c3253] border-slate-300"
                        />
                          <div>
                            <p className="font-medium text-slate-900">Workshop access</p>
                            <p className="text-[11px] text-slate-600">Select one workshop below.</p>
                            {isAoaMember && !hasWorkshopLocked && (
                              <p className="text-[11px] text-slate-500 mt-1">
                                Choose either Workshop or AOA Certified Course.
                              </p>
                            )}
                            {workshopAddOn?.priceWithoutGST <= 0 && (
                              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Not available in this phase
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#9c3253]">
                          ₹{(workshopAddOn?.priceWithoutGST || 0).toLocaleString()}
                        </p>
                      </div>
                    </label>

                    {aoaAddOn && (
                      <label
                        className={`flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs ${
                          aoaAddOn.priceWithoutGST > 0 && !pricing?.meta?.aoaCourseFull
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type={isAoaMember ? 'radio' : 'checkbox'}
                          name={isAoaMember ? 'aoa-addon' : undefined}
                          value={isAoaMember ? 'course' : undefined}
                            checked={isAoaMember ? aoaAddonSelection === 'course' : formData.addAoaCourse}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                addAoaCourse:
                                  isPaidRegistration && existingRegistration?.addAoaCourse
                                    ? true
                                    : isAoaMember
                                      ? true
                                      : e.target.checked,
                                addWorkshop:
                                  isAoaMember ? false : prev.addWorkshop,
                                selectedWorkshop: isAoaMember ? '' : prev.selectedWorkshop,
                              }))
                            }
                            disabled={
                              aoaAddOn.priceWithoutGST <= 0 ||
                              pricing?.meta?.aoaCourseFull ||
                              hasCourseLocked ||
                              (isAoaMember && hasWorkshopLocked)
                            }
                            className="mt-0.5 h-4 w-4 text-purple-600 border-slate-300"
                          />
                          <div>
                            <p className="font-medium text-purple-900">AOA Certified Course</p>
                            <p className="text-[11px] text-purple-700">
                              Bundle price brings Conference + Course to ₹13,000 (AOA / Non-AOA only).
                            </p>
                            {isAoaMember && !hasCourseLocked && (
                              <p className="text-[11px] text-slate-500 mt-1">
                                Choose either Workshop or AOA Certified Course.
                              </p>
                            )}
                            {pricing?.meta?.aoaCourseFull && (
                              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Seats full
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-700">
                            ₹{aoaAddOn.priceWithoutGST.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-purple-500">
                            {40 - (pricing?.meta?.aoaCourseCount || 0)} seats left
                          </p>
                        </div>
                      </label>
                    )}

                    {lifeMembershipAddOn && (
                      <label
                        className={`flex items-center justify-between gap-3 rounded border px-3 py-2 text-xs ${
                          lifeMembershipAddOn.priceWithoutGST > 0
                            ? 'border-[#ff8a1f]/30 bg-[#ff8a1f]/5'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.addLifeMembership}
                          onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                addLifeMembership:
                                  isPaidRegistration && existingRegistration?.addLifeMembership
                                    ? true
                                    : e.target.checked,
                              }))
                            }
                            disabled={
                              lifeMembershipAddOn.priceWithoutGST <= 0 ||
                              (isPaidRegistration && existingRegistration?.addLifeMembership)
                            }
                            className="mt-0.5 h-4 w-4 text-[#ff8a1f] border-slate-300"
                          />
                          <div>
                            <p className="font-medium text-slate-900">AOA Life Membership</p>
                            <p className="text-[11px] text-slate-600">Only for Non-AOA members.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#ff8a1f]">
                            ₹{lifeMembershipAddOn.priceWithoutGST.toLocaleString()}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {formData.addWorkshop && (
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
                        onClick={() => setFormData(prev => ({ ...prev, selectedWorkshop: workshop.id }))}
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

              {}
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 rounded-lg">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-[#9c3253]" />
                  Accompanying person
                </h2>
                <div className="flex items-center justify-between border border-slate-200 bg-[#ff8a1f]/5 px-3 py-3 text-xs rounded">
                  <div>
                    <p className="font-medium text-slate-900">Add accompanying person(s)</p>
                    <p className="text-[11px] text-[#7cb342]">₹7,000 per person</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        accompanyingPersons: Math.max(0, prev.accompanyingPersons - 1),
                      }))}
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
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        accompanyingPersons: prev.accompanyingPersons + 1,
                      }))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 text-sm hover:bg-[#9c3253]/5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {formData.accompanyingPersons > 0 && (
                  <p className="mt-2 text-xs text-[#ff8a1f] font-medium">
                    Extra amount: ₹{accompanyingBase.toLocaleString()}
                  </p>
                )}
              </div>

              {}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8a2b47] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : existingRegistration ? (
                  <>Update Registration <Edit3 className="w-4 h-4" /></>
                ) : (
                  <>Proceed to payment <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </section>

          {}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-4 py-4 text-xs rounded-lg">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Order summary
              </h2>

              {totalBaseAmount > 0 ? (
                <>
                  <div className="border border-[#ff8a1f]/20 bg-[#ff8a1f]/5 px-3 py-3 mb-3 rounded">
                    <p className="text-[11px] text-slate-500 mb-1">Selected package</p>
                    <p className="font-medium text-slate-900">
                      {getSelectedPackageLabel(formData)}
                    </p>
                    {formData.addWorkshop && formData.selectedWorkshop && (
                      <p className="mt-1 inline-flex items-center rounded-full bg-[#7cb342]/10 px-2 py-0.5 text-[10px] text-[#7cb342] border border-[#7cb342]/30">
                        {WORKSHOPS.find(w => w.id === formData.selectedWorkshop)?.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conference base</span>
                      <span>₹{packageBase.toLocaleString()}</span>
                    </div>
                    {formData.addWorkshop && (
                      <div className="flex justify-between text-[#ff8a1f]">
                        <span>Workshop add-on</span>
                        <span>₹{workshopBase.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.addAoaCourse && (
                      <div className="flex justify-between text-purple-700">
                        <span>AOA Course Add-on</span>
                        <span>₹{aoaBase.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.addLifeMembership && (
                      <div className="flex justify-between text-[#ff8a1f]">
                        <span>AOA Life Membership</span>
                        <span>₹{lifeMembershipBase.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.accompanyingPersons > 0 && (
                      <div className="flex justify-between text-[#ff8a1f]">
                        <span>Accompanying ({formData.accompanyingPersons})</span>
                        <span>₹{accompanyingBase.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-2 mt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total Base Amount</span>
                        <span>₹{totalBaseAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-green-700">
                      <span>GST (18%)</span>
                      <span>+₹{totalGST.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-slate-200 pt-2 mt-3">
                      <div className="flex justify-between font-medium">
                        <span>Subtotal (incl. GST)</span>
                        <span>₹{subtotalWithGST.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-amber-700">
                      <span>Processing Fee (1.65%)</span>
                      <span>+₹{processingFee.toLocaleString()}</span>
                    </div>

                    {paidSoFar > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Paid so far</span>
                        <span>-₹{paidSoFar.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t-2 border-[#9c3253] pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">
                        {paidSoFar > 0 ? 'Balance Due' : 'Final Amount'}
                      </span>
                      <span className="text-lg font-bold text-[#9c3253]">
                        ₹{(paidSoFar > 0 ? balanceDue : finalAmount).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 text-right mt-1">
                      Payable via Razorpay
                    </p>
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
