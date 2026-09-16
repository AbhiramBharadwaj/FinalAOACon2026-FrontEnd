import { useMemo, useState } from 'react';
import { CheckCircle, FileUp, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { facultyCvAPI } from '../../utils/api';
import logo from '../../images/logo.png';

const FacultyCvUploadPage = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [uploadToken, setUploadToken] = useState('');
  const [faculty, setFaculty] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const acceptedTypes = useMemo(
    () => '.pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    []
  );

  const requestOtp = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await facultyCvAPI.requestOtp(email.trim());
      setFaculty(response.data.faculty);
      setStep('otp');
      setMessage('OTP sent to your faculty email.');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP could not be sent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await facultyCvAPI.verifyOtp(email.trim(), otp.trim());
      setUploadToken(response.data.uploadToken);
      setFaculty(response.data.faculty);
      setStep('upload');
      setMessage('Email verified. Upload your CV.');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP could not be verified. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError('');
    if (!file) {
      setCvFile(null);
      return;
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
    const lowerName = file.name.toLowerCase();
    const validExtension = allowedExtensions.some((extension) => lowerName.endsWith(extension));
    if (!validExtension) {
      setCvFile(null);
      setError('Please upload a PDF, DOC, DOCX, PPT, or PPTX file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setCvFile(null);
      setError('CV file size must be less than 25 MB.');
      return;
    }

    setCvFile(file);
  };

  const uploadCv = async (event) => {
    event.preventDefault();
    if (!cvFile) {
      setError('Please select a CV file.');
      return;
    }

    const formData = new FormData();
    formData.append('uploadToken', uploadToken);
    formData.append('cvFile', cvFile);

    setError('');
    setMessage('');
    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await facultyCvAPI.upload(formData, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      setFaculty(response.data.faculty);
      setCvFile(null);
      setStep('done');
      setMessage('CV uploaded successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'CV could not be uploaded. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
            <img src={logo} alt="AOACON 2026" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AOACON 2026</p>
            <p className="text-xs text-slate-600">Faculty CV Upload</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h1 className="text-lg font-semibold text-slate-900">Faculty CV Submission</h1>
            <p className="mt-1 text-sm text-slate-600">
              Use the faculty email ID shared with the AOACON team.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 text-xs">
            {[
              ['email', Mail, 'Email'],
              ['otp', ShieldCheck, 'OTP'],
              ['upload', FileUp, 'Upload'],
            ].map(([key, Icon, label]) => {
              const active = step === key || (key === 'upload' && step === 'done');
              return (
                <div key={key} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${active ? 'border-[#005aa9] bg-sky-50 text-[#005aa9]' : 'border-slate-200 text-slate-500'}`}>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </div>
              );
            })}
          </div>

          {faculty && (
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{faculty.name}</p>
              <p className="text-xs text-slate-600">{faculty.email}</p>
              {faculty.role && <p className="mt-1 text-xs text-slate-500">{faculty.role}</p>}
            </div>
          )}

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {message && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}

          {step === 'email' && (
            <form onSubmit={requestOtp} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Faculty email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#005aa9] focus:ring-2 focus:ring-[#005aa9]/10"
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#004684] disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send OTP
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">OTP</label>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:border-[#005aa9] focus:ring-2 focus:ring-[#005aa9]/10"
                  placeholder="000000"
                  inputMode="numeric"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => setStep('email')} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Change email
                </button>
                <button type="submit" disabled={loading || otp.length !== 6} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#004684] disabled:opacity-60">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify OTP
                </button>
              </div>
            </form>
          )}

          {step === 'upload' && (
            <form onSubmit={uploadCv} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">CV file</label>
                <input
                  type="file"
                  accept={acceptedTypes}
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#005aa9]"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX, PPT, or PPTX. Maximum 25 MB.</p>
              </div>
              {cvFile && <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">{cvFile.name}</p>}
              {loading && uploadProgress > 0 && (
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#005aa9]" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{uploadProgress}% uploaded</p>
                </div>
              )}
              <button type="submit" disabled={loading || !cvFile} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#004684] disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Upload CV
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
              <h2 className="text-base font-semibold text-emerald-900">CV uploaded successfully</h2>
              <p className="mt-1 text-sm text-emerald-700">Thank you. The AOACON team has received your faculty CV.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCvUploadPage;
