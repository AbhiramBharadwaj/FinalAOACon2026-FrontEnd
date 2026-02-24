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
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { registrationAPI, paymentAPI, attendanceAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WORKSHOP_DETAILS = {
  'labour-analgesia': { name: 'Labour Analgesia' },
  'critical-incidents': { name: 'Critical Incidents in Obstetric Anaesthesia' },
  pocus: { name: 'POCUS in Obstetrics' },
  'maternal-collapse': { name: 'Maternal Resuscitation ' },
};

const CheckoutPage = () => {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);

  const COUPON_ENABLED = true;

  const { user } = useAuth();
  const { setRegistration: setAppRegistration } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistration();
  }, []);

  const fetchRegistration = async () => {
    try {
      const response = await registrationAPI.getMyRegistration();
      setRegistration(response.data);
      setAppRegistration(response.data);
      setCouponInput(response.data?.couponCode || '');
      setCouponApplied(Boolean(response.data?.couponDiscount));
    } catch (err) {
      setError('Registration not found. Please complete registration first.');
      setTimeout(() => navigate('/registration'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (balanceDue <= 0) {
      navigate('/dashboard');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      if (registration?.couponCode) {
        const validation = await registrationAPI.validateCoupon();
        const updated = validation.data?.registration || validation.data;
        const couponValid = Boolean(validation.data?.couponValid);
        if (updated) {
          setRegistration(updated);
          setAppRegistration(updated);
          setCouponApplied(Boolean(updated?.couponDiscount));
          setCouponInput(updated?.couponCode || '');
        }
        if (!couponValid) {
          setError('Coupon code is no longer valid. Please review the updated total.');
          setProcessing(false);
          return;
        }
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load payment gateway');

      const orderResponse = await paymentAPI.createOrderRegistration();
      const { orderId, amount, currency, keyId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency,
        name: 'AOA Shivamogga 2026',
        description: 'Conference Registration',
        order_id: orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            try {
              await attendanceAPI.generateQr(registration._id);
            } catch (qrErr) {
              console.error('QR generation failed, continuing to success page:', qrErr);
            }

            navigate('/payment-status?status=success&type=registration');
          } catch (error) {
            navigate('/payment-status?status=failed&type=registration');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#9c3253',
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Payment failed. Please try again.'
      );
      setProcessing(false);
    }
  };

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

  const getBookingPhaseBadge = (phase) => {
    const map = {
      EARLY_BIRD: 'bg-[#9c3253]/10 text-[#9c3253] border-[#9c3253]/30',
      REGULAR: 'bg-[#ff8a1f]/10 text-[#ff8a1f] border-[#ff8a1f]/30',
      SPOT: 'bg-[#7cb342]/10 text-[#7cb342] border-[#7cb342]/30',
    };
    return map[phase] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getWorkshopDetail = (workshopId) =>
    WORKSHOP_DETAILS[workshopId] || { name: workshopId || 'N/A' };

  const totalPaid = registration?.totalPaid || 0;
  const balanceDue = registration ? Math.max(0, registration.totalAmount - totalPaid) : 0;
  const workshopDetail = registration?.selectedWorkshop
    ? getWorkshopDetail(registration.selectedWorkshop)
    : null;

  const applyCoupon = async () => {
    const entered = couponInput.trim().toUpperCase();
    setCouponError('');
    if (!entered) {
      setCouponApplied(false);
      setCouponError('Enter a coupon code.');
      return;
    }
    try {
      setCouponApplying(true);
      const res = await registrationAPI.applyCoupon(entered);
      setRegistration(res.data);
      setAppRegistration(res.data);
      setCouponApplied(Boolean(res.data?.couponDiscount));
    } catch (err) {
      setCouponApplied(false);
      setCouponError(err?.response?.data?.message || 'Failed to apply coupon.');
    } finally {
      setCouponApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="md" text="Loading checkout..." />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen  bg-cover bg-center bg-no-repeat relative"
       style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/70 pt-20 sm:pt-24" />
        <Header />
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <h1 className="text-lg font-semibold text-slate-900 mb-2">
            No registration found
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Please complete your registration before proceeding to payment.
          </p>
          <button
            onClick={() => navigate('/registration')}
            className="w-full inline-flex items-center justify-center border border-[#9c3253] px-4 py-3 text-sm font-medium text-[#9c3253] hover:bg-[#9c3253]/5 transition-colors"
          >
            Go to registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-cover bg-center bg-no-repeat relative"
       style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/70 pt-20 sm:pt-24" />
      <Header />

     <div className="relative z-10 container mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20 max-w-6xl">
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-3">
          <button
            onClick={() => navigate('/registration')}
            className="inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:text-[#9c3253] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-slate-900">
              Checkout
            </h1>
            <p className="text-xs text-slate-600">
              Review your registration details and complete the payment.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <section className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-slate-200 px-4 py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#9c3253]" />
                Personal information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 border border-slate-200 bg-[#9c3253]/5 px-3 py-2 rounded">
                  <Mail className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Email</p>
                    <p className="font-medium text-slate-900 truncate">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border border-slate-200 bg-[#ff8a1f]/5 px-3 py-2 rounded">
                  <Award className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Category</p>
                    <p className="font-medium text-slate-900">{getRoleText(user?.role)}</p>
                  </div>
                </div>
                {user?.membershipId && (
                  <div className="flex items-center gap-3 border border-slate-200 bg-[#7cb342]/5 px-3 py-2 rounded">
                    <CreditCard className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Membership ID</p>
                      <p className="font-medium text-slate-900">{user.membershipId}</p>
                    </div>
                  </div>
                )}
                {user?.collegeLetter && (
                  <div className="flex items-center gap-3 border border-slate-200 bg-[#9c3253]/5 px-3 py-2 rounded">
                    <FileText className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Recommendation letter</p>
                      <p className="font-medium text-slate-900">Uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Registration details
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500">Registration no.</p>
                    <p className="font-medium text-slate-900">{registration.registrationNumber}</p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 border px-2.5 py-1 text-[11px] font-medium rounded-full ${getBookingPhaseBadge(
                      registration.bookingPhase
                    )}`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{getBookingPhaseText(registration.bookingPhase)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Package</p>
                  <p className="font-medium text-slate-900">
                    {getRegistrationTypeText(registration)}
                  </p>
                </div>
                {workshopDetail && (
                  <div className="border border-[#7cb342]/30 bg-[#7cb342]/5 px-3 py-2 rounded">
                    <p className="text-xs text-slate-500">Workshop selected</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {workshopDetail.name}
                    </p>
                  </div>
                )}
                {registration.addAoaCourse && (
                  <div className="bg-purple-50 border border-purple-300 px-3 py-2 rounded">
                    <p className="text-[11px] text-purple-700 font-medium">
                      + AOA Certified Course Add-on
                    </p>
                  </div>
                )}
              </div>
            </div>

          </section>

          {}
          <section className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
            {/* Coupon code section (comment out this block to disable coupon entry) */}
            {COUPON_ENABLED && (
              <div className="bg-white border border-slate-200 px-4 py-4 text-xs rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Coupon code
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponApplied(false);
                      setCouponError('');
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#9c3253]/40"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplying}
                    className="inline-flex items-center justify-center rounded-lg border border-[#9c3253] bg-[#9c3253] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8a2b47] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {couponApplying ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {couponApplied && registration?.couponDiscount > 0 && (
                  <p className="mt-2 text-xs text-emerald-700 font-medium">
                    Coupon applied: -₹{registration.couponDiscount.toLocaleString()} on conference base.
                  </p>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-red-600 font-medium">{couponError}</p>
                )}
              </div>
            )}

            <div className="bg-white border border-slate-200 px-4 py-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Payment summary
              </h3>

              {}
              <div className="border border-[#9c3253]/20 bg-[#9c3253]/5 px-3 py-3 text-center mb-4 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">
                  {balanceDue > 0 ? 'Balance Due' : 'Final Amount Paid'}
                </p>
                <p className="text-lg font-bold text-[#9c3253]">
                  ₹{(balanceDue > 0 ? balanceDue : registration.totalAmount)?.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#ff8a1f] font-medium mt-1">
                  Incl. GST & Processing Fee
                </p>
              </div>

              {}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Conference base</span>
                  <span className="font-medium">
                    ₹{(registration.basePrice ?? registration.packageBase ?? 0).toLocaleString()}
                  </span>
                </div>
                {registration.couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700">
                    <span>
                      Coupon{registration.couponCode ? ` ${registration.couponCode}` : ''}
                    </span>
                    <span>-₹{registration.couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {registration.addWorkshop && (
                  <div className="flex justify-between text-xs text-[#ff8a1f] font-medium">
                    <span>Workshop add-on</span>
                    <span>₹{registration.workshopAddOn?.toLocaleString?.() || registration.workshopPrice?.toLocaleString?.() || '0'}</span>
                  </div>
                )}

                {registration.addAoaCourse && (
                  <div className="flex justify-between text-xs text-purple-700 font-medium">
                    <span>AOA Certified Course Add-on</span>
                    <span>₹{registration.aoaCourseBase.toLocaleString()}</span>
                  </div>
                )}

                {registration.addLifeMembership && (
                  <div className="flex justify-between text-xs text-[#ff8a1f] font-medium">
                    <span>AOA Life Membership</span>
                    <span>₹{registration.lifeMembershipBase?.toLocaleString?.() || '0'}</span>
                  </div>
                )}

                {registration.accompanyingPersons > 0 && (
                  <div className="flex justify-between text-xs text-orange-600">
                    <span>Accompanying ({registration.accompanyingPersons})</span>
                    <span>₹{registration.accompanyingBase.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total Base Amount</span>
                    <span>₹{registration.totalBase.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-green-700 text-xs">
                  <span>GST (18%)</span>
                  <span>+₹{registration.totalGST.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-amber-700 text-xs">
                  <span>Processing Fee (1.95%)</span>
                  <span>+₹{registration.processingFee.toLocaleString()}</span>
                </div>

                {totalPaid > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Paid so far</span>
                    <span>-₹{totalPaid.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {}
              <div className="flex items-center justify-between border border-slate-200 bg-[#ff8a1f]/5 px-3 py-2 mb-4 rounded">
                <span className="font-medium text-slate-700 text-xs">Payment status</span>
                <span
                  className={`inline-flex items-center gap-1 border px-2 py-1 text-[11px] font-medium rounded-full ${
                    registration.paymentStatus === 'PAID'
                      ? 'border-[#7cb342]/30 bg-[#7cb342]/10 text-[#7cb342]'
                      : 'border-[#ff8a1f]/30 bg-[#ff8a1f]/10 text-[#ff8a1f]'
                  }`}
                >
                  {registration.paymentStatus === 'PAID' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {registration.paymentStatus}
                </span>
              </div>

              {}
              <button
                onClick={handlePayment}
                disabled={processing || balanceDue <= 0}
                className="w-full inline-flex items-center justify-center gap-2 border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8a2b47] disabled:opacity-60 disabled:cursor-not-allowed mb-3 transition-all duration-200"
              >
                {processing ? (
                  <LoadingSpinner size="sm" />
                ) : balanceDue <= 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Payment complete
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay ₹{balanceDue.toLocaleString()}
                  </>
                )}
              </button>

              {balanceDue <= 0 && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full inline-flex items-center justify-center border border-[#7cb342]/50 bg-[#7cb342]/5 px-4 py-2.5 text-xs font-semibold text-[#7cb342] hover:bg-[#7cb342]/10 transition-colors"
                >
                  Go to dashboard
                </button>
              )}

              {}
              <div className="mt-5 border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-[#7cb342]" />
                  <span>Payments secured by Razorpay</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center">
                  <span>UPI</span>
                  <span>Cards</span>
                  <span>Netbanking</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
