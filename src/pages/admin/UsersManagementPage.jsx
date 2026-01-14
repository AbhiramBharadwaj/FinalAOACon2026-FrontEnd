import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Eye,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Award,
  CheckCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { adminAPI, API_BASE_URL } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteNotice, setDeleteNotice] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [reviewNotice, setReviewNotice] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewEditingEnabled, setReviewEditingEnabled] = useState(false);

  const getUserId = (user) => user?._id || user?.id;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    setFiltered(
      users.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        u.membershipId?.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setFetchError(null);
      const res = await adminAPI.getUsers();
      setUsers(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error('Fetch users failed:', err);
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch users.';
      setFetchError(
        status ? `Error ${status}: ${message}` : message
      );
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
      setSelectedIds(filtered.map((u) => getUserId(u)).filter(Boolean));
    }
  };

  const viewDetails = (user) => {
    if (!user) return;
    setReviewNotice(null);
    setReviewEditingEnabled(false);
    setModalData({ user });
    setShowModal(true);
  };

  const updateUserState = (updatedUser) => {
    if (!updatedUser) return;
    const userId = getUserId(updatedUser);
    setUsers((prev) => prev.map((u) => (getUserId(u) === userId ? updatedUser : u)));
    setFiltered((prev) => prev.map((u) => (getUserId(u) === userId ? updatedUser : u)));
    setModalData((prev) =>
      prev?.user && getUserId(prev.user) === userId ? { ...prev, user: updatedUser } : prev
    );
  };

  const reviewCollegeLetter = async (user, status) => {
    if (!user) return;
    const userId = getUserId(user);
    setReviewingId(userId);
    setReviewNotice(null);
    try {
      const res = await adminAPI.reviewCollegeLetter(userId, status);
      updateUserState(res.data.user);
      setReviewEditingEnabled(false);
      setReviewNotice({
        type: 'success',
        message: `Recommendation letter ${status.toLowerCase()}.`,
      });
    } catch (err) {
      setReviewNotice({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to review recommendation letter.',
      });
    } finally {
      setReviewingId(null);
    }
  };

  const handleDeleteUser = (user) => {
    if (!getUserId(user)) return;
    setDeleteTarget({ type: 'single', user });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    setDeleteTarget({ type: 'bulk', ids: [...selectedIds] });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'single') {
        const user = deleteTarget.user;
        const userId = getUserId(user);
        setDeletingId(userId);
        const res = await adminAPI.deleteUser(userId);
        setUsers((prev) => prev.filter((u) => getUserId(u) !== userId));
        setFiltered((prev) => prev.filter((u) => getUserId(u) !== userId));
        setSelectedIds((prev) => prev.filter((id) => id !== userId));
        if (modalData?.user && getUserId(modalData.user) === userId) {
          setShowModal(false);
          setModalData(null);
        }
        await fetchUsers();
        const deleted = res?.data?.deleted || {};
        setDeleteNotice({
          type: 'success',
          message: `User deleted. Registrations: ${deleted.registrations || 0}. Payments: ${deleted.payments || 0}. Attendance: ${deleted.attendance || 0}.`,
        });
      } else {
        setBulkDeleting(true);
        const res = await adminAPI.bulkDeleteUsers(deleteTarget.ids);
        setUsers((prev) =>
          prev.filter((u) => !deleteTarget.ids.includes(getUserId(u)))
        );
        setFiltered((prev) =>
          prev.filter((u) => !deleteTarget.ids.includes(getUserId(u)))
        );
        setSelectedIds([]);
        await fetchUsers();
        const deleted = res?.data?.deleted || {};
        setDeleteNotice({
          type: 'success',
          message: `Users deleted: ${deleted.users || 0}. Registrations: ${deleted.registrations || 0}. Payments: ${deleted.payments || 0}. Attendance: ${deleted.attendance || 0}.`,
        });
      }
    } catch (err) {
      console.error('Delete users failed:', err);
      setDeleteNotice({
        type: 'error',
        message: 'Failed to delete users. Please try again.',
      });
    } finally {
      setDeletingId(null);
      setBulkDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (isActive) => {
    const Icon = isActive ? CheckCircle : XCircle;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
          isActive
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-rose-100 text-rose-700 border-rose-200'
        }`}
      >
        <Icon className="w-3 h-3" />
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getLetterStatusBadge = (status) => {
    const normalized = status || 'PENDING';
    const styles = {
      APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-rose-100 text-rose-700 border-rose-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
          styles[normalized] || styles.PENDING
        }`}
      >
        {normalized}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="md" text="Loading users..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      {selectedIds.length > 0 && (
        <div className="fixed left-64 right-0 top-0 z-30 bg-rose-600 text-white px-4 py-2 flex items-center gap-3 text-xs sm:text-sm">
          <Users className="w-4 h-4" />
          <span>{selectedIds.length} selected</span>
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-white/50 text-[11px] hover:bg-white/10"
          >
            <Trash2 className="w-3 h-3" />
            Delete Selected
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
        {fetchError && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 flex items-center justify-between gap-3">
            <span>{fetchError}</span>
            <button
              onClick={() => setFetchError(null)}
              className="text-[11px] font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#005aa9]" />
            Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {filtered.length} of {users.length} records
          </p>
        </div>

        <div className="mb-4 max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name / email / phone"
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005aa9]/40"
            />
          </div>
        </div>

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
                  User
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Role
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Phone
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Created
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={getUserId(user)} className="hover:bg-slate-50/60">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(getUserId(user))}
                      onChange={() => toggleSelect(getUserId(user))}
                      className="w-4 h-4 rounded border-slate-300 text-[#005aa9]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-900 text-xs">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {user.role?.replace('_', ' + ') || 'N/A'}
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-700">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-3 py-2">{getStatusBadge(user.isActive)}</td>
                  <td className="px-3 py-2 text-[11px] text-slate-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => viewDetails(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingId === getUserId(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === getUserId(user) ? 'Deleting' : 'Delete'}
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
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {filtered.map((user) => (
            <div
              key={getUserId(user)}
              className="bg-white border border-slate-200 rounded-xl p-3 text-xs"
            >
              <div className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(getUserId(user))}
                  onChange={() => toggleSelect(getUserId(user))}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#005aa9]"
                />
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-[10px] text-slate-500">Role</p>
                  <p className="text-[11px] text-slate-800">
                    {user.role?.replace('_', ' + ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Phone</p>
                  <p className="text-[11px] text-slate-800">
                    {user.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Status</p>
                  {getStatusBadge(user.isActive)}
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Created</p>
                  <p className="text-[11px] text-slate-800">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => viewDetails(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="w-3 h-3" />
                  Details
                </button>
                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={deletingId === getUserId(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="w-3 h-3" />
                  {deletingId === getUserId(user) ? 'Deleting' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && modalData && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#005aa9]" />
                {modalData.user.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-4 text-xs">
              {reviewNotice && (
                <div
                  className={`rounded-lg border px-3 py-2 text-[11px] ${
                    reviewNotice.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {reviewNotice.message}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Contact
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.email}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.phone || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Role
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.role?.replace('_', ' + ') || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Membership ID: {modalData.user.membershipId || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.address || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.city || 'N/A'},{' '}
                    {modalData.user.state || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.pincode || 'N/A'},{' '}
                    {modalData.user.country || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Professional
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.instituteHospital || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.designation || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.medicalCouncilName || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.medicalCouncilNumber || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {modalData.user.createdAt
                      ? new Date(modalData.user.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    Status: {modalData.user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {modalData.user.role === 'PGS' && modalData.user.collegeLetter && (
                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      Recommendation letter
                    </p>
                    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 flex flex-wrap items-center gap-2">
                      <a
                        href={`${API_BASE_URL}/${modalData.user.collegeLetter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-medium text-[#005aa9] hover:underline"
                      >
                        View PDF
                      </a>
                      {getLetterStatusBadge(modalData.user.collegeLetterStatus)}
                      {modalData.user.collegeLetterReviewedAt && (
                        <span className="text-[10px] text-slate-500">
                          Reviewed {new Date(modalData.user.collegeLetterReviewedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewCollegeLetter(modalData.user, 'APPROVED')}
                        disabled={
                          reviewingId === getUserId(modalData.user) ||
                          (modalData.user.collegeLetterStatus && modalData.user.collegeLetterStatus !== 'PENDING' && !reviewEditingEnabled)
                        }
                        className="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewCollegeLetter(modalData.user, 'REJECTED')}
                        disabled={
                          reviewingId === getUserId(modalData.user) ||
                          (modalData.user.collegeLetterStatus && modalData.user.collegeLetterStatus !== 'PENDING' && !reviewEditingEnabled)
                        }
                        className="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                      >
                        Reject
                      </button>
                      {modalData.user.collegeLetterStatus &&
                        modalData.user.collegeLetterStatus !== 'PENDING' &&
                        !reviewEditingEnabled && (
                          <button
                            onClick={() => setReviewEditingEnabled(true)}
                            className="inline-flex items-center justify-center px-3 py-1 text-[11px] rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            Change review
                          </button>
                        )}
                    </div>
                  </div>
                )}
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
                Delete user{deleteTarget.type === 'bulk' ? 's' : ''}
              </h2>
            </div>
            <div className="px-4 py-4 text-xs text-slate-600 space-y-2">
              {deleteTarget.type === 'single' ? (
                <p>
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-slate-900">
                    {deleteTarget.user.name}
                  </span>
                  ?
                </p>
              ) : (
                <p>
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-slate-900">
                    {deleteTarget.ids.length}
                  </span>{' '}
                  users?
                </p>
              )}
              <p className="text-[11px] text-slate-500">
                This will remove related registrations, payments, and attendance
                records.
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
                onClick={confirmDelete}
                disabled={
                  (deleteTarget.type === 'single' &&
                    deletingId === getUserId(deleteTarget.user)) ||
                  bulkDeleting
                }
                className="px-3 py-1.5 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bulkDeleting ||
                deletingId === deleteTarget.user?._id
                  ? 'Deleting…'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;
