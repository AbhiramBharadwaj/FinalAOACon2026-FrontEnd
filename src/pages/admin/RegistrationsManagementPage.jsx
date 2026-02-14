import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  DownloadCloud,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  QrCode,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  Award,
  Home,
  Stethoscope,
  CreditCard,
  FileText,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const packageFilterOptions = [
  { key: 'Conference Only', label: 'Conference Only' },
  { key: 'Conference + Workshop', label: 'Conference + Workshop' },
  { key: 'Conference + AOA Certified Course', label: 'Conference + AOA Certified Course' },
  { key: 'Conference + AOA Life Membership', label: 'Conference + AOA Life Membership' },
  { key: 'Conference + Workshop + AOA Certified Course', label: 'Conference + Workshop + AOA Certified Course' },
  { key: 'Conference + Workshop + AOA Life Membership', label: 'Conference + Workshop + AOA Life Membership' },
  { key: 'Conference + AOA Certified Course + AOA Life Membership', label: 'Conference + AOA Certified Course + AOA Life Membership' },
  { key: 'Conference + Workshop + AOA Certified Course + AOA Life Membership', label: 'Conference + Workshop + AOA Certified Course + AOA Life Membership' },
];

const statusFilterOptions = [
  { key: 'PAID', label: 'Paid' },
  { key: 'PENDING', label: 'Pending' },
];

const roleFilterOptions = [
  { key: 'AOA', label: 'AOA' },
  { key: 'NON_AOA', label: 'NON AOA' },
  { key: 'PGS', label: 'PGS' },
];

const RegistrationsManagementPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilters, setPackageFilters] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [roleFilters, setRoleFilters] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const getPackageLabels = (registration) => {
    const labels = [];
    if (registration?.addWorkshop || registration?.selectedWorkshop) labels.push('Workshop');
    if (registration?.addAoaCourse) labels.push('AOA Certified Course');
    if (registration?.addLifeMembership) labels.push('AOA Life Membership');
    return labels;
  };

  const getRegistrationLabel = (registration) => {
    const labels = getPackageLabels(registration);
    return labels.length ? `Conference + ${labels.join(' + ')}` : 'Conference Only';
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      registrations.filter((r) => {
        const matchesSearch =
          r.registrationNumber?.toLowerCase().includes(q) ||
          r.userId?.name?.toLowerCase().includes(q) ||
          r.userId?.email?.toLowerCase().includes(q);
        const matchesPackage =
          packageFilters.length === 0 ||
          packageFilters.includes(getRegistrationLabel(r));
        const matchesStatus =
          statusFilters.length === 0 ||
          statusFilters.includes(r.paymentStatus);
        const matchesRole =
          roleFilters.length === 0 ||
          roleFilters.includes(r.userId?.role);
        return matchesSearch && matchesPackage && matchesStatus && matchesRole;
      })
    );
  }, [searchTerm, registrations, packageFilters, statusFilters, roleFilters]);

  const fetchRegistrations = async () => {
    try {
      const res = await adminAPI.getRegistrations();
      setRegistrations(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePackageFilter = (key) => {
    setPackageFilters((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const toggleStatusFilter = (key) => {
    setStatusFilters((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const toggleRoleFilter = (key) => {
    setRoleFilters((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const clearPackageFilters = () => {
    setPackageFilters([]);
  };

  const clearStatusFilters = () => {
    setStatusFilters([]);
  };

  const clearRoleFilters = () => {
    setRoleFilters([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r._id));
    }
  };

  // Small, neutral QR PNG download via public API + canvas
  const downloadQRCanvas = (qrData, filename) => {
    const canvas = canvasRef.current;
    if (!canvas || !qrData) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      qrData
    )}&color=0d47a1&bgcolor=ffffff`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 40, 320, 320);

      ctx.fillStyle = '#0d47a1';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(qrData, 240, 410);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = qrUrl;
  };

  const viewDetails = (registration) => {
    if (!registration) return;
    const qrData = registration.registrationNumber;
    setModalData({
      registration,
      qrData,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        qrData
      )}&color=0d47a1&bgcolor=ffffff`,
    });
    setShowModal(true);
  };

  const downloadBulkQR = () => {
    if (!selectedIds.length) return;
    selectedIds.forEach((id) => {
      const reg = registrations.find((r) => r._id === id);
      if (reg) {
        downloadQRCanvas(
          reg.registrationNumber,
          `AOA_${reg.registrationNumber}_QR.png`
        );
      }
    });
  };

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
  };

  const escapeHTMLValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const buildExportRows = (items) =>
    items.map((reg) => ({
      'Reg #': reg.registrationNumber || '',
      'Registration Type': reg.registrationType || '',
      'Booking Phase': reg.bookingPhase || '',
      Name: reg.userId?.name || '',
      Email: reg.userId?.email || '',
      Phone: reg.userId?.phone || '',
      Gender: reg.userId?.gender || '',
      Role: reg.userId?.role || '',
      'Membership ID': reg.userId?.membershipId || '',
      Address: reg.userId?.address || '',
      City: reg.userId?.city || '',
      State: reg.userId?.state || '',
      Pincode: reg.userId?.pincode || '',
      Country: reg.userId?.country || '',
      'Institute/Hospital': reg.userId?.instituteHospital || '',
      Designation: reg.userId?.designation || '',
      'Medical Council Name': reg.userId?.medicalCouncilName || '',
      'Medical Council Number': reg.userId?.medicalCouncilNumber || '',
      Package: getRegistrationLabel(reg),
      'Selected Workshop': reg.selectedWorkshop || '',
      Workshop: reg.addWorkshop || reg.selectedWorkshop ? 'Yes' : 'No',
      'AOA Certified Course': reg.addAoaCourse ? 'Yes' : 'No',
      'AOA Life Membership': reg.addLifeMembership ? 'Yes' : 'No',
      'Accompanying Persons': reg.accompanyingPersons ?? '',
      'Accompanying Base': reg.accompanyingBase ?? '',
      'Accompanying GST': reg.accompanyingGST ?? '',
      'Package Base': reg.packageBase ?? '',
      'Package GST': reg.packageGST ?? '',
      'AOA Course Base': reg.aoaCourseBase ?? '',
      'AOA Course GST': reg.aoaCourseGST ?? '',
      'Life Membership Base': reg.lifeMembershipBase ?? '',
      'Workshop Add-on': reg.workshopAddOn ?? '',
      'Total Base': reg.totalBase ?? '',
      'Total GST': reg.totalGST ?? '',
      'Subtotal With GST': reg.subtotalWithGST ?? '',
      'Processing Fee': reg.processingFee ?? '',
      Amount: reg.totalAmount ?? '',
      'Total Paid': reg.totalPaid ?? '',
      'Base Price': reg.basePrice ?? '',
      'Workshop Price': reg.workshopPrice ?? '',
      'Combo Discount': reg.comboDiscount ?? '',
      GST: reg.gst ?? '',
      'Coupon Code': reg.couponCode || '',
      'Coupon Discount': reg.couponDiscount ?? '',
      Status: reg.paymentStatus || '',
      'Lifetime Membership ID': reg.lifetimeMembershipId || '',
      'Razorpay Order ID': reg.razorpayOrderId || '',
      'Razorpay Payment ID': reg.razorpayPaymentId || '',
      'Registered At': reg.createdAt || '',
      'Updated At': reg.updatedAt || '',
    }));

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (items) => {
    const rows = buildExportRows(items);
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const csvLines = [
      headers.map(escapeCSVValue).join(','),
      ...rows.map((row) =>
        headers.map((header) => escapeCSVValue(row[header])).join(',')
      ),
    ].filter(Boolean);
    const blob = new Blob([csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    triggerDownload(blob, 'registrations.csv');
  };

  const downloadExcel = (items) => {
    const rows = buildExportRows(items);
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const thead = `<tr>${headers
      .map((header) => `<th>${escapeHTMLValue(header)}</th>`)
      .join('')}</tr>`;
    const tbody = rows
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${escapeHTMLValue(row[header])}</td>`)
            .join('')}</tr>`
      )
      .join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${thead}${tbody}</table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    triggerDownload(blob, 'registrations.xls');
  };

  const handleDeleteRegistration = (registration) => {
    if (!registration?._id) return;
    setDeleteTarget(registration);
  };

  const confirmDeleteRegistration = async () => {
    const registration = deleteTarget;
    if (!registration?._id) return;
    try {
      setDeletingId(registration._id);
      const res = await adminAPI.deleteRegistration(registration._id);
      setRegistrations((prev) => prev.filter((r) => r._id !== registration._id));
      setFiltered((prev) => prev.filter((r) => r._id !== registration._id));
      setSelectedIds((prev) => prev.filter((id) => id !== registration._id));
      if (modalData?.registration?._id === registration._id) {
        setShowModal(false);
        setModalData(null);
      }
      await fetchRegistrations();
      const paymentsDeleted =
        res?.data?.paymentsDeleted ??
        res?.data?.deletedPayments ??
        res?.data?.payments ??
        0;
      const attendanceDeleted =
        res?.data?.attendanceDeleted ??
        res?.data?.deletedAttendance ??
        res?.data?.attendance ??
        0;
      setDeleteNotice({
        type: 'success',
        message: `Registration deleted. Payments removed: ${paymentsDeleted}. Attendance removed: ${attendanceDeleted}.`,
      });
    } catch (err) {
      console.error('Failed to delete registration:', err);
      setDeleteNotice({
        type: 'error',
        message: 'Failed to delete registration. Please try again.',
      });
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleResendEmail = async (registration) => {
    try {
      setResendingId(registration._id);
      await adminAPI.resendRegistrationEmail(registration._id);
      setDeleteNotice({
        type: 'success',
        message: `Email resent for ${registration.registrationNumber}.`,
      });
    } catch (err) {
      setDeleteNotice({
        type: 'error',
        message: err.response?.data?.message || 'Failed to resend email.',
      });
    } finally {
      setResendingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      FAILED: 'bg-red-100 text-red-700 border-red-200',
    };
    const icons = {
      PAID: CheckCircle,
      PENDING: Clock,
      FAILED: XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
          colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="md" text="Loading registrations..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      {}
      {selectedIds.length > 0 && (
        <div className="fixed left-64 right-0 top-0 z-30 bg-emerald-600 text-white px-4 py-2 flex items-center gap-3 text-xs sm:text-sm">
          <Users className="w-4 h-4" />
          <span>{selectedIds.length} selected</span>
          <button
            onClick={downloadBulkQR}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-white/50 text-[11px] hover:bg-white/10"
          >
            <DownloadCloud className="w-3 h-3" />
            Bulk QR
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="ml-auto text-[11px] hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {}
        {deleteNotice && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-xs flex items-center justify-between gap-3 ${
              deleteNotice.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <span>{deleteNotice.message}</span>
            <button
              onClick={() => setDeleteNotice(null)}
              className="text-[11px] font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#005aa9]" />
            Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {filtered.length} of {registrations.length} records
          </p>
        </div>

        {}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="max-w-xs">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name / email / reg no"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-slate-600">
                  Package filter
                </p>
                {packageFilters.length > 0 && (
                  <button
                    onClick={clearPackageFilters}
                    className="text-[11px] text-slate-500 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {packageFilterOptions.map((option) => {
                  const isActive = packageFilters.includes(option.key);
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => togglePackageFilter(option.key)}
                      className={`px-2.5 py-1 text-[11px] rounded-full border ${
                        isActive
                          ? 'bg-[#005aa9] text-white border-[#005aa9]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-slate-600">
                  Status filter
                </p>
                {statusFilters.length > 0 && (
                  <button
                    onClick={clearStatusFilters}
                    className="text-[11px] text-slate-500 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {statusFilterOptions.map((option) => {
                  const isActive = statusFilters.includes(option.key);
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => toggleStatusFilter(option.key)}
                      className={`px-2.5 py-1 text-[11px] rounded-full border ${
                        isActive
                          ? 'bg-[#005aa9] text-white border-[#005aa9]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-slate-600">
                  Role filter
                </p>
                {roleFilters.length > 0 && (
                  <button
                    onClick={clearRoleFilters}
                    className="text-[11px] text-slate-500 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {roleFilterOptions.map((option) => {
                  const isActive = roleFilters.includes(option.key);
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => toggleRoleFilter(option.key)}
                      className={`px-2.5 py-1 text-[11px] rounded-full border ${
                        isActive
                          ? 'bg-[#005aa9] text-white border-[#005aa9]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => downloadCSV(filtered)}
              className="inline-flex items-center gap-1 px-3 py-2 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <DownloadCloud className="w-3 h-3" />
              Download CSV
            </button>
            <button
              onClick={() => downloadExcel(filtered)}
              className="inline-flex items-center gap-1 px-3 py-2 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <DownloadCloud className="w-3 h-3" />
              Download Excel
            </button>
          </div>
        </div>

        {}
        <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      selectedIds.length === filtered.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#005aa9]"
                  />
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Participant
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Reg #
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Package
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Coupon
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => (
                <tr key={reg._id} className="hover:bg-slate-50/60">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(reg._id)}
                      onChange={() => toggleSelect(reg._id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#005aa9]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-900 text-xs">
                      {reg.userId?.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {reg.userId?.email}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[12px] font-semibold text-[#005aa9]">
                    {reg.registrationNumber}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {getRegistrationLabel(reg)}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-900">
                    ₹{reg.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {reg.couponCode ? `${reg.couponCode} (-₹${reg.couponDiscount?.toLocaleString() || 0})` : '—'}
                  </td>
                  <td className="px-3 py-2">{getStatusBadge(reg.paymentStatus)}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() =>
                          downloadQRCanvas(
                            reg.registrationNumber,
                            `AOA_${reg.registrationNumber}_QR.png`
                          )
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      >
                        <QrCode className="w-3 h-3" />
                        QR
                      </button>
                      <button
                        onClick={() => viewDetails(reg)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleResendEmail(reg)}
                        disabled={resendingId === reg._id || reg.paymentStatus !== 'PAID'}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Mail className="w-3 h-3" />
                        {resendingId === reg._id ? 'Sending' : 'Resend'}
                      </button>
                      <button
                        onClick={() => handleDeleteRegistration(reg)}
                        disabled={deletingId === reg._id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === reg._id ? 'Deleting' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    No registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {}
        <div className="md:hidden space-y-3">
          {filtered.map((reg) => (
            <div
              key={reg._id}
              className="bg-white border border-slate-200 rounded-xl p-3 text-xs"
            >
              <div className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(reg._id)}
                  onChange={() => toggleSelect(reg._id)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#005aa9]"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    {reg.userId?.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {reg.userId?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-[10px] text-slate-500">Reg #</p>
                  <p className="font-mono text-[11px] font-semibold text-[#005aa9]">
                    {reg.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Package</p>
                  <p className="text-[11px] text-slate-800">
                    {getRegistrationLabel(reg)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Amount</p>
                  <p className="font-mono text-[11px] text-slate-900">
                    ₹{reg.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Coupon</p>
                  <p className="text-[11px] text-slate-800">
                    {reg.couponCode ? `${reg.couponCode} (-₹${reg.couponDiscount?.toLocaleString() || 0})` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Status</p>
                  {getStatusBadge(reg.paymentStatus)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    downloadQRCanvas(
                      reg.registrationNumber,
                      `AOA_${reg.registrationNumber}_QR.png`
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                  <QrCode className="w-3 h-3" />
                  QR
                </button>
                <button
                  onClick={() => viewDetails(reg)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="w-3 h-3" />
                  Details
                </button>
                <button
                  onClick={() => handleResendEmail(reg)}
                  disabled={resendingId === reg._id || reg.paymentStatus !== 'PAID'}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Mail className="w-3 h-3" />
                  {resendingId === reg._id ? 'Sending' : 'Resend'}
                </button>
                <button
                  onClick={() => handleDeleteRegistration(reg)}
                  disabled={deletingId === reg._id}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="w-3 h-3" />
                  {deletingId === reg._id ? 'Deleting' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        className="hidden"
      />

      {}
      {showModal && modalData && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#005aa9]" />
                {modalData.registration.registrationNumber}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-4 text-xs">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={modalData.qrUrl}
                  alt="QR"
                  className="w-40 h-40 rounded-xl border border-slate-200 mb-2"
                />
                <button
                  onClick={() =>
                    downloadQRCanvas(
                      modalData.qrData,
                      `AOA_${modalData.qrData}_QR.png`
                    )
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                  <DownloadCloud className="w-3 h-3" />
                  Download QR
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Participant
                  </p>
                  <p className="font-medium text-slate-900">
                    {modalData.registration.userId?.name}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.email}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.phone || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.gender || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600 capitalize">
                    {modalData.registration.userId?.role}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.membershipId || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Registration
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Package:{' '}
                    {getRegistrationLabel(modalData.registration)}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Amount: ₹
                    {modalData.registration.totalAmount?.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Coupon: {modalData.registration.couponCode
                      ? `${modalData.registration.couponCode} (-₹${modalData.registration.couponDiscount?.toLocaleString() || 0})`
                      : '—'}
                  </p>
                  <p className="text-[11px] text-slate-700 flex items-center gap-1">
                    Status: {getStatusBadge(modalData.registration.paymentStatus)}
                  </p>
                  {}
                  {modalData.registration.userId?.role === 'PGS' && (
                    <button
                      onClick={() => {
                        // TODO: hook your existing PDF download for PGS/Fellows here
                      }}
                      className="mt-1 inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="w-3 h-3" />
                      Download PGS PDF
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    Location
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.address || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.city || 'N/A'},{' '}
                    {modalData.registration.userId?.state || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.pincode || 'N/A'},{' '}
                    {modalData.registration.userId?.country || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    Professional
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.instituteHospital || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.designation || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.medicalCouncilName || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {modalData.registration.userId?.medicalCouncilNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-lg">
            <div className="px-4 py-3 border-b border-slate-200">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Delete registration
              </h2>
            </div>
            <div className="px-4 py-4 text-xs text-slate-600 space-y-2">
              <p>
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">
                  {deleteTarget.registrationNumber}
                </span>
                ?
              </p>
              <p className="text-[11px] text-slate-500">
                This will remove related payments and attendance records.
              </p>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRegistration}
                disabled={deletingId === deleteTarget._id}
                className="px-3 py-1.5 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === deleteTarget._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManagementPage;
