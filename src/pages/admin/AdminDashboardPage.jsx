import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  IndianRupee,
  MapPin,
  RefreshCw,
  ScanLine,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const roleStyles = {
  AOA: { bar: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 ring-sky-100', short: 'AOA' },
  NON_AOA: { bar: 'bg-teal-500', badge: 'bg-teal-50 text-teal-700 ring-teal-100', short: 'NA' },
  PGS: { bar: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700 ring-violet-100', short: 'PG' },
  CERTIFICATE: { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-100', short: 'CC' },
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch {
      setError('We could not load the latest conference data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return 'Updated just now';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getRoleName = (role) => ({
    AOA: 'AOA members',
    NON_AOA: 'Non-AOA delegates',
    PGS: 'PGs & fellows',
    CERTIFICATE: 'Certificate course',
  }[role] || role);

  const daysToConference = useMemo(() => {
    const eventDate = new Date('2026-10-30T09:00:00+05:30');
    return Math.max(0, Math.ceil((eventDate - new Date()) / 86400000));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f7fb]">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-6">
          <LoadingSpinner size="sm" text="Preparing your command centre..." />
        </main>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-[#f4f7fb]">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-950">Dashboard unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
            <button onClick={fetchDashboardData} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#073b4c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5269]">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const paidRate = dashboardData.registrations.total
    ? Math.round((dashboardData.registrations.paid / dashboardData.registrations.total) * 100)
    : 0;
  const attendanceRate = Math.min(100, dashboardData.attendance.rate || 0);
  const recentPayments = dashboardData.recentPayments || [];
  const roles = dashboardData.registrations.byRole || [];
  const abstracts = dashboardData.abstracts || [];

  const metricCards = [
    {
      label: 'Total registrations',
      value: dashboardData.registrations.total,
      note: `+${dashboardData.registrations.today} today`,
      icon: Users,
      accent: 'bg-sky-50 text-sky-600',
      path: '/admin/registrations',
    },
    {
      label: 'Paid delegates',
      value: dashboardData.registrations.paid,
      note: `${paidRate}% conversion`,
      icon: UserCheck,
      accent: 'bg-emerald-50 text-emerald-600',
      path: '/admin/payments',
    },
    {
      label: 'Total revenue',
      value: formatCurrency(dashboardData.revenue.total),
      note: `+${formatCurrency(dashboardData.revenue.today)} today`,
      icon: IndianRupee,
      accent: 'bg-violet-50 text-violet-600',
      path: '/admin/payments',
    },
    {
      label: 'Attendance rate',
      value: `${attendanceRate}%`,
      note: `${dashboardData.attendance.attended} checked in`,
      icon: ScanLine,
      accent: 'bg-amber-50 text-amber-600',
      path: '/admin/check/attendance',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-slate-900">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-8">
          <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#073b4c] px-6 py-7 text-white shadow-xl shadow-[#073b4c]/10 sm:px-8 lg:px-10 lg:py-9">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#22c1a6]/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl" />
            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-teal-50 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-[#62e6cf]" /> AOA CON 2026 · LIVE OVERVIEW
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, Admin.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Everything happening across registrations, payments and delegate operations—at a glance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">Last synced</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-[#62e6cf]" /> {formatDate(dashboardData.generatedAt)}</p>
                </div>
                <button onClick={fetchDashboardData} aria-label="Refresh dashboard" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22c1a6] text-[#073b4c] transition hover:-translate-y-0.5 hover:bg-[#62e6cf]">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <section className="relative z-10 -mt-1 grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(({ label, value, note, icon: Icon, accent, path }) => (
              <button key={label} onClick={() => navigate(path)} className="group rounded-[1.4rem] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
                <div className="flex items-start justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}><Icon className="h-5 w-5" /></span>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-700" />
                </div>
                <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-950">{value}</p>
                <p className="mt-2 text-xs font-semibold text-teal-700">{note}</p>
              </button>
            ))}
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.85fr)]">
            <div className="space-y-6">
              <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Delegate mix</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Registrations by category</h2>
                  </div>
                  <button onClick={() => navigate('/admin/registrations')} className="hidden items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:flex">View all <ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="space-y-5">
                  {roles.map((role) => {
                    const style = roleStyles[role._id] || roleStyles.AOA;
                    const rolePaidRate = role.count ? Math.round((role.paidCount / role.count) * 100) : 0;
                    return (
                      <div key={role._id}>
                        <div className="mb-2.5 flex items-center gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 ${style.badge}`}>{style.short}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="truncate text-sm font-bold text-slate-800">{getRoleName(role._id)}</p>
                              <p className="shrink-0 text-sm font-bold text-slate-950">{role.count} <span className="font-normal text-slate-500">delegates</span></p>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                              <span>{formatCurrency(role.revenue)}</span><span>{role.paidCount} paid · {rolePaidRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-[52px] h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${style.bar}`} style={{ width: `${rolePaidRate}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Money movement</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Recent payments</h2>
                  </div>
                  <button onClick={() => navigate('/admin/payments')} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-950">View all <ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentPayments.slice(0, 5).map((payment, index) => (
                    <div key={payment._id || payment.razorpayPaymentId || index} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:px-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{payment.userId?.name || 'Unknown delegate'}</p>
                        <p className="truncate text-xs text-slate-500">{payment.userId?.email || 'No email available'}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-slate-950">{formatCurrency(payment.amount)}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {!recentPayments.length && <p className="px-6 py-10 text-center text-sm text-slate-500">No recent payments yet.</p>}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#0b5269] to-[#073b4c] p-6 text-white shadow-lg shadow-[#073b4c]/10">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[24px] border-white/5" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#62e6cf]">Conference countdown</p><h2 className="mt-2 text-xl font-bold">AOA CON 2026</h2></div>
                    <CalendarDays className="h-6 w-6 text-[#62e6cf]" />
                  </div>
                  <div className="my-7 flex items-end gap-2"><span className="text-6xl font-bold tracking-tighter">{daysToConference}</span><span className="pb-2 text-sm font-semibold text-slate-300">days to go</span></div>
                  <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-slate-200">
                    <p className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#62e6cf]" /> 30 Oct – 1 Nov 2026</p>
                    <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#62e6cf]" /> SIMS, Shivamogga</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">On-ground</p><h2 className="mt-1 text-xl font-bold text-slate-950">Attendance</h2></div><ScanLine className="h-6 w-6 text-amber-500" /></div>
                <div className="mt-6 flex items-center gap-5">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#22c1a6 ${attendanceRate * 3.6}deg, #e8eef3 0deg)` }}>
                    <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-bold text-slate-950">{attendanceRate}%</span><span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">checked in</span></div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-3 text-sm">
                    <div className="flex justify-between gap-2"><span className="text-slate-500">Attended</span><strong>{dashboardData.attendance.attended}</strong></div>
                    <div className="flex justify-between gap-2"><span className="text-slate-500">Records</span><strong>{dashboardData.attendance.totalRecords}</strong></div>
                    <button onClick={() => navigate('/admin/scanner')} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"><ScanLine className="h-4 w-4" /> Open scanner</button>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Revenue split</p><h2 className="mt-1 text-xl font-bold text-slate-950">Collections</h2></div><TrendingUp className="h-6 w-6 text-sky-500" /></div>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><WalletCards className="h-5 w-5" /></span><div className="flex-1"><p className="text-xs text-slate-500">Registration</p><p className="font-bold text-slate-900">{formatCurrency(dashboardData.revenue.registration)}</p></div></div>
                  <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><BedDouble className="h-5 w-5" /></span><div className="flex-1"><p className="text-xs text-slate-500">Accommodation</p><p className="font-bold text-slate-900">{formatCurrency(dashboardData.revenue.accommodation)}</p></div></div>
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <button onClick={() => navigate('/admin/abstracts')} className="group rounded-[1.4rem] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><FileText className="h-5 w-5" /></span><ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700" /></div>
              <p className="mt-4 text-sm font-bold text-slate-950">Abstract review</p>
              <div className="mt-3 flex flex-wrap gap-2">{abstracts.map((item) => <span key={item._id} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item._id === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : item._id === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{item.count} {item._id.toLowerCase()}</span>)}</div>
            </button>

            <button onClick={() => navigate('/admin/accommodations')} className="group rounded-[1.4rem] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><BedDouble className="h-5 w-5" /></span><ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700" /></div>
              <p className="mt-4 text-sm font-bold text-slate-950">Accommodation</p><p className="mt-2 text-2xl font-bold">{dashboardData.accommodation.totalBookings}</p><p className="text-xs text-slate-500">{dashboardData.accommodation.paidBookings} paid bookings</p>
            </button>

            <button onClick={() => navigate('/admin/feedback')} className="group rounded-[1.4rem] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Star className="h-5 w-5" /></span><ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700" /></div>
              <p className="mt-4 text-sm font-bold text-slate-950">Delegate feedback</p><p className="mt-2 text-2xl font-bold">{dashboardData.feedback.total}</p><p className="text-xs text-slate-500">responses received</p>
            </button>

            <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><LayoutDashboard className="h-5 w-5" /></span><span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">LAST 7 DAYS</span></div>
              <p className="mt-4 text-sm font-bold text-slate-950">Momentum</p><div className="mt-3 flex gap-6"><div><p className="text-xl font-bold">{dashboardData.trending.registrations}</p><p className="text-xs text-slate-500">registrations</p></div><div><p className="text-xl font-bold text-emerald-600">{dashboardData.trending.payments}</p><p className="text-xs text-slate-500">payments</p></div></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
