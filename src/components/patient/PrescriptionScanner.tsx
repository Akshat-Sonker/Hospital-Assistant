'use client';

import React, { useState } from 'react';
import { Camera, Volume2, BellRing, Sparkles, CheckCircle } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';

export const PrescriptionScanner: React.FC = () => {
  const { speak } = useVoice();
  const [scannedMeds, setScannedMeds] = useState<Array<{ name: string; dosage: string; time: string }> | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const meds = [
        { name: 'Paracetamol 650mg', dosage: '1 tablet after food', time: '8:00 AM & 8:00 PM' },
        { name: 'Amoxicillin 500mg', dosage: '1 capsule', time: '1:00 PM' },
      ];
      setScannedMeds(meds);
      setScanning(false);

      speak('पर्चे का स्कैन पूरा हुआ। आपकी दो दवाएं पाई गईं। पैरासिटामोल सुबह 8 बजे और शाम 8 बजे लें।');
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-white flex items-center">
            <Camera size={18} className="text-teal-400 mr-2" />
            OCR Prescription Scanner & Reminders
          </h3>
          <p className="text-xs text-slate-400">Scan physical doctor prescription for voice medicine reminders</p>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2"
        >
          {scanning ? (
            <span>Scanning...</span>
          ) : (
            <>
              <Camera size={14} />
              <span>Scan Prescription</span>
            </>
          )}
        </button>
      </div>

      {scannedMeds && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center">
            <Sparkles size={14} className="mr-1" />
            Extracted Medicine Schedule (Voice Alert Active)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scannedMeds.map((med, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white">{med.name}</div>
                <div className="text-slate-400">{med.dosage}</div>
                <div className="text-teal-400 font-semibold flex items-center">
                  <BellRing size={12} className="mr-1" />
                  {med.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
