import { useState, useEffect } from 'react';
import { Download, Eye, Users, CheckCircle, Clock, Calendar, Filter, FileText } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AttendanceManagementPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchAttendances();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await fetch('https://aoa-backend.onrender.com/api/attendance', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAttendances(data);
      
      setStats({
        total: data.length,
        attended: data.filter(a => a.totalScans > 0).length,
        notAttended: data.filter(a => a.totalScans === 0).length,
      });
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = attendances.filter(attendance => {
    if (filter === 'attended') return attendance.totalScans > 0;
    if (filter === 'not-attended') return attendance.totalScans === 0;
    return true;
  });

  const downloadQR = async (attendanceId) => {
    const link = document.createElement('a');
    link.href = `https://aoa-backend.onrender.com/api/attendance/qr-download/${attendanceId}`;
    link.download = 'QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportList = async (type) => {
    setExporting(type);
    try {
      const endpoint = type === 'attended' 
        ? 'https://aoa-backend.onrender.com/api/attendance/export-attended' 
        : 'https://aoa-backend.onrender.com/api/attendance/export-not-attended';
      
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AOA_Attendance_${type === 'attended' ? 'Attended' : 'Not_Attended'}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting('');
    }
  };

  // Mobile Card Component
  const AttendanceCard = ({ attendance }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="font-semibold text-sm text-slate-900 truncate">
          {attendance.registrationId.userId.name}
        </div>
        {}
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Reg#</span>
          <span className="font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-900">
            {attendance.registrationId.registrationNumber}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Type</span>
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
            {attendance.registrationId.registrationType.replace('_', ' ').toLowerCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-600">Status</span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            attendance.totalScans > 0 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-orange-100 text-orange-800 border border-orange-200'
          }`}>
            {attendance.totalScans > 0 ? `Attended (${attendance.totalScans})` : 'Not Attended'}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Email</span>
          <span className="font-medium text-slate-900 truncate max-w-[120px]">
            {attendance.registrationId.userId.email}
          </span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-slate-600">Last Scan</span>
          <span className="text-xs text-slate-600">
            {attendance.scanHistory.length > 0
              ? new Date(attendance.scanHistory[0].scannedAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Never scanned'
            }
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading attendance..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Attendance Tracking</h1>
          <p className="text-sm text-slate-600 mt-1">Real-time attendance status & QR management</p>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total</p>
                <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Attended</p>
                <p className="text-xl font-bold text-slate-900">{stats.attended}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Not Attended</p>
                <p className="text-xl font-bold text-slate-900">{stats.notAttended}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Last Scan</p>
                <p className="text-sm font-bold text-slate-900">
                  {attendances[0]?.scanHistory[0]?.scannedAt 
                    ? new Date(attendances[0].scanHistory[0].scannedAt).toLocaleTimeString()
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-600 font-medium">Show:</span>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm font-medium text-slate-900 bg-transparent border-none focus:ring-0 focus:outline-none px-2 py-1 rounded hover:bg-slate-50 flex-1 min-w-[140px]"
            >
              <option value="all">All ({stats.total})</option>
              <option value="attended">Attended ({stats.attended})</option>
              <option value="not-attended">Not Attended ({stats.notAttended})</option>
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => exportList('attended')}
              disabled={exporting === 'attended'}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex-1 sm:flex-none min-w-[120px]"
            >
              {exporting === 'attended' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" />
                  Attended
                </>
              )}
            </button>
            <button
              onClick={() => exportList('not-attended')}
              disabled={exporting === 'not-attended'}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex-1 sm:flex-none min-w-[120px]"
            >
              {exporting === 'not-attended' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" />
                  Not Attended
                </>
              )}
            </button>
          </div>
        </div>

        {}
        <div className="space-y-3">
          {isMobile ? (
            // Mobile: Cards
            filteredAttendances.length > 0 ? (
              filteredAttendances.map((attendance) => (
                <AttendanceCard key={attendance._id} attendance={attendance} />
              ))
            ) : (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No records found</h3>
                <p className="text-sm text-slate-600">Try adjusting your filter above</p>
              </div>
            )
          ) : (
            // Desktop: Table
            <>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-3">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-sm text-slate-600">
                    Showing {filteredAttendances.length} of {attendances.length} registrations
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-48">Delegate</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Reg#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-32">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-28">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-40">Last Scan</th>
                        {}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAttendances.map((attendance) => (
                        <tr key={attendance._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm text-slate-900 truncate max-w-[150px] sm:max-w-none">
                              {attendance.registrationId.userId.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {attendance.registrationId.userId.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs">
                              {attendance.registrationId.registrationNumber}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                              {attendance.registrationId.registrationType.replace('_', ' ').toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              attendance.totalScans > 0 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-orange-100 text-orange-800 border border-orange-200'
                            }`}>
                              {attendance.totalScans > 0 ? `Attended (${attendance.totalScans})` : 'Not Attended'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {attendance.scanHistory.length > 0
                              ? new Date(attendance.scanHistory[0].scannedAt).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Never scanned'
                            }
                          </td>
                          {}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {filteredAttendances.length === 0 && (
                <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No records found</h3>
                  <p className="text-sm text-slate-600">Try adjusting your filter above</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagementPage;
