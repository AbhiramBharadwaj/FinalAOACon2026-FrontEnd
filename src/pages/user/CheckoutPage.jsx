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

const CheckoutPage = () => {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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
    if (registration?.paymentStatus === 'PAID') {
      navigate('/dashboard');
      return;
    }

    setProcessing(true);
    setError('');

    try {
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
                {registration?.collegeLetter && (
                  <div className="flex items-center gap-3 border border-slate-200 bg-[#9c3253]/5 px-3 py-2 rounded">
                    <FileText className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">College letter</p>
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
                    {getRegistrationTypeText(registration.registrationType)}
                  </p>
                </div>
                {registration.addAoaCourse && (
                  <div className="bg-purple-50 border border-purple-300 px-3 py-2 rounded">
                    <p className="text-[11px] text-purple-700 font-medium">
                      + AOA Certified Course Add-on
                    </p>
                  </div>
                )}
                {registration.lifetimeMembershipId && (
                  <div className="border border-[#ff8a1f]/20 bg-[#ff8a1f]/5 px-3 py-2 flex items-center gap-2 rounded">
                    <Award className="w-4 h-4 text-[#ff8a1f]" />
                    <div>
                      <p className="text-[11px] text-slate-600">Lifetime membership ID</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {registration.lifetimeMembershipId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7cb342]" />
                What is included
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  All conference sessions (3 days)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                  Conference kit and materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                  Certificate of participation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  Lunch and tea breaks
                </li>
                {registration.registrationType !== 'CONFERENCE_ONLY' && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                    Workshop access as per selection
                  </li>
                )}
                {registration.registrationType === 'COMBO' && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                    Lifetime AOA membership
                  </li>
                )}
                {registration.addAoaCourse && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    Hands-on AOA Certified Course + Certificate
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Event details
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#9c3253]" />
                  <span>Oct 30 – Nov 1, 2026</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#7cb342]" />
                  <span>5000+ delegates expected</span>
                </div>
              </div>
            </div>
          </section>

          {}
          <section className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 px-4 py-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Payment summary
              </h3>

              {}
              <div className="border border-[#9c3253]/20 bg-[#9c3253]/5 px-3 py-3 text-center mb-4 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Final Amount Payable</p>
                <p className="text-lg font-bold text-[#9c3253]">
                  ₹{registration.totalAmount?.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#ff8a1f] font-medium mt-1">
                  Incl. GST & Processing Fee
                </p>
              </div>

              {}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Conference Package</span>
                  <span className="font-medium">₹{registration.packageBase.toLocaleString()}</span>
                </div>

                {registration.addAoaCourse && (
                  <div className="flex justify-between text-xs text-purple-700 font-medium">
                    <span>AOA Certified Course Add-on</span>
                    <span>₹{registration.aoaCourseBase.toLocaleString()}</span>
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
                  <span>Processing Fee (1.65%)</span>
                  <span>+₹{registration.processingFee.toLocaleString()}</span>
                </div>
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
                disabled={processing || registration.paymentStatus === 'PAID'}
                className="w-full inline-flex items-center justify-center gap-2 border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8a2b47] disabled:opacity-60 disabled:cursor-not-allowed mb-3 transition-all duration-200"
              >
                {processing ? (
                  <LoadingSpinner size="sm" />
                ) : registration.paymentStatus === 'PAID' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Payment complete
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay ₹{registration.totalAmount?.toLocaleString()}
                  </>
                )}
              </button>

              {registration.paymentStatus === 'PAID' && (
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