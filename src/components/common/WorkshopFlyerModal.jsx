import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const WorkshopFlyerModal = ({ title, image, imageAlt }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workshop-flyer-title"
    >
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9c3253]">
              Workshop announcement
            </p>
            <h2
              id="workshop-flyer-title"
              className="truncate text-base font-bold text-slate-900 sm:text-lg"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            autoFocus
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9c3253]"
            aria-label="Close workshop flyer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-2 sm:p-4">
          <img
            src={image}
            alt={imageAlt}
            className="mx-auto max-h-[calc(95vh-9.5rem)] w-auto max-w-full rounded-lg shadow-sm"
          />
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-3 text-right sm:px-5">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-[#9c3253] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#812742] focus:outline-none focus:ring-2 focus:ring-[#9c3253] focus:ring-offset-2"
          >
            Continue to workshop
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopFlyerModal;
