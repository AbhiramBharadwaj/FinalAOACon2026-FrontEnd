import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  ThumbsUp, 
  ThumbsDown,
  Download,
  Search,
  Eye
} from 'lucide-react';
import { feedbackAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X } from 'lucide-react';

const FeedbackViewerPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [recommendFilter, setRecommendFilter] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, ratingFilter, recommendFilter]);

  const fetchData = async () => {
    try {
      const [feedbacksRes, analyticsRes] = await Promise.all([
        feedbackAPI.getAll(),
        feedbackAPI.getAnalytics()
      ]);
      setFeedbacks(feedbacksRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(feedback => 
        feedback.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.suggestions?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter) {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(feedback => feedback.overallRating === rating);
    }

    if (recommendFilter !== '') {
      const wouldRecommend = recommendFilter === 'true';
      filtered = filtered.filter(feedback => feedback.wouldRecommend === wouldRecommend);
    }

    setFilteredFeedbacks(filtered);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex -space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Participant Name', 'Email', 'Role', 'Overall Rating', 'Venue Rating',
      'Content Rating', 'Organization Rating', 'Networking Rating', 'Would Recommend',
      'Comments', 'Suggestions', 'Future Topics', 'Submission Date'
    ];

    const csvData = filteredFeedbacks.map(feedback => [
      feedback.userId?.name,
      feedback.userId?.email,
      feedback.userId?.role,
      feedback.overallRating,
      feedback.venueRating,
      feedback.contentRating,
      feedback.organizationRating,
      feedback.networkingRating,
      feedback.wouldRecommend ? 'Yes' : 'No',
      feedback.comments || '',
      feedback.suggestions || '',
      feedback.futureTopics || '',
      new Date(feedback.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading feedback..." />
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
              <h1 className="text-base sm:text-lg text-slate-900">Feedback</h1>
              <p className="text-xs text-slate-600">{filteredFeedbacks.length} of {feedbacks.length} responses</p>
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
          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total</p>
                  <p className="text-sm text-slate-900">{analytics.totalFeedback}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Avg Rating</p>
                  <p className="text-sm text-slate-900">{analytics.avgOverallRating?.toFixed(1)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Recommend</p>
                  <p className="text-sm text-emerald-600">{analytics.recommendationRate?.toFixed(1)}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Content</p>
                  <p className="text-sm text-indigo-600">{analytics.avgContentRating?.toFixed(1)}</p>
                </div>
              </div>
            </div>
          )}

          {}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Rating Breakdown
                </h3>
                <div className="space-y-2 text-xs lg:text-sm">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Overall</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(analytics.avgOverallRating))}
                      <span>({analytics.avgOverallRating?.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Venue</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(analytics.avgVenueRating))}
                      <span>({analytics.avgVenueRating?.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Content</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(analytics.avgContentRating))}
                      <span>({analytics.avgContentRating?.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Organization</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(analytics.avgOrganizationRating))}
                      <span>({analytics.avgOrganizationRating?.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Networking</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(analytics.avgNetworkingRating))}
                      <span>({analytics.avgNetworkingRating?.toFixed(1)})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:p-6">
                <h3 className="text-sm lg:text-base font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recommendation
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs lg:text-sm">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ThumbsUp className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-emerald-800">Recommend</span>
                    </div>
                    <p className="text-lg lg:text-xl font-bold text-emerald-600">{analytics.totalRecommend}</p>
                    <p className="text-[11px] text-emerald-700">{analytics.recommendationRate?.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">Not Recommend</span>
                    </div>
                    <p className="text-lg lg:text-xl font-bold text-red-600">
                      {analytics.totalFeedback - (analytics.totalRecommend || 0)}
                    </p>
                    <p className="text-[11px] text-red-700">
                      {(100 - (analytics.recommendationRate || 0))?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search name, email, comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                />
              </div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All Ratings</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
                <option value="3">★★★</option>
                <option value="2">★★</option>
                <option value="1">★</option>
              </select>
              <select
                value={recommendFilter}
                onChange={(e) => setRecommendFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
              >
                <option value="">All</option>
                <option value="true">Recommend</option>
                <option value="false">Not Recommend</option>
              </select>
            </div>
          </div>

          {}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {}
              <div className="sm:hidden space-y-2 p-3">
                {filteredFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{feedback.userId?.name}</p>
                        <p className="text-xs text-slate-600 truncate">{feedback.userId?.email}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex items-center gap-1">
                        {renderStars(feedback.overallRating)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500">
                        {feedback.wouldRecommend ? '✅ Yes' : '❌ No'}
                      </span>
                      <span className="text-slate-500">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2 mb-2">{feedback.comments}</p>
                    <button
                      onClick={() => viewDetails(feedback)}
                      className="w-full flex items-center justify-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-1.5 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Participant</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24">Rating</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">Recommend</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-64">Comments</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-28">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-28">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFeedbacks.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <div className="font-medium text-slate-900">{feedback.userId?.name}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{feedback.userId?.email}</div>
                            <div className="text-[10px] text-slate-500">{feedback.userId?.role}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {renderStars(feedback.overallRating)}
                            <span className="text-xs text-slate-600 ml-1">{feedback.overallRating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                            feedback.wouldRecommend 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {feedback.wouldRecommend ? (
                              <>
                                <ThumbsUp className="w-3 h-3" />
                                Yes
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="w-3 h-3" />
                                No
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-900 line-clamp-2 max-w-[350px]">{feedback.comments || 'No comments'}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => viewDetails(feedback)}
                            className="flex items-center gap-1 text-xs text-[#005aa9] hover:text-[#004684] py-1.5 px-2.5 rounded-lg border border-[#005aa9]/20 hover:bg-[#005aa9]/5 transition-colors"
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

          {filteredFeedbacks.length === 0 && (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No feedback found</h3>
              <p className="text-xs text-slate-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-sm lg:text-base font-medium text-slate-900">Feedback Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 text-xs lg:text-sm">
                {}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Participant
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-600 block text-[11px]">Name</span>
                      <span className="font-medium">{selectedFeedback.userId?.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Email</span>
                      <span className="font-medium truncate">{selectedFeedback.userId?.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Role</span>
                      <span className="font-medium">{selectedFeedback.userId?.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Date</span>
                      <span>{new Date(selectedFeedback.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Ratings
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600">Overall</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFeedback.overallRating)}
                        <span>({selectedFeedback.overallRating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600">Venue</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFeedback.venueRating)}
                        <span>({selectedFeedback.venueRating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600">Content</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFeedback.contentRating)}
                        <span>({selectedFeedback.contentRating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600">Organization</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFeedback.organizationRating)}
                        <span>({selectedFeedback.organizationRating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-600">Networking</span>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedFeedback.networkingRating)}
                        <span>({selectedFeedback.networkingRating})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedFeedback.wouldRecommend ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium text-slate-900">
                      Would {selectedFeedback.wouldRecommend ? '' : 'Not '}Recommend
                    </span>
                  </div>
                </div>

                {}
                {selectedFeedback.comments && (
                  <div className="p-4 bg-gradient-to-r from-sky-50 to-slate-50 rounded-xl border border-sky-200">
                    <h4 className="font-medium text-slate-900 mb-2 text-[13px]">Comments</h4>
                    <p className="text-slate-700 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{selectedFeedback.comments}</p>
                  </div>
                )}

                {selectedFeedback.suggestions && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl border border-emerald-200">
                    <h4 className="font-medium text-slate-900 mb-2 text-[13px]">Suggestions</h4>
                    <p className="text-slate-700 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{selectedFeedback.suggestions}</p>
                  </div>
                )}

                {selectedFeedback.futureTopics && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-slate-50 rounded-xl border border-purple-200">
                    <h4 className="font-medium text-slate-900 mb-2 text-[13px]">Future Topics</h4>
                    <p className="text-slate-700 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{selectedFeedback.futureTopics}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackViewerPage;
