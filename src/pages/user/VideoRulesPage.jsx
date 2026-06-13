import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Video, Users, Trophy, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import videoAnnouncementImage from '../../images/VideoCompetition/awardPoster.jpeg';

const VideoRulesPage = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleProceed = () => {
    if (!acceptedRules) return;

    if (isAuthenticated) {
      navigate('/video/upload');
      return;
    }

    navigate('/login', {
      state: {
        from: '/video/upload',
      },
    });
  };

  const announcementModal = showAnnouncement ? (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-3 py-6 backdrop-blur-md sm:px-6">
      <div
        className="absolute inset-0"
        onClick={() => setShowAnnouncement(false)}
        aria-hidden="true"
      />
      <div className="relative z-[81] max-h-full w-full max-w-2xl overflow-hidden border border-white/25 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <div className="sticky top-0 z-10 flex items-center justify-end border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto bg-[#f6f1e8] p-3 sm:p-5">
          <figure className="mx-auto max-w-xl overflow-hidden border border-[#ded2bd] bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <img
              src={videoAnnouncementImage}
              alt="Award video competition announcement"
              className="w-full object-contain"
            />
          </figure>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {announcementModal}

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 lg:px-6 lg:py-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#2e0845] via-[#5a189a] to-[#c9184a] px-5 py-6 text-white lg:px-8 lg:py-8">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                AOACON 2026 • Shivamogga
              </div>
              <h1 className="text-xl font-bold tracking-tight lg:text-3xl">
                AWARD VIDEO COMPETITION
              </h1>
              <p className="max-w-3xl text-sm text-white/85 lg:text-base">
                Submit a five-minute clinical video showcasing expertise in obstetric anaesthesia, obstetric analgesia, or obstetric critical care.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 lg:p-8">
            <section className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-rose-50 p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 lg:text-base">Competition Snapshot</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Open to all delegates, including PGs and fellows.</li>
                <li>Upload one 5-minute video in the field of obstetric anaesthesia, obstetric analgesia, or obstetric critical care.</li>
                <li>The best two videos will be recognised and showcased during the main conference.</li>
                <li>Conference registration is mandatory for submission.</li>
              </ul>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
              <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 lg:text-base">Eligibility</h2>
                <p className="mt-2 text-sm text-slate-700">All delegates including PGs and fellows may participate.</p>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Video className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 lg:text-base">Video Specs</h2>
                <p className="mt-2 text-sm text-slate-700">Recommended quality is 720p and above with clear audio. Maximum file size is 500 MB.</p>
              </section>

              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 lg:text-base">Judging Focus</h2>
                <p className="mt-2 text-sm text-slate-700">Scientific accuracy, technical quality, and creativity.</p>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 lg:text-base">Submission Requirements</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Submit the video title, presenter name, presenter details, and a brief description.</li>
                <li>Accepted file formats: MP4, MOV, WEBM, M4V, MPEG, and AVI.</li>
                <li>Only one active submission per participant is allowed at a time.</li>
                <li>If a submission is rejected, you may revise and submit again.</li>
                <li>Last date for submission: <strong>10 October 2026</strong>.</li>
              </ul>
            </section>

            <div className="border-t border-slate-200 pt-5">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedRules}
                  onChange={(event) => setAcceptedRules(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span className="text-sm text-slate-700">
                  I have read, understood, and agree to the award video competition rules and submission requirements.
                </span>
              </label>

              <button
                onClick={handleProceed}
                disabled={!acceptedRules}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                Proceed to Upload
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default VideoRulesPage;
