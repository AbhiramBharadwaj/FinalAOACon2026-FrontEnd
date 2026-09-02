import { useEffect, useMemo, useState } from 'react';
import { BedDouble, CalendarDays, CheckCircle2, IndianRupee, Mail, Plus, RefreshCw, Search, Settings2, UserRound, UsersRound } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount || 0));
const dateLabel = (value) => value ? new Date(value).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—';
const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#005aa9]';
const hotelWindow = (hotel = {}) => ({ earliestCheckIn: hotel.bookingWindow?.earliestCheckIn || '2026-10-28', latestCheckOut: hotel.bookingWindow?.latestCheckOut || '2026-11-03' });
const dateOptions = (start, end) => {
  if (!start || !end) return [];
  const result = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (cursor <= last && result.length < 31) {
    const value = cursor.toISOString().slice(0, 10);
    result.push([value, cursor.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })]);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
};
const initialStayDates = (hotel) => {
  const window = hotelWindow(hotel);
  const options = dateOptions(window.earliestCheckIn, window.latestCheckOut).map(([value]) => value);
  const checkInDate = options.includes('2026-10-30') ? '2026-10-30' : options[0] || '';
  const checkouts = options.filter((date) => date > checkInDate);
  return { checkInDate, checkOutDate: checkouts.includes('2026-11-02') ? '2026-11-02' : checkouts[0] || '' };
};
const todayInIndia = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const freshForm = (hotel = {}) => ({
  accommodationId: hotel._id || '', occupancyType: 'SINGLE', roommateName: '', ...initialStayDates(hotel),
  checkInTime: hotel.checkInTime || '14:00', checkOutTime: hotel.checkOutTime || '12:00', amountCollected: '', amountAdjustmentNote: '',
  paymentMethod: 'UPI', paymentReference: '', paymentDate: todayInIndia(), adminNotes: '', sendEmail: true, confirmPaymentReceived: false,
});
const settingsFromHotel = (hotel = {}) => ({
  name: hotel.name || '', location: hotel.location || '', description: hotel.description || '',
  singleBasePerNight: hotel.manualBookingRates?.singleBasePerNight ?? 5000,
  sharingBasePerPersonPerNight: hotel.manualBookingRates?.sharingBasePerPersonPerNight ?? 4000,
  gstRate: hotel.manualBookingRates?.gstRate ?? 5, checkInTime: hotel.checkInTime || '14:00', checkOutTime: hotel.checkOutTime || '12:00',
  earliestCheckIn: hotel.bookingWindow?.earliestCheckIn || '2026-10-28', latestCheckOut: hotel.bookingWindow?.latestCheckOut || '2026-11-03',
  isActive: hotel.isActive !== false,
});

