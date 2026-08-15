import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CalendarDays, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { announcements } from '../../data/announcements';

const READ_STORAGE_KEY = 'aoacon-read-announcements';

const getReadAnnouncementIds = () => {
  try {
    return JSON.parse(window.localStorage.getItem(READ_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const AnnouncementCenter = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [readIds, setReadIds] = useState(getReadAnnouncementIds);

  const unreadAnnouncements = useMemo(
    () => announcements.filter((announcement) => !readIds.includes(announcement.id)),
    [readIds]
  );

  const markAsRead = (ids) => {
    const nextReadIds = [...new Set([...readIds, ...ids])];
    setReadIds(nextReadIds);
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(nextReadIds));
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (activeAnnouncement) markAsRead([activeAnnouncement.id]);
        setActiveAnnouncement(null);
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeAnnouncement, readIds]);

  const closeFlyer = () => {
    if (activeAnnouncement) markAsRead([activeAnnouncement.id]);
    setActiveAnnouncement(null);
  };

  const togglePanel = () => {
    const willOpen = !isPanelOpen;
    setIsPanelOpen(willOpen);
    if (willOpen && unreadAnnouncements.length) {
      markAsRead(unreadAnnouncements.map((announcement) => announcement.id));
    }
  };

  const handleAction = (announcement) => {
    markAsRead([announcement.id]);
    setActiveAnnouncement(null);
    setIsPanelOpen(false);
    navigate(announcement.href);
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={togglePanel}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={`Announcements${unreadAnnouncements.length ? `, ${unreadAnnouncements.length} unread` : ''}`}
          aria-expanded={isPanelOpen}
        >
          <Bell
            className={`h-5 w-5 ${unreadAnnouncements.length ? 'notification-bell-ring' : ''}`}
          />
          {unreadAnnouncements.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-slate-950 ring-2 ring-[#9c3253]">
              {unreadAnnouncements.length > 9 ? '9+' : unreadAnnouncements.length}
            </span>
          )}
        </button>

        {isPanelOpen && (
          <div className="fixed left-4 right-4 top-[7.5rem] z-[70] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[min(22rem,calc(100vw-2rem))]">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="font-bold">Announcements</p>
                <p className="text-xs text-slate-500">Latest AOACON updates</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Close announcements"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[26rem] overflow-y-auto">
              {announcements.length ? (
                announcements.map((announcement) => (
                  <button
                    type="button"
                    key={announcement.id}
                    onClick={() => {
                      markAsRead([announcement.id]);
                      setActiveAnnouncement(announcement);
                      setIsPanelOpen(false);
                    }}
                    className="flex w-full gap-3 border-b border-slate-100 p-3 text-left transition-colors last:border-0 hover:bg-slate-50"
                  >
                    <img
                      src={announcement.image}
                      alt=""
                      className="h-20 w-14 shrink-0 rounded-md border border-slate-200 object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span className="flex-1 text-sm font-semibold leading-snug">
                          {announcement.title}
                        </span>
                        {!readIds.includes(announcement.id) && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9c3253]" />
                        )}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">
                        {announcement.summary}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <CalendarDays className="h-3 w-3" />
                        {announcement.publishedAt}
                      </span>
                    </span>
                    <ChevronRight className="mt-7 h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                ))
              ) : (
                <p className="p-6 text-center text-sm text-slate-500">No announcements yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {activeAnnouncement && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFlyer();
          }}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9c3253]">Latest announcement</p>
                <h2 id="announcement-dialog-title" className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  {activeAnnouncement.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeFlyer}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9c3253]"
                aria-label="Close announcement"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-2 sm:p-4">
              <img
                src={activeAnnouncement.image}
                alt={activeAnnouncement.imageAlt}
                className="mx-auto max-h-[calc(94vh-9.5rem)] w-auto max-w-full rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
              <p className="hidden text-xs text-slate-500 sm:block">{activeAnnouncement.publishedAt}</p>
              <button
                type="button"
                onClick={() => handleAction(activeAnnouncement)}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#9c3253] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#812742] focus:outline-none focus:ring-2 focus:ring-[#9c3253] focus:ring-offset-2"
              >
                {activeAnnouncement.actionLabel}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementCenter;
