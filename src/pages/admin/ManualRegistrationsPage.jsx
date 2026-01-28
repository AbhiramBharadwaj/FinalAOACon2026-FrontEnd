import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCcw, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../utils/api';

const workshopOptions = [
  { value: 'labour-analgesia', label: 'Labour Analgesia' },
  { value: 'critical-incidents', label: 'Critical Incidents' },
  { value: 'pocus', label: 'POCUS' },
  { value: 'maternal-collapse', label: 'Maternal Collapse' },
];

const ManualRegistrationsPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'NON_AOA',
    gender: '',
    mealPreference: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    instituteHospital: '',
    designation: '',
    medicalCouncilName: '',
    medicalCouncilNumber: '',
    membershipId: '',
    addWorkshop: false,
    selectedWorkshop: '',
    addAoaCourse: false,
    addLifeMembership: false,
    bookingPhase: 'EARLY_BIRD',
    utr: '',
    preferredRegistrationNumber: '',
    rangeStart: 1,
    rangeEnd: 14,
  });

  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);

  const inputClass = 'border border-slate-200 rounded-xl px-3 py-2 h-10 text-sm';

  const needsWorkshop = form.addWorkshop;
  const showMembership = form.role === 'AOA';

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    setError('');
    try {
      const response = await adminAPI.getManualRegistrationAvailability({
        start: form.rangeStart,
        end: form.rangeEnd,
      });
      setAvailability(response.data);
      if (response.data?.availableNumbers?.length) {
        setForm((prev) => ({
          ...prev,
          preferredRegistrationNumber: response.data.availableNumbers[0],
        }));
      } else {
        setForm((prev) => ({ ...prev, preferredRegistrationNumber: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load availability.');
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [form.rangeStart, form.rangeEnd]);

  useEffect(() => {
    let isActive = true;
    const fetchQuote = async () => {
      setQuoteLoading(true);
      setQuoteError('');
      try {
        const response = await adminAPI.getManualRegistrationQuote({
          role: form.role,
          bookingPhase: form.bookingPhase,
          addWorkshop: form.addWorkshop,
          addAoaCourse: form.addAoaCourse,
          addLifeMembership: form.addLifeMembership,
        });
        if (isActive) {
          setQuote(response.data);
        }
      } catch (err) {
        if (isActive) {
          setQuote(null);
          setQuoteError(err.response?.data?.message || 'Unable to calculate amount.');
        }
      } finally {
        if (isActive) {
          setQuoteLoading(false);
        }
      }
    };
    fetchQuote();
    return () => {
      isActive = false;
    };
  }, [form.role, form.bookingPhase, form.addWorkshop, form.addAoaCourse, form.addLifeMembership]);

  const availableOptions = useMemo(() => {
    if (!availability?.availableNumbers?.length) return [];
    return availability.availableNumbers.map((seq) => ({
      value: seq,
      label: `AOA2026-${String(seq).padStart(4, '0')}`,
    }));
  }, [availability]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        preferredRegistrationNumber: form.preferredRegistrationNumber || undefined,
      };
      const response = await adminAPI.createManualRegistration(payload);
      setMessage(
        `Created registration ${response.data?.registration?.registrationNumber || ''} successfully.`
      );
      await fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create manual registration.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!availability && loadingAvailability) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="sm" text="Loading availability..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Manual Registrations</h1>
              <p className="text-sm text-slate-500">
                Create paid registrations and send password reset + payment confirmation.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchAvailability}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh availability
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">User Profile</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={inputClass}
                      required
                    />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={inputClass}
                      required
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={inputClass}
                      required
                    />
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="AOA">AOA</option>
                      <option value="NON_AOA">NON AOA</option>
                      <option value="PGS">PGS</option>
                    </select>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      name="mealPreference"
                      value={form.mealPreference}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Meal Preference</option>
                      <option value="Veg">Veg</option>
                      <option value="Non Veg">Non Veg</option>
                    </select>
                    {showMembership && (
                      <input
                        name="membershipId"
                        value={form.membershipId}
                        onChange={handleChange}
                        placeholder="AOA Membership ID"
                        className={inputClass}
                        required
                      />
                    )}
                    <input
                      name="instituteHospital"
                      value={form.instituteHospital}
                      onChange={handleChange}
                      placeholder="Institution / Hospital"
                      className={inputClass}
                      required
                    />
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="Designation"
                      className={inputClass}
                      required
                    />
                    <input
                      name="medicalCouncilName"
                      value={form.medicalCouncilName}
                      onChange={handleChange}
                      placeholder="Medical Council Name"
                      className={inputClass}
                      required
                    />
                    <input
                      name="medicalCouncilNumber"
                      value={form.medicalCouncilNumber}
                      onChange={handleChange}
                      placeholder="Medical Council Registration Number"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className={`${inputClass} sm:col-span-2`}
                      required
                    />
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={inputClass}
                      required
                    />
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={inputClass}
                      required
                    />
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className={inputClass}
                      required
                    />
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Registration</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="addWorkshop"
                        checked={form.addWorkshop}
                        onChange={handleChange}
                      />
                      Add Workshop
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="addAoaCourse"
                        checked={form.addAoaCourse}
                        onChange={handleChange}
                      />
                      Add AOA Certified Course
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="addLifeMembership"
                        checked={form.addLifeMembership}
                        onChange={handleChange}
                      />
                      Add AOA Life Membership
                    </label>
                    <select
                      name="bookingPhase"
                      value={form.bookingPhase}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="EARLY_BIRD">Early Bird</option>
                      <option value="REGULAR">Regular</option>
                      <option value="SPOT">Spot</option>
                    </select>
                    {needsWorkshop && (
                      <select
                        name="selectedWorkshop"
                        value={form.selectedWorkshop}
                        onChange={handleChange}
                        className={`${inputClass} sm:col-span-2`}
                        required
                      >
                        <option value="">Select Workshop</option>
                        {workshopOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      name="utr"
                      value={form.utr}
                      onChange={handleChange}
                      placeholder="UTR / Transaction ID (optional)"
                      className={`${inputClass} sm:col-span-2`}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {quoteLoading ? (
                      <span>Calculating total...</span>
                    ) : quoteError ? (
                      <span className="text-red-600">{quoteError}</span>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>Final Amount (incl. GST + fee)</span>
                        <span className="font-semibold">
                          INR {Number(quote?.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-slate-900">Registration Number</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="rangeStart"
                      type="number"
                      value={form.rangeStart}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Range start"
                      min={1}
                    />
                    <input
                      name="rangeEnd"
                      type="number"
                      value={form.rangeEnd}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Range end"
                      min={1}
                    />
                    <select
                      name="preferredRegistrationNumber"
                      value={form.preferredRegistrationNumber}
                      onChange={handleChange}
                      className={`${inputClass} sm:col-span-2`}
                    >
                      <option value="">Auto assign next available</option>
                      {availableOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#005aa9] text-white rounded-xl py-3 font-semibold hover:bg-[#004684] transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Manual Registration'}
                </button>
              </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Availability</h3>
              {loadingAvailability ? (
                <LoadingSpinner size="sm" text="Refreshing..." />
              ) : (
                <>
                  <div className="text-sm text-slate-600">
                    Range: {availability?.range?.start} - {availability?.range?.end}
                  </div>
                  <div className="text-sm text-slate-600">
                    Current Counter: {availability?.currentCounter || 0}
                  </div>
                  <div className="text-sm text-slate-600">
                    Next Available: {availability?.nextAvailable?.registrationNumber || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">
                    Next Available (In Range): {availability?.nextAvailableInRange || 'N/A'}
                  </div>
                  <div className="text-sm text-slate-600">
                    Next Available (After Range): {availability?.nextAvailableAfterRange || 'N/A'}
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 mb-2">Available Numbers</div>
                    <div className="flex flex-wrap gap-2">
                      {availability?.availableNumbers?.length ? (
                        availability.availableNumbers.map((seq) => (
                          <span
                            key={seq}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
                          >
                            {String(seq).padStart(4, '0')}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No numbers available in range.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 mb-2">Used Numbers</div>
                    <div className="flex flex-wrap gap-2">
                      {availability?.usedNumbers?.length ? (
                        availability.usedNumbers.map((seq) => (
                          <span
                            key={seq}
                            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
                          >
                            {String(seq).padStart(4, '0')}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None in range.</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualRegistrationsPage;
