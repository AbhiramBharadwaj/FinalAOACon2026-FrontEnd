import { Image } from 'lucide-react';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import Footer from '../../components/common/Footer';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pb-20">
        <section className="mt-6 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'url(https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#005aa9]/85 via-slate-800/80 to-[#9c3253]/80" />

            <div className="relative px-6 sm:px-10 py-12 sm:py-14 text-white text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center">
                <Image className="w-7 h-7 text-white" />
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold">Gallery</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-100/90 max-w-xl mx-auto">
                Coming soon. We’ll share photos and highlights from AOACON 2026 here.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default GalleryPage;
