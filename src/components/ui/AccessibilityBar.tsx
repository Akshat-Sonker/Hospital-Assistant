'use client';

import React, { useState, useEffect } from 'react';
import { Type, Eye, Volume2, Sparkles, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';

export function AccessibilityBar() {
  const { currentLangObj, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    // Apply font size class to root HTML
    const html = document.documentElement;
    html.classList.remove('text-size-large', 'text-size-xlarge');
    if (fontSize === 'large') html.classList.add('text-size-large');
    if (fontSize === 'xlarge') html.classList.add('text-size-xlarge');
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast class to root HTML
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const handleSelectLang = (code: LanguageCode) => {
    setLanguage(code);
    setShowLangDropdown(false);
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 text-xs flex items-center justify-between gap-2 overflow-x-auto text-slate-300 relative z-40">
      <div className="flex items-center gap-3 shrink-0">
        {/* Global Language Selector Modal / Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 font-bold text-emerald-400 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg hover:border-emerald-500 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
            <span className="text-[10px] text-slate-400 font-normal">({currentLangObj.name})</span>
          </button>

          {/* Quick Language Dropdown Menu */}
          {showLangDropdown && (
            <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 grid grid-cols-1 gap-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800 mb-1">
                {t('choose_language_title')}
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    currentLangObj.code === lang.code
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span className="font-semibold">{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400">({lang.name})</span>
                  </span>
                  {currentLangObj.code === lang.code && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-700">|</span>
        <span className="hidden sm:inline text-slate-400">
          {t('poweredBySarvam')}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Font Scaling Controls */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              fontSize === 'normal'
                ? 'bg-slate-700 font-bold text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Normal Font Size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              fontSize === 'large'
                ? 'bg-slate-700 font-bold text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Large Font Size"
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-2 py-1 rounded text-base transition-colors ${
              fontSize === 'xlarge'
                ? 'bg-slate-700 font-bold text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Extra Large Font Size"
          >
            A++
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            highContrast
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
          title="Toggle High Contrast for low-vision accessibility"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">High Contrast</span>
        </button>
      </div>
    </div>
  );
}
