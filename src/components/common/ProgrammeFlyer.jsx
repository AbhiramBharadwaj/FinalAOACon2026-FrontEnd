import { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, Sparkles, X } from 'lucide-react';

const ProgrammeFlyer = ({ title, images, accent = 'from-[#005aa9] to-[#0d9488]' }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!images?.length) return null;

  return (
    <>
      <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Programme released
            </div>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Explore the full programme
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Browse the detailed schedule, sessions and hands-on stations planned for {title}.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-fit ${accent}`}
            >
              <Maximize2 className="h-4 w-4" />
              View full programme
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative min-h-[280px] overflow-hidden border-t border-slate-200 bg-slate-100 text-left lg:border-l lg:border-t-0"
            aria-label={`Open the full programme for ${title}`}
          >
            <img
              src={images[0].src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]"
            />
          </button>
        </div>
      </section>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-md sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="programme-dialog-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close programme"
          />

          <div className="relative z-[101] flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#f6f1e8] shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:rounded-3xl">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a6a2f]">Official programme</p>
                <h2 id="programme-dialog-title" className="truncate text-sm font-bold text-slate-900 sm:text-lg">
                  {title}
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={images[0].src}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
                >
                  Full size
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-700 sm:px-4 sm:text-sm"
                  autoFocus
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain p-2 sm:p-4 lg:p-5">
              <div className="mx-auto space-y-3 sm:space-y-5">
                {images.map((image, index) => (
                  <figure
                    key={image.src}
                    className="overflow-hidden rounded-xl border border-[#ded2bd] bg-white p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.1)] sm:rounded-2xl sm:p-2"
                  >
                    {images.length > 1 ? (
                      <figcaption className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Page {index + 1} of {images.length}
                      </figcaption>
                    ) : null}
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-auto w-full select-none object-contain"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProgrammeFlyer;
