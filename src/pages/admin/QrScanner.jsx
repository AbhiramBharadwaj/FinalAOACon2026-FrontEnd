import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  SwitchCamera,
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

const WORKSHOP_LABELS = {
  'labour-analgesia': 'Labour Analgesia',
  'critical-incidents': 'Critical Incidents in Obstetric Anaesthesia',
  pocus: 'POCUS in Obstetrics',
  'maternal-collapse': 'Maternal Resuscitation',
  'critical-incidents-ob-anaesthesia': 'Critical Incidents in Obstetric Anaesthesia',
  'pocus-regional-anaesthesia-obstetrics': 'POCUS in Obstetrics',
  'maternal-resuscitation': 'Maternal Resuscitation',
};

const SUCCESS_MODAL_SECONDS = 6;
const ERROR_MODAL_SECONDS = 4;

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
  const [countdown, setCountdown] = useState(0);
  const [undoing, setUndoing] = useState(false);
  const isScanning = useRef(false);
  const autoCloseTimeout = useRef(null);
  const countdownInterval = useRef(null);

  const { show, type, registration, error, scannedCode, scannerKey } = modalState;

  const clearModalTimers = useCallback(() => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
      autoCloseTimeout.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, []);

  const startModalTimer = useCallback((seconds) => {
    clearModalTimers();
    setCountdown(seconds);
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    autoCloseTimeout.current = setTimeout(closeModal, seconds * 1000);
  }, [clearModalTimers]);

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
      const checkRes = await fetch('https://api.aoacon2026.com/api/attendance/scan/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ qrCode: qr }),
      });
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.valid) {
        throw new Error(checkData.message || checkData.reason || 'Invalid QR');
      }

      if (checkData.alreadyScanned) {
        showAlreadyCheckedIn(checkData, qr);
        return;
      }
      
      const markRes = await fetch('https://api.aoacon2026.com/api/attendance/scan/mark', {
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

      if (!markRes.ok || markData.code === 'ALREADY_CHECKED_IN' || markData.alreadyScanned) {
        if (markData.code === 'ALREADY_CHECKED_IN' || markRes.status === 409) {
          showAlreadyCheckedIn(markData, qr);
          return;
        }
        throw new Error(markData.message || markData.reason || 'Attendance could not be marked');
      }

      setModalState({
        show: true,
        type: 'success',
        registration: markData.registration || checkData.registration,
        error: { title: markData.message || 'Entry marked!', desc: '' },
        scannedCode: qr,
        scannerKey: scannerKey,
      });
      triggerSuccessFeedback();
      startModalTimer(SUCCESS_MODAL_SECONDS);

    } catch (err) {
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
      startModalTimer(ERROR_MODAL_SECONDS);
    }
  };

  const showAlreadyCheckedIn = (data, qr) => {
    const firstScan = formatScanTime(data.firstScannedAt || data.scanHistory?.[0]?.scannedAt);

    setModalState({
      show: true,
      type: 'warning',
      registration: data.registration || null,
      error: {
        title: data.message || 'Already checked in',
        desc: firstScan ? `First scan: ${firstScan}` : 'This QR was already used for entry.',
      },
      scannedCode: qr,
      scannerKey: scannerKey,
    });
    triggerPendingFeedback();
    startModalTimer(SUCCESS_MODAL_SECONDS);
  };

  const closeModal = useCallback(() => {
    clearModalTimers();
    setCountdown(0);
    setUndoing(false);
    setModalState((prev) => ({
      ...prev,
      show: false,
      type: null,
      registration: null,
      scannedCode: '',
      scannerKey: prev.scannerKey + 1,
    }));
  }, [clearModalTimers]);

  const handleUndoScan = async () => {
    if (!scannedCode || undoing) return;

    clearModalTimers();
    setUndoing(true);

    try {
      const res = await fetch('https://api.aoacon2026.com/api/attendance/scan/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ qrCode: scannedCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Scan could not be undone');
      }

      setModalState((prev) => ({
        ...prev,
        type: 'warning',
        registration: data.registration || prev.registration,
        error: {
          title: 'Scan undone',
          desc: 'This attendee is not marked checked in now.',
        },
      }));
      triggerPendingFeedback();
      startModalTimer(ERROR_MODAL_SECONDS);
    } catch (err) {
      setModalState((prev) => ({
        ...prev,
        type: 'error',
        error: {
          title: err.message || 'Undo failed',
          desc: 'Please check attendance manually before scanning again.',
        },
      }));
      triggerErrorFeedback();
      startModalTimer(ERROR_MODAL_SECONDS + 1);
    } finally {
      setUndoing(false);
    }
  };

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
    };
  }, [currentCameraId, scannerKey, startScanner, stopScanner, show]);

  useEffect(() => () => {
    clearModalTimers();
  }, [clearModalTimers]);

  const getRoleText = (role) => {
    const texts = {
      AOA: 'AOA Member',
      NON_AOA: 'Non-Member',
      PGS: 'PGS/Fellow',
    };
    return texts[role] || role;
  };

  const getPackageText = (reg) => {
    if (!reg) return 'N/A';
    const labels = ['Conference'];
    if (reg.addWorkshop || reg.selectedWorkshop) {
      labels.push(`Workshop${reg.selectedWorkshop ? ` - ${WORKSHOP_LABELS[reg.selectedWorkshop] || reg.selectedWorkshop}` : ''}`);
    }
    if (reg.addAoaCourse) labels.push('AOA Certified Course');
    if (reg.addLifeMembership) labels.push('AOA Life Membership');
    return labels.join(' + ');
  };

  const formatScanTime = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <p className="text-sm text-slate-600">Scan delegate QR codes and mark first entry.</p>
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
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              {}
              <h2 className="text-base font-semibold text-slate-900 mb-1">Auto Attendance</h2>
              <p className="text-xs text-slate-600">Center the delegate QR code inside the frame.</p>
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
                  <p className="text-xs text-slate-500">{registration?.registrationNumber}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-left text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-800">{getRoleText(registration?.userId?.role)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Package</span>
                    <span className="font-medium text-slate-800 text-right">{getPackageText(registration)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleUndoScan}
                    disabled={undoing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {undoing ? 'Undoing...' : 'Wrong person? Undo'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Looks right
                  </button>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                  Auto-closes in {countdown}s
                </div>
              </div>
            )}

            {type === 'warning' && (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <Clock className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-amber-600">{error.title}</h3>
                  {error.desc && <p className="text-sm text-amber-700">{error.desc}</p>}
                </div>
                {registration && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-left text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Name</span>
                      <span className="font-medium text-slate-800 text-right">{registration.userId?.name}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Reg No</span>
                      <span className="font-medium text-slate-800">{registration.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Package</span>
                      <span className="font-medium text-slate-800 text-right">{getPackageText(registration)}</span>
                    </div>
                  </div>
                )}
                <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                  Auto-closes in {countdown}s
                </div>
              </div>
            )}

            {type === 'error' && (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-600">{error.title}</h3>
                  {error.desc && <p className="text-sm text-red-500">{error.desc}</p>}
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                  Auto-closes in {countdown}s
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
