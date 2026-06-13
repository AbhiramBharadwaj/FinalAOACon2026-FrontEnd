import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { API_BASE_URL, videoAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VideoUploadPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    presenterName: '',
    presenterDetails: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { setVideoSubmission } = useApp();

  useEffect(() => {
    checkExistingSubmission();
  }, []);

  useEffect(() => {
    if (existingSubmission?.status === 'REJECTED') {
      setFormData({
        title: existingSubmission.title || '',
        presenterName: existingSubmission.presenterName || '',
        presenterDetails: existingSubmission.presenterDetails || '',
        description: existingSubmission.description || '',
      });
    }
  }, [existingSubmission]);

  const checkExistingSubmission = async () => {
    try {
      const response = await videoAPI.getMyVideo();
      setExistingSubmission(response.data);
      setVideoSubmission(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedMimeTypes = new Set([
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-m4v',
      'video/mpeg',
      'video/x-msvideo',
    ]);
    const allowedExtensions = new Set(['mp4', 'mov', 'webm', 'm4v', 'mpeg', 'mpg', 'avi']);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedType = allowedMimeTypes.has(file.type) || allowedExtensions.has(fileExtension);

    if (!isAllowedType) {
      setErrors((prev) => ({ ...prev, file: 'Please upload a valid video file (.mp4, .mov, .webm, .m4v, .mpeg, or .avi)' }));
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'Video file size must be less than 500MB' }));
      return;
    }

    setVideoFile(file);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.presenterName.trim()) newErrors.presenterName = 'Presenter name is required';
    if (!formData.presenterDetails.trim()) newErrors.presenterDetails = 'Presenter details are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!videoFile) newErrors.file = 'Video file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (existingSubmission && existingSubmission.status !== 'REJECTED') {
      setErrors({
        general: 'You have already submitted a video. You can resubmit only after rejection.',
      });
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessMessage('');
    setUploadProgress(0);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('presenterName', formData.presenterName.trim());
      submitData.append('presenterDetails', formData.presenterDetails.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('videoFile', videoFile);

      const response = await videoAPI.submit(submitData, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentage = Math.min(
            100,
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          setUploadProgress(percentage);
        },
      });
      setExistingSubmission(response.data.submission);
      setVideoSubmission(response.data.submission);
      setVideoFile(null);
      setErrors({});
      setSuccessMessage('Video submitted successfully. Review updates will appear here once the admin completes evaluation.');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to submit video. Please try again.',
      });
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setVideoFile(null);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleBackNavigation = () => {
    navigate(isAuthenticated ? '/dashboard' : '/video/rules');
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-[#ff8a1f]/20 text-[#ff8a1f] border-[#ff8a1f]/30',
      APPROVED: 'bg-[#7cb342]/20 text-[#7cb342] border-[#7cb342]/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-400/30',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-500 border-slate-400/30';
  };

  const submissionHistory = [...(existingSubmission?.submissionHistory || [])].sort(
    (a, b) => (b.attemptNumber || 0) - (a.attemptNumber || 0)
  );

  if (loading) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading award video submission..." />
      </div>
    );
  }

  const isRejectedSubmission = existingSubmission?.status === 'REJECTED';
  const videoFileUrl = existingSubmission?.filePath
    ? (/^https?:\/\//i.test(existingSubmission.filePath)
      ? existingSubmission.filePath
      : `${API_BASE_URL}/${existingSubmission.filePath}`)
    : null;

  if (existingSubmission && !isRejectedSubmission) {
    return (
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70 pt-20 sm:pt-24" />
        <Header />

        <div className="relative z-10 mx-auto max-w-6xl space-y-4 px-3 py-4 pb-20 sm:px-4 sm:py-6 lg:px-6">
          {successMessage && (
            <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="mb-4 flex items-center rounded-xl border border-white/40 bg-white/90 px-4 py-3 backdrop-blur-xl">
            <button
              onClick={handleBackNavigation}
              className="-m-2 rounded-lg p-2 text-slate-200 transition-colors hover:bg-slate-100/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-slate-900">Award Video Submitted</h1>
              <p className="text-xs text-slate-600">Status: {existingSubmission.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <section className="space-y-4 lg:col-span-2">
              <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl lg:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Video className="h-4 w-4 text-[#7cb342]" />
                    Submission #{existingSubmission.submissionNumber}
                  </h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusColor(existingSubmission.status)}`}>
                    {existingSubmission.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    ['Title', existingSubmission.title, '#7cb342'],
                    ['Presenter', existingSubmission.presenterName, '#ff8a1f'],
                    ['Presenter Details', existingSubmission.presenterDetails, '#9c3253'],
                    ['Description', existingSubmission.description, '#2563eb'],
                  ].map(([label, value, color]) => (
                    <div key={label} className="flex gap-3 rounded-lg border border-slate-200/50 bg-slate-50/60 p-3">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="font-semibold text-slate-900" style={{ color }}>{value}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 rounded-lg border border-slate-200/50 bg-slate-50/60 p-3">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Submitted</p>
                      <p className="font-semibold text-slate-900 text-[11px]">
                        {new Date(existingSubmission.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {existingSubmission.reviewComments && (
                <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl lg:p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <AlertCircle className="h-4 w-4 text-[#ff8a1f]" />
                    Review Comments
                  </h3>
                  <div className="rounded-lg border border-[#ff8a1f]/20 bg-[#ff8a1f]/5 p-3 text-xs text-[#ff8a1f]">
                    {existingSubmission.reviewComments}
                  </div>
                </div>
              )}

              {submissionHistory.length > 0 && (
                <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl lg:p-6">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Submission History</h3>
                  <div className="space-y-3">
                    {submissionHistory.map((attempt) => (
                      <div key={`video-attempt-${attempt.attemptNumber}-${attempt.submittedAt}`} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">Attempt #{attempt.attemptNumber || '-'}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(attempt.finalStatus || 'PENDING')}`}>
                            {attempt.finalStatus || 'PENDING'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{attempt.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString('en-IN') : '-'}
                        </p>
                        {attempt.reviewComments && (
                          <p className="mt-1 text-[11px] text-amber-700">Review: {attempt.reviewComments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-4 lg:sticky lg:top-4 lg:col-span-1">
              <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl lg:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <CheckCircle className="h-4 w-4 text-[#7cb342]" />
                  Submission Status
                </h3>

                {existingSubmission.status === 'PENDING' && (
                  <div className="rounded-xl border-2 border-[#ff8a1f]/30 bg-[#ff8a1f]/10 p-6 text-center">
                    <Clock className="mx-auto mb-3 h-12 w-12 text-[#ff8a1f]" />
                    <p className="mb-1 text-lg font-semibold text-[#ff8a1f]">Under Review</p>
                    <p className="text-xs text-[#ff8a1f]">Review in progress</p>
                  </div>
                )}

                {existingSubmission.status === 'APPROVED' && (
                  <div className="rounded-xl border-2 border-[#7cb342]/30 bg-[#7cb342]/10 p-6 text-center">
                    <CheckCircle className="mx-auto mb-3 h-12 w-12 text-[#7cb342]" />
                    <p className="mb-1 text-lg font-semibold text-[#7cb342]">Approved</p>
                    <p className="text-xs text-[#7cb342]">Your video is part of the accepted competition entries.</p>
                  </div>
                )}
              </div>

              {videoFileUrl && (
                <a
                  href={videoFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center rounded-xl border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-xs font-medium text-white transition-colors hover:bg-[#8a2b47]"
                >
                  View Uploaded Video
                </a>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="flex w-full items-center justify-center rounded-xl border border-slate-200/50 bg-white/90 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')",
      }}
      >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      <Header />

      <div className="relative z-10 mx-auto max-w-6xl space-y-4 px-3 py-4 pb-20 sm:px-4 sm:py-6 lg:px-6">
        <div className="mb-4 flex items-center rounded-xl border border-white/40 bg-white/90 px-4 py-3 backdrop-blur-xl">
          <button
            onClick={handleBackNavigation}
            className="-m-2 rounded-lg p-2 text-slate-200 transition-colors hover:bg-slate-100/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="ml-3">
            <h1 className="text-2xl font-semibold text-slate-900">Submit Award Video</h1>
            <p className="text-base text-slate-600">Upload your competition video for AOACON 2026, Shivamogga</p>
          </div>
        </div>

        {errors.general && (
          <div className="rounded-xl border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-500 backdrop-blur-sm">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-300/60 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {isRejectedSubmission && (
          <div className="rounded-xl border border-red-300/60 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-semibold">Your previous video was rejected. Please submit a revised version.</p>
            {existingSubmission?.reviewComments && (
              <p className="mt-2 text-sm">Reason for rejection: {existingSubmission.reviewComments}</p>
            )}
          </div>
        )}

        {isRejectedSubmission && submissionHistory.length > 0 && (
          <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl lg:p-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Submission History</h3>
            <div className="space-y-3">
              {submissionHistory.map((attempt) => (
                <div key={`video-form-attempt-${attempt.attemptNumber}-${attempt.submittedAt}`} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">Attempt #{attempt.attemptNumber || '-'}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(attempt.finalStatus || 'PENDING')}`}>
                      {attempt.finalStatus || 'PENDING'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{attempt.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString('en-IN') : '-'}
                  </p>
                  {attempt.reviewComments && (
                    <p className="mt-1 text-[11px] text-amber-700">Review: {attempt.reviewComments}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <section className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Users className="h-4 w-4 text-[#9c3253]" />
                Presenter
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200/50 bg-[#9c3253]/5 p-3">
                  <Users className="h-4 w-4 flex-shrink-0 text-[#9c3253]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Account Name</p>
                    <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200/50 bg-[#ff8a1f]/5 p-3">
                  <FileText className="h-4 w-4 flex-shrink-0 text-[#ff8a1f]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                    <p className="truncate text-base font-semibold text-slate-900">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Video className="h-4 w-4 text-[#9c3253]" />
                Submission Details
              </h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Video Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter the title of the competition video"
                  className={`w-full rounded-lg border border-slate-200/50 bg-white/50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253]/50 focus:ring-1 focus:ring-[#9c3253]/50 ${errors.title ? 'border-red-400/50' : ''}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Presenter Name *</label>
                <input
                  type="text"
                  name="presenterName"
                  value={formData.presenterName}
                  onChange={handleInputChange}
                  placeholder="Name of the presenter"
                  className={`w-full rounded-lg border border-slate-200/50 bg-white/50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253]/50 focus:ring-1 focus:ring-[#9c3253]/50 ${errors.presenterName ? 'border-red-400/50' : ''}`}
                />
                {errors.presenterName && <p className="mt-1 text-sm text-red-500">{errors.presenterName}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Presenter Details *</label>
                <textarea
                  name="presenterDetails"
                  value={formData.presenterDetails}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Institution, designation, and any relevant presenter details"
                  className={`w-full resize-vertical rounded-lg border border-slate-200/50 bg-white/50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253]/50 focus:ring-1 focus:ring-[#9c3253]/50 ${errors.presenterDetails ? 'border-red-400/50' : ''}`}
                />
                {errors.presenterDetails && <p className="mt-1 text-sm text-red-500">{errors.presenterDetails}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Brief Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Briefly describe the video content, procedure, and learning focus"
                  className={`w-full resize-vertical rounded-lg border border-slate-200/50 bg-white/50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#9c3253]/50 focus:ring-1 focus:ring-[#9c3253]/50 ${errors.description ? 'border-red-400/50' : ''}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
            </div>

            <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Upload className="h-4 w-4 text-[#ff8a1f]" />
                Video File *
              </h2>

              <div
                className={`rounded-xl border-2 border-dashed p-6 text-center transition-all lg:p-8 ${
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
                {videoFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Video className="h-10 w-10 text-[#ff8a1f]" />
                    <div className="flex items-center rounded border border-[#ff8a1f]/20 bg-[#ff8a1f]/10 px-3 py-2 text-sm text-[#ff8a1f]">
                      <span className="max-w-[220px] truncate">{videoFile.name}</span>
                      <button type="button" onClick={removeFile} className="ml-2 text-[#ff8a1f] hover:text-[#e67e22]">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                    <div>
                      <label htmlFor="video-file" className="inline-flex cursor-pointer items-center rounded-xl border border-[#ff8a1f]/30 bg-[#ff8a1f]/10 px-4 py-2.5 text-sm font-medium text-[#ff8a1f] transition-all hover:bg-[#ff8a1f]/20">
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        Upload Video
                        <input
                          id="video-file"
                          name="video-file"
                          type="file"
                          accept=".mp4,.mov,.webm,.m4v,.mpeg,.mpg,.avi,video/mp4,video/quicktime,video/webm"
                          onChange={(event) => handleFileChange(event.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="mt-2 text-sm text-slate-500">or drag and drop</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Max 500MB • MP4, MOV, WEBM, M4V, MPEG, or AVI</p>
                  </>
                )}
              </div>
              {errors.file && <p className="mt-2 text-center text-sm text-red-500">{errors.file}</p>}
            </div>
          </section>

          <section className="space-y-4 lg:sticky lg:top-4 lg:col-span-1">
            <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#9c3253] bg-[#9c3253] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#8a2b47] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {isRejectedSubmission ? 'Resubmit Award Video' : 'Submit Award Video'}
                  </>
                )}
              </button>
              {submitting ? (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-600">
                    <span>Uploading video</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-[#9c3253] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <AlertCircle className="h-4 w-4 text-[#ff8a1f]" />
                Important
              </h3>
              <div className="space-y-2 text-sm text-[#ff8a1f]">
                <div>• One active submission per participant</div>
                <div>• Conference registration is mandatory</div>
                <div>• Maximum upload size is 500 MB</div>
                <div>• Technical quality guidance is advisory in v1</div>
                <div>• Accepted entries may be showcased during the conference</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default VideoUploadPage;
