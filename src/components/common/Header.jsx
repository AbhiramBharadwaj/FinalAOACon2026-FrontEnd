import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import mainLogo from '../../images/main-logo.png';
import simsLogo from '../../images/SIMSLogo.png';
import brochurePdf from '../../files/AOA CON BROCHURE ANNOUNCEMENT.pdf';
import {
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  Hotel,
  FileText,
  MapPin,
  Download,
  Phone,
  Calendar,
  User,
  Map,
  HomeIcon,
  UserSquareIcon,
  Image,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Committee',
    icon: Users,
    items: [
      { label: 'AOA Office Bearers', path: '/office-bearers', icon: UserSquareIcon },
      { label: 'Organizing Committee', path: '/committee', icon: Users },
    ],
  },
  {
    label: 'Attendee',
    icon: Hotel,
    items: [
      { label: 'Accommodation', path: '/accommodation', icon: Hotel },
      { label: 'Program Schedule', path: '/conference-days', icon: Calendar },
      { label: 'Abstract', path: '/abstract/rules', icon: FileText },
      { label: 'Contact', path: '/contact', icon: User },
      { label: 'Gallery', path: '/gallery', icon: Image },
    ],
  },
];

const PRIMARY_LINKS_TOP = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Venue', path: '/venue', icon: MapPin },
];

const PRIMARY_LINKS_BOTTOM = [
  { label: 'Download', download: true, icon: Download },
  { label: 'Registration', path: '/register-details', icon: User },
  { label: 'Profile', path: '/dashboard', icon: User },
];

// MOBILE DRAWER (left side) – reusing your MobileNav logic but without bottom bar
const MobileDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const topDrawerItems = PRIMARY_LINKS_TOP;
  const bottomDrawerItems = PRIMARY_LINKS_BOTTOM;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  if (!open) return null;

  return (
    <>
      {}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {}
      <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col border-r border-slate-200 md:hidden">
        {}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#005aa9] via-sky-500 to-sky-300" />

        {}
        <div className="pl-4 pr-4 py-4 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={mainLogo} alt="AOACON" className="h-12 w-auto" />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto py-4 px-4 space-y-4">
            <div className="space-y-1.5">
              {topDrawerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (!item.disabled && item.path) {
                        navigate(item.path);
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm border transition-all ${
                      item.disabled
                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/40 hover:text-[#005aa9]'
                    }`}
                    disabled={item.disabled}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {NAV_ITEMS.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <div className="px-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm border transition-all bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/40 hover:text-[#005aa9]"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="space-y-1.5">
              {bottomDrawerItems.map((item) => {
                const Icon = item.icon;
                if (item.download) {
                  return (
                    <a
                      key={item.label}
                      href={brochurePdf}
                      download="AOA CON BROCHURE ANNOUNCEMENT.pdf"
                      onClick={onClose}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm border transition-all bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/40 hover:text-[#005aa9]"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500">
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
                      if (!item.disabled && item.path) {
                        navigate(item.path);
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-2xl text-left text-sm border transition-all ${
                      item.disabled
                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-[#005aa9]/40 hover:text-[#005aa9]'
                    }`}
                    disabled={item.disabled}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {}
        <div className="px-4 pb-4 pt-3 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-100 border border-red-200">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/login');
                onClose();
              }}
              className="w-full px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-[#005aa9] shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#005aa9]/40"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileDropdown(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const getRoleText = (role) => {
    const texts = {
      AOA: 'AOA Member',
      NON_AOA: 'Non-AOA Member',
      PGS: 'PGS & Fellows',
    };
    return texts[role] || role;
  };

  return (
    <div className="bg-white">
      {}
      <div className="w-full bg-white/95 backdrop-blur-md px-3 py-2 md:px-8 relative z-50 border-b border-white/50">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-3 items-center gap-2 md:gap-6">
          <img
            src={logo}
            alt="Logo 1"
            className="h-10 w-auto max-w-[32vw] justify-self-start object-contain md:h-16 md:max-w-none"
          />
          <img
            src={mainLogo}
            alt="Logo 2"
            className="h-10 w-auto max-w-[32vw] justify-self-center object-contain md:h-16 md:max-w-none"
          />
          <img
            src={simsLogo}
            alt="Logo 3"
            className="h-10 w-auto max-w-[32vw] justify-self-end object-contain md:h-16 md:max-w-none"
          />
        </div>
      </div>


      <header className="bg-[#9c3253] border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            {}
            <div className="flex items-center gap-2">
              {}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#004a8b] focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setShowMobileDrawer(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <img
                  src={mainLogo}
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
              </button>
            </div>

            {}
            <nav className="hidden lg:flex items-center gap-0.5">
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
              >
                <Home className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                <span>Home</span>
              </Link>

              <Link
                to="/venue"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
              >
                <Map className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                <span>Venue</span>
              </Link>

              {NAV_ITEMS.map((item, index) => (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 ml-1 text-white transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-0 w-72 bg-white border border-slate-200 shadow-md rounded-b-lg z-50">
                      <div>
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => {
                              navigate(subItem.path);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-3 w-full px-5 py-3.5 text-sm text-slate-700 hover:bg-[#9c3253] hover:text-white border-l-4 border-transparent hover:border-l-[#005aa9]/30 transition-all duration-200"
                          >
                            <span className="font-medium">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <a
                href={brochurePdf}
                download="AOA CON BROCHURE ANNOUNCEMENT.pdf"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
              >
                <Download className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                <span>Download</span>
              </a>
              <Link
                to="/register-details"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
              >
                <User className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                <span>Registration</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border-b-2 border-transparent transition-colors duration-200"
              >
                <User className="w-4 h-4 text-white hover:text-yellow-900 transition-colors" />
                <span>Profile</span>
              </Link>
            </nav>

            {}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative lg:ml-4">
                  <button
                    onClick={() =>
                      setShowProfileDropdown(!showProfileDropdown)
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#005aa9]" />
                    </div>
                    <div className="hidden lg:block">
                      <div className="font-medium text-sm text-white truncate max-w-[100px]">
                        {user?.name}
                      </div>
                    </div>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 shadow-lg rounded-lg z-50 overflow-hidden">
                      <div className="px-4 py-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#005aa9] rounded-full flex items-center justify-center border-2 border-[#005aa9]/30">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {user?.name}
                            </div>
                            <div className="text-xs text-[#005aa9] font-medium">
                              {getRoleText(user?.role)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-slate-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 text-sm font-semibold text-[#9c3253] bg-white rounded-lg hover:bg-slate-100 transition-all duration-200 whitespace-nowrap"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {}
      <MobileDrawer
        open={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
      />
    </div>
  );
};

export default Header;
