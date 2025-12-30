import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { accommodationAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    roomsBooked: 1
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccommodation();
  }, [id]);

  useEffect(() => {
    const checkIn = new Date('2025-10-29');
    const checkOut = new Date('2025-11-02');
    
    setBookingData(prev => ({
      ...prev,
      checkInDate: checkIn.toISOString().split('T')[0],
      checkOutDate: checkOut.toISOString().split('T')[0]
    }));
  }, []);

  const fetchAccommodation = async () => {
    try {
      const response = await accommodationAPI.getById(id);
      setAccommodation(response.data);
    } catch (error) {
      setError('Failed to load accommodation details');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Free Wi-Fi': Wifi,
      'Premium Wi-Fi': Wifi,
      'Parking': Car,
      'Valet Parking': Car,
      'Coffee Shop': Coffee,
      'Restaurant': Coffee,
      'Gym': Dumbbell,
      'Swimming Pool': Dumbbell,
      'Rooftop Pool': Dumbbell
    };
    return icons[amenity] || CheckCircle;
  };

  const calculateNights = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return accommodation?.pricePerNight * nights * bookingData.roomsBooked || 0;
  };

  const handleBooking = () => {
    const nights = calculateNights();
    if (nights <= 0) {
      setError('Please select valid check-in and check-out dates');
      return;
    }

    const bookingInfo = {
      ...bookingData,
      accommodationId: accommodation._id,
      numberOfNights: nights,
      totalAmount: calculateTotal()
    };

    navigate('/accommodation/checkout', { state: { bookingInfo, accommodation } });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (accommodation?.images.length - 1 || 0) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (accommodation?.images.length - 1 || 0) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading hotel..." />
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <Header />
        <div className="relative z-10 max-w-md mx-auto px-4 py-12 text-center">
          <h1 className="text-lg font-semibold text-white mb-2">Hotel Not Found</h1>
          <p className="text-sm text-slate-200 mb-6">The hotel doesn't exist</p>
          <button
            onClick={() => navigate('/accommodation')}
            className="w-full px-4 py-3 border border-[#9c3253]/50 bg-[#9c3253]/90 text-white hover:bg-[#8a2b47]/90 rounded text-sm font-medium transition-colors backdrop-blur-sm"
          >
            Back to Hotels
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 lg:space-y-6 pb-20">
        {}
        <div className="lg:hidden bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg px-4 py-3 flex items-center mb-4">
          <button
            onClick={() => navigate('/accommodation')}
            className="p-1.5 text-slate-200 hover:text-white mr-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{accommodation.name}</h1>
            <div className="flex items-center text-xs text-slate-600">
              <MapPin className="w-3 h-3 mr-1.5 text-[#9c3253]" />
              <span className="truncate">{accommodation.location}</span>
            </div>
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
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg overflow-hidden">
              <div className="relative h-48 lg:h-64">
                <img
                  src={accommodation.images[currentImageIndex]}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
                
                {accommodation.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-slate-200/50 transition-all lg:left-3 lg:p-2.5"
                    >
                      <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-slate-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full border border-slate-200/50 transition-all lg:right-3 lg:p-2.5"
                    >
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-slate-700" />
                    </button>
                  </>
                )}

                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded px-2 py-1.5 border border-slate-200/50">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-[#ff8a1f] mr-1" />
                    <span className="text-[11px] font-medium text-slate-900">{accommodation.rating}</span>
                  </div>
                </div>

                {accommodation.availableRooms <= 5 && (
                  <div className="absolute top-2 left-2 bg-[#9c3253] text-white px-2 py-1 rounded-full text-[10px] font-medium">
                    {accommodation.availableRooms} left
                  </div>
                )}
              </div>

              {accommodation.images.length > 1 && (
                <div className="p-3 bg-slate-50/50">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
                    {accommodation.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 lg:w-20 lg:h-16 rounded border-2 transition-all hover:scale-105 ${
                          index === currentImageIndex 
                            ? 'border-[#9c3253] bg-[#9c3253]/10' 
                            : 'border-slate-200/50 hover:border-[#ff8a1f]/50'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${accommodation.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <p className="text-xs text-slate-700 leading-relaxed">{accommodation.description}</p>
            </div>
            
            {}
            <div className="grid grid-cols-2 gap-3 bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#9c3253] mr-2 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wide">Check-in</p>
                  <p className="font-semibold text-sm text-slate-900">{accommodation.checkInTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#ff8a1f] mr-2 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wide">Check-out</p>
                  <p className="font-semibold text-sm text-slate-900">{accommodation.checkOutTime}</p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#ff8a1f]" />
                  Amenities
                </h2>
                {accommodation.amenities.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="text-xs text-[#9c3253] font-medium flex items-center gap-1 hover:text-[#8a2b47]"
                  >
                    {showAllAmenities ? 'Show Less' : 'Show All'}
                    <ChevronDown className={`w-3 h-3 transition-transform ${showAllAmenities ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {(showAllAmenities ? accommodation.amenities : accommodation.amenities.slice(0, 6)).map((amenity, idx) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={`${amenity}-${idx}`} className="flex items-center p-2.5 bg-[#9c3253]/5 hover:bg-[#9c3253]/10 rounded border border-[#9c3253]/10 transition-colors">
                      <IconComponent className="w-3.5 h-3.5 text-[#9c3253] mr-2 flex-shrink-0" />
                      <span className="text-xs text-slate-700 font-medium truncate">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7cb342]" />
                  Included
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {accommodation.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#ff8a1f]" />
                  Excluded
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {accommodation.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-3 h-3 border-2 border-slate-400 rounded-full mr-2 flex-shrink-0 bg-slate-100" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {}
            {accommodation.faqs?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">FAQs</h3>
                <div className="space-y-2">
                  {accommodation.faqs.slice(0, 3).map((faq, index) => (
                    <div key={index} className="border border-slate-200/50 rounded overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="text-xs font-medium text-slate-900 truncate">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-4 h-4 text-[#9c3253]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#9c3253]" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-3 pb-3 bg-[#9c3253]/5">
                          <p className="text-xs text-slate-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {}
          <aside className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4 lg:sticky lg:top-6">
              <div className="mb-4">
                <div className="flex items-baseline mb-1">
                  <span className="text-lg font-bold text-[#9c3253]">₹{accommodation.pricePerNight?.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 ml-1">/night</span>
                </div>
                <p className="text-[10px] text-slate-500">Taxes included</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-700 mb-1.5">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9c3253]" />
                      <input
                        type="date"
                        value={bookingData.checkInDate}
                        onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-8 pr-2 py-2 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-700 mb-1.5">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#ff8a1f]" />
                      <input
                        type="date"
                        value={bookingData.checkOutDate}
                        onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                        min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full pl-8 pr-2 py-2 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-700 mb-1.5">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7cb342]" />
                      <select
                        value={bookingData.numberOfGuests}
                        onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                        className="w-full pl-8 pr-2 py-2 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 bg-white/50"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-700 mb-1.5">Rooms</label>
                    <select
                      value={bookingData.roomsBooked}
                      onChange={(e) => setBookingData({ ...bookingData, roomsBooked: parseInt(e.target.value) })}
                      className="w-full px-2 py-2 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 bg-white/50"
                    >
                      {Array.from({ length: Math.min(accommodation.availableRooms || 5, 5) }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {calculateNights() > 0 && (
                  <div className="space-y-1.5 pt-2 pb-1 border-t border-slate-200/50">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-600">
                        ₹{accommodation.pricePerNight} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''} × {bookingData.roomsBooked} room{bookingData.roomsBooked > 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-sm">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={calculateNights() <= 0 || (accommodation.availableRooms < bookingData.roomsBooked)}
                  className="w-full px-3 py-2.5 border border-[#9c3253] bg-[#9c3253] text-white text-xs font-semibold hover:bg-[#8a2b47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
                >
                  {accommodation.availableRooms < bookingData.roomsBooked 
                    ? 'Not enough rooms' 
                    : calculateNights() <= 0 
                    ? 'Select dates first' 
                    : 'Book Now'
                  }
                </button>

                <div className="text-center py-1.5">
                  <span className={`text-[10px] font-semibold ${
                    accommodation.availableRooms > 10 ? 'text-[#7cb342]' : 
                    accommodation.availableRooms > 5 ? 'text-[#ff8a1f]' : 'text-red-500'
                  }`}>
                    {accommodation.availableRooms} rooms available
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AccommodationDetailPage;
