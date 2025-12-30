import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png'
import {
  Home,
  Users,
  CreditCard,
  Building2,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  QrCodeIcon,
  ListChecksIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Registrations', path: '/admin/registrations' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Building2, label: 'Accommodations', path: '/admin/accommodations' },
    { icon: FileText, label: 'Abstracts', path: '/admin/abstracts' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
    { icon: QrCodeIcon, label: 'Scanner', path: '/admin/scanner' },
    { icon: ListChecksIcon, label: 'Attendence', path: '/admin/check/attendance' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const sidebarWidth = isCollapsed ? 'w-18 lg:w-18' : 'w-64 lg:w-64'; 

  return (
    <>
      {}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#005aa9] text-white rounded-xl shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 transform
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          bg-slate-950 text-slate-100 flex flex-col shadow-xl lg:shadow-none
        `}
      >
        {}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
           <img src={logo} width={100} alt="" />
            {}
          </div>

          {}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="hidden lg:inline-flex items-center justify-center p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-4 h-4 text-slate-300" />
          </button>

          {}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="inline-flex lg:hidden items-center justify-center p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center rounded-2xl px-2.5 py-2.5 mb-0.5 text-left text-sm
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-gradient-to-r from-[#005aa9] to-sky-500 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center
                    ${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'}
                    rounded-xl border
                    ${
                      active
                        ? 'border-white/40 bg-white/10'
                        : 'border-slate-700 bg-slate-900'
                    }
                  `}
                >
                  <Icon
                    className={`${
                      isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                    } text-current`}
                  />
                </div>
                {!isCollapsed && (
                  <span className="ml-3 font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {}
        <div className="border-t border-slate-800 px-3 py-4">
          {!isCollapsed && (
            <div className="mb-3 px-1">
              <p className="text-sm font-medium text-slate-100">
                {admin?.name || 'Administrator'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {admin?.email || 'admin@example.com'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center rounded-2xl px-2.5 py-2 text-sm
              text-slate-300 hover:text-red-400 hover:bg-slate-900 transition-all
            `}
          >
            <div
              className={`
                flex items-center justify-center
                ${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'}
                rounded-xl border border-slate-700 bg-slate-900
              `}
            >
              <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </div>
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
