import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  MessageSquare,
  Search,
  User,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_BASE_URL, videoAPI } from '../../utils/api';

const VideoConferencingPage = () => {
  const getAssetUrl = (filePath) => {
    if (!filePath) return null;
    return /^https?:\/\//i.test(filePath) ? filePath : `${API_BASE_URL}/${filePath}`;
  };

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    reviewComments: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((submission) =>
        submission.title.toLowerCase().includes(term) ||
        submission.presenterName.toLowerCase().includes(term) ||
        submission.userId?.name?.toLowerCase().includes(term) ||
        submission.submissionNumber.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((submission) => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, statusFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      const response = await videoAPI.getAll();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch video submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-amber-100 text-amber-800', icon: Clock },
      APPROVED: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const badge = badges[status] || { color: 'bg-slate-100 text-slate-800', icon: Clock };
    const IconComponent = badge.icon;

    return (
      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badge.color}`}>
        <IconComponent className="mr-1 h-2.5 w-2.5 flex-shrink-0" />
        {status}
      </span>
    );
  };

  const getSubmissionHistory = (submission) =>
    [...(submission?.submissionHistory || [])].sort(
      (a, b) => (b.attemptNumber || 0) - (a.attemptNumber || 0)
    );

  const getCurrentAttemptNumber = (submission) => getSubmissionHistory(submission)[0]?.attemptNumber || 1;
  const getLatestSubmittedAt = (submission) => getSubmissionHistory(submission)[0]?.submittedAt || submission?.createdAt;

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setReviewData({
      status: submission.status || 'PENDING',
      reviewComments: submission.reviewComments || '',
    });
    setShowModal(true);
  };

  const submitReview = async () => {
    if (!reviewData.status) {
      alert('Please select a review status');
      return;
    }

    setSubmitting(true);
    try {
      await videoAPI.review(selectedSubmission._id, reviewData);
      await fetchSubmissions();
      setShowModal(false);
      setSelectedSubmission(null);
      setReviewData({ status: '', reviewComments: '' });
    } catch (error) {
      console.error('Failed to submit video review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Submission Number',
      'Registration Number',
      'Title',
      'Presenter Name',
      'Presenter Details',
      'Description',
      'Submitter Name',
      'Submitter Email',
      'Attempt Number',
      'Status',
      'Submission Date',
      'Review Comments',
    ];

    const csvData = filteredSubmissions.map((submission) => [
      submission.submissionNumber,
      submission.registration?.registrationNumber || '',
      submission.title,
      submission.presenterName,
      submission.presenterDetails,
      submission.description,
      submission.userId?.name || '',
      submission.userId?.email || '',
      getCurrentAttemptNumber(submission),
      submission.status,
      new Date(getLatestSubmittedAt(submission)).toLocaleDateString(),
      submission.reviewComments || '',
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${String(field ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `video_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const total = submissions.length;
  const pending = submissions.filter((item) => item.status === 'PENDING').length;
  const approved = submissions.filter((item) => item.status === 'APPROVED').length;
  const rejected = submissions.filter((item) => item.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading video submissions..." />
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
              <h1 className="text-base text-slate-900 sm:text-lg">Video Conferencing</h1>
              <p className="text-xs text-slate-600">{filteredSubmissions.length} of {total} submissions</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-xl bg-[#005aa9] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#004684]"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Total', total, Video, 'bg-sky-50', 'text-sky-600'],
              ['Pending', pending, Clock, 'bg-amber-50', 'text-amber-600'],
              ['Approved', approved, CheckCircle, 'bg-emerald-50', 'text-emerald-600'],
              ['Rejected', rejected, XCircle, 'bg-red-50', 'text-red-600'],
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

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, presenter, submitter..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-[#005aa9] focus:outline-none focus:ring-1 focus:ring-[#005aa9]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#005aa9] focus:outline-none focus:ring-1 focus:ring-[#005aa9]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <div className="space-y-2 p-3 sm:hidden">
                {filteredSubmissions.map((submission) => (
                  <div key={submission._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{submission.title}</p>
                        <p className="truncate text-xs text-slate-600">{submission.presenterName}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">{getStatusBadge(submission.status)}</div>
                    </div>
                    <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">#{submission.submissionNumber} • Attempt {getCurrentAttemptNumber(submission)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{submission.userId?.name}</span>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{submission.registration?.registrationNumber || 'No registration'}</span>
                      <span className="text-slate-500">{new Date(getLatestSubmittedAt(submission)).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleReview(submission)}
                      className="flex w-full items-center justify-center gap-1 rounded-lg border border-[#005aa9]/20 py-2 text-xs text-[#005aa9] transition-colors hover:bg-[#005aa9]/5 hover:text-[#004684]"
                    >
                      <Eye className="h-3 w-3" />
                      Review
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">#</th>
                      <th className="w-64 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Title</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Presenter</th>
                      <th className="w-48 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Submitter</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Status</th>
                      <th className="w-32 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Date</th>
                      <th className="w-24 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-xs font-medium text-slate-900">{submission.submissionNumber}</div>
                          <div className="text-[10px] text-slate-500">Attempt {getCurrentAttemptNumber(submission)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="line-clamp-2 max-w-[300px] text-xs font-medium text-slate-900">{submission.title}</div>
                          <div className="line-clamp-1 text-[10px] text-slate-500">{submission.description}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-xs font-medium text-slate-900">{submission.presenterName}</div>
                          <div className="max-w-[160px] truncate text-[10px] text-slate-500">{submission.presenterDetails}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-xs font-medium text-slate-900">{submission.userId?.name}</div>
                          <div className="max-w-[120px] truncate text-[10px] text-slate-500">{submission.userId?.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">{getStatusBadge(submission.status)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                          {new Date(getLatestSubmittedAt(submission)).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <button
                            onClick={() => handleReview(submission)}
                            className="flex items-center gap-1 rounded-lg border border-[#005aa9]/20 px-2.5 py-1.5 text-xs text-[#005aa9] transition-colors hover:bg-[#005aa9]/5 hover:text-[#004684]"
                          >
                            <Eye className="h-3 w-3" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Video className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <h3 className="mb-1 text-sm font-medium text-slate-900">No video submissions found</h3>
              <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-2 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white">
            <div className="p-4 lg:p-6">
              <div className="mb-4 flex items-center justify-between lg:mb-6">
                <h3 className="text-sm font-medium text-slate-900 lg:text-base">Review Video Submission</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl p-1.5 transition-colors hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500 lg:h-5 lg:w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs lg:gap-6 lg:text-sm">
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 lg:p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                      <Video className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      Submission Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submission #</span>
                        <span className="font-medium">{selectedSubmission.submissionNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Attempt #</span>
                        <span className="font-medium">{getCurrentAttemptNumber(selectedSubmission)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Registration #</span>
                        <span className="font-medium">{selectedSubmission.registration?.registrationNumber || 'Not available'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Current Status</span>
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submitted</span>
                        <span>{new Date(getLatestSubmittedAt(selectedSubmission)).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 lg:p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                      <User className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      Submitter
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name</span>
                        <span className="font-medium">{selectedSubmission.userId?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Email</span>
                        <span className="max-w-[280px] break-all text-right font-medium">{selectedSubmission.userId?.email || 'Not available'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Title</h4>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">{selectedSubmission.title}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Presenter Name</h4>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">{selectedSubmission.presenterName}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Presenter Details</h4>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">{selectedSubmission.presenterDetails}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-slate-900">Description</h4>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">{selectedSubmission.description}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                      <Video className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      Uploaded Video
                    </h4>
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                      <div className="flex items-center gap-2 text-xs lg:text-sm">
                        <Video className="h-3.5 w-3.5 text-sky-600" />
                        <span className="font-medium text-sky-800">Competition Video</span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-sky-700">{selectedSubmission.filePath}</p>

                      <a
                        href={getAssetUrl(selectedSubmission.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#004684] hover:shadow-md"
                      >
                        Check Video
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-medium text-slate-900">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                      Review Decision
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Status *</label>
                        <select
                          value={reviewData.status}
                          onChange={(event) => setReviewData({ ...reviewData, status: event.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#005aa9] focus:outline-none focus:ring-1 focus:ring-[#005aa9]"
                        >
                          <option value="">Select status</option>
                          <option value="PENDING">Pending Review</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Comments</label>
                        <textarea
                          value={reviewData.reviewComments}
                          onChange={(event) => setReviewData({ ...reviewData, reviewComments: event.target.value })}
                          rows={3}
                          placeholder="Provide detailed feedback..."
                          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#005aa9] focus:outline-none focus:ring-1 focus:ring-[#005aa9]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={submitReview}
                          disabled={submitting || !reviewData.status}
                          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#004684] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {submitting ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <MessageSquare className="h-3.5 w-3.5" />
                              Submit Review
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedSubmission.reviewComments && (
                    <div className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
                      <h4 className="mb-2 text-[13px] font-medium text-amber-900">Previous Comments</h4>
                      <p className="text-xs leading-relaxed text-amber-800 lg:text-sm">{selectedSubmission.reviewComments}</p>
                      {selectedSubmission.reviewedAt && (
                        <p className="mt-2 text-[11px] text-amber-600">
                          Reviewed: {new Date(selectedSubmission.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {getSubmissionHistory(selectedSubmission).length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-3 text-[13px] font-medium text-slate-900">Submission History</h4>
                      <div className="space-y-2">
                        {getSubmissionHistory(selectedSubmission).map((attempt) => (
                          <div key={`video-review-attempt-${attempt.attemptNumber}-${attempt.submittedAt}`} className="rounded-lg border border-slate-200 bg-white p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900">Attempt #{attempt.attemptNumber || '-'}</p>
                              {getStatusBadge(attempt.finalStatus || 'PENDING')}
                            </div>
                            <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">{attempt.title}</p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : '-'}
                            </p>
                            {attempt.reviewComments && (
                              <p className="mt-1 text-[11px] text-amber-700">Review: {attempt.reviewComments}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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

export default VideoConferencingPage;
