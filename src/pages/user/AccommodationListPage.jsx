import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  ArrowRight,
  Filter,
  Search,
  ArrowLeft
} from 'lucide-react';
import { accommodationAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AccommodationListPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const response = await accommodationAPI.getAll();
      setAccommodations(response.data);
    } catch (error) {
      setError('Failed to load accommodations');
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
    return icons[amenity] || null;
  };

  const filteredAndSortedAccommodations = accommodations
    .filter(acc => 
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerNight - b.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading hotels..." />
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
      
      <div className="relative z-10 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20 sm:pb-8 max-w-7xl mx-auto">
        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg px-4 py-4 flex items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 text-slate-200 hover:text-white mr-3 lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900">Accommodation</h1>
            <p className="text-xs text-slate-600">AOACON 2026 Shivamogga</p>
          </div>
        </div>

        {}
        <div className="space-y-3 bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4">
          {}
          <div className="lg:hidden relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {}
          <div className="flex items-center border border-slate-200/50 rounded px-3 py-2.5 bg-[#ff8a1f]/5">
            <Filter className="w-4 h-4 text-[#ff8a1f] mr-2 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-slate-700 focus:ring-0 p-1"
            >
              <option value="price">Price: Low to High</option>
              <option value="rating">Rating: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 border border-red-200/50 bg-red-500/10 text-red-400 text-xs rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedAccommodations.map((accommodation) => (
            <div 
              key={accommodation._id} 
              className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg overflow-hidden hover:border-[#9c3253]/30 transition-all hover:scale-[1.01]"
            >
              {}
              <div className="relative h-32 sm:h-36 lg:h-40 bg-slate-100/50">
                <img
                  src={accommodation.images?.[0] || '/placeholder-hotel.jpg'}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded px-2 py-1 border border-slate-200/50">
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

              {}
              <div className="p-3 space-y-2">
                {}
                <div>
                  <h3 className="font-medium text-slate-900 text-xs leading-tight line-clamp-2">{accommodation.name}</h3>
                  <div className="flex items-center text-[10px] text-slate-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1.5 text-[#9c3253] flex-shrink-0" />
                    <span className="truncate">{accommodation.location}</span>
                  </div>
                </div>

                {}
                <div className="flex flex-wrap gap-1">
                  {accommodation.amenities.slice(0, 3).map((amenity) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex items-center bg-[#9c3253]/10 px-1.5 py-1 rounded-full text-[10px] border border-[#9c3253]/20">
                        {IconComponent && <IconComponent className="w-2.5 h-2.5 mr-1 text-[#9c3253] flex-shrink-0" />}
                        <span className="truncate text-[#9c3253]">{amenity}</span>
                      </div>
                    );
                  })}
                  {accommodation.amenities.length > 3 && (
                    <div className="flex items-center bg-[#ff8a1f]/10 px-1.5 py-1 rounded-full text-[10px] border border-[#ff8a1f]/20">
                      <span className="text-[#ff8a1f]">+{accommodation.amenities.length - 3}</span>
                    </div>
                  )}
                </div>

                {}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 pb-1.5">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-sm font-semibold text-[#9c3253]">₹{accommodation.pricePerNight}</span>
                      <span className="text-[10px] text-slate-500 ml-1">/night</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Taxes incl.</p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/accommodation/${accommodation._id}`)}
                    className="px-2.5 py-1.5 border border-[#9c3253] rounded text-[10px] bg-[#9c3253] text-white font-medium hover:bg-[#8a2b47] flex items-center gap-1 transition-colors"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {}
                {accommodation.availableRooms < accommodation.totalRooms && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600">Rooms left</span>
                      <span className={`font-medium text-xs ${
                        accommodation.availableRooms > 10 ? 'text-[#7cb342]' : 
                        accommodation.availableRooms > 5 ? 'text-[#ff8a1f]' : 'text-red-500'
                      }`}>
                        {accommodation.availableRooms}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {}
        {filteredAndSortedAccommodations.length === 0 && !loading && (
          <div className="text-center py-12 space-y-3 col-span-full bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-6">
            <div className="w-12 h-12 bg-slate-100/50 rounded-xl flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-xs text-slate-600">No hotels found</p>
            <p className="text-[10px] text-slate-500">Try different search or filters</p>
          </div>
        )}

        {}
        <div className="border border-slate-200/50 rounded-lg p-3 bg-white/90 backdrop-blur-xl mt-6">
          <div className="flex items-center text-[11px] text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-[#9c3253]" />
            <span>All hotels within 15 mins of Shivamogga Convention Center</span>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AccommodationListPage;
