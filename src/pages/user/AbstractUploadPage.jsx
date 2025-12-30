import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  X,
  Eye,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { abstractAPI } from '../../utils/api';
import { ABSTRACT_CATEGORIES } from '../../utils/constants';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AbstractUploadPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    category: ''
  });
  const [abstractFile, setAbstractFile] = useState(null);
  const [existingAbstract, setExistingAbstract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  
  const { user } = useAuth();
  const { setAbstract } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingAbstract();
  }, []);

  const checkExistingAbstract = async () => {
    try {
      const response = await abstractAPI.getMyAbstract();
      setExistingAbstract(response.data);
      setAbstract(response.data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, file: 'Please upload a PDF file only' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
      return;
    }

    setAbstractFile(file);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().split(' ').length > 20) {
      newErrors.title = 'Title should not exceed 20 words';
    }

    if (!formData.authors.trim()) {
      newErrors.authors = 'Authors are required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!abstractFile && !existingAbstract) {
      newErrors.file = 'Abstract PDF is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('authors', formData.authors.trim());
      submitData.append('category', formData.category);
      
      if (abstractFile) {
        submitData.append('abstractFile', abstractFile);
      }

      const response = await abstractAPI.submit(submitData);
      setAbstract(response.data.abstract);
      
      navigate('/dashboard', { 
        state: { 
          message: 'Abstract submitted successfully! You will be notified about the review status.' 
        }
      });
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to submit abstract. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeFile = () => {
    setAbstractFile(null);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-[#ff8a1f]/20 text-[#ff8a1f] border-[#ff8a1f]/30',
      APPROVED: 'bg-[#7cb342]/20 text-[#7cb342] border-[#7cb342]/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-400/30'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-500 border-slate-400/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading abstract submission..." />
      </div>
    );
  }

  if (existingAbstract) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70 pt-20 sm:pt-24" />
        <Header />
        
        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-3 flex items-center mb-4">
            <button
              onClick={() => navigate('/abstract/rules')}
              className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-slate-100/50 transition-colors -m-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-slate-900">Abstract Submitted</h1>
              <p className="text-xs text-slate-600">Status: {existingAbstract.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <section className="lg:col-span-2 space-y-4">
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7cb342]" />
                    Abstract #{existingAbstract.submissionNumber}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusColor(existingAbstract.status)}`}>
                    {existingAbstract.status}
                  </span>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#7cb342]/5 rounded-lg">
                    <FileText className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Title</p>
                      <p className="font-semibold text-slate-900">{existingAbstract.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#ff8a1f]/5 rounded-lg">
                    <Users className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Authors</p>
                      <p className="font-semibold text-slate-900 text-[11px]">{existingAbstract.authors}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#9c3253]/5 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Category</p>
                      <p className="font-semibold text-slate-900">
                        {ABSTRACT_CATEGORIES.find(cat => cat.value === existingAbstract.category)?.label}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#7cb342]/5 rounded-lg">
                    <Clock className="w-4 h-4 text-[#7cb342] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Submitted</p>
                      <p className="font-semibold text-slate-900 text-[11px]">
                        {new Date(existingAbstract.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {existingAbstract.reviewComments && (
                <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ff8a1f]" />
                    Review Comments
                  </h3>
                  <div className="p-3 border border-[#ff8a1f]/20 rounded-lg bg-[#ff8a1f]/5 text-xs text-[#ff8a1f]">
                    {existingAbstract.reviewComments}
                  </div>
                </div>
              )}
            </section>

            <section className="lg:col-span-1 lg:sticky lg:top-4 space-y-4">
              <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 lg:p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#7cb342]" />
                  Submission Status
                </h3>
                
                {existingAbstract.status === 'PENDING' && (
                  <div className="text-center p-6 border-2 border-[#ff8a1f]/30 rounded-xl bg-[#ff8a1f]/10">
                    <Clock className="w-12 h-12 text-[#ff8a1f] mx-auto mb-3" />
                    <p className="text-lg font-semibold text-[#ff8a1f] mb-1">Under Review</p>
                    <p className="text-xs text-[#ff8a1f]">Results by October 28, 2025</p>
                  </div>
                )}
                
                {existingAbstract.status === 'APPROVED' && (
                  <div className="text-center p-6 border-2 border-[#7cb342]/30 rounded-xl bg-[#7cb342]/10">
                    <CheckCircle className="w-12 h-12 text-[#7cb342] mx-auto mb-3" />
                    <p className="text-lg font-semibold text-[#7cb342] mb-1">Accepted ✓</p>
                    <p className="text-xs text-[#7cb342]">Prepare presentation slides</p>
                  </div>
                )}
                
                {existingAbstract.status === 'REJECTED' && (
                  <div className="text-center p-6 border-2 border-red-400/30 rounded-xl bg-red-500/10">
                    <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-red-600 mb-1">Not Accepted</p>
                    <p className="text-xs text-red-600">See review comments above</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-3 border border-slate-200/50 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors rounded-xl backdrop-blur-sm flex items-center justify-center"
              >
                Back to Dashboard
              </button>
            </section>
          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      <Header />
      
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 pb-20">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-3 flex items-center mb-4">
          <button
            onClick={() => navigate('/abstract/rules')}
            className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-slate-100/50 transition-colors -m-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-slate-900">Submit Abstract</h1>
            <p className="text-xs text-slate-600">Upload your research for AOA Shivamogga 2026</p>
          </div>
        </div>

        {errors.general && (
          <div className="p-3 border border-red-400/50 bg-red-500/10 text-red-400 text-xs rounded-xl backdrop-blur-sm">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9c3253]" />
                Primary Author
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#9c3253]/5 rounded-lg">
                  <Users className="w-4 h-4 text-[#9c3253] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Name</p>
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200/50 bg-[#ff8a1f]/5 rounded-lg">
                  <FileText className="w-4 h-4 text-[#ff8a1f] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900 text-[11px] truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9c3253]" />
                Abstract Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-2">
                    Abstract Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title (max 20 words)"
                    className={`w-full px-3 py-2.5 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50 backdrop-blur-sm ${errors.title ? 'border-red-400/50' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title}</p>}
                  <p className="text-[10px] text-slate-500 mt-1">
                    {formData.title.trim().split(' ').filter(Boolean).length}/20 words
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-2">
                    All Authors *
                  </label>
                  <textarea
                    name="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Dr. John Smith¹, Dr. Jane Doe²&#10;¹Orthopedics, ABC Hospital | ²Surgery, XYZ College"
                    className={`w-full px-3 py-2.5 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 focus:border-[#9c3253]/50 bg-white/50 resize-vertical ${errors.authors ? 'border-red-400/50' : ''}`}
                  />
                  {errors.authors && <p className="text-red-500 text-[10px] mt-1">{errors.authors}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 border border-slate-200/50 rounded text-xs focus:ring-1 focus:ring-[#9c3253]/50 bg-white/50 ${errors.category ? 'border-red-400/50' : ''}`}
                  >
                    <option value="">Select category</option>
                    {ABSTRACT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-[10px] mt-1">{errors.category}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#ff8a1f]" />
                Abstract PDF *
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-6 lg:p-8 text-center transition-all text-xs ${
                  dragActive 
                    ? 'border-[#ff8a1f] bg-[#ff8a1f]/10' 
                    : errors.file 
                    ? 'border-red-400/50 bg-red-500/5' 
                    : 'border-slate-200/50 hover:border-[#ff8a1f]/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {abstractFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <FileText className="w-10 h-10 text-[#ff8a1f]" />
                    <div className="flex items-center bg-[#ff8a1f]/10 text-[#ff8a1f] px-3 py-1.5 rounded border border-[#ff8a1f]/20 text-xs">
                      <span className="truncate max-w-[200px]">{abstractFile.name}</span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="ml-2 text-[#ff8a1f] hover:text-[#e67e22]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <div>
                      <label htmlFor="abstract-file" className="inline-flex items-center px-4 py-2.5 border border-[#ff8a1f]/30 bg-[#ff8a1f]/10 text-[#ff8a1f] rounded-xl cursor-pointer hover:bg-[#ff8a1f]/20 transition-all font-medium text-xs">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload PDF
                        <input
                          id="abstract-file"
                          name="abstract-file"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-slate-500 mt-1 text-[10px]">or drag & drop</p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Max 5MB • PDF only</p>
                  </>
                )}
              </div>
              {errors.file && <p className="text-red-500 text-[10px] mt-2 text-center">{errors.file}</p>}
            </div>
          </section>

          <section className="lg:col-span-1 lg:sticky lg:top-4 space-y-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7cb342]" />
                Checklist
              </h3>
              <ul className="space-y-2 text-[10px] text-slate-600">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                  Title ≤ 20 words
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                  All authors listed
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                  Category selected
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-[#7cb342] mr-2 flex-shrink-0" />
                  PDF file below 5MB
                </li>
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-[#9c3253] bg-[#9c3253] text-white text-xs font-semibold hover:bg-[#8a2b47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Abstract
                  </>
                )}
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#ff8a1f]" />
                Important
              </h3>
              <div className="space-y-1 text-[10px] text-[#ff8a1f]">
                <div>• One submission per participant</div>
                <div>• Cannot modify after submission</div>
                <div>• Results by Oct 28, 2025</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AbstractUploadPage;
