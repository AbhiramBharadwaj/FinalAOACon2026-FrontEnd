import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Clock, Download, FileText, Search, Users } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { facultyCvAPI } from '../../utils/api';

const FacultyCvManagementPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await facultyCvAPI.getAll();
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch faculty CV records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !term ||
        record.name?.toLowerCase().includes(term) ||
        record.email?.toLowerCase().includes(term) ||
        record.role?.toLowerCase().includes(term);
      const matchesStatus = !statusFilter || record.cvStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const uploaded = records.filter((record) => record.cvStatus === 'UPLOADED' || record.cvStatus === 'REVIEWED').length;
  const pending = records.length - uploaded;

  const statusBadge = (status) => {
    if (status === 'UPLOADED' || status === 'REVIEWED') {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Uploaded
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </span>
    );
  };

  const downloadCv = async (record) => {
    try {
      const response = await facultyCvAPI.download(record._id);
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = record.cvFileName || `${record.name || 'faculty'}-cv`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download faculty CV:', error);
      alert('CV could not be downloaded. Please try again.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'CV Status', 'Uploaded At', 'File Name'];
    const csvRows = filteredRecords.map((record) => [
      record.name || '',
      record.email || '',
      record.role || '',
      record.cvStatus || '',
      record.cvUploadedAt ? new Date(record.cvUploadedAt).toLocaleString('en-IN') : '',
      record.cvFileName || '',
    ]);
    const csv = [headers, ...csvRows]
      .map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `faculty_cvs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading faculty CV records..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base text-slate-900 sm:text-lg">Faculty CVs</h1>
              <p className="text-xs text-slate-600">{filteredRecords.length} of {records.length} faculty</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-xl bg-[#005aa9] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#004684]"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['Total Faculty', records.length, Users, 'bg-sky-50', 'text-sky-600'],
              ['Uploaded', uploaded, CheckCircle, 'bg-emerald-50', 'text-emerald-600'],
              ['Pending', pending, Clock, 'bg-amber-50', 'text-amber-600'],
            ].map(([label, value, Icon, bgClass, textClass]) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgClass}`}>
                  <Icon className={`h-4 w-4 ${textClass}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-600">{label}</p>
                  <p className="text-sm text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name, email, role..."
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-[#005aa9] focus:ring-2 focus:ring-[#005aa9]/10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#005aa9] focus:ring-2 focus:ring-[#005aa9]/10"
              >
                <option value="">All statuses</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="NOT_UPLOADED">Pending</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    {['Faculty', 'Role', 'Status', 'Uploaded', 'File', 'Action'].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-900">{record.name}</p>
                        <p className="text-[10px] text-slate-500">{record.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.role || '-'}</td>
                      <td className="px-4 py-3">{statusBadge(record.cvStatus)}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {record.cvUploadedAt ? new Date(record.cvUploadedAt).toLocaleString('en-IN') : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{record.cvFileName || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => downloadCv(record)}
                          disabled={!record.cvUploadedAt}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#005aa9] px-2.5 py-1.5 text-xs text-white hover:bg-[#004684] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {filteredRecords.map((record) => (
                <div key={record._id} className="p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{record.name}</p>
                      <p className="truncate text-xs text-slate-500">{record.email}</p>
                    </div>
                    {statusBadge(record.cvStatus)}
                  </div>
                  <p className="mb-2 text-xs text-slate-600">{record.role || '-'}</p>
                  {record.cvFileName && (
                    <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-600">
                      <FileText className="h-3 w-3" />
                      {record.cvFileName}
                    </p>
                  )}
                  <button
                    onClick={() => downloadCv(record)}
                    disabled={!record.cvUploadedAt}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#005aa9] px-2.5 py-1.5 text-xs text-white hover:bg-[#004684] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-900">No faculty records found</p>
                <p className="text-xs text-slate-500">Try adjusting the search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCvManagementPage;
