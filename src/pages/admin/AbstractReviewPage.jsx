import { useState, useEffect } from 'react';
import {
  FileText, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  MessageSquare,
  User
} from 'lucide-react';
import { abstractAPI, API_BASE_URL } from '../../utils/api';
import { downloadPoster } from '../../utils/posterDownload';
import { ABSTRACT_CATEGORIES } from '../../utils/constants';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X } from 'lucide-react';

const AbstractReviewPage = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [filteredAbstracts, setFilteredAbstracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [posterFilter, setPosterFilter] = useState('');
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    reviewComments: ''
  });
  const [posterReviewData, setPosterReviewData] = useState({
    status: '',
    reviewComments: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [posterSubmitting, setPosterSubmitting] = useState(false);
  const [downloadingPosterIds, setDownloadingPosterIds] = useState([]);

  useEffect(() => {
    fetchAbstracts();
  }, []);

  useEffect(() => {
    filterAbstracts();
  }, [abstracts, searchTerm, statusFilter, categoryFilter, posterFilter]);

  const fetchAbstracts = async () => {
    try {
      const response = await abstractAPI.getAll();
      setAbstracts(response.data);
    } catch (error) {
      console.error('Failed to fetch abstracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAbstracts = () => {
    let filtered = abstracts;

    if (searchTerm) {
      filtered = filtered.filter(abstract => 
        abstract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.registration?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.submissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(abstract => abstract.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(abstract => abstract.category === categoryFilter);
    }

    if (posterFilter === 'UPLOADED') {
      filtered = filtered.filter(abstract => Boolean(abstract.finalPosterPath));
    }

    if (posterFilter === 'POSTER_PENDING') {
      filtered = filtered.filter(abstract => abstract.finalPosterPath && (abstract.finalPosterStatus || 'PENDING') === 'PENDING');
    }

    if (posterFilter === 'POSTER_APPROVED') {
      filtered = filtered.filter(abstract => abstract.finalPosterPath && abstract.finalPosterStatus === 'APPROVED');
    }

    if (posterFilter === 'POSTER_REJECTED') {
      filtered = filtered.filter(abstract => abstract.finalPosterPath && abstract.finalPosterStatus === 'REJECTED');
    }

    if (posterFilter === 'NOT_UPLOADED') {
      filtered = filtered.filter(abstract => !abstract.finalPosterPath);
    }

    if (posterFilter === 'APPROVED_PENDING') {
      filtered = filtered.filter(abstract => abstract.status === 'APPROVED' && !abstract.finalPosterPath);
    }

    setFilteredAbstracts(filtered);
  };

  const getAssetUrl = (filePath) => {
    if (!filePath) return null;
    return /^https?:\/\//i.test(filePath) ? filePath : `${API_BASE_URL}/${filePath}`;
  };

  const handlePosterDownload = async (abstract) => {
    setDownloadingPosterIds(ids => [...ids, abstract._id]);
    try {
      await downloadPoster(abstract, getAssetUrl(abstract.finalPosterPath));
    } catch (error) {
      console.error('Failed to download e-poster:', error);
      alert('E-poster could not be downloaded. Please try again.');
    } finally {
      setDownloadingPosterIds(ids => ids.filter(id => id !== abstract._id));
    }
  };

  const getPosterStatusLabel = (abstract) => {
    if (abstract.finalPosterPath) {
      return {
        PENDING: 'Awaiting review',
        APPROVED: 'Poster Accepted',
        REJECTED: 'Poster Rejected',
      }[abstract.finalPosterStatus || 'PENDING'];
    }
    if (abstract.status === 'APPROVED') return 'Not submitted';
    return 'Not eligible';
  };

  const getPosterBadge = (abstract) => {
    const status = getPosterStatusLabel(abstract);
    const styles = {
      Uploaded: 'bg-emerald-100 text-emerald-800',
      'Awaiting review': 'bg-amber-100 text-amber-800',
      'Poster Accepted': 'bg-emerald-100 text-emerald-800',
      'Poster Rejected': 'bg-red-100 text-red-800',
      'Not submitted': 'bg-amber-100 text-amber-800',
      'Not eligible': 'bg-slate-100 text-slate-600',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-amber-100 text-amber-800', icon: Clock },
      APPROVED: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle }
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

  const getCategoryLabel = (category) => {
    const categoryObj = ABSTRACT_CATEGORIES.find(cat => cat.value === category);
    return categoryObj ? categoryObj.label : category;
  };

  const getSubmissionHistory = (abstract) =>
    [...(abstract?.submissionHistory || [])].sort(
      (a, b) => (b.attemptNumber || 0) - (a.attemptNumber || 0)
    );

  const getCurrentAttemptNumber = (abstract) => {
    const latestAttempt = getSubmissionHistory(abstract)[0];
    return latestAttempt?.attemptNumber || 1;
  };

  const getLatestSubmittedAt = (abstract) => {
    const latestAttempt = getSubmissionHistory(abstract)[0];
    return latestAttempt?.submittedAt || abstract?.createdAt;
  };

  const handleReview = (abstract) => {
    setSelectedAbstract(abstract);
    setReviewData({
      status: abstract.status || 'PENDING',
      reviewComments: abstract.reviewComments || ''
    });
    setPosterReviewData({
      status: abstract.finalPosterStatus || 'PENDING',
      reviewComments: abstract.finalPosterReviewComments || ''
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
      await abstractAPI.review(selectedAbstract._id, reviewData);
      fetchAbstracts();
      setShowModal(false);
      setSelectedAbstract(null);
      setReviewData({ status: '', reviewComments: '' });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitPosterReview = async (statusOverride) => {
    const nextStatus = statusOverride || posterReviewData.status;
    if (!nextStatus || !['APPROVED', 'REJECTED'].includes(nextStatus)) {
      alert('Please select Accepted or Rejected for the final e-poster');
      return;
    }

    setPosterSubmitting(true);
    try {
      const payload = {
        status: nextStatus,
        reviewComments: posterReviewData.reviewComments
      };
      await abstractAPI.reviewFinalPoster(selectedAbstract._id, payload);
      await fetchAbstracts();
      setShowModal(false);
      setSelectedAbstract(null);
      setPosterReviewData({ status: '', reviewComments: '' });
    } catch (error) {
      console.error('Failed to submit final e-poster review:', error);
      alert(error.response?.data?.message || 'Failed to submit final e-poster review. Please try again.');
    } finally {
      setPosterSubmitting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Submission Number', 'Registration Number', 'Title', 'Authors', 'Category', 'Submitter Name',
      'Submitter Email', 'Attempt Number', 'Status', 'Final E-Poster Status',
      'Final E-Poster Uploaded At', 'Final E-Poster File', 'Submission Date', 'Review Comments'
    ];

    const csvData = filteredAbstracts.map(abstract => [
      abstract.submissionNumber,
      abstract.registration?.registrationNumber || '',
      abstract.title,
      abstract.authors,
      getCategoryLabel(abstract.category),
      abstract.userId?.name,
      abstract.userId?.email,
      getCurrentAttemptNumber(abstract),
      abstract.status,
      getPosterStatusLabel(abstract),
      abstract.finalPosterUploadedAt ? new Date(abstract.finalPosterUploadedAt).toLocaleString() : '',
      getAssetUrl(abstract.finalPosterPath) || '',
      new Date(getLatestSubmittedAt(abstract)).toLocaleDateString(),
      abstract.reviewComments || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abstracts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAbstracts = abstracts.length;
  const pendingAbstracts = abstracts.filter(a => a.status === 'PENDING').length;
  const approvedAbstracts = abstracts.filter(a => a.status === 'APPROVED').length;
  const rejectedAbstracts = abstracts.filter(a => a.status === 'REJECTED').length;
  const uploadedPosters = abstracts.filter(a => a.finalPosterPath).length;
  const pendingPosters = abstracts.filter(a => a.finalPosterPath && (a.finalPosterStatus || 'PENDING') === 'PENDING').length;

  const approvedPosters = abstracts.filter(a => a.finalPosterPath && a.finalPosterStatus === 'APPROVED').length;
  const rejectedPosters = abstracts.filter(a => a.finalPosterPath && a.finalPosterStatus === 'REJECTED').length;
  const awaitingUpload = abstracts.filter(a => a.status === 'APPROVED' && !a.finalPosterPath).length;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading abstracts..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="min-w-0 flex-1 overflow-auto">
        <div className="p-4 pt-20 sm:p-6 sm:pt-20 lg:pt-6">
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-base sm:text-lg text-slate-900">Abstracts &amp; E-Posters</h1>
              <p className="text-xs text-slate-600">Track abstract decisions and final e-poster submissions separately.</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex min-h-11 items-center justify-center gap-1.5 px-4 py-2 text-sm bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-colors"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>

          {}
          <section aria-label="Submission overview" className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {[
              {
                title: 'Abstracts submitted', count: totalAbstracts, icon: FileText,
                description: 'Current abstract submissions across all categories.',
                stats: [
                  { label: 'Awaiting review', count: pendingAbstracts, tone: 'text-amber-700' },
                  { label: 'Approved', count: approvedAbstracts, tone: 'text-emerald-700' },
                  { label: 'Rejected', count: rejectedAbstracts, tone: 'text-red-700' },
                ],
              },
              {
                title: 'E-posters submitted', count: uploadedPosters, icon: Download,
                description: 'Final e-poster files uploaded after abstract approval.',
                stats: [
                  { label: 'Awaiting review', count: pendingPosters, tone: 'text-amber-700' },
                  { label: 'Accepted', count: approvedPosters, tone: 'text-emerald-700' },
                  { label: 'Rejected', count: rejectedPosters, tone: 'text-red-700' },
                ],
              },
            ].map(({ title, count, icon: Icon, description, stats }) => (
              <div key={title} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-medium text-slate-600">{title}</h2>
                    <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{count}</p>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-3 text-[#005aa9]"><Icon className="h-5 w-5" /></div>
                </div>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  {stats.map(stat => (
                    <div key={stat.label}>
                      <dt className="text-xs text-slate-600">{stat.label}</dt>
                      <dd className={`mt-1 text-xl font-semibold tabular-nums ${stat.tone}`}>{stat.count}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 xl:col-span-2">
              <strong className="tabular-nums">{awaitingUpload}</strong> approved abstracts are still awaiting an e-poster upload.
              <span className="mt-1 block text-xs text-slate-600">Overview counts always include all submissions, regardless of the filters below.</span>
            </p>
          </section>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  aria-label="Search submissions"
                  placeholder="Search title, authors, submitter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-h-11 w-full pl-9 pr-3 py-2 text-base sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                />
              </div>
              <select
                aria-label="Abstract review status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-h-11 min-w-0 w-full text-base sm:text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All abstract statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                aria-label="Abstract category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="min-h-11 min-w-0 w-full text-base sm:text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All Categories</option>
                {ABSTRACT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                aria-label="E-poster submission and review status"
                value={posterFilter}
                onChange={(e) => setPosterFilter(e.target.value)}
                className="min-h-11 min-w-0 w-full text-base sm:text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All E-Posters</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="POSTER_PENDING">Uploaded - Pending Review</option>
                <option value="POSTER_APPROVED">Uploaded - Accepted</option>
                <option value="POSTER_REJECTED">Uploaded - Rejected</option>
                <option value="NOT_UPLOADED">Not Uploaded</option>
                <option value="APPROVED_PENDING">Approved but Not Uploaded</option>
              </select>
            </div>
          </div>

          {}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600" aria-live="polite">Showing <strong>{filteredAbstracts.length}</strong> of {totalAbstracts} abstract submissions</p>
            {(searchTerm || statusFilter || categoryFilter || posterFilter) && (
              <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter(''); setCategoryFilter(''); setPosterFilter(''); }} className="min-h-11 rounded-lg px-3 text-sm font-medium text-[#005aa9] hover:bg-sky-50">Clear filters</button>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {}
              <div className="lg:hidden space-y-3 p-3">
                {filteredAbstracts.map((abstract) => (
                  <div key={abstract._id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex flex-col items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 break-words">{abstract.title}</p>
                        <p className="text-xs text-slate-600 break-words">{abstract.authors}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Abstract:</span> {getStatusBadge(abstract.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-slate-500">#{abstract.submissionNumber} • Attempt {getCurrentAttemptNumber(abstract)}</span>
                      </div>
                      <div className="text-right break-words">
                        <span className="font-medium">{getCategoryLabel(abstract.category)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500">{abstract.userId?.name}</span>
                      <span className="text-slate-500">{new Date(getLatestSubmittedAt(abstract)).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Final E-Poster</span>
                      <span>{getPosterBadge(abstract)}</span>
                    </div>
                    <button
                      onClick={() => handleReview(abstract)}
                      className="min-h-11 w-full flex items-center justify-center gap-1 text-sm text-[#005aa9] hover:text-[#004684] py-2 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </button>
                  </div>
                ))}
              </div>

              {}
              <div className="hidden lg:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-64">Title</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-48">Submitter</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">E-Poster</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAbstracts.map((abstract) => (
                      <tr key={abstract._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-900">{abstract.submissionNumber}</div>
                          <div className="text-[10px] text-slate-500">Attempt {getCurrentAttemptNumber(abstract)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-slate-900 line-clamp-2 max-w-[300px]">{abstract.title}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{abstract.authors}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          <span className="font-medium">{getCategoryLabel(abstract.category)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-900">{abstract.userId?.name}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{abstract.userId?.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(abstract.status)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {getPosterBadge(abstract)}
                            {abstract.finalPosterPath && (
                              <div className="flex items-center gap-2">
                                <a href={getAssetUrl(abstract.finalPosterPath)} target="_blank" rel="noreferrer" className="text-[10px] font-medium text-[#005aa9] hover:text-[#004684]">View</a>
                                <button type="button" onClick={() => handlePosterDownload(abstract)} disabled={downloadingPosterIds.includes(abstract._id)} className="text-[10px] font-medium text-[#005aa9] hover:text-[#004684] disabled:opacity-50">
                                  {downloadingPosterIds.includes(abstract._id) ? 'Downloading…' : 'Download'}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                          {new Date(getLatestSubmittedAt(abstract)).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleReview(abstract)}
                            className="flex items-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-1.5 px-2.5 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
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

          {filteredAbstracts.length === 0 && (
            <div className="text-center py-12 px-4">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No abstracts found</h3>
              <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {}
      {showModal && selectedAbstract && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-sm lg:text-base font-medium text-slate-900">Review Abstract</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:gap-6 text-xs lg:text-sm">
                {}
                <div className="space-y-4">
                  <div className="p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      Abstract Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submission #</span>
                        <span className="font-medium">{selectedAbstract.submissionNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Attempt #</span>
                        <span className="font-medium">{getCurrentAttemptNumber(selectedAbstract)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Registration #</span>
                        <span className="font-medium">
                          {selectedAbstract.registration?.registrationNumber || 'Not available'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Category</span>
                        <span className="font-medium">{getCategoryLabel(selectedAbstract.category)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Current Status</span>
                        {getStatusBadge(selectedAbstract.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submitted</span>
                        <span>{new Date(getLatestSubmittedAt(selectedAbstract)).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      Submitter
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name</span>
                        <span className="font-medium">{selectedAbstract.userId?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Email</span>
                        <span className="font-medium max-w-[280px] text-right break-all">
                          {selectedAbstract.userId?.email || 'Not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Title</h4>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 line-clamp-3 lg:line-clamp-none">{selectedAbstract.title}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Authors</h4>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 line-clamp-2">{selectedAbstract.authors}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      File
                    </h4>
                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                      <div className="flex items-center gap-2 text-xs lg:text-sm">
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-sky-800 font-medium">Abstract PDF</span>
                      </div>
                      <p className="text-sky-700 text-[11px] mt-1 truncate">{selectedAbstract.filePath}</p>

                      <a
                        className="mt-5 flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#004684] hover:shadow-md"
                        href={getAssetUrl(selectedAbstract.filePath)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Check Abstract
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      Final E-Poster
                    </h4>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs lg:text-sm font-medium text-emerald-900">Upload Status</span>
                        {getPosterBadge(selectedAbstract)}
                      </div>
                      {selectedAbstract.finalPosterPath ? (
                        <>
                          <p className="mt-2 text-[11px] text-emerald-800 truncate">
                            {selectedAbstract.finalPosterOriginalName || selectedAbstract.finalPosterPath}
                          </p>
                          {selectedAbstract.finalPosterUploadedAt && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              Uploaded: {new Date(selectedAbstract.finalPosterUploadedAt).toLocaleString()}
                            </p>
                          )}
                          {selectedAbstract.finalPosterReviewedAt && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              Reviewed: {new Date(selectedAbstract.finalPosterReviewedAt).toLocaleString()}
                            </p>
                          )}
                          {selectedAbstract.finalPosterReviewComments && (
                            <p className="mt-2 rounded-lg border border-white/70 bg-white/70 p-2 text-[11px] text-slate-700">
                              {selectedAbstract.finalPosterReviewComments}
                            </p>
                          )}
                          {selectedAbstract.finalPosterSize && (
                            <p className="mt-1 text-[11px] text-emerald-700">
                              Size: {(selectedAbstract.finalPosterSize / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          )}
                          <a href={getAssetUrl(selectedAbstract.finalPosterPath)} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-medium text-emerald-800 underline">View Final E-Poster</a>
                          <button
                            type="button"
                            onClick={() => handlePosterDownload(selectedAbstract)}
                            disabled={downloadingPosterIds.includes(selectedAbstract._id)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-50"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {downloadingPosterIds.includes(selectedAbstract._id) ? 'Downloading…' : 'Download Final E-Poster'}
                          </button>
                        </>
                      ) : (
                        <p className="mt-2 text-[11px] text-emerald-800">
                          {selectedAbstract.status === 'APPROVED'
                            ? 'Approved, but final e-poster has not been uploaded yet.'
                            : 'Final e-poster upload becomes available after approval.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedAbstract.finalPosterPath && (
                    <div className="p-4 bg-gradient-to-r from-sky-50 to-slate-50 rounded-2xl border border-sky-200">
                      <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                        <Download className="w-4 h-4 text-[#005aa9]" />
                        Final E-Poster Decision
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">E-poster status *</label>
                          <select
                            value={posterReviewData.status}
                            onChange={(e) => setPosterReviewData({ ...posterReviewData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm"
                          >
                            <option value="PENDING">Pending Review</option>
                            <option value="APPROVED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">E-poster comments</label>
                          <textarea
                            value={posterReviewData.reviewComments}
                            onChange={(e) => setPosterReviewData({ ...posterReviewData, reviewComments: e.target.value })}
                            rows={3}
                            placeholder="Example: Please use the official AOACON 2026 e-poster template and re-upload."
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => submitPosterReview('APPROVED')}
                            disabled={posterSubmitting}
                            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Accept E-Poster
                          </button>
                          <button
                            type="button"
                            onClick={() => submitPosterReview('REJECTED')}
                            disabled={posterSubmitting}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject E-Poster
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-slate-50 rounded-2xl border border-amber-200">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      Review Decision
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Status *</label>
                        <select
                          value={reviewData.status}
                          onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm"
                        >
                          <option value="">Select status</option>
                          <option value="PENDING">Pending Review</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Comments</label>
                        <textarea
                          value={reviewData.reviewComments}
                          onChange={(e) => setReviewData({ ...reviewData, reviewComments: e.target.value })}
                          rows={3}
                          placeholder="Provide detailed feedback..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={submitReview}
                          disabled={submitting || !reviewData.status}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 h-11 text-sm bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                        >
                          {submitting ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <MessageSquare className="w-3.5 h-3.5" />
                              Submit Review
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 px-4 py-2.5 h-11 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {}
                  {selectedAbstract.reviewComments && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                      <h4 className="font-medium text-amber-900 mb-2 text-[13px]">Previous Comments</h4>
                      <p className="text-amber-800 text-xs lg:text-sm leading-relaxed">{selectedAbstract.reviewComments}</p>
                      {selectedAbstract.reviewedAt && (
                        <p className="text-amber-600 text-[11px] mt-2">
                          Reviewed: {new Date(selectedAbstract.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {getSubmissionHistory(selectedAbstract).length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-3 text-[13px]">Submission History</h4>
                      <div className="space-y-2">
                        {getSubmissionHistory(selectedAbstract).map((attempt) => (
                          <div key={`attempt-${attempt.attemptNumber}-${attempt.submittedAt}`} className="p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900">Attempt #{attempt.attemptNumber || '-'}</p>
                              {getStatusBadge(attempt.finalStatus || 'PENDING')}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{attempt.title}</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : '-'}
                            </p>
                            {attempt.reviewComments && (
                              <p className="text-[11px] text-amber-700 mt-1">Review: {attempt.reviewComments}</p>
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

export default AbstractReviewPage;
