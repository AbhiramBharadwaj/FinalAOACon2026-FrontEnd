import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X } from 'lucide-react';

const PaymentsManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, typeFilter]);

  const fetchPayments = async () => {
    try {
      const response = await adminAPI.getPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(payment => payment.paymentType === typeFilter);
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      PENDING: { color: 'bg-amber-100 text-amber-800', icon: Clock },
      FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const badge = badges[status] || { color: 'bg-slate-100 text-slate-800', icon: Clock };
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
        <IconComponent className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const badges = {
      REGISTRATION: { color: 'bg-sky-100 text-sky-800' },
      ACCOMMODATION: { color: 'bg-purple-100 text-purple-800' }
    };
    
    const badge = badges[type] || { color: 'bg-slate-100 text-slate-800' };
    
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
        {type}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = [
      'Payment ID', 'User Name', 'Email', 'Payment Type', 'Amount', 
      'Status', 'Razorpay Order ID', 'Razorpay Payment ID', 'Date'
    ];

    const csvData = filteredPayments.map(payment => [
      payment._id,
      payment.userId?.name,
      payment.userId?.email,
      payment.paymentType,
      payment.amount,
      payment.status,
      payment.razorpayOrderId,
      payment.razorpayPaymentId || '',
      new Date(payment.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  // Calculate stats
  const totalRevenue = payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = payments.filter(p => p.status === 'SUCCESS').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const failedPayments = payments.filter(p => p.status === 'FAILED').length;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading payments..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-base sm:text-lg text-slate-900">Payments</h1>
              <p className="text-xs text-slate-600">{filteredPayments.length} of {payments.length} total</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-colors"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Revenue</p>
                <p className="text-sm text-emerald-600">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Success</p>
                <p className="text-sm text-slate-900">{successfulPayments}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Pending</p>
                <p className="text-sm text-slate-900">{pendingPayments}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Failed</p>
                <p className="text-sm text-slate-900">{failedPayments}</p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search name, email, order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">Type</option>
                <option value="REGISTRATION">Registration</option>
                <option value="ACCOMMODATION">Accommodation</option>
              </select>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {}
              <div className="sm:hidden space-y-2 p-3">
                {filteredPayments.map((payment) => (
                  <div key={payment._id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{payment.userId?.name}</p>
                        <p className="text-xs text-slate-600 truncate">{payment.userId?.email}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-slate-500">Type:</span>
                        <span className="ml-1">{getTypeBadge(payment.paymentType)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Order:</span>
                        <span className="ml-1 font-mono text-[10px]">{payment.razorpayOrderId}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(payment.amount)}</span>
                    </div>
                    <button
                      onClick={() => viewDetails(payment)}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-1.5 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </div>
                ))}
              </div>

              {}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">User</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs">
                            <div className="font-medium text-slate-900">{payment.userId?.name}</div>
                            <div className="text-slate-600 truncate max-w-[120px]">{payment.userId?.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-mono text-slate-900">{payment.razorpayOrderId}</div>
                          {payment.razorpayPaymentId && (
                            <div className="text-[10px] text-slate-500">{payment.razorpayPaymentId}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">{getTypeBadge(payment.paymentType)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-900">{formatCurrency(payment.amount)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => viewDetails(payment)}
                            className="flex items-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-1 px-2 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 px-4">
              <CreditCard className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No payments found</h3>
              <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-900">Payment Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {}
                <div>
                  <h4 className="font-medium text-slate-900 mb-1.5">User</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{selectedPayment.userId?.name}</p>
                        <p className="text-slate-600 text-[10px] truncate">{selectedPayment.userId?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div>
                  <h4 className="font-medium text-slate-900 mb-1.5">Payment</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <span>Type:</span>
                      {getTypeBadge(selectedPayment.paymentType)}
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <span>Status:</span>
                      {getStatusBadge(selectedPayment.status)}
                    </div>
                  </div>
                </div>

                {}
                <div>
                  <h4 className="font-medium text-slate-900 mb-1.5">Razorpay</h4>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                      <span>Order ID:</span>
                      <span className="font-mono truncate">{selectedPayment.razorpayOrderId}</span>
                    </div>
                    {selectedPayment.razorpayPaymentId && (
                      <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                        <span>Payment ID:</span>
                        <span className="font-mono truncate">{selectedPayment.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Date:</span>
                    <span>{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagementPage;
