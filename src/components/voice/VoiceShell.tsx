'use client';

import React from 'react';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/LanguageContext';
import { Mic, MicOff, Volume2, VolumeX, Globe, Sparkles } from 'lucide-react';

export const VoiceShell: React.FC = () => {
  const { voiceState, transcript, assistantText, startListening, stopListening, stopSpeaking } =
    useVoice();
  const { language, setLanguage, currentLangObj, isLanguageConfirmed } = useLanguage();

  const handleMicClick = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else if (voiceState === 'speaking') {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  // Do not render floating bar over the initial language selection modal until language is chosen
  if (!isLanguageConfirmed) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl rounded-2xl p-3.5 text-white flex flex-col space-y-2.5 transition-all duration-300">
        
        {/* Assistant status text & spoken prompt */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  voiceState === 'listening'
                    ? 'bg-red-400'
                    : voiceState === 'speaking'
                    ? 'bg-emerald-400'
                    : voiceState === 'processing'
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  voiceState === 'listening'
                    ? 'bg-red-500'
                    : voiceState === 'speaking'
                    ? 'bg-emerald-500'
                    : voiceState === 'processing'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </span>

            <span className="uppercase tracking-widest text-slate-300 text-xs font-bold">
              {voiceState === 'listening' && 'Listening... (बोलिए)'}
              {voiceState === 'speaking' && 'Speaking (जनवाणी बोल रही है)'}
              {voiceState === 'processing' && 'Understanding Intent...'}
              {voiceState === 'idle' && 'JanVaani Voice Ready (वॉइस एक्टिव)'}
            </span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
            <Globe size={14} className="text-emerald-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-semibold"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live speech feedback display */}
        {(transcript || assistantText) && (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs sm:text-sm leading-relaxed text-slate-200 font-sans">
            {voiceState === 'listening' && transcript && (
              <p className="text-red-300 animate-pulse">
                &quot;{transcript}&quot;
              </p>
            )}
            {assistantText && (
              <p className="text-emerald-200 flex items-start space-x-2">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{assistantText}</span>
              </p>
            )}
          </div>
        )}

        {/* Mic action button bar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Voice-First Interface • {currentLangObj.nativeName}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">
            {voiceState === 'speaking' && (
              <button
                onClick={stopSpeaking}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition"
              >
                <VolumeX size={14} />
                <span>Mute TTS</span>
              </button>
            )}

            <button
              onClick={handleMicClick}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                voiceState === 'listening'
                  ? 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/30'
                  : voiceState === 'speaking'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black'
              }`}
            >
              {voiceState === 'listening' ? (
                <>
                  <MicOff size={18} className="animate-bounce" />
                  <span>Stop Listening</span>
                </>
              ) : voiceState === 'speaking' ? (
                <>
                  <Volume2 size={18} className="animate-pulse" />
                  <span>Speaking...</span>
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span>Tap to Speak (बोलें)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
