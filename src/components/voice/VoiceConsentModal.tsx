'use client';

import React from 'react';
import { ShieldCheck, Check, X, Mic } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';

interface VoiceConsentModalProps {
  onConsentGiven: () => void;
  onConsentDenied: () => void;
  doctorName?: string;
}

export const VoiceConsentModal: React.FC<VoiceConsentModalProps> = ({
  onConsentGiven,
  onConsentDenied,
  doctorName = 'Dr. Sharma',
}) => {
  const { speak, startListening } = useVoice();

  React.useEffect(() => {
    speak(
      `डेटा साझाकरण अनुमति: क्या आप ${doctorName} को अपना ABDM मेडिकल इतिहास देखने की अनुमति देते हैं? बोलें: हाँ, मैं अनुमति देता हूँ।`
    );
  }, [doctorName, speak]);

  const handleVoiceConsent = () => {
    startListening((text) => {
      const lower = text.toLowerCase();
      if (lower.includes('yes') || lower.includes('हाँ') || lower.includes('allow') || lower.includes('अनुमति')) {
        speak('अनुमति दर्ज की गई।');
        onConsentGiven();
      } else {
        speak('अनुमति अस्वीकार की गई।');
        onConsentDenied();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-teal-500/50 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center space-x-3 text-teal-400">
          <ShieldCheck size={32} />
          <div>
            <h3 className="text-lg font-bold text-white">Voice Data Consent UI</h3>
            <p className="text-xs text-slate-400">ABDM Health Record Privacy Protocol</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Allow <strong className="text-white">{doctorName}</strong> to view your past medical record for consultation?
        </p>

        <button
          onClick={handleVoiceConsent}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition"
        >
          <Mic size={16} />
          <span>Say &quot;Yes, I allow doctor access&quot; (हाँ अनुमति दें)</span>
        </button>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={onConsentDenied}
            className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
          >
            Deny Access
          </button>
          <button
            onClick={onConsentGiven}
            className="flex-1 py-2.5 bg-teal-500 text-slate-950 rounded-xl font-bold text-xs"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
};
