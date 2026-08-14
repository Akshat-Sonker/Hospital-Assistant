'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Keyboard, Volume2, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { SarvamVoiceClient } from '@/services/sarvamVoiceClient';

export type FieldContext = 'name' | 'mobile' | 'age' | 'symptoms' | 'doctor' | 'address' | 'generic';

interface FieldVoiceInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  fieldContext?: FieldContext;
  required?: boolean;
  type?: 'text' | 'tel' | 'number' | 'textarea';
  rows?: number;
}

export function FieldVoiceInput({
  label,
  value,
  onChange,
  placeholder,
  fieldContext = 'generic',
  required = false,
  type = 'text',
  rows = 3,
}: FieldVoiceInputProps) {
  const { language, t } = useLanguage();
  const { speak } = useVoice();

  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastSpeechRaw, setLastSpeechRaw] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [recognitionRef, setRecognitionRef] = useState<any>(null);

  // Stop listening when unmounted or field context changes
  useEffect(() => {
    return () => {
      if (recognitionRef) {
        try {
          recognitionRef.stop();
        } catch (_) {}
      }
    };
  }, [recognitionRef]);

  // Extract structured data based on field context
  const processFieldSpeech = (rawText: string, context: FieldContext): string => {
    let cleaned = rawText.trim();

    if (context === 'mobile') {
      // Extract digits only for mobile number
      const digits = cleaned.replace(/\D/g, '');
      if (digits.length >= 10) {
        return digits.slice(-10);
      }
      return digits || cleaned;
    }

    if (context === 'age') {
      // Extract age number
      const digits = cleaned.replace(/\D/g, '');
      if (digits) {
        const num = parseInt(digits, 10);
        if (num > 0 && num < 120) return num.toString();
      }
      return digits || cleaned;
    }

    if (context === 'name') {
      // Strip common prefixes like "mera naam hai", "my name is", "naam"
      cleaned = cleaned
        .replace(/^(मेरा नाम|मेरा नाम है|my name is|naam|name is)\s+/i, '')
        .trim();
      return cleaned;
    }

    if (context === 'symptoms') {
      cleaned = cleaned
        .replace(/^(मुझे|मुझे समस्या है|i have|symptoms are)\s+/i, '')
        .trim();
      return cleaned;
    }

    return cleaned;
  };

  const startFieldListening = () => {
    setVoiceError(null);
    setInterimTranscript('');
    setLastSpeechRaw('');
    setIsListening(true);
    setInputMode('voice');

    speak(t('listenPrompt'));

    const recognition = SarvamVoiceClient.createSpeechRecognition(
      language,
      (transcript, isFinal) => {
        setInterimTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setLastSpeechRaw(transcript);
          const parsed = processFieldSpeech(transcript, fieldContext);
          onChange(parsed);
          setIsListening(false);
          speak(`दर्ज किया गया: ${parsed}`);
        }
      },
      (err) => {
        console.warn(`[FieldVoiceInput] Recognition error for field ${label}:`, err);
        setVoiceError(t('voice_unavailable_msg'));
        setIsListening(false);
        setInputMode('text'); // Automatic fallback to text mode
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognition) {
      setRecognitionRef(recognition);
      try {
        recognition.start();
      } catch (e) {
        console.warn('Failed to start recognition:', e);
        setVoiceError(t('voice_unavailable_msg'));
        setIsListening(false);
        setInputMode('text');
      }
    } else {
      setVoiceError(t('voice_unavailable_msg'));
      setIsListening(false);
      setInputMode('text');
    }
  };

  const stopFieldListening = () => {
    if (recognitionRef) {
      try {
        recognitionRef.stop();
      } catch (_) {}
    }
    setIsListening(false);
  };

  return (
    <div className="space-y-1.5">
      {/* Label and Dual-Mode Toggle Bar */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={startFieldListening}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              inputMode === 'voice' || isListening
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Speak into microphone"
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-slate-950' : ''}`} />
            <span>{t('speak_option')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopFieldListening();
              setInputMode('text');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              inputMode === 'text' && !isListening
                ? 'bg-slate-700 text-slate-100 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Type using keyboard"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{t('type_option')}</span>
          </button>
        </div>
      </div>

      {/* Voice listening active indicator */}
      {isListening && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 animate-pulse flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>
              {t('listening')} {interimTranscript && `"${interimTranscript}"`}
            </span>
          </div>
          <button
            type="button"
            onClick={stopFieldListening}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
          >
            Done
          </button>
        </div>
      )}

      {/* Speech transcription feedback badge */}
      {lastSpeechRaw && !isListening && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400">{t('you_said')}:</span>
          <span className="font-semibold text-emerald-300">&ldquo;{lastSpeechRaw}&rdquo;</span>
        </div>
      )}

      {/* Error message / Fallback message */}
      {voiceError && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Field Input (always visible and editable) */}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || t('type_or_speak_placeholder')}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || t('type_or_speak_placeholder')}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        )}

        {/* Quick inline mic button */}
        <button
          type="button"
          onClick={isListening ? stopFieldListening : startFieldListening}
          className={`absolute right-2.5 ${type === 'textarea' ? 'top-3' : 'top-1/2 -translate-y-1/2'} p-1.5 rounded-lg transition-colors ${
            isListening
              ? 'bg-amber-500 text-slate-950 animate-pulse'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
          }`}
          title="Speak for this field"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
