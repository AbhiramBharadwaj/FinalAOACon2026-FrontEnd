import { useState } from 'react';
import {
  Home,
  User,
  Hotel,
  Menu,
  X,
  Users,
  MapPin,
  FileText,
  Calendar,
  Download,
  Phone,
  LogOut,
  Image,
  Stethoscope,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../images/main-logo.png'
import brochurePdf from '../../files/AOA CON BROCHURE ANNOUNCEMENT.pdf';

const MobileNav = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Hotel, label: 'Stay', path: '/accommodation' },
    { icon: User, label: 'Dashboard', path: '/dashboard' },
  ];

  const drawerItems = [
    { label: 'Profile settings', path: '/profile', icon: User },
    { label: 'Committee', path: '/committee', icon: Users },
    // { label: 'Office Bearers', path: '/committee/office-bearers', icon: Users },
    // { label: 'Organising Committee', path: '/committee/organising', icon: Users },
    // { label: 'Faculty', path: '/faculty', icon: Users },
    // { label: 'National Faculty', path: '/faculty/national', icon: Users },
    // { label: 'International Faculty', path: '/faculty/international', icon: Users },
    { label: 'Venue', path: '/venue', icon: MapPin },
    { label: 'Workshops', path: '/workshops', icon: Stethoscope },
    { label: 'Program Schedule', path: '/conference-days', icon: Calendar },
    { label: 'Registration Details', path: '/register-details', icon: FileText },
    { label: 'Registration', path: '/register', icon: FileText },
    { label: 'Abstract', path: '/abstract', icon: FileText },
    { label: 'Download', download: true, icon: Download },
    { label: 'Contact', path: '/contact', icon: Phone },
    { label: 'Gallery', path: '/gallery', icon: Image },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const closeDrawer = () => setShowDrawer(false);

  const handleLogout = () => {
    logout();
    closeDrawer();
  };

  return (
    <>
      {}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200/60 shadow-[0_-4px_16px_rgba(15,23,42,0.12)] z-40">
        <div className="flex justify-around py-2.5 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2.5 -m-2 rounded-2xl transition-all group ${
                  active
                    ? 'text-[#005aa9]'
                    : 'text-slate-500 hover:text-[#005aa9] hover:bg-[#005aa9]/5'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                    active ? 'scale-110' : ''
                  }`}
                />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowDrawer(true)}
            className="flex flex-col items-center p-2.5 -m-2 text-slate-500 hover:text-[#005aa9] hover:bg-[#005aa9]/5 rounded-2xl transition-all group"
          >
            <Menu className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">More</span>
          </button>
        </div>
      </div>

      {}
      {showDrawer && (
        <>
          {}
          <div
            className="md:hidden fixed inset-0 bg-slate-900/25 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />

          {}
          <div className="md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col border-r border-slate-200">
            {}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#005aa9] via-[#009688] to-sky-400" />

            {}
            <div className="pl-4 pr-4 sm:px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100/80">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="AOACON 2026" className="h-20 w-auto" />
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {}
            </div>

            {}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto py-4 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300/60 scrollbar-track-slate-100/60">
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.download ? false : isActive(item.path);

                  if (item.download) {
                    return (
                      <a
                        key={item.label}
                        href={brochurePdf}
                        download="AOA CON BROCHURE ANNOUNCEMENT.pdf"
                        onClick={closeDrawer}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm transition-all duration-200 border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/30 hover:text-[#005aa9]"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border text-slate-500 transition-all bg-slate-50 border-slate-200 group-hover:bg-[#005aa9]/10">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium truncate">{item.label}</span>
                      </a>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        closeDrawer();
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm transition-all duration-200 border ${
                        active
                          ? 'bg-gradient-to-r from-[#005aa9]/8 to-[#009688]/8 text-[#005aa9] border-[#005aa9]/50 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/30 hover:text-[#005aa9]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border text-slate-500 transition-all ${
                          active
                            ? 'bg-gradient-to-r from-[#005aa9]/10 to-[#009688]/10 border-[#005aa9]/50 text-[#005aa9]'
                            : 'bg-slate-50 border-slate-200 group-hover:bg-[#005aa9]/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {}
            <div className="px-4 pb-4 pt-3 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-100 to-red-200 border border-red-200">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    closeDrawer();
                  }}
                  className="w-full px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-[#005aa9] to-[#009688] shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#005aa9]/40"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;