const AccommodationManagementPage = () => {
  const [tab, setTab] = useState('create');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [editingHotelId, setEditingHotelId] = useState('');
  const [settings, setSettings] = useState(settingsFromHotel());
  const [form, setForm] = useState(freshForm());
  const [quote, setQuote] = useState(null);
  const [selectedDelegate, setSelectedDelegate] = useState(null);
  const [delegateSearch, setDelegateSearch] = useState('');
  const [delegateResults, setDelegateResults] = useState([]);
  const [delegateSearching, setDelegateSearching] = useState(false);
  const [bookingSearch, setBookingSearch] = useState('');
  const [notice, setNotice] = useState(null);

  const activeHotels = useMemo(() => hotels.filter((hotel) => hotel.isActive), [hotels]);
  const selectedHotel = useMemo(() => hotels.find((hotel) => hotel._id === selectedHotelId), [hotels, selectedHotelId]);
  const stayDateOptions = useMemo(() => {
    const window = hotelWindow(selectedHotel);
    return dateOptions(window.earliestCheckIn, window.latestCheckOut);
  }, [selectedHotel]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingResult, hotelResult] = await Promise.all([adminAPI.getAccommodationBookings(), adminAPI.getManagedAccommodations()]);
      const loadedHotels = hotelResult.data;
      const firstHotel = loadedHotels.find((hotel) => hotel.isActive && /Harsha The Fern/i.test(hotel.name)) || loadedHotels.find((hotel) => hotel.isActive) || loadedHotels[0];
      setBookings(bookingResult.data);
      setHotels(loadedHotels);
      if (firstHotel) {
        setSelectedHotelId(firstHotel._id);
        setEditingHotelId(firstHotel._id);
        setSettings(settingsFromHotel(firstHotel));
        setForm(freshForm(firstHotel));
      }
    } catch (error) {
      setNotice({ error: true, text: error.response?.data?.message || 'Accommodation data could not be loaded.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    if (!form.accommodationId || !form.checkInDate || !form.checkOutDate) return undefined;
    let current = true;
    adminAPI.getAccommodationQuote({ accommodationId: form.accommodationId, occupancyType: form.occupancyType, checkInDate: form.checkInDate, checkOutDate: form.checkOutDate })
      .then(({ data }) => {
        if (!current) return;
        setQuote(data.quote);
        setForm((previous) => ({ ...previous, amountCollected: String(data.quote.totalAmount), amountAdjustmentNote: '' }));
      }).catch((error) => {
        if (!current) return;
        setQuote(null);
        setNotice({ error: true, text: error.response?.data?.message || 'Unable to calculate this stay.' });
      });
    return () => { current = false; };
  }, [form.accommodationId, form.occupancyType, form.checkInDate, form.checkOutDate]);

  useEffect(() => {
    const query = delegateSearch.trim();
    if (query.length < 2) {
      setDelegateResults([]);
      setDelegateSearching(false);
      return undefined;
    }
    let current = true;
    const timer = setTimeout(async () => {
      setDelegateSearching(true);
      try {
        const { data } = await adminAPI.searchAccommodationDelegates(query);
        if (current) setDelegateResults(data);
      } catch (error) {
        if (current) {
          setDelegateResults([]);
          setNotice({ error: true, text: error.response?.data?.message || 'Delegates could not be searched.' });
        }
      } finally {
        if (current) setDelegateSearching(false);
      }
    }, 300);
    return () => { current = false; clearTimeout(timer); };
  }, [delegateSearch]);

  const summary = useMemo(() => ({
    total: bookings.length,
    collected: bookings.reduce((sum, item) => sum + Number(item.amountCollected ?? item.totalAmount ?? 0), 0),
    single: bookings.filter((item) => item.occupancyType === 'SINGLE').length,
    sharing: bookings.filter((item) => item.occupancyType === 'SHARING').length,
    unsent: bookings.filter((item) => !item.paymentEmailSentAt).length,
  }), [bookings]);
  const filteredBookings = useMemo(() => {
    const query = bookingSearch.trim().toLowerCase();
    if (!query) return bookings;
    return bookings.filter((item) => [item.bookingNumber, item.userId?.name, item.userId?.phone, item.userId?.email, item.paymentReference, item.accommodationId?.name]
      .some((value) => String(value || '').toLowerCase().includes(query)));
  }, [bookings, bookingSearch]);

  const selectBookingHotel = (hotelId) => {
    const hotel = hotels.find((item) => item._id === hotelId);
    if (!hotel) return;
    setSelectedHotelId(hotelId);
    setQuote(null);
    setForm((current) => ({ ...freshForm(hotel), paymentDate: current.paymentDate, paymentMethod: current.paymentMethod }));
  };
  const change = ({ target }) => setForm((current) => {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const next = { ...current, [target.name]: value };
    if (target.name === 'checkInDate' && current.checkOutDate <= value) next.checkOutDate = stayDateOptions.find(([date]) => date > value)?.[0] || current.checkOutDate;
    return next;
  });
  const createBooking = async () => {
    setNotice(null);
    if (!selectedDelegate) return setNotice({ error: true, text: 'Select a registered delegate.' });
    if (!selectedHotel) return setNotice({ error: true, text: 'Select a hotel.' });
    setBusy(true);
    try {
      const { data } = await adminAPI.createManualAccommodationBooking({ ...form, userId: selectedDelegate.userId, amountCollected: Number(form.amountCollected) });
      setBookings((items) => [data.booking, ...items]);
      setNotice({ error: false, text: `${data.booking.bookingNumber} created for ${selectedHotel.name}.${data.emailStatus === 'SENT' ? ' Confirmation email sent.' : ''}` });
      setSelectedDelegate(null); setDelegateResults([]); setDelegateSearch(''); setForm(freshForm(selectedHotel)); setTab('bookings');
    } catch (error) { setNotice({ error: true, text: error.response?.data?.message || 'Accommodation booking could not be created.' }); }
    finally { setBusy(false); }
  };
  const emailBooking = async (booking) => {
    setNotice(null);
    try {
      await adminAPI.sendAccommodationEmail(booking._id);
      setBookings((items) => items.map((item) => item._id === booking._id ? { ...item, paymentEmailSentAt: new Date().toISOString() } : item));
      setNotice({ error: false, text: `Confirmation email sent for ${booking.bookingNumber}.` });
    } catch (error) { setNotice({ error: true, text: error.response?.data?.message || 'Email could not be sent.' }); }
  };
  const editHotel = (hotel) => { setEditingHotelId(hotel._id); setSettings(settingsFromHotel(hotel)); setNotice(null); };
  const addHotel = () => {
    setEditingHotelId('');
    setSettings({ ...settingsFromHotel(), singleBasePerNight: '', sharingBasePerPersonPerNight: '' });
    setNotice(null);
  };
  const saveSettings = async (event) => {
    event.preventDefault(); setBusy(true); setNotice(null);
    const payload = { ...settings, singleBasePerNight: Number(settings.singleBasePerNight), sharingBasePerPersonPerNight: Number(settings.sharingBasePerPersonPerNight), gstRate: Number(settings.gstRate) };
    try {
      const wasEditing = Boolean(editingHotelId);
      const { data } = editingHotelId ? await adminAPI.updateManagedAccommodation(editingHotelId, payload) : await adminAPI.createManagedAccommodation(payload);
      const saved = data.accommodation;
      setHotels((items) => items.some((item) => item._id === saved._id) ? items.map((item) => item._id === saved._id ? saved : item) : [...items, saved]);
      setEditingHotelId(saved._id);
      setSettings(settingsFromHotel(saved));
      if (saved._id === selectedHotelId && saved.isActive) setForm(freshForm(saved));
      if (saved._id === selectedHotelId && !saved.isActive) {
        const replacement = hotels.find((hotel) => hotel._id !== saved._id && hotel.isActive);
        if (replacement) selectBookingHotel(replacement._id);
        else { setSelectedHotelId(''); setForm(freshForm()); setQuote(null); }
      }
      setNotice({ error: false, text: wasEditing ? 'Hotel settings updated.' : 'Hotel added successfully.' });
    } catch (error) { setNotice({ error: true, text: error.response?.data?.message || 'Hotel settings could not be saved.' }); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="flex h-screen bg-slate-50"><Sidebar /><div className="flex flex-1 items-center justify-center"><LoadingSpinner size="sm" text="Loading accommodations..." /></div></div>;
  return <div className="flex min-h-screen bg-slate-50"><Sidebar /><main className="min-w-0 flex-1 p-4 sm:p-6"><div className="mx-auto max-w-7xl space-y-5">
    <header><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#005aa9]">Organizer allocation</p><h1 className="mt-1 text-xl font-bold text-slate-950">Accommodation management</h1><p className="mt-1 text-sm text-slate-600">Record paid delegate stays across organizer-managed hotels. Room assignment remains with each hotel.</p></header>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{[['Bookings', summary.total, BedDouble], ['Collected', money(summary.collected), IndianRupee], ['Single', summary.single, UserRound], ['Sharing', summary.sharing, UsersRound], ['Email pending', summary.unsent, Mail]].map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><Icon className="h-4 w-4 text-[#005aa9]" /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-950">{value}</p></div>)}</div>
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2">{[['create', 'Create booking', BedDouble], ['bookings', 'All bookings', CalendarDays], ['settings', 'Manage hotels', Settings2]].map(([id, label, Icon]) => <button key={id} type="button" onClick={() => { setTab(id); setNotice(null); }} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-[#005aa9] text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
    {notice && <div className={`rounded-xl border px-4 py-3 text-sm ${notice.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{notice.text}</div>}

    {tab === 'create' && <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-950">1. Select registered delegate</h2><div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={delegateSearch} onChange={(event) => { setDelegateSearch(event.target.value); setSelectedDelegate(null); }} placeholder="Start typing a name, phone, email or registration number" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm" /></div>
        {delegateSearching && <p className="mt-3 text-xs text-slate-500">Searching registered delegates…</p>}
        {!delegateSearching && delegateSearch.trim().length >= 2 && delegateResults.length === 0 && <p className="mt-3 text-xs text-slate-500">No paid registration found.</p>}
        {delegateResults.length > 0 && <div className="mt-3 divide-y overflow-hidden rounded-xl border">{delegateResults.map((person) => <button key={person.registrationId} type="button" onClick={() => setSelectedDelegate(person)} className={`flex w-full items-center justify-between gap-4 p-3 text-left hover:bg-slate-50 ${selectedDelegate?.userId === person.userId ? 'bg-sky-50' : ''}`}><div><p className="text-sm font-bold text-slate-900">{person.name}</p><p className="text-xs text-slate-500">{person.phone} · {person.email}</p></div><span className="text-xs font-bold text-[#005aa9]">{person.registrationNumber}</span></button>)}</div>}
        {selectedDelegate && <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><div><p className="text-sm font-bold text-emerald-900">{selectedDelegate.name}</p><p className="text-xs text-emerald-700">Paid registration {selectedDelegate.registrationNumber}</p></div></div>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-950">2. Hotel and stay</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">Hotel<select value={selectedHotelId} onChange={(event) => selectBookingHotel(event.target.value)} className={inputClass}>{activeHotels.map((hotel) => <option key={hotel._id} value={hotel._id}>{hotel.name} — {hotel.location}</option>)}</select></label>
        <label className="text-sm font-medium">Occupancy<select name="occupancyType" value={form.occupancyType} onChange={change} className={inputClass}><option value="SINGLE">Single</option><option value="SHARING">Sharing</option></select></label>
        <label className="text-sm font-medium">Check-in date<select name="checkInDate" value={form.checkInDate} onChange={change} className={inputClass}>{stayDateOptions.slice(0, -1).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-sm font-medium">Check-in time<input type="time" name="checkInTime" value={form.checkInTime} onChange={change} className={inputClass} /></label>
        <label className="text-sm font-medium">Check-out date<select name="checkOutDate" value={form.checkOutDate} onChange={change} className={inputClass}>{stayDateOptions.slice(1).map(([value, label]) => <option key={value} value={value} disabled={value <= form.checkInDate}>{label}</option>)}</select></label>
        <label className="text-sm font-medium">Check-out time<input type="time" name="checkOutTime" value={form.checkOutTime} onChange={change} className={inputClass} /></label>
        {form.occupancyType === 'SHARING' && <label className="text-sm font-medium">Roommate name <span className="text-slate-400">(optional)</span><input name="roommateName" value={form.roommateName} onChange={change} className={inputClass} /></label>}
      </div></section>
    </div><section className="h-fit rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-950">3. Payment</h2>
      {quote && <div className="mt-4 rounded-xl bg-slate-950 p-4 text-white"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-sky-300">{selectedHotel?.name}</p><p className="flex justify-between text-sm text-slate-300"><span>{money(quote.baseRatePerNight)} × {quote.numberOfNights} nights</span><span>{money(quote.baseAmount)}</span></p><p className="mt-2 flex justify-between text-sm text-slate-300"><span>GST ({quote.gstRate}%)</span><span>{money(quote.gstAmount)}</span></p><p className="mt-3 flex justify-between border-t border-white/20 pt-3 font-bold"><span>Calculated total</span><span>{money(quote.totalAmount)}</span></p></div>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Amount collected<input min="0" type="number" name="amountCollected" value={form.amountCollected} onChange={change} className={inputClass} /></label><label className="text-sm font-medium">Payment method<select name="paymentMethod" value={form.paymentMethod} onChange={change} className={inputClass}><option value="UPI">UPI</option><option value="BANK_TRANSFER">Bank transfer</option><option value="CASH">Cash</option><option value="OTHER">Other</option></select></label><label className="text-sm font-medium">Payment date<input type="date" name="paymentDate" value={form.paymentDate} onChange={change} className={inputClass} /></label><label className="text-sm font-medium">UTR/reference <span className="text-slate-400">(optional)</span><input name="paymentReference" value={form.paymentReference} onChange={change} className={inputClass} /></label></div>
      {quote && Number(form.amountCollected) !== quote.totalAmount && <label className="mt-4 block text-sm font-medium">Amount difference reason<textarea name="amountAdjustmentNote" value={form.amountAdjustmentNote} onChange={change} rows="2" className={`${inputClass} border-amber-300`} /></label>}
      <label className="mt-4 block text-sm font-medium">Internal notes<textarea name="adminNotes" value={form.adminNotes} onChange={change} rows="2" className={inputClass} /></label>
      <div className="mt-4 space-y-3 rounded-xl border bg-slate-50 p-4 text-sm"><label className="flex gap-3"><input type="checkbox" name="confirmPaymentReceived" checked={form.confirmPaymentReceived} onChange={change} />I confirm payment was received.</label><label className="flex gap-3"><input type="checkbox" name="sendEmail" checked={form.sendEmail} onChange={change} />Send confirmation email and invoice now.</label></div>
      <button type="button" onClick={createBooking} disabled={busy || !selectedDelegate || !selectedHotel || !quote || !form.confirmPaymentReceived} className="mt-5 w-full rounded-xl bg-[#005aa9] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Recording…' : 'Record paid accommodation'}</button>
    </section></div>}

    {tab === 'bookings' && <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Accommodation bookings</h2><p className="text-xs text-slate-500">Internal allocations linked to delegate profiles.</p></div><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={bookingSearch} onChange={(event) => setBookingSearch(event.target.value)} placeholder="Delegate, hotel or booking" className="rounded-xl border py-2 pl-9 pr-3 text-sm" /></div></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="p-3">Delegate</th><th className="p-3">Hotel</th><th className="p-3">Stay</th><th className="p-3">Occupancy</th><th className="p-3">Collected</th><th className="p-3">Payment</th><th className="p-3">Email</th></tr></thead><tbody className="divide-y">{filteredBookings.map((item) => <tr key={item._id}><td className="p-3"><p className="font-bold">{item.userId?.name}</p><p className="text-xs text-slate-500">{item.bookingNumber} · {item.userId?.phone}</p></td><td className="p-3"><p className="font-medium">{item.accommodationId?.name || '—'}</p><p className="text-xs text-slate-500">{item.accommodationId?.location}</p></td><td className="p-3"><p>{dateLabel(item.checkInDate)} – {dateLabel(item.checkOutDate)}</p><p className="text-xs text-slate-500">{item.numberOfNights} nights · {item.checkInTime} / {item.checkOutTime}</p></td><td className="p-3"><span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700">{item.occupancyType === 'SHARING' ? 'Sharing' : 'Single'}</span>{item.roommateName && <p className="mt-1 text-xs text-slate-500">with {item.roommateName}</p>}</td><td className="p-3 font-bold">{money(item.amountCollected ?? item.totalAmount)}</td><td className="p-3"><p>{item.paymentMethod?.replaceAll('_', ' ') || '—'}</p><p className="max-w-44 truncate text-xs text-slate-500">{item.paymentReference || 'No reference'}</p></td><td className="p-3">{item.paymentEmailSentAt ? <span className="text-xs font-bold text-emerald-700">Sent {dateLabel(item.paymentEmailSentAt)}</span> : <button type="button" onClick={() => emailBooking(item)} className="flex items-center gap-1 rounded-lg border border-[#005aa9]/30 px-2 py-1 text-xs font-bold text-[#005aa9]"><Mail className="h-3 w-3" />Send email</button>}</td></tr>)}</tbody></table>{!filteredBookings.length && <p className="py-10 text-center text-sm text-slate-500">No bookings found.</p>}</div></section>}

    {tab === 'settings' && <div className="grid gap-5 lg:grid-cols-[0.36fr_0.64fr]"><section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><div><h2 className="font-bold">Hotels</h2><p className="text-xs text-slate-500">{hotels.length} configured</p></div><button type="button" onClick={addHotel} className="flex items-center gap-1 rounded-lg bg-[#005aa9] px-3 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" />Add hotel</button></div><div className="mt-4 space-y-2">{hotels.map((hotel) => <button key={hotel._id} type="button" onClick={() => editHotel(hotel)} className={`w-full rounded-xl border p-3 text-left ${editingHotelId === hotel._id ? 'border-[#005aa9] bg-sky-50' : 'border-slate-200 hover:bg-slate-50'}`}><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-bold text-slate-900">{hotel.name}</p><p className="mt-1 text-xs text-slate-500">{hotel.location}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${hotel.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{hotel.isActive ? 'Active' : 'Inactive'}</span></div></button>)}</div></section>
      <form onSubmit={saveSettings} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">{editingHotelId ? `${settings.name} settings` : 'Add hotel'}</h2><p className="mt-1 text-sm text-slate-500">Tariff changes apply only to new bookings. Existing booking totals stay unchanged.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Hotel name<input required value={settings.name} onChange={(event) => setSettings((value) => ({ ...value, name: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Location<input required value={settings.location} onChange={(event) => setSettings((value) => ({ ...value, location: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Single base rate/night<input required min="0" type="number" value={settings.singleBasePerNight} onChange={(event) => setSettings((value) => ({ ...value, singleBasePerNight: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Sharing rate/person/night<input required min="0" type="number" value={settings.sharingBasePerPersonPerNight} onChange={(event) => setSettings((value) => ({ ...value, sharingBasePerPersonPerNight: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">GST percentage<input required min="0" type="number" value={settings.gstRate} onChange={(event) => setSettings((value) => ({ ...value, gstRate: event.target.value }))} className={inputClass} /></label><span /><label className="text-sm font-medium">Earliest check-in<input required type="date" value={settings.earliestCheckIn} onChange={(event) => setSettings((value) => ({ ...value, earliestCheckIn: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Latest check-out<input required type="date" value={settings.latestCheckOut} onChange={(event) => setSettings((value) => ({ ...value, latestCheckOut: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Default check-in<input required type="time" value={settings.checkInTime} onChange={(event) => setSettings((value) => ({ ...value, checkInTime: event.target.value }))} className={inputClass} /></label><label className="text-sm font-medium">Default check-out<input required type="time" value={settings.checkOutTime} onChange={(event) => setSettings((value) => ({ ...value, checkOutTime: event.target.value }))} className={inputClass} /></label><label className="flex items-center gap-3 rounded-xl border bg-slate-50 p-3 text-sm sm:col-span-2"><input type="checkbox" checked={settings.isActive} onChange={(event) => setSettings((value) => ({ ...value, isActive: event.target.checked }))} />Active and available for new bookings</label></div><button disabled={busy} className="mt-5 flex items-center gap-2 rounded-xl bg-[#005aa9] px-4 py-2.5 text-sm font-bold text-white"><RefreshCw className="h-4 w-4" />{busy ? 'Saving…' : editingHotelId ? 'Save hotel settings' : 'Add hotel'}</button></form>
    </div>}
  </div></main></div>;
};

export default AccommodationManagementPage;
