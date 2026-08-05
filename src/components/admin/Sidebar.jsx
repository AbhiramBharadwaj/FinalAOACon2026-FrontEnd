import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png';
import {
  Home,
  Users,
  User,
  CreditCard,
  Building2,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  QrCodeIcon,
  ListChecksIcon,
  ClipboardList,
  Hash,
  Video,
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
    { icon: User, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Building2, label: 'Accommodations', path: '/admin/accommodations' },
    { icon: FileText, label: 'Abstracts', path: '/admin/abstracts' },
    { icon: Video, label: 'Video Conferencing', path: '/admin/video-conferencing' },
    { icon: MessageSquare, label: 'Feedback', path: '/admin/feedback' },
    { icon: ClipboardList, label: 'Manual Registrations', path: '/admin/manual-registrations' },
    { icon: Hash, label: 'Counter', path: '/admin/counter' },
    { icon: QrCodeIcon, label: 'Scanner', path: '/admin/scanner' },
    { icon: ListChecksIcon, label: 'Attendance', path: '/admin/check/attendance' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-[#073b4c] p-2.5 text-white shadow-lg lg:hidden"
        aria-label="Open admin navigation"
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
          bg-[#062f3d] text-slate-100 flex flex-col shadow-xl lg:shadow-none
        `}
      >
        {}
        <div className="flex min-h-[82px] items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm">
              <img src={logo} className="h-full w-full object-contain" alt="AOA CON" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">AOA CON 2026</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#62e6cf]">Admin console</p>
              </div>
            )}
          </div>

          {}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="hidden items-center justify-center rounded-xl p-2 transition-colors hover:bg-white/10 lg:inline-flex"
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
          {!isCollapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>}
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
                  w-full flex items-center rounded-xl px-2.5 py-2 mb-0.5 text-left text-sm
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-[#22c1a6] text-[#073b4c] shadow-lg shadow-black/10'
                      : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center
                    ${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'}
                    rounded-lg
                    ${
                      active
                        ? 'bg-[#073b4c]/10'
                        : 'bg-white/[0.06]'
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
                  <span className="ml-3 truncate font-semibold">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {}
        <div className="border-t border-white/10 px-3 py-4">
          {!isCollapsed && (
            <div className="mb-3 rounded-xl bg-white/[0.05] px-3 py-3">
              <p className="text-sm font-semibold text-slate-100">
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
              text-slate-300 hover:text-rose-300 hover:bg-white/[0.06] transition-all
            `}
          >
            <div
              className={`
                flex items-center justify-center
                ${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'}
                rounded-lg bg-white/[0.06]
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
