'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Check, X } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';

interface ActionPreviewModalProps {
  title: string;
  actionDetails: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ActionPreviewModal: React.FC<ActionPreviewModalProps> = ({
  title,
  actionDetails,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm & Execute Action (पुष्टि करें)',
  cancelLabel = 'Cancel (रद्द करें)',
}) => {
  const { speak } = useVoice();

  React.useEffect(() => {
    speak(`कृपया कार्य की पुष्टि करें: ${title}. ${actionDetails}`);
  }, [title, actionDetails, speak]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-teal-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center space-x-3 text-teal-400">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">JanVaani Safety & Confirmation Gateway</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 leading-relaxed font-sans">
          <p className="text-slate-300 mb-2 font-medium">{actionDetails}</p>
          <div className="flex items-center space-x-2 text-amber-400 text-xs mt-3 pt-3 border-t border-slate-800">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Deterministic engine requires explicit user confirmation before state changes.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition flex items-center justify-center space-x-2 border border-slate-700 text-sm"
          >
            <X size={16} />
            <span>{cancelLabel}</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold rounded-xl transition shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 text-sm"
          >
            <Check size={18} />
            <span>{confirmLabel}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
