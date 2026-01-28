import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../utils/api';

const CounterManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(null);
  const [maxUsed, setMaxUsed] = useState(null);
  const [suggestedNext, setSuggestedNext] = useState(null);
  const [nextValue, setNextValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCounter = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getRegistrationCounter();
      setCounter(response.data?.counter ?? 0);
      setMaxUsed(response.data?.maxUsed ?? 0);
      setSuggestedNext(response.data?.suggestedNext ?? 0);
      setNextValue(String(response.data?.counter ?? 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load counter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const seq = Number(nextValue);
      if (!Number.isFinite(seq)) {
        setError('Please enter a valid number.');
        return;
      }
      const response = await adminAPI.updateRegistrationCounter(seq);
      setMessage('Counter updated successfully.');
      setCounter(response.data?.counter ?? seq);
      setMaxUsed(response.data?.maxUsed ?? maxUsed);
      setSuggestedNext(Math.max((response.data?.counter ?? seq) + 1, (response.data?.maxUsed ?? 0) + 1));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update counter.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Registration Counter</h1>
              <p className="text-sm text-slate-500">View and update the registration number counter safely.</p>
            </div>
            <button
              type="button"
              onClick={fetchCounter}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            {loading ? (
              <LoadingSpinner size="sm" text="Loading counter..." />
            ) : (
              <>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="text-slate-500">Current Counter</div>
                    <div className="text-lg font-semibold text-slate-900">{counter ?? 0}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="text-slate-500">Max Used</div>
                    <div className="text-lg font-semibold text-slate-900">{maxUsed ?? 0}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="text-slate-500">Suggested Next</div>
                    <div className="text-lg font-semibold text-slate-900">{suggestedNext ?? 0}</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-600 block mb-2">Set Counter To</label>
                    <input
                      type="number"
                      min={0}
                      value={nextValue}
                      onChange={(event) => setNextValue(event.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 h-10 text-sm w-full"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Counter cannot be set below max used registration number.
                    </p>
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
                    disabled={saving}
                    className="w-full bg-[#005aa9] text-white rounded-xl py-3 font-semibold hover:bg-[#004684] transition-colors"
                  >
                    {saving ? 'Updating...' : 'Update Counter'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterManagementPage;
