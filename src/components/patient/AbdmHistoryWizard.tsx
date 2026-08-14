'use client';

import React, { useState } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { Mic, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface AbdmHistoryWizardProps {
  onComplete: (historyJson: any) => void;
}

export const AbdmHistoryWizard: React.FC<AbdmHistoryWizardProps> = ({ onComplete }) => {
  const { speak, startListening, voiceState, transcript } = useVoice();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    conditions: '',
    allergies: '',
    currentMeds: '',
  });

  const questions = [
    {
      key: 'conditions',
      prompt: 'क्या आपको कोई पुरानी बीमारी है? जैसे शुगर, बीपी, या अस्थमा? बोलकर बताएं।',
      fieldLabel: 'Existing Conditions (पुरानी बीमारियां)',
    },
    {
      key: 'allergies',
      prompt: 'क्या आपको किसी दवाई से एलर्जी है? बोलकर बताएं।',
      fieldLabel: 'Known Allergies (दवाई एलर्जी)',
    },
    {
      key: 'currentMeds',
      prompt: 'आप अभी कौन सी दवाएं ले रहे हैं? बोलकर बताएं।',
      fieldLabel: 'Current Medications (वर्तमान दवाएं)',
    },
  ];

  const currentQ = questions[step];

  const handleStartQuestion = () => {
    speak(currentQ.prompt, () => {
      startListening((text) => {
        setAnswers((prev) => ({ ...prev, [currentQ.key]: text }));
      });
    });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      speak('धन्यवाद! आपका स्वास्थ्य रिकॉर्ड तैयार है।', () => {
        onComplete(answers);
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Guided Voice Profile Wizard</h3>
          <p className="text-xs text-slate-400">Step {step + 1} of {questions.length} · No Reading or Typing Required</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="text-sm font-bold text-teal-300">{currentQ.fieldLabel}</div>
        <p className="text-slate-200 text-sm">{currentQ.prompt}</p>

        <button
          onClick={handleStartQuestion}
          className="mt-3 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition"
        >
          <Mic size={16} />
          <span>Listen & Speak Answer (उत्तर दें)</span>
        </button>

        {transcript && (
          <div className="mt-3 p-3 bg-slate-900 rounded-xl text-xs text-teal-200 border border-teal-500/30">
            <strong>Recorded Voice Answer:</strong> &quot;{transcript}&quot;
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl text-sm flex items-center space-x-2 shadow-lg"
        >
          <span>{step < questions.length - 1 ? 'Next Question' : 'Save Voice Profile'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
