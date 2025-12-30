import { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  DollarSign,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  Activity,
  Hotel,
  Users2,
  Zap,
  Star,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => `${value}%`;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit'
    });
  };

  const getRoleName = (role) => {
    const roleNames = {
      'AOA': 'AOA Members',
      'NON_AOA': 'Non-AOA',
      'PGS': 'PGS & Fellows',
      'CERTIFICATE': 'Certificate'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-sm bg-white border border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-xs text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-1.5 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-xs text-slate-500">{formatDate(dashboardData.generatedAt)}</p>
        </div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-slate-900">{dashboardData.registrations.total}</p>
                <p className="text-xs text-slate-500">Registrations</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-1">+{dashboardData.registrations.today} today</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-slate-900">{dashboardData.registrations.paid}</p>
                <p className="text-xs text-slate-500">Paid</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-indigo-600">{formatCurrency(dashboardData.revenue.total)}</p>
                <p className="text-xs text-slate-500">Revenue</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-1">+{formatCurrency(dashboardData.revenue.today)} today</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 hover:bg-slate-50 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-blue-600">{formatPercentage(dashboardData.attendance.rate)}</p>
                <p className="text-xs text-slate-500">Attendance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {}
          <div className="lg:col-span-2 space-y-4">
            {}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Registrations by Category</h3>
              </div>
              <div className="space-y-2">
                {dashboardData.registrations.byRole.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium ${
                        role._id === 'AOA' ? 'bg-sky-100 text-sky-700' :
                        role._id === 'NON_AOA' ? 'bg-emerald-100 text-emerald-700' :
                        role._id === 'PGS' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {role._id}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">{getRoleName(role._id)}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(role.revenue)}</p>
                      </div>
                    </div>
                    <div className="text-right min-w-[90px]">
                      <p className="text-xs font-medium text-slate-900">{role.count}</p>
                      <div className="w-14 h-1.5 bg-slate-200 rounded-full mt-0.5">
                        <div 
                          className="h-1.5 bg-sky-500 rounded-full" 
                          style={{ width: `${(role.paidCount / role.count) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{role.paidCount} paid</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Recent Payments</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dashboardData.recentPayments.slice(0, 5).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs">
                    <div className="flex items-center gap-2 truncate flex-1">
                      <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-slate-900">{payment.userId.name}</p>
                        <p className="text-slate-500 truncate">{payment.userId.email}</p>
                      </div>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="font-semibold text-emerald-600">{formatCurrency(payment.amount)}</p>
                      <p className="text-slate-400">{formatDate(payment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4">
            {}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Revenue</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Registration</span>
                  <span>{formatCurrency(dashboardData.revenue.registration)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Accommodation</span>
                  <span>{formatCurrency(dashboardData.revenue.accommodation)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-semibold text-indigo-600">
                  <span>Total</span>
                  <span>{formatCurrency(dashboardData.revenue.total)}</span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Attendance</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <p className="font-semibold">{dashboardData.attendance.totalRecords}</p>
                  <p className="text-slate-500">Total</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded">
                  <p className="font-semibold text-emerald-600">{dashboardData.attendance.attended}</p>
                  <p className="text-slate-500">Attended</p>
                </div>
                <div className="col-span-2 p-2 bg-slate-50 rounded">
                  <p className="text-lg font-semibold text-blue-600">{formatPercentage(dashboardData.attendance.rate)}</p>
                  <p className="text-slate-500">Rate</p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-semibold text-slate-900">Accommodation</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold">{dashboardData.accommodation.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid</span>
                  <span className="font-semibold text-emerald-600">{dashboardData.accommodation.paidBookings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-semibold text-slate-900">Abstracts</h4>
            </div>
            <div className="space-y-1">
              {dashboardData.abstracts.map((abs, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                  <span className="capitalize">{abs._id.toLowerCase()}</span>
                  <span className={`px-2 py-px rounded-full font-semibold ${
                    abs._id === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    abs._id === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {abs.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-slate-900">Feedback</h4>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-amber-600">{dashboardData.feedback.total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-slate-900">7 Days</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div>
                <p className="text-lg font-semibold">{dashboardData.trending.registrations}</p>
                <p className="text-slate-500">Registrations</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-600">{dashboardData.trending.payments}</p>
                <p className="text-slate-500">Payments</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200">
              <p className="text-xs">
                Users: <span className="font-semibold">{dashboardData.users.total}</span> 
                <span className="text-slate-500">(admins: {dashboardData.users.admins})</span>
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <Calendar className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-900">30 Oct - 1 Nov 2026</p>
            </div>
            <div>
              <MapPin className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-900">SIMS, Shivamogga</p>
            </div>
            <div>
              <Award className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-900">19th Annual AOA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
