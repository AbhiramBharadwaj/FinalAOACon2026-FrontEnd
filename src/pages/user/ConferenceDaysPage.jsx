import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Lock, FileText, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { registrationAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConferenceDaysPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { updateStepperProgress } = useApp();

  useEffect(() => {
    fetchRegistration();
  }, []);

  const fetchRegistration = async () => {
    try {
      const response = await registrationAPI.getMyRegistration();
      setRegistration(response.data);
      
      if (response.data.paymentStatus === 'PAID') {
        updateStepperProgress('conferenceDays', true);
      }
    } catch (error) {
      console.error('Failed to fetch registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const conferenceDays = [
    {
      date: '2025-10-30',
      day: 'Day 1',
      title: 'Opening Ceremony & Keynote Sessions',
      sessions: [
        { time: '09:00 - 10:00', title: 'Registration & Welcome Coffee', speaker: 'Conference Team', type: 'registration' },
        { time: '10:00 - 11:00', title: 'Opening Ceremony', speaker: 'Chief Guest & Organizing Committee', type: 'ceremony' },
        { time: '11:00 - 12:00', title: 'Keynote: Advances in Orthopedic Surgery', speaker: 'Dr. Rajesh Kumar, AIIMS Delhi', type: 'keynote' },
        { time: '12:00 - 13:00', title: 'Panel Discussion: Future of Joint Replacement', speaker: 'Expert Panel', type: 'panel' },
        { time: '13:00 - 14:00', title: 'Lunch Break', speaker: 'Networking Opportunity', type: 'break' },
        { time: '14:00 - 15:30', title: 'Workshop: Arthroscopic Techniques', speaker: 'Dr. Priya Sharma, Manipal Hospital', type: 'workshop' },
        { time: '15:30 - 16:00', title: 'Tea Break', speaker: 'Networking', type: 'break' },
        { time: '16:00 - 17:30', title: 'Scientific Paper Presentations', speaker: 'Selected Participants', type: 'presentation' }
      ]
    },
    {
      date: '2025-10-31',
      day: 'Day 2',
      title: 'Clinical Sessions & Workshops',
      sessions: [
        { time: '09:00 - 10:00', title: 'Morning Coffee & Networking', speaker: 'Conference Team', type: 'networking' },
        { time: '10:00 - 11:30', title: 'Symposium: Trauma Management', speaker: 'Dr. Anil Gupta, PGIMER Chandigarh', type: 'symposium' },
        { time: '11:30 - 12:00', title: 'Coffee Break', speaker: 'Networking', type: 'break' },
        { time: '12:00 - 13:30', title: 'Live Surgery Demonstration', speaker: 'Dr. Suresh Reddy, Apollo Hospitals', type: 'demonstration' },
        { time: '13:30 - 14:30', title: 'Lunch & Poster Session', speaker: 'Research Presentations', type: 'poster' },
        { time: '14:30 - 16:00', title: 'Workshop: Spine Surgery Techniques', speaker: 'Dr. Meera Patel, Fortis Hospital', type: 'workshop' },
        { time: '16:00 - 16:30', title: 'Tea Break', speaker: 'Networking', type: 'break' },
        { time: '16:30 - 18:00', title: 'Case Discussions & Q&A', speaker: 'Interactive Session', type: 'discussion' },
        { time: '19:00 - 22:00', title: 'Gala Dinner & Cultural Program', speaker: 'Entertainment & Networking', type: 'social' }
      ]
    },
    {
      date: '2025-11-01',
      day: 'Day 3',
      title: 'Research Presentations & Closing',
      sessions: [
        { time: '09:00 - 10:00', title: 'Morning Coffee', speaker: 'Conference Team', type: 'networking' },
        { time: '10:00 - 11:30', title: 'Young Orthopedist Forum', speaker: 'Emerging Professionals', type: 'forum' },
        { time: '11:30 - 12:00', title: 'Coffee Break', speaker: 'Networking', type: 'break' },
        { time: '12:00 - 13:30', title: 'Research Paper Presentations', speaker: 'Selected Researchers', type: 'research' },
        { time: '13:30 - 14:30', title: 'Lunch Break', speaker: 'Final Networking', type: 'break' },
        { time: '14:30 - 15:30', title: 'Award Ceremony', speaker: 'Recognition of Excellence', type: 'awards' },
        { time: '15:30 - 16:30', title: 'Closing Ceremony', speaker: 'Organizing Committee', type: 'ceremony' },
        { time: '16:30 - 17:00', title: 'Vote of Thanks & Departure', speaker: 'Conference Team', type: 'closing' }
      ]
    }
  ];

  const getSessionTypeColor = (type) => {
    const colors = {
      registration: 'bg-[#9c3253]/20 text-[#9c3253]',
      ceremony: 'bg-[#ff8a1f]/20 text-[#ff8a1f]',
      keynote: 'bg-[#7cb342]/20 text-[#7cb342]',
      panel: 'bg-[#9c3253]/20 text-[#9c3253]',
      workshop: 'bg-[#ff8a1f]/20 text-[#ff8a1f]',
      presentation: 'bg-[#7cb342]/20 text-[#7cb342]',
      symposium: 'bg-[#9c3253]/20 text-[#9c3253]',
      demonstration: 'bg-[#ff8a1f]/20 text-[#ff8a1f]',
      discussion: 'bg-[#7cb342]/20 text-[#7cb342]',
      networking: 'bg-slate-100/50 text-slate-600',
      break: 'bg-slate-100/50 text-slate-500',
      poster: 'bg-[#9c3253]/20 text-[#9c3253]',
      social: 'bg-[#ff8a1f]/20 text-[#ff8a1f]',
      forum: 'bg-[#7cb342]/20 text-[#7cb342]',
      research: 'bg-[#9c3253]/20 text-[#9c3253]',
      awards: 'bg-[#ff8a1f]/20 text-[#ff8a1f]',
      closing: 'bg-[#7cb342]/20 text-[#7cb342]'
    };
    return colors[type] || 'bg-slate-100/50 text-slate-600';
  };

  const isDateAccessible = (dateString) => {
    if (!registration || registration.paymentStatus !== 'PAID') return false;
    
    const conferenceDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return conferenceDate >= today;
  };

  const isPastDate = (dateString) => {
    const conferenceDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return conferenceDate < today;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading conference schedule..." />
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
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-10 space-y-6 pb-20">
        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-[#9c3253] mr-3" />
            <h1 className="text-lg lg:text-xl font-semibold text-slate-900">Conference Schedule</h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-600 mb-2">AOA Shivamogga 2026 • 3-Day Program</p>
          <div className="flex items-center text-xs lg:text-sm text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-[#ff8a1f]" />
            Shivamogga Convention Center, MG Road
          </div>
        </div>

        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
          {registration && registration.paymentStatus === 'PAID' ? (
            <div className="flex items-start gap-3 p-4 bg-[#7cb342]/10 border border-[#7cb342]/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-[#7cb342] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#7cb342]">Registration Confirmed</h3>
                <p className="text-xs text-slate-700">Full access to all sessions and materials granted.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-[#ff8a1f]/10 border border-[#ff8a1f]/30 rounded-xl">
              <Lock className="w-6 h-6 text-[#ff8a1f] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#ff8a1f]">Complete Registration</h3>
                <p className="text-xs text-slate-700">Complete payment to unlock full schedule access.</p>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden">
          <div className="flex -mb-px">
            {conferenceDays.map((day, index) => (
              <button
                key={day.date}
                onClick={() => setActiveTab(index)}
                className={`flex-1 py-3 px-4 text-xs font-medium border-b-2 transition-all ${
                  activeTab === index
                    ? 'bg-[#9c3253] text-white border-[#9c3253] shadow-sm'
                    : 'text-slate-600 bg-gray-100 border-gray-900 border hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{day.day}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isPastDate(day.date) 
                      ? 'bg-slate-200/50 text-slate-500' 
                      : isDateAccessible(day.date) 
                      ? 'bg-[#7cb342]/50 text-[#7cb342]' 
                      : 'bg-[#ff8a1f]/50 text-[#ff8a1f]'
                  }`}>
                    {isPastDate(day.date) ? '✓' : isDateAccessible(day.date) ? 'Live' : 'Upcoming'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {}
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 p-3 bg-[#9c3253]/5 rounded-xl border border-[#9c3253]/20">
              <div>
                <div className="flex items-center text-xs text-slate-600 mb-1">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  {new Date(conferenceDays[activeTab].date).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h2 className="text-sm lg:text-base font-semibold text-slate-900">
                  {conferenceDays[activeTab].title}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {conferenceDays[activeTab].sessions.map((session, index) => (
                <div key={index} className="flex items-start gap-3 p-3 lg:p-4 border border-slate-200/50 bg-white/50 rounded-lg hover:bg-white backdrop-blur-sm transition-all">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-lg flex-shrink-0 ${
                    activeTab === 0 ? 'bg-[#9c3253]/10 border border-[#9c3253]/20' :
                    activeTab === 1 ? 'bg-[#ff8a1f]/10 border border-[#ff8a1f]/20' :
                    'bg-[#7cb342]/10 border border-[#7cb342]/20'
                  }`}>
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 text-xs lg:text-sm leading-tight">{session.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ml-2 whitespace-nowrap ${getSessionTypeColor(session.type)}`}>
                        {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[10px] mb-1 leading-tight">{session.speaker}</p>
                    <p className="text-xs lg:text-sm font-medium text-slate-900 font-mono">{session.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9c3253]" />
              Venue Details
            </h3>
            <div className="space-y-2 text-xs lg:text-sm text-slate-700">
              <div>Shivamogga Convention Center</div>
              <div className="text-[10px]">MG Road, Shivamogga, Karnataka 577201</div>
              <div className="flex items-center mt-2">
                <Clock className="w-3.5 h-3.5 mr-2 text-[#ff8a1f]" />
                <span>Daily: 9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-2 text-[#7cb342]" />
                <span>500+ Medical Professionals</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff8a1f]" />
              Important Notes
            </h3>
            <div className="space-y-1.5 text-xs lg:text-sm text-slate-700">
              <div>• Registration desk opens 8:30 AM Day 1</div>
              <div>• Meals & refreshments included</div>
              <div>• CME credits for all sessions</div>
              <div>• Business formal dress code</div>
              <div>• Phones on silent during sessions</div>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default ConferenceDaysPage;
