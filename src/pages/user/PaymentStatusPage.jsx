import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  ArrowRight, 
  RefreshCw, 
  ArrowLeft, 
  CreditCard,
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee,
  QrCode
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { registrationAPI, accommodationAPI, attendanceAPI } from '../../utils/api';
import Header from '../../components/common/Header';
import MobileNav from '../../components/common/MobileNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setRegistration: setAppRegistration } = useApp();
  const { user } = useAuth();

  const status = searchParams.get('status') || 'failed';
  const type = searchParams.get('type') || 'registration'; 
  const isSuccess = status === 'success';

  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState(null);

  const getRegistrationLabel = (registration) => {
    const labels = [];
    if (registration?.addWorkshop || registration?.selectedWorkshop) labels.push('Workshop');
    if (registration?.addAoaCourse) labels.push('AOA Certified Course');
    if (registration?.addLifeMembership) labels.push('AOA Life Membership');
    return labels.length ? `Conference + ${labels.join(' + ')}` : 'Conference Only';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === 'accommodation') {
          const res = await accommodationAPI.getMyBookings(); 
          // Take the latest booking (last one in array)
          setData(res.data[res.data.length - 1]);
        } else {
          const res = await registrationAPI.getMyRegistration();
          setData(res.data);
          setAppRegistration(res.data);

          if (isSuccess) {
            try {
              const qrRes = await attendanceAPI.getMyQr();
              setQrData(qrRes.data);
            } catch (qrErr) {
              console.error('QR fetch failed:', qrErr);
            }
          }
        }
      } catch (err) {
        setError('Failed to load payment details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, setAppRegistration, isSuccess]);

  const handleRetry = () => {
    navigate(type === 'accommodation' ? '/accommodation/checkout' : '/checkout');
  };

  const handleDownloadInvoice = () => {
    if (!data) return;

    const doc = new jsPDF();
    autoTable(doc);

    doc.setFontSize(20);
    doc.setTextColor(156, 50, 83); 
    doc.text('AOA 19th Conference Shivamogga 2026', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Invoice', 105, 32, { align: 'center' });

    doc.setFontSize(10);
    const invoiceNumber = data.registrationNumber || data.bookingNumber || data._id?.slice(-8) || 'N/A';
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 58);
    doc.text(`Billed To: ${user?.name || 'N/A'}`, 20, 66);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 74);
    if (user?.phone) {
      doc.text(`Phone: ${user?.phone}`, 20, 82);
    }

    doc.setFontSize(12);
    doc.text('Event Details', 20, 100);
    doc.setFontSize(10);
    doc.text('Event: AOA Shivamogga 2026', 20, 110);
    doc.text('Dates: October 30 - November 1, 2026', 20, 118);

    let detailsY = 144;
    if (type === 'registration') {
      doc.setFontSize(12);
      doc.text('Registration Details', 20, detailsY);
      detailsY += 12;
      doc.setFontSize(10);
      doc.text(`Package: ${getRegistrationLabel(data) || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      if (data.role) {
        doc.text(`Category: ${data.role}`, 20, detailsY);
        detailsY += 8;
      }
      if (data.membershipId) {
        doc.text(`Membership ID: ${data.membershipId}`, 20, detailsY);
        detailsY += 8;
      }
      if (data.bookingPhase) {
        doc.text(`Booking Phase: ${data.bookingPhase}`, 20, detailsY);
        detailsY += 8;
      }
    } else {
      doc.setFontSize(12);
      doc.text('Accommodation Details', 20, detailsY);
      detailsY += 12;
      doc.setFontSize(10);
      doc.text(`Hotel: ${data.accommodationId?.name || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Location: ${data.accommodationId?.location || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Check-in: ${data.checkInDate ? new Date(data.checkInDate).toLocaleDateString('en-IN') : 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Check-out: ${data.checkOutDate ? new Date(data.checkOutDate).toLocaleDateString('en-IN') : 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Guests: ${data.numberOfGuests || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Rooms: ${data.roomsBooked || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      doc.text(`Nights: ${data.numberOfNights || 'N/A'}`, 20, detailsY);
      detailsY += 8;
      if (data.specialRequests) {
        doc.text(`Special Requests: ${data.specialRequests}`, 20, detailsY);
        detailsY += 8;
      }
    }

    const baseAmount =
      data.basePrice ||
      (data.packageBase
        ? data.packageBase -
          (data.workshopAddOn || 0) -
          (data.aoaCourseBase || 0) -
          (data.lifeMembershipBase || 0)
        : 0);
    const workshopPrice = data.workshopAddOn || 0;
    const aoaCourseBase = data.aoaCourseBase || 0;
    const lifeMembershipBase = data.lifeMembershipBase || 0;
    const accompanyingBase = data.accompanyingBase || 0;
    const couponDiscount = data.couponDiscount || 0;
    const couponCode = data.couponCode || '';
    const gst = data.totalGST || Math.round((data.totalBase || 0) * 0.18) || 0;
    const total = data.totalAmount || 0;

    doc.setFontSize(12);
    doc.text('Payment Breakdown', 20, detailsY + 10);

    doc.autoTable({
      startY: detailsY + 20,
      head: [['Description', 'Amount (₹)']],
      body: [
        ['Conference Base', baseAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })],
        ...(couponDiscount > 0
          ? [[
              `Coupon ${couponCode ? `(${couponCode})` : ''}`.trim(),
              (-couponDiscount).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
            ]]
          : []),
        ...(workshopPrice > 0 ? [['Workshop Add-on', workshopPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })]] : []),
        ...(aoaCourseBase > 0 ? [['AOA Course Add-on', aoaCourseBase.toLocaleString('en-IN', { maximumFractionDigits: 2 })]] : []),
        ...(lifeMembershipBase > 0 ? [['AOA Life Membership', lifeMembershipBase.toLocaleString('en-IN', { maximumFractionDigits: 2 })]] : []),
        ...(accompanyingBase > 0 ? [['Accompanying person(s)', accompanyingBase.toLocaleString('en-IN', { maximumFractionDigits: 2 })]] : []),
        ['GST (18%)', gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })],
        ['Total Amount', total.toLocaleString('en-IN', { maximumFractionDigits: 2 })],
      ],
      theme: 'grid',
      headStyles: { fillColor: [156, 50, 83], textColor: 255 },
      styles: { fontSize: 10 },
    });

    const footerY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your participation!', 105, footerY, { align: 'center' });
    doc.text('AOA Shivamogga 2026 Organizing Team', 105, footerY + 8, { align: 'center' });

    doc.save(`AOA_Invoice_${type}_${data.registrationNumber || data.bookingNumber || 'N/A'}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <LoadingSpinner size="md" text="Loading payment details..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="text-center p-6 max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-200 mb-6 text-sm">{error || 'No payment details found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#9c3253]/90 text-white rounded-lg text-sm font-medium hover:bg-[#8a2b47]/90 backdrop-blur-sm transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isRegistration = type === 'registration';
  const title = isRegistration ? 'Registration' : 'Accommodation Booking';
  const number = isRegistration ? data.registrationNumber : data.bookingNumber || data._id?.slice(-8);
  const amount = data.totalAmount || data.amount || 0;
  const currency = '₹';

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://www.justmbbs.com/img/college/karnataka/shimoga-institute-of-medical-sciences-shimoga-banner.jpg')"
      }}
    >
      {}
      <div className="absolute inset-0 bg-black/70 pt-20 sm:pt-24" />
      
      <Header />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-20">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {}
          <div className="lg:col-span-1 lg:row-span-2">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4 lg:p-6 text-center">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 rounded-xl flex items-center justify-center border-2 ${
                isSuccess ? 'bg-[#7cb342]/20 border-[#7cb342]/50' : 'bg-red-500/20 border-red-400/50'
              }`}>
                {isSuccess ? (
                  <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-[#7cb342]" />
                ) : (
                  <XCircle className="w-8 h-8 lg:w-10 lg:h-10 text-red-400" />
                )}
              </div>

              <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2">
                {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
              </h2>

              <p className="text-xs lg:text-sm text-slate-600 mb-6">
                {isSuccess
                  ? `Your ${title.toLowerCase()} has been confirmed!`
                  : 'The payment was not successful. Please try again.'}
              </p>

              <div className="bg-[#9c3253]/10 border border-[#9c3253]/30 rounded px-4 py-3 mb-6">
                <p className="text-lg lg:text-xl font-semibold text-[#9c3253]">
                  {currency}{amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] lg:text-xs text-slate-600 mt-1">Total Amount Paid</p>
              </div>

              <div className="space-y-3">
                {isSuccess ? (
                  <>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs lg:text-sm rounded border border-[#9c3253] bg-[#9c3253] text-white font-medium hover:bg-[#8a2b47] transition-colors"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownloadInvoice}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs lg:text-sm rounded border border-[#ff8a1f]/50 bg-[#ff8a1f]/10 text-[#ff8a1f] font-medium hover:bg-[#ff8a1f]/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRetry}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs lg:text-sm rounded border border-[#9c3253] bg-[#9c3253] text-white font-medium hover:bg-[#8a2b47] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry Payment
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center px-4 py-2.5 text-xs lg:text-sm border border-slate-200 bg-white/90 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4 lg:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              {isRegistration ? (
                <CreditCard className="w-4 h-4 text-[#9c3253]" />
              ) : (
                <Hotel className="w-4 h-4 text-[#ff8a1f]" />
              )}
              {title} #{number}
            </h3>

            <div className="space-y-3 text-xs">
              {isRegistration ? (
                <>
                  <div className="flex justify-between py-2 border-b border-slate-100/50">
                    <span className="text-slate-600">Package</span>
                    <span className="font-medium capitalize">
                      {getRegistrationLabel(data) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100/50">
                    <span className="text-slate-600">Amount Paid</span>
                    <span className="font-semibold text-[#9c3253]">
                      {currency}{data.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {data.couponDiscount > 0 && (
                    <div className="flex justify-between py-2 border-b border-slate-100/50">
                      <span className="text-slate-600">Coupon {data.couponCode || 'Applied'}</span>
                      <span className="font-medium text-emerald-700">
                        -{currency}{data.couponDiscount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Payment Status</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      isSuccess 
                        ? 'bg-[#7cb342]/20 text-[#7cb342] border border-[#7cb342]/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      {isSuccess ? 'Confirmed' : 'Failed'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={data.accommodationId?.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={data.accommodationId?.name}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{data.accommodationId?.name}</p>
                      <p className="text-slate-600 text-[10px]">{data.accommodationId?.location}</p>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100/50 text-[10px]">
                    <span>Check-in - Check-out</span>
                    <span className="font-medium">
                      {new Date(data.checkInDate).toLocaleDateString('en-IN')} – 
                      {new Date(data.checkOutDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100/50 text-[10px]">
                    <span>Guests / Rooms</span>
                    <span className="font-medium">
                      {data.numberOfGuests} Guest{data.numberOfGuests > 1 ? 's' : ''} • 
                      {data.roomsBooked} Room{data.roomsBooked > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Total Amount</span>
                    <span className="font-semibold text-[#9c3253] text-xs">
                      {currency}{data.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {}
          {isSuccess && isRegistration && qrData && (
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-white/40 rounded-lg p-4 lg:p-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#7cb342]" />
                Your Conference Entry QR
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <img
                    src={qrData.qrUrl}
                    alt="Conference QR"
                    className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl"
                  />
                </div>
                <div className="flex-1 space-y-2 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Reg No: {qrData.registrationNumber}
                  </p>
                  <p className="text-[10px]">Show this QR at conference entry.</p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrData.qrUrl;
                      link.download = `AOA_${qrData.registrationNumber}_QR.png`;
                      link.click();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded border border-[#7cb342]/50 bg-[#7cb342]/10 text-[#7cb342] text-xs font-medium hover:bg-[#7cb342]/20 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default PaymentStatusPage;
