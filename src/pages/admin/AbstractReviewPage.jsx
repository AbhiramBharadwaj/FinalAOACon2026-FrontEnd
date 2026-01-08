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
  List,
  User
} from 'lucide-react';
import { abstractAPI } from '../../utils/api';
import { ABSTRACT_CATEGORIES } from '../../utils/constants';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AbstractReviewPage = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [filteredAbstracts, setFilteredAbstracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    reviewComments: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAbstracts();
  }, []);

  useEffect(() => {
    filterAbstracts();
  }, [abstracts, searchTerm, statusFilter, categoryFilter]);

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
        abstract.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        abstract.submissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(abstract => abstract.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(abstract => abstract.category === categoryFilter);
    }

    setFilteredAbstracts(filtered);
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

  const handleReview = (abstract) => {
    setSelectedAbstract(abstract);
    setReviewData({
      status: abstract.status || 'PENDING',
      reviewComments: abstract.reviewComments || ''
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

  const exportToCSV = () => {
    const headers = [
      'Submission Number', 'Title', 'Authors', 'Category', 'Submitter Name',
      'Submitter Email', 'Status', 'Submission Date', 'Review Comments'
    ];

    const csvData = filteredAbstracts.map(abstract => [
      abstract.submissionNumber,
      abstract.title,
      abstract.authors,
      getCategoryLabel(abstract.category),
      abstract.userId?.name,
      abstract.userId?.email,
      abstract.status,
      new Date(abstract.createdAt).toLocaleDateString(),
      abstract.reviewComments || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
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
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-base sm:text-lg text-slate-900">Abstract Review</h1>
              <p className="text-xs text-slate-600">{filteredAbstracts.length} of {totalAbstracts} abstracts</p>
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
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total</p>
                <p className="text-sm text-slate-900">{totalAbstracts}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Pending</p>
                <p className="text-sm text-slate-900">{pendingAbstracts}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Approved</p>
                <p className="text-sm text-slate-900">{approvedAbstracts}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Rejected</p>
                <p className="text-sm text-slate-900">{rejectedAbstracts}</p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search title, authors, submitter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All Categories</option>
                {ABSTRACT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {}
              <div className="sm:hidden space-y-2 p-3">
                {filteredAbstracts.map((abstract) => (
                  <div key={abstract._id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{abstract.title}</p>
                        <p className="text-xs text-slate-600 truncate">{abstract.authors}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(abstract.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-slate-500">#{abstract.submissionNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{getCategoryLabel(abstract.category)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500">{abstract.userId?.name}</span>
                      <span className="text-slate-500">{new Date(abstract.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleReview(abstract)}
                      className="w-full flex items-center justify-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-2 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </button>
                  </div>
                ))}
              </div>

              {}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-64">Title</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-48">Submitter</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAbstracts.map((abstract) => (
                      <tr key={abstract._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-900">{abstract.submissionNumber}</div>
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
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                          {new Date(abstract.createdAt).toLocaleDateString()}
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
                        <span className="text-slate-600">Category</span>
                        <span className="font-medium">{getCategoryLabel(selectedAbstract.category)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Current Status</span>
                        {getStatusBadge(selectedAbstract.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Submitted</span>
                        <span>{new Date(selectedAbstract.createdAt).toLocaleDateString()}</span>
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
                        <span className="font-medium truncate max-w-[200px]">{selectedAbstract.userId?.email}</span>
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

                      <Link className='mt-5 block flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-[#005aa9] text-white rounded-xl hover:bg-[#004684]  transition-all font-medium shadow-sm hover:shadow-md' to={`http://localhost:5050/${selectedAbstract.filePath}`}>Check Abstract</Link>
                    </div>
                  </div>

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
