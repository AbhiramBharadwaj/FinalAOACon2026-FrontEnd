import { useState, useEffect, useRef, useMemo } from 'react';
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
  CalendarDays,
  SlidersHorizontal,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const packageFilterOptions = [
  { key: 'CONFERENCE_ONLY', label: 'Conference only' },
  { key: 'WORKSHOP', label: 'Workshop' },
  { key: 'AOA_COURSE', label: 'AOA Certified Course' },
  { key: 'LIFE_MEMBERSHIP', label: 'AOA Life Membership' },
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

const WORKSHOP_LABELS = {
  'labour-analgesia': 'Labour Analgesia',
  'critical-incidents': 'Critical Incidents in Obstetric Anaesthesia',
  pocus: 'POCUS in Obstetrics',
  'maternal-collapse': 'Maternal Resuscitation',
  'critical-incidents-ob-anaesthesia': 'Critical Incidents in Obstetric Anaesthesia',
  'pocus-regional-anaesthesia-obstetrics': 'POCUS in Obstetrics',
  'maternal-resuscitation': 'Maternal Resuscitation',
};

const RegistrationsManagementPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageFilters, setPackageFilters] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [roleFilters, setRoleFilters] = useState([]);
  const [workshopFilters, setWorkshopFilters] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [upgradingId, setUpgradingId] = useState(null);

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

  const matchesRegistrationChoice = (registration, choice) => {
    if (!choice) return true;
    if (choice === 'CONFERENCE_ONLY') {
      return !registration.addWorkshop && !registration.selectedWorkshop &&
        !registration.addAoaCourse && !registration.addLifeMembership;
    }
    if (choice === 'WORKSHOP') {
      return Boolean(registration.addWorkshop || registration.selectedWorkshop);
    }
    if (choice === 'AOA_COURSE') return Boolean(registration.addAoaCourse);
    if (choice === 'LIFE_MEMBERSHIP') return Boolean(registration.addLifeMembership);
    return true;
  };

  const getWorkshopLabel = (workshopId) =>
    WORKSHOP_LABELS[workshopId] || workshopId || '—';

  const formatRegistrationDate = (value) => {
    if (!value) return { date: 'Not available', time: '' };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { date: 'Not available', time: '' };
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const registrationStats = useMemo(
    () => ({
      total: registrations.length,
      shown: filtered.length,
      paid: registrations.filter((registration) => registration.paymentStatus === 'PAID').length,
      pending: registrations.filter((registration) => registration.paymentStatus === 'PENDING').length,
    }),
    [registrations, filtered.length]
  );

  const activeFilterCount =
    packageFilters.length + statusFilters.length + roleFilters.length + workshopFilters.length;

  const filterCounts = useMemo(() => {
    const packages = new Map(
      packageFilterOptions.map((option) => [
        option.key,
        registrations.filter((registration) =>
          matchesRegistrationChoice(registration, option.key)
        ).length,
      ])
    );
    const statuses = new Map();
    const roles = new Map();
    registrations.forEach((registration) => {
      if (registration.paymentStatus) {
        statuses.set(
          registration.paymentStatus,
          (statuses.get(registration.paymentStatus) || 0) + 1
        );
      }
      if (registration.userId?.role) {
        roles.set(
          registration.userId.role,
          (roles.get(registration.userId.role) || 0) + 1
        );
      }
    });
    return { packages, statuses, roles };
  }, [registrations]);

  const workshopFilterOptions = useMemo(() => {
    const byLabel = new Map();
    registrations.forEach((reg) => {
      if (!reg?.selectedWorkshop) return;
      const id = reg.selectedWorkshop;
      const label = getWorkshopLabel(id);
      if (!byLabel.has(label)) {
        byLabel.set(label, { key: label, label, ids: new Set(), count: 0 });
      }
      byLabel.get(label).ids.add(id);
      byLabel.get(label).count += 1;
    });
    return Array.from(byLabel.values())
      .map((option) => ({
        ...option,
        ids: Array.from(option.ids),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [registrations]);

  const selectedPackage = packageFilters[0] || '';
  const workshopFilterDisabled = selectedPackage !== 'WORKSHOP';

  const handlePackageFilterChange = (value) => {
    setPackageFilters(value ? [value] : []);
    if (value !== 'WORKSHOP') setWorkshopFilters([]);
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
        const matchesPackage = matchesRegistrationChoice(r, packageFilters[0]);
        const matchesStatus =
          statusFilters.length === 0 ||
          statusFilters.includes(r.paymentStatus);
        const matchesRole =
          roleFilters.length === 0 ||
          roleFilters.includes(r.userId?.role);
        const matchesWorkshop =
          workshopFilters.length === 0 ||
          (r.selectedWorkshop &&
            workshopFilterOptions.some(
              (option) =>
                workshopFilters.includes(option.key) &&
                option.ids.includes(r.selectedWorkshop)
            ));
        return (
          matchesSearch &&
          matchesPackage &&
          matchesStatus &&
          matchesRole &&
          matchesWorkshop
        );
      })
    );
  }, [
    searchTerm,
    registrations,
    packageFilters,
    statusFilters,
    roleFilters,
    workshopFilters,
    workshopFilterOptions,
  ]);

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

  const clearAllFilters = () => {
    setSearchTerm('');
    setPackageFilters([]);
    setStatusFilters([]);
    setRoleFilters([]);
    setWorkshopFilters([]);
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

  const canAddLifeMembership = (registration) =>
    registration?.paymentStatus === 'PAID' &&
    registration?.userId?.role === 'NON_AOA' &&
    !registration?.addLifeMembership;

  const handleAddLifeMembership = async (registration) => {
    if (!canAddLifeMembership(registration)) return;
    const confirmed = window.confirm(
      `Add AOA Life Membership to ${registration.registrationNumber}? The attendee will need to pay the additional balance.`
    );
    if (!confirmed) return;

    try {
      setUpgradingId(registration._id);
      const res = await adminAPI.addLifeMembership(registration._id);
      const updated = res.data?.registration;
      if (updated) {
        setRegistrations((prev) => prev.map((item) => item._id === updated._id ? updated : item));
        if (modalData?.registration?._id === updated._id) {
          setModalData((prev) => ({ ...prev, registration: updated }));
        }
      }
      setDeleteNotice({
        type: 'success',
        message: `Life membership added. Additional balance: ₹${Number(res.data?.balanceDue || 0).toLocaleString('en-IN')}.`,
      });
    } catch (err) {
      setDeleteNotice({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add AOA Life Membership.',
      });
    } finally {
      setUpgradingId(null);
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
        <div className="mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#005aa9]" />
            Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            View attendees, payment status, packages and registration dates.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { label: 'All registrations', value: registrationStats.total, tone: 'border-blue-200 bg-blue-50 text-blue-700' },
            { label: 'Currently shown', value: registrationStats.shown, tone: 'border-cyan-200 bg-cyan-50 text-cyan-700' },
            { label: 'Paid', value: registrationStats.paid, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
            { label: 'Payment pending', value: registrationStats.pending, tone: 'border-amber-200 bg-amber-50 text-amber-700' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-3 ${item.tone}`}>
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">{item.label}</p>
              <p className="mt-1 text-2xl font-bold">{item.value.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        {}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#005aa9]/10 p-2 text-[#005aa9]">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Find registrations</h2>
                <p className="text-[11px] text-slate-500">Search, or choose a value from any dropdown.</p>
              </div>
            </div>
            {(activeFilterCount > 0 || searchTerm) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
              >
                Clear all {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Search attendee</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, email or registration number"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Registration choice</label>
              <select
                value={packageFilters[0] || ''}
                onChange={(event) => handlePackageFilterChange(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
              >
                <option value="">All registrations ({registrations.length})</option>
                {packageFilterOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label} ({filterCounts.packages.get(option.key) || 0})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Payment status</label>
              <select
                value={statusFilters[0] || ''}
                onChange={(event) => setStatusFilters(event.target.value ? [event.target.value] : [])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
              >
                <option value="">All statuses ({registrations.length})</option>
                {statusFilterOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label} ({filterCounts.statuses.get(option.key) || 0})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Attendee type</label>
              <select
                value={roleFilters[0] || ''}
                onChange={(event) => setRoleFilters(event.target.value ? [event.target.value] : [])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
              >
                <option value="">All attendee types ({registrations.length})</option>
                {roleFilterOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label} ({filterCounts.roles.get(option.key) || 0})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Workshop</label>
              <select
                value={workshopFilters[0] || ''}
                onChange={(event) => setWorkshopFilters(event.target.value ? [event.target.value] : [])}
                disabled={workshopFilterDisabled}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {workshopFilterDisabled
                    ? 'Select Workshop above first'
                    : `All workshops (${workshopFilterOptions.reduce((total, option) => total + option.count, 0)})`}
                </option>
                {workshopFilterOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              {workshopFilterDisabled && (
                <p className="mt-1 text-[10px] text-slate-500">
                  Choose Workshop under Registration choice to filter individual workshops.
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
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
        <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[1450px] text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
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
                  Attendee
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Registration No.
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Registered on
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Package
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Workshop
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
              {filtered.map((reg, index) => {
                const registered = formatRegistrationDate(reg.createdAt);
                return (
                <tr key={reg._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-blue-50/50`}>
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
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <CalendarDays className="mt-0.5 h-3.5 w-3.5 text-[#005aa9]" />
                      <div>
                        <div className="text-[11px] font-medium">{registered.date}</div>
                        <div className="text-[10px] text-slate-500">{registered.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {getRegistrationLabel(reg)}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {reg.selectedWorkshop
                      ? getWorkshopLabel(reg.selectedWorkshop)
                      : 'CONFERENCE ONLY'}
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
                      {canAddLifeMembership(reg) && (
                        <button
                          onClick={() => handleAddLifeMembership(reg)}
                          disabled={upgradingId === reg._id}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Award className="w-3 h-3" />
                          {upgradingId === reg._id ? 'Adding' : 'Add membership'}
                        </button>
                      )}
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
              );})}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
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
          {filtered.map((reg) => {
            const registered = formatRegistrationDate(reg.createdAt);
            return (
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
                  <p className="text-[10px] text-slate-500">Registration No.</p>
                  <p className="font-mono text-[11px] font-semibold text-[#005aa9]">
                    {reg.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Registered on</p>
                  <p className="text-[11px] font-medium text-slate-800">{registered.date}</p>
                  <p className="text-[10px] text-slate-500">{registered.time}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Package</p>
                  <p className="text-[11px] text-slate-800">
                    {getRegistrationLabel(reg)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Workshop</p>
                  <p className="text-[11px] text-slate-800">
                    {reg.selectedWorkshop
                      ? getWorkshopLabel(reg.selectedWorkshop)
                      : 'CONFERENCE ONLY'}
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
                {canAddLifeMembership(reg) && (
                  <button
                    onClick={() => handleAddLifeMembership(reg)}
                    disabled={upgradingId === reg._id}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Award className="w-3 h-3" />
                    {upgradingId === reg._id ? 'Adding' : 'Membership'}
                  </button>
                )}
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
          );})}
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
                    Workshop:{' '}
                    {modalData.registration.selectedWorkshop
                      ? getWorkshopLabel(modalData.registration.selectedWorkshop)
                      : 'CONFERENCE ONLY'}
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
                  <p className="text-[11px] text-slate-700">
                    Registered on:{' '}
                    <span className="font-medium">
                      {formatRegistrationDate(modalData.registration.createdAt).date}{' '}
                      {formatRegistrationDate(modalData.registration.createdAt).time}
                    </span>
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
