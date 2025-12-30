import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  CheckCircle, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  Send,
  User,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { feedbackAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    overallRating: 0,
    venueRating: 0,
    contentRating: 0,
    organizationRating: 0,
    networkingRating: 0,
    comments: '',
    suggestions: '',
    wouldRecommend: null,
    futureTopics: ''
  });
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { user } = useAuth();
  const { setFeedback, updateStepperProgress } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingFeedback();
  }, []);

  const checkExistingFeedback = async () => {
    try {
      const response = await feedbackAPI.getMyFeedback();
      setExistingFeedback(response.data);
      setFeedback(response.data);
      updateStepperProgress('feedback', true);
    } catch (error) {
      // No existing feedback found
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (field, rating) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRecommendChange = (value) => {
    setFormData(prev => ({ ...prev, wouldRecommend: value }));
    if (errors.wouldRecommend) {
      setErrors(prev => ({ ...prev, wouldRecommend: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.overallRating === 0) newErrors.overallRating = 'Overall rating is required';
    if (formData.venueRating === 0) newErrors.venueRating = 'Venue rating is required';
    if (formData.contentRating === 0) newErrors.contentRating = 'Content rating is required';
    if (formData.organizationRating === 0) newErrors.organizationRating = 'Organization rating is required';
    if (formData.networkingRating === 0) newErrors.networkingRating = 'Networking rating is required';
    if (formData.wouldRecommend === null) newErrors.wouldRecommend = 'Recommendation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await feedbackAPI.submit(formData);
      setFeedback(response.data.feedback);
      updateStepperProgress('feedback', true);
      
      navigate('/dashboard', { 
        state: { 
          message: 'Thank you for your feedback! Your input helps us improve future conferences.' 
        }
      });
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to submit feedback. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (field, value, label, error) => (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">{label} *</label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(field, star)}
            className={`p-1 transition-colors ${
              star <= value ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
            }`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-[12px] text-slate-600">
          {value > 0 ? `${value}/5` : 'Not rated'}
        </span>
      </div>
      {error && <p className="text-red-600 text-[12px]">{error}</p>}
    </div>
  );

  const now = new Date();
  const feedbackOpenDate = new Date('2025-12-01');
  const isFeedbackOpen = now >= feedbackOpenDate;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="sm" text="Loading feedback..." />
        </div>
        <MobileNav />
      </div>
    );
  }

  if (existingFeedback) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20">
          <div className="flex items-center mb-5">
            <div>
              <h1 className="text-lg font-medium text-slate-900">Feedback Submitted</h1>
              <p className="text-[13px] text-slate-600">Thank you for your input</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="lg:col-span-2 space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-3 bg-emerald-50/50">
                <div className="flex items-center justify-center text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <div>
                    <h2 className="text-lg font-medium text-slate-900 mb-1">Thank You!</h2>
                    <p className="text-[13px] text-slate-600">Your feedback recorded successfully</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Overall Experience', rating: existingFeedback.overallRating },
                  { label: 'Venue & Facilities', rating: existingFeedback.venueRating },
                  { label: 'Content Quality', rating: existingFeedback.contentRating },
                  { label: 'Organization', rating: existingFeedback.organizationRating },
                  { label: 'Networking', rating: existingFeedback.networkingRating }
                ].map(({ label, rating }) => (
                  <div key={label} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="text-[12px] font-semibold text-slate-900">{rating}/5</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {(existingFeedback.comments || existingFeedback.suggestions || existingFeedback.futureTopics) && (
                <div className="space-y-3">
                  {existingFeedback.comments && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Comments</p>
                      <p className="text-sm text-slate-900 text-[13px]">{existingFeedback.comments}</p>
                    </div>
                  )}
                  {existingFeedback.suggestions && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Suggestions</p>
                      <p className="text-sm text-slate-900 text-[13px]">{existingFeedback.suggestions}</p>
                    </div>
                  )}
                  {existingFeedback.futureTopics && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Future Topics</p>
                      <p className="text-sm text-slate-900 text-[13px]">{existingFeedback.futureTopics}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="lg:col-span-1 space-y-4">
              <div className="border border-slate-200 rounded-xl px-4 py-3 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-slate-700">Would Recommend</span>
                  <div className={`px-2.5 py-1.5 rounded-full text-[12px] font-medium flex items-center ${
                    existingFeedback.wouldRecommend 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {existingFeedback.wouldRecommend ? <ThumbsUp className="w-3.5 h-3.5 mr-1" /> : <ThumbsDown className="w-3.5 h-3.5 mr-1" />}
                    <span>{existingFeedback.wouldRecommend ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 text-center border-t border-slate-200 pt-3">
                  <p className="mb-1">Submitted</p>
                  <p className="text-xs font-semibold text-slate-900">
                    {new Date(existingFeedback.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full mt-4 px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </section>
          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  if (!isFeedbackOpen) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="max-w-md mx-auto px-4 py-12 text-center pb-20">
          <div className="border border-slate-200 rounded-xl p-8">
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h1 className="text-lg font-medium text-slate-900 mb-2">Feedback Not Available</h1>
            <p className="text-[13px] text-slate-600 mb-6">Opens after conference on Dec 1, 2025</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20">
        <div className="flex items-center mb-5">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Conference Feedback</h1>
            <p className="text-[13px] text-slate-600">Share your experience</p>
          </div>
        </div>

        {errors.general && (
          <div className="p-3 border border-red-200 text-red-700 text-[12px] rounded-lg bg-red-50">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="lg:col-span-2 space-y-4">
            {}
            <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50">
              <h2 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-1.5 text-slate-500" />
                Participant Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-slate-900 text-sm truncate">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Role</p>
                  <p className="font-semibold text-slate-900 text-sm capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {}
            <div className="border border-slate-200 rounded-xl px-4 py-3">
              <h2 className="text-sm font-medium text-slate-900 mb-4 flex items-center">
                <Star className="w-4 h-4 mr-1.5 text-amber-500" />
                Rate Your Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderStarRating('overallRating', formData.overallRating, 'Overall Experience', errors.overallRating)}
                {renderStarRating('venueRating', formData.venueRating, 'Venue & Facilities', errors.venueRating)}
                {renderStarRating('contentRating', formData.contentRating, 'Content Quality', errors.contentRating)}
                {renderStarRating('organizationRating', formData.organizationRating, 'Organization', errors.organizationRating)}
                {renderStarRating('networkingRating', formData.networkingRating, 'Networking', errors.networkingRating)}
              </div>
            </div>

            {}
            <div className="border border-slate-200 rounded-xl px-4 py-3">
              <h2 className="text-sm font-medium text-slate-900 mb-3">Recommendation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRecommendChange(true)}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors font-medium text-[13px] ${
                    formData.wouldRecommend === true
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleRecommendChange(false)}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors font-medium text-[13px] ${
                    formData.wouldRecommend === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  No
                </button>
              </div>
              {errors.wouldRecommend && <p className="text-red-600 text-[12px] mt-2">{errors.wouldRecommend}</p>}
            </div>

            {}
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-[13px]"
                  placeholder="Share your thoughts..."
                  maxLength={1000}
                />
                <p className="text-[11px] text-slate-500 mt-1">{formData.comments.length}/1000</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">Suggestions</label>
                <textarea
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-[13px]"
                  placeholder="How can we improve..."
                  maxLength={1000}
                />
                <p className="text-[11px] text-slate-500 mt-1">{formData.suggestions.length}/1000</p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">Future Topics</label>
                <textarea
                  name="futureTopics"
                  value={formData.futureTopics}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-[13px]"
                  placeholder="Topics for next conference..."
                  maxLength={500}
                />
                <p className="text-[11px] text-slate-500 mt-1">{formData.futureTopics.length}/500</p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-1 space-y-4">
            <div className="border border-slate-200 rounded-xl px-4 py-3 sticky top-4">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-4 h-4 text-slate-500 mr-1.5" />
                <h3 className="text-sm font-medium text-slate-900">Thank You</h3>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
                Your feedback helps us improve
              </p>

              <button
                type="submit"
                form="feedback-form"
                disabled={submitting}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-gradient-to-r from-orange-500 to-sky-500 text-white text-sm font-medium hover:from-orange-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-200 mt-3">
                <p>Your input matters</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <form id="feedback-form" onSubmit={handleSubmit} className="hidden" />
      <MobileNav />
    </div>
  );
};

export default FeedbackPage;
