'use client';

import { useState, useEffect } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { EmergencyRoutingService, HospitalOption } from '@/services/emergencyRouting';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ActionPreviewModal } from '@/components/voice/ActionPreviewModal';
import { ArrowLeft, PhoneCall, ShieldCheck, MapPin, AlertCircle, Navigation, Ambulance, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyRoutingPage() {
  const { speak } = useVoice();
  const [requiredCap, setRequiredCap] = useState<'ICU' | 'Trauma' | 'Burn' | 'Cardiac'>('ICU');
  const [routeResult, setRouteResult] = useState<{
    recommended: HospitalOption;
    options: HospitalOption[];
    disclaimer: string;
  } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadRoutes = async () => {
      const res = await EmergencyRoutingService.calculateEmergencyRoutes({
        patientLatitude: 28.567,
        patientLongitude: 77.208,
        requiredCapability: requiredCap,
      });
      setRouteResult(res);

      const msg = `आपातकालीन मार्ग गणना पूर्ण। ${res.recommended.name} को अनुशंसित किया गया है। ईटीए ${res.recommended.etaMinutes} मिनट है।`;
      speak(msg);
    };

    loadRoutes();
  }, [requiredCap, speak]);

  const handleSelectHospital = (h: HospitalOption) => {
    if (!h.hasCapability || !h.hasBedAvailability) return;
    setSelectedHospital(h);
    setShowConfirmModal(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedHospital) return;
    setShowConfirmModal(false);
    setDispatchStatus(
      `Ambulance Dispatched! Dispatching unit to ${selectedHospital.name} (ETA: ${selectedHospital.etaMinutes} min). Emergency dispatch logged to ERSS-112.`
    );
    speak(
      `एम्बुलेंस सफलतापूर्वक बुक की गई! ${selectedHospital.name} के लिए रवानगी जारी है। ईटीए ${selectedHospital.etaMinutes} मिनट है।`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 pb-36">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between py-4 border-b border-slate-800 mb-8">
        <Link
          href="/"
          className="flex items-center text-slate-400 hover:text-white transition font-medium text-sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 font-extrabold text-sm uppercase tracking-wider">
            ERSS-112 SOS Orchestrator
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-950 to-slate-900 border border-red-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Ambulance size={140} className="text-red-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold text-red-300">
              <PhoneCall size={14} className="text-red-400 animate-pulse" />
              <span>ERSS-112 Emergency Dispatch Layer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Deterministic Emergency Routing
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Routes based on <strong className="text-white">Required Capability + Realtime Bed Availability + Traffic-aware ETA</strong> — never geographic distance alone.
            </p>

            <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl font-mono inline-block">
              ⚠️ {routeResult?.disclaimer || 'Simulated provider network — MVP demo.'}
            </div>
          </div>
        </div>

        {/* Capability Filter Buttons */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Select Required Emergency Capability:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['ICU', 'Trauma', 'Burn', 'Cardiac'] as const).map((cap) => (
              <button
                key={cap}
                onClick={() => setRequiredCap(cap)}
                className={`py-3 px-4 rounded-xl font-black text-sm border transition ${
                  requiredCap === cap
                    ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cap} Capability
              </button>
            ))}
          </div>
        </div>

        {/* Dispatch Confirmation Banner */}
        {dispatchStatus && (
          <div className="p-5 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-200 text-sm font-medium flex items-start space-x-3 shadow-xl">
            <ShieldCheck size={22} className="shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-extrabold text-base text-white">Dispatch Request Confirmed</div>
              <p className="mt-1">{dispatchStatus}</p>
            </div>
          </div>
        )}

        {/* Hospital Options List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Sparkles size={18} className="text-teal-400 mr-2" />
            Ranked Hospital Options (Capability Match)
          </h2>

          <div className="space-y-4">
            {routeResult?.options.map((h) => {
              const isRec = h.id === routeResult.recommended.id;

              return (
                <div
                  key={h.id}
                  className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                    isRec
                      ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border-teal-400/80 ring-2 ring-teal-400/30 shadow-2xl'
                      : h.hasCapability && h.hasBedAvailability
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/30 border-slate-900 opacity-60'
                  }`}
                >
                  {isRec && (
                    <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 px-4 py-1 rounded-bl-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-1 shadow-md">
                      <Sparkles size={12} />
                      <span>Best Matched Option</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-white">{h.name}</h3>
                        <FreshnessBadge customMinutesAgo={h.lastUpdatedMinutesAgo} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1 text-slate-500" />
                          {h.district} ({h.distanceKm} km)
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-300">
                          {h.requiredCapability}: {h.icuBedsAvailable} ICU beds available
                        </span>
                      </div>

                      {/* Bypass Reason Display for Closer Incapable Hospitals */}
                      {h.bypassReason && (
                        <div className="p-2.5 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl flex items-center space-x-2">
                          <AlertCircle size={14} className="shrink-0 text-red-400" />
                          <span>Bypassed: {h.bypassReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Traffic ETA</div>
                        <div className="text-3xl font-black text-teal-300">{h.etaMinutes} <span className="text-xs font-semibold text-slate-400">min</span></div>
                      </div>

                      <button
                        onClick={() => handleSelectHospital(h)}
                        disabled={!h.hasCapability || !h.hasBedAvailability}
                        className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                          h.hasCapability && h.hasBedAvailability
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-teal-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        {h.hasCapability && h.hasBedAvailability ? 'Confirm Dispatch' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Action Preview Modal */}
      {showConfirmModal && selectedHospital && (
        <ActionPreviewModal
          title="Confirm Emergency Dispatch"
          actionDetails={`Dispatching ambulance to ${selectedHospital.name} (${selectedHospital.district}). Traffic ETA is ${selectedHospital.etaMinutes} minutes. ${selectedHospital.icuBedsAvailable} ICU beds confirmed available.`}
          onConfirm={handleConfirmDispatch}
          onCancel={() => setShowConfirmModal(false)}
          confirmLabel="Dispatch Ambulance Now"
        />
      )}

    </div>
  );
}
