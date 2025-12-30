import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Camera,
  SwitchCamera,
  ListChecks,
} from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';

let audioContext = null;
const getAudioContext = () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
};

const playBeep = (freq = 800, dur = 200, type = 'sine') => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur / 1000);
    osc.start();
    osc.stop(ctx.currentTime + dur / 1000);
  } catch (e) {}
};

const vibrate = (pattern) => 'vibrate' in navigator && navigator.vibrate(pattern);

const triggerPendingFeedback = () => {
  vibrate(100);
  playBeep(900, 100, 'sine');
};

const triggerSuccessFeedback = () => {
  vibrate([200, 100, 200]);
  playBeep(1200, 150, 'square');
  setTimeout(() => playBeep(1500, 200, 'square'), 200);
};

const triggerErrorFeedback = () => {
  vibrate(500);
  playBeep(300, 600, 'sawtooth');
};

const QrScanner = () => {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const [modalState, setModalState] = useState({
    show: false,
    type: null,
    registration: null,
    error: { title: '', desc: '' },
    scannedCode: '',
    scannerKey: 0,
  });
  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const isScanning = useRef(false);
  const autoCloseTimeout = useRef(null);

  // TEST mode state
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [testRegId, setTestRegId] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  const { show, type, registration, error, scannedCode, scannerKey } = modalState;

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {}
      scannerRef.current = null;
      return true;
    }
    return false;
  }, []);

  const startScanner = useCallback(
    async (cameraId) => {
      if (!containerRef.current) return;
      await stopScanner();

      const idToUse = cameraId || currentCameraId;
      if (!idToUse) return;

      const scanner = new Html5Qrcode('qr-reader');
      try {
        await scanner.start(
          idToUse,
          { fps: 8, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
          (decodedText) => {
            if (isScanning.current || show) return;
            isScanning.current = true;
            handleScan(decodedText).finally(() => {
              isScanning.current = false;
            });
          },
          () => {}
        );
        scannerRef.current = scanner;
      } catch (err) {
        console.error('Camera error:', err);
      }
    },
    [stopScanner, currentCameraId, show]
  );

  const handleScan = async (code) => {
    const qr = code.trim();
    if (!qr) return;

    await stopScanner();

    try {
      console.log('🔍 Checking QR:', qr);
      
      // Step 1: Check QR validity
      const checkRes = await fetch('https://aoa-backend.onrender.com/api/attendance/scan/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ qrCode: qr }),
      });
      const checkData = await checkRes.json();

      console.log('✅ Check response:', checkData);

      if (!checkData.valid) {
        throw new Error(checkData.message || checkData.reason || 'Invalid QR');
      }

      // Step 2: Auto-mark entry (1 person by default)
      console.log('🎯 Auto-marking entry for:', checkData.registration.userId.name);
      
      const markRes = await fetch('https://aoa-backend.onrender.com/api/attendance/scan/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          qrCode: qr,
          count: 1,
          location: 'Main Gate',
          notes: 'Auto entry - 1 person',
        }),
      });
      const markData = await markRes.json();

      console.log('🎉 Mark response:', markData);

      // Step 3: Show success for 2 seconds
      setModalState({
        show: true,
        type: 'success',
        registration: checkData.registration,
        error: { title: markData.message || 'Entry marked!', desc: '' },
        scannedCode: qr,
        scannerKey: scannerKey,
      });
      triggerSuccessFeedback();
      autoCloseTimeout.current = setTimeout(closeModal, 2000);

    } catch (err) {
      console.error('❌ Scan error:', err);
      setModalState({
        show: true,
        type: 'error',
        registration: null,
        error: {
          title: err.message || 'Invalid QR Code',
          desc: 'Registration not found or deactivated',
        },
        scannedCode: qr,
        scannerKey: scannerKey,
      });
      triggerErrorFeedback();
      autoCloseTimeout.current = setTimeout(closeModal, 3000);
    }
  };

  const closeModal = useCallback(() => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
      autoCloseTimeout.current = null;
    }
    setModalState((prev) => ({
      ...prev,
      show: false,
      type: null,
      registration: null,
      scannedCode: '',
      scannerKey: prev.scannerKey + 1,
    }));
  }, []);

  useEffect(() => {
    const initCameras = async () => {
      try {
        const cams = await Html5Qrcode.getCameras();
        setAvailableCameras(cams);
        if (cams.length > 0) {
          const frontCam = cams.find((c) => c.label.toLowerCase().includes('front')) || cams[0];
          setCurrentCameraId(frontCam.id);
        }
      } catch (err) {
        console.error('Camera init error:', err);
      }
    };
    initCameras();
  }, []);

  useEffect(() => {
    if (currentCameraId && !show) {
      startScanner(currentCameraId);
    }
    return () => {
      stopScanner();
      if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
    };
  }, [currentCameraId, scannerKey, startScanner, stopScanner, show]);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const res = await fetch('https://aoa-backend.onrender.com/api/admin/registrations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setAllRegistrations(data || []);
      } catch (e) {
        console.error('Test registrations fetch failed', e);
      }
    };
    fetchRegs();
  }, []);

  const handleTestScan = async () => {
    if (!testRegId) return;
    const reg = allRegistrations.find((r) => r._id === testRegId);
    if (!reg?.registrationNumber) {
      alert('No registration number found');
      return;
    }

    console.log('🧪 Testing with QR:', reg.registrationNumber);
    setTestLoading(true);
    await handleScan(reg.registrationNumber);
    setTestLoading(false);
  };

  const getRoleText = (role) => {
    const texts = {
      AOA: 'AOA Member',
      NON_AOA: 'Non-Member',
      PGS: 'PGS/Fellow',
    };
    return texts[role] || role;
  };

  return (
   <div className="flex h-screen bg-slate-50">
    <Sidebar/>
     <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-auto">
      {}
      <header className="bg-white border-b border-slate-200 px-4 py-4 ">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">AOACON 2026 Attendance scanner</h1>
            <p className="text-sm text-slate-600">Attendance with QR ID</p>
          </div>
          <div className="flex items-center gap-2">
            {availableCameras.length > 1 && (
              <button
                onClick={() => {
                  const idx = availableCameras.findIndex((c) => c.id === currentCameraId);
                  const nextCam = availableCameras[(idx + 1) % availableCameras.length].id;
                  setCurrentCameraId(nextCam);
                }}
                className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-all"
              >
                <SwitchCamera className="w-5 h-5 text-emerald-700" />
              </button>
            )}
          </div>
        </div>
      </header>

      {}
      <section className="px-4 pt-3 pb-2">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl px-3 py-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {}
          <div className="flex-1 flex gap-2">
            <select
              value={testRegId}
              onChange={(e) => setTestRegId(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white text-slate-700 focus:ring-1 focus:ring-emerald-400"
              disabled={testLoading}
            >
                {}
              <option value="">Select </option>
              {allRegistrations.slice(0, 50).map((r) => (
                <option key={r._id} value={r._id}>
                  {r.registrationNumber} – {r.userId?.name?.substring(0, 20)}
                </option>
              ))}
            </select>
            <button
              onClick={handleTestScan}
              disabled={!testRegId || testLoading}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-500 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all flex-shrink-0"
            >
              {}
              {testLoading ? 'Scanning...' : 'check'}
            </button>
          </div>
        </div>
      </section>

      {}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              {}
              <h2 className="text-base font-semibold text-slate-900 mb-1">Auto Attendance</h2>
              <p className="text-xs text-slate-600">Place middle camera to qr code to scan</p>
            </div>
            <div className="relative bg-slate-900 p-2">
              <div id="qr-reader" ref={containerRef} className="w-full h-64 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-44 h-44 border-4 border-emerald-500 rounded-2xl" />
                <div className="absolute w-44 h-44 border-4 border-emerald-400 rounded-2xl animate-ping opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 max-h-[85vh] overflow-y-auto shadow-xl">
            {type === 'success' && (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto animate-bounce" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-emerald-600 mb-1">Entry Marked!</h2>
                  <p className="text-sm text-slate-700">{registration?.userId?.name}</p>
                  <p className="text-xs text-slate-500">1 person checked in</p>
                </div>
                <div className="text-xs text-slate-600 animate-pulse">Ready for next scan...</div>
              </div>
            )}

            {type === 'error' && (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-600">{error.title}</h3>
                  {error.desc && <p className="text-sm text-red-500">{error.desc}</p>}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition-all"
            >
              <XCircle className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
   </div>
  );
};

export default QrScanner;
