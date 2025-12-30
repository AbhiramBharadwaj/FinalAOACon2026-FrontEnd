import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { accommodationAPI, paymentAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AccommodationCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const { bookingInfo, accommodation } = location.state || {};

  useEffect(() => {
    if (!bookingInfo || !accommodation) {
      navigate('/accommodation');
      return;
    }
  }, [bookingInfo, accommodation, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    setProcessing(true);
    setError('');

    try {
      const bookingData = {
        ...bookingInfo,
        specialRequests
      };

      const bookingResponse = await accommodationAPI.book(bookingData);
      const createdBooking = bookingResponse.data.booking;
      setBooking(createdBooking);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const orderResponse = await paymentAPI.createOrderAccommodation(createdBooking._id);
      const { orderId, amount, currency, keyId } = orderResponse.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: currency,
        name: 'AOA Shivamogga 2026',
        description: `Accommodation - ${accommodation.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            navigate('/payment-status?status=success&type=accommodation');
          } catch (error) {
            navigate('/payment-status?status=failed&type=accommodation');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#9c3253'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!bookingInfo || !accommodation) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <Header />
        <div className="relative z-10 max-w-md mx-auto px-4 py-12 text-center">
          <h1 className="text-lg font-semibold text-white mb-2">No Booking</h1>
          <p className="text-sm text-slate-200 mb-6">Select accommodation first</p>
          <button
            onClick={() => navigate('/accommodation')}
            className="w-full px-4 py-3 border border-[#9c3253]/50 bg-[#9c3253]/90 text-white hover:bg-[#8a2b47]/90 rounded text-sm font-medium transition-colors backdrop-blur-sm"
          >
            Browse Hotels
          </button>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      {}
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      
      <Header />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20">
        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg px-4 py-3 flex items-center mb-4">
          <button
            onClick={() => navigate(`/accommodation/${accommodation._id}`)}
            className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-slate-100/50 transition-colors -m-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="ml-3 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900">Secure Booking</h1>
            <p className="text-xs text-slate-600">Review & book {accommodation.name}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 border border-red-200/50 bg-red-500/10 text-red-400 text-xs rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {}
          <section className="lg:col-span-2 space-y-4">
            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9c3253]" />
                Guest Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#9c3253]/5 rounded">
                  <Users className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Primary Guest</p>
                    <p className="font-medium text-slate-900 truncate">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#ff8a1f]/5 rounded">
                  <MapPin className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Email</p>
                    <p className="font-medium text-slate-900 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9c3253]" />
                Hotel #{accommodation._id?.slice(-6)}
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <img
                    src={accommodation.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={accommodation.name}
                    className="w-14 h-14 rounded object-cover flex-shrink-0 border"
                  />
                  <div className="flex-1 min-w-0 ml-3">
                    <p className="font-semibold text-slate-900 truncate">{accommodation.name}</p>
                    <p className="text-slate-600 truncate">{accommodation.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex text-[#ff8a1f]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(accommodation.rating || 0) ? 'fill-[#ff8a1f] text-[#ff8a1f]' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-[11px] font-medium text-slate-900">{accommodation.rating}</span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9c3253]" />
                Stay Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center p-3 border border-slate-200/50 bg-[#9c3253]/5 rounded">
                  <Calendar className="w-4 h-4 text-[#9c3253] mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Check-in</p>
                    <p className="font-semibold">{new Date(bookingInfo.checkInDate).toLocaleDateString('en-IN')}</p>
                    <p className="text-[10px] text-slate-600">{accommodation.checkInTime}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-slate-200/50 bg-[#ff8a1f]/5 rounded">
                  <Calendar className="w-4 h-4 text-[#ff8a1f] mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Check-out</p>
                    <p className="font-semibold">{new Date(bookingInfo.checkOutDate).toLocaleDateString('en-IN')}</p>
                    <p className="text-[10px] text-slate-600">{accommodation.checkOutTime}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between p-3 border border-slate-200/50 bg-[#7cb342]/5 rounded mt-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-[#7cb342] mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{bookingInfo.numberOfGuests} Guest{bookingInfo.numberOfGuests > 1 ? 's' : ''}</p>
                      <p className="text-[10px] text-slate-600">{bookingInfo.roomsBooked} Room{bookingInfo.roomsBooked > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#9c3253] text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {bookingInfo.numberOfNights} Nights
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7cb342]" />
                What's Included
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {accommodation.inclusions.slice(0, 6).map((inclusion, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                    <span>{inclusion}</span>
                  </li>
                ))}
                {accommodation.inclusions.length > 6 && (
                  <li className="flex items-center text-slate-500">
                    <span className="text-xs">+{accommodation.inclusions.length - 6} more amenities</span>
                  </li>
                )}
              </ul>
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff8a1f]" />
                Special Requests (Optional)
              </h3>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Room near elevator? Extra pillows? Early check-in?..."
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50 resize-vertical"
              />
              <p className="text-[10px] text-slate-500 mt-2 flex items-center">
                <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
                Subject to availability. May incur extra charges.
              </p>
            </div>
          </section>

          {}
          <section className="lg:col-span-1 lg:sticky lg:top-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
                Booking Summary
              </h3>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Base Rate</span>
                  <span>₹{accommodation.pricePerNight?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-[#ff8a1f] font-medium">
                  <span>× {bookingInfo.numberOfNights} nights</span>
                  <span>× {bookingInfo.roomsBooked} room{bookingInfo.roomsBooked > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/50">
                  <span className="font-medium text-slate-600">Total (Taxes incl.)</span>
                  <span className="font-semibold text-[#9c3253]">₹{bookingInfo.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 p-2.5 bg-[#ff8a1f]/5 rounded text-xs">
                <span className="font-medium text-slate-700">Check-in/out</span>
                <span className="font-medium">{accommodation.checkInTime} - {accommodation.checkOutTime}</span>
              </div>

              <button
                onClick={handleBooking}
                disabled={processing}
                className="w-full px-4 py-3 border border-[#9c3253] bg-[#9c3253] text-white text-xs font-semibold hover:bg-[#8a2b47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded mb-4 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Book & Pay ₹{bookingInfo.totalAmount?.toLocaleString()}
                  </>
                )}
              </button>

              <div className="space-y-2 pt-3 border-t border-slate-200/50">
                <div className="flex items-center justify-center text-[10px] text-[#7cb342]">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span>Secured by Razorpay</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-500 text-center">
                  <div className="p-1.5 border rounded bg-white/50">UPI</div>
                  <div className="p-1.5 border rounded bg-white/50">Cards</div>
                  <div className="p-1.5 border rounded bg-white/50">Netbanking</div>
                </div>
                <div className="text-[10px] text-slate-500 text-center">
                  <p>🛡️ Free cancellation up to 24hrs before check-in</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AccommodationCheckoutPage;
