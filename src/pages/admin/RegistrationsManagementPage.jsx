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
  X,
  User,
  Mail,
  Phone,
  Award,
  CreditCard,
  FileText,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegistrationsManagementPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

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
      registrations.filter((r) =>
        r.registrationNumber?.toLowerCase().includes(q) ||
        r.userId?.name?.toLowerCase().includes(q) ||
        r.userId?.email?.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, registrations]);

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
        <div className="mb-4 max-w-xs">
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
                    {reg.registrationType?.replace('_', ' + ')}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-900">
                    ₹{reg.totalAmount?.toLocaleString()}
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
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
                    {reg.registrationType?.replace('_', ' + ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Amount</p>
                  <p className="font-mono text-[11px] text-slate-900">
                    ₹{reg.totalAmount?.toLocaleString()}
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
                  <p className="text-[11px] text-slate-600 capitalize">
                    {modalData.registration.userId?.role}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    Registration
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Package:{' '}
                    {modalData.registration.registrationType?.replace(
                      '_',
                      ' + '
                    )}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Amount: ₹
                    {modalData.registration.totalAmount?.toLocaleString()}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManagementPage;
