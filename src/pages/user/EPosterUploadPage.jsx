import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { abstractAPI, API_BASE_URL } from '../../utils/api';
import { useApp } from '../../contexts/AppContext';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EPosterUploadPage = () => {
  const [existingAbstract, setExistingAbstract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posterFile, setPosterFile] = useState(null);
  const [posterSubmitting, setPosterSubmitting] = useState(false);
  const [posterError, setPosterError] = useState('');
  const [posterSuccessMessage, setPosterSuccessMessage] = useState('');

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
    } catch {
      setExistingAbstract(null);
    } finally {
      setLoading(false);
    }
  };

  const getAssetUrl = (filePath) => {
    if (!filePath) return null;
    return /^https?:\/\//i.test(filePath) ? filePath : `${API_BASE_URL}/${filePath}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-[#ff8a1f]/20 text-[#ff8a1f] border-[#ff8a1f]/30',
      APPROVED: 'bg-[#7cb342]/20 text-[#7cb342] border-[#7cb342]/30',
      REJECTED: 'bg-red-500/20 text-red-500 border-red-400/30',
    };
    return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const handlePosterFileChange = (file) => {
    if (!file) return;

    const allowedMimeTypes = new Set([
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ]);
    const allowedExtensions = new Set(['pdf', 'docx', 'ppt', 'pptx']);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedType = allowedMimeTypes.has(file.type) || allowedExtensions.has(fileExtension);

    if (!isAllowedType) {
      setPosterError('Please upload the final e-poster as PDF, DOCX, PPT, or PPTX.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setPosterError('Final e-poster file size must be less than 25MB.');
      return;
    }

    setPosterFile(file);
    setPosterError('');
    setPosterSuccessMessage('');
  };

  const removePosterFile = () => {
    setPosterFile(null);
    setPosterError('');
  };

  const handlePosterSubmit = async () => {
    if (!posterFile) {
      setPosterError('Final e-poster file is required.');
      return;
    }

    setPosterSubmitting(true);
    setPosterError('');
    setPosterSuccessMessage('');

    try {
      const submitData = new FormData();
      submitData.append('finalPoster', posterFile);
      const response = await abstractAPI.uploadFinalPoster(submitData);
      setExistingAbstract(response.data.abstract);
      setAbstract(response.data.abstract);
      setPosterFile(null);
      setPosterSuccessMessage('Final e-poster uploaded successfully.');
    } catch (error) {
      setPosterError(error.response?.data?.message || 'Failed to upload final e-poster. Please try again.');
    } finally {
      setPosterSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading e-poster upload..." />
      </div>
    );
  }

  const isApproved = existingAbstract?.status === 'APPROVED';
  const finalPosterUrl = getAssetUrl(existingAbstract?.finalPosterPath);
  const hasFinalPoster = Boolean(existingAbstract?.finalPosterPath);
  const finalPosterStatus = existingAbstract?.finalPosterStatus || 'PENDING';
  const isPosterAccepted = hasFinalPoster && finalPosterStatus === 'APPROVED';
  const isPosterRejected = hasFinalPoster && finalPosterStatus === 'REJECTED';
  const posterStatusLabel = {
    PENDING: 'PENDING REVIEW',
    APPROVED: 'ACCEPTED',
    REJECTED: 'REJECTED',
  }[finalPosterStatus] || 'PENDING REVIEW';

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/80 pt-20 sm:pt-24" />
      <Header />

      <div className="relative z-10 mx-auto max-w-4xl space-y-5 px-3 py-4 pb-20 sm:px-4 sm:py-6 lg:px-6">
        <div className="flex items-center rounded-xl border border-white/40 bg-white/90 px-4 py-3 backdrop-blur-xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="-m-2 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="ml-3">
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Upload Final E-Poster</h1>
            <p className="text-xs text-slate-600 sm:text-sm">
              Final e-poster upload is available after abstract acceptance.
            </p>
          </div>
        </div>

        {!existingAbstract && (
          <div className="rounded-2xl border border-white/40 bg-white/90 p-6 text-center backdrop-blur-xl">
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">No abstract submitted</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Submit your abstract first. This e-poster window will unlock after the abstract is accepted.
            </p>
            <button
              onClick={() => navigate('/abstract/rules')}
              className="mt-5 rounded-xl bg-[#7cb342] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#68c239]"
            >
              Submit abstract
            </button>
          </div>
        )}

        {existingAbstract && !isApproved && (
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 backdrop-blur-xl grayscale">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Clock className="h-5 w-5 text-slate-400" />
                  E-Poster upload locked
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Once your abstract is accepted, this window will become active for final e-poster upload.
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusColor(existingAbstract.status)}`}>
                {existingAbstract.status}
              </span>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-[11px] uppercase text-slate-500">Abstract</p>
              <p className="mt-1 font-semibold text-slate-900">{existingAbstract.title}</p>
              {existingAbstract.reviewComments && (
                <p className="mt-3 flex items-start gap-2 text-xs text-slate-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {existingAbstract.reviewComments}
                </p>
              )}
            </div>
          </div>
        )}

        {isApproved && (
          <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
            <section className="rounded-2xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Upload className="h-5 w-5 text-[#005aa9]" />
                    Final E-Poster
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Upload the final presentation file for your accepted abstract.
                  </p>
                </div>
                <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  isPosterAccepted
                    ? 'bg-[#7cb342]/20 text-[#7cb342]'
                    : isPosterRejected
                      ? 'bg-red-500/20 text-red-500'
                      : hasFinalPoster
                        ? 'bg-[#ff8a1f]/20 text-[#ff8a1f]'
                        : 'bg-[#005aa9]/10 text-[#005aa9]'
                }`}>
                  {hasFinalPoster ? posterStatusLabel : 'READY'}
                </span>
              </div>

              {isPosterAccepted && (
                <div className="mb-3 rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-xs text-emerald-700">
                  Your final e-poster has been accepted. No further upload action is required.
                </div>
              )}

              {isPosterRejected && (
                <div className="mb-3 rounded-lg border border-red-300/60 bg-red-50 p-3 text-xs text-red-700">
                  <p className="font-semibold">Your final e-poster was rejected. Please use the official template and re-upload.</p>
                  {existingAbstract.finalPosterReviewComments && (
                    <p className="mt-1">{existingAbstract.finalPosterReviewComments}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/abstract/rules')}
                    className="mt-2 rounded-lg border border-red-300 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
                  >
                    View template and guidelines
                  </button>
                </div>
              )}

              {posterSuccessMessage && (
                <div className="mb-3 rounded-lg border border-emerald-300/60 bg-emerald-50 p-3 text-xs text-emerald-700">
                  {posterSuccessMessage}
                </div>
              )}

              {posterError && (
                <div className="mb-3 rounded-lg border border-red-300/60 bg-red-50 p-3 text-xs text-red-600">
                  {posterError}
                </div>
              )}

              {!isPosterAccepted && (
                <>
                  <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                    {posterFile ? (
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-10 w-10 text-[#005aa9]" />
                        <div className="flex max-w-full items-center rounded border border-[#005aa9]/20 bg-[#005aa9]/10 px-3 py-2 text-xs text-[#005aa9]">
                          <span className="max-w-[220px] truncate">{posterFile.name}</span>
                          <button
                            type="button"
                            onClick={removePosterFile}
                            className="ml-2 text-[#005aa9] hover:text-[#004684]"
                            disabled={posterSubmitting}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                        <label htmlFor="final-poster-file" className="inline-flex cursor-pointer items-center rounded-xl border border-[#005aa9]/30 bg-[#005aa9]/10 px-4 py-2.5 text-xs font-semibold text-[#005aa9] transition hover:bg-[#005aa9]/20">
                          <Upload className="mr-1.5 h-3.5 w-3.5" />
                          Select File
                          <input
                            id="final-poster-file"
                            type="file"
                            accept=".pdf,.docx,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            onChange={(event) => handlePosterFileChange(event.target.files[0])}
                            className="sr-only"
                            disabled={posterSubmitting}
                          />
                        </label>
                        <p className="mt-2 text-xs text-slate-500">Max 25MB • PDF, DOCX, PPT, or PPTX</p>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePosterSubmit}
                    disabled={posterSubmitting || !posterFile}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004684] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {posterSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {hasFinalPoster ? 'Replace final e-poster' : 'Upload final e-poster'}
                      </>
                    )}
                  </button>
                </>
              )}
            </section>

            <aside className="rounded-2xl border border-white/40 bg-white/90 p-4 backdrop-blur-xl sm:p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckCircle className="h-4 w-4 text-[#7cb342]" />
                Accepted Abstract
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusColor(existingAbstract.status)}`}>
                    APPROVED
                  </span>
                </div>
                <p className="font-semibold text-slate-900">{existingAbstract.title}</p>
                <p className="text-[11px] text-slate-600">#{existingAbstract.submissionNumber}</p>
                {hasFinalPoster && (
                  <div className="rounded-xl border border-[#7cb342]/30 bg-[#7cb342]/10 p-3 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Uploaded</p>
                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isPosterAccepted
                        ? 'bg-[#7cb342]/20 text-[#7cb342]'
                        : isPosterRejected
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-[#ff8a1f]/20 text-[#ff8a1f]'
                    }`}>
                      {posterStatusLabel}
                    </p>
                    <p className="mt-1 truncate">
                      {existingAbstract.finalPosterOriginalName || 'Final e-poster file'}
                    </p>
                    {existingAbstract.finalPosterUploadedAt && (
                      <p className="mt-1 text-slate-600">
                        {new Date(existingAbstract.finalPosterUploadedAt).toLocaleString('en-IN')}
                      </p>
                    )}
                    {existingAbstract.finalPosterReviewComments && (
                      <p className="mt-2 rounded-lg bg-white/70 p-2 text-slate-700">
                        {existingAbstract.finalPosterReviewComments}
                      </p>
                    )}
                  </div>
                )}
                {finalPosterUrl && (
                  <a
                    href={finalPosterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border border-[#005aa9]/40 px-4 py-2.5 text-center text-xs font-semibold text-[#005aa9] hover:bg-[#005aa9]/10 sm:text-sm"
                  >
                    View uploaded file
                  </a>
                )}
                <button
                  onClick={() => navigate('/abstract/upload')}
                  className="w-full rounded-xl border border-[#7cb342]/40 px-4 py-2.5 text-xs font-semibold text-[#7cb342] hover:bg-[#7cb342]/10 sm:text-sm"
                >
                  View abstract
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default EPosterUploadPage;
