'use client';

import { useEffect, useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  Mic,
  User,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Smartphone,
  CreditCard,
  FileText,
  Mail,
  Lock,
  ArrowRight,
  AlertTriangle,
  Globe,
  Volume2,
  CheckCircle2,
  Keyboard,
  ShieldAlert,
} from 'lucide-react';
import { UnifiedAuthService, AuthMethod } from '@/services/unifiedAuth';

export default function EntryGatewayPage() {
  const {
    language,
    setLanguage,
    isLanguageConfirmed,
    confirmLanguageSelection,
    t,
    currentLangObj,
  } = useLanguage();
  const { speak, startListening, voiceState } = useVoice();
  const router = useRouter();

  // Authentication modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState<'patient' | 'doctor'>('patient');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('mobile_otp');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Auto-play JanVaani introduction immediately on load once language is confirmed
  useEffect(() => {
    if (isLanguageConfirmed) {
      speak(t('janvaani_intro'));
    }
  }, [isLanguageConfirmed, language, speak, t]);

  // One-click instant language selection & immediate audio welcome
  const handleLanguagePickAndConfirm = (code: LanguageCode) => {
    confirmLanguageSelection(code);
    speak(t('janvaani_intro'));
  };

  const handleReplayIntro = () => {
    speak(t('janvaani_intro'));
  };

  // Direct 1-Click Navigation to Patient Dashboard
  const handleDirectPatientPortal = () => {
    speak(`${currentLangObj.nativeName} में मरीज़ डैशबोर्ड पर भेजा जा रहा है।`);
    UnifiedAuthService.login({
      method: 'mobile_otp',
      identifier: '9876543210',
      role: 'patient',
    });
    router.push('/dashboard');
  };

  // Direct 1-Click Navigation to Doctor Portal
  const handleDirectDoctorPortal = () => {
    speak('प्रदाता पोर्टल पर भेजा जा रहा है।');
    UnifiedAuthService.login({
      method: 'email',
      identifier: 'doctor@hospital.gov.in',
      role: 'doctor',
    });
    router.push('/admin');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const result = await UnifiedAuthService.login({
        method: authMethod,
        identifier: identifier || '9876543210',
        password,
        role: authRole,
      });

      if (result.success) {
        speak(
          authRole === 'patient'
            ? 'सफलतापूर्वक प्रवेश। मरीज़ डैशबोर्ड पर भेजा जा रहा है।'
            : 'प्रदाता पोर्टल पर भेजा जा रहा है।'
        );
        setShowAuthModal(false);
        if (authRole === 'patient') {
          router.push('/dashboard');
        } else {
          router.push('/admin');
        }
      } else {
        setAuthError('Authentication failed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error authenticating');
    } finally {
      setAuthLoading(false);
    }
  };

  // ─── STEP 1: FIRST SCREEN MUST BE LANGUAGE SELECTION ───────────────────
  if (!isLanguageConfirmed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 pb-24">
        <div className="w-full max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold animate-pulse-soft">
            <Sparkles className="w-4 h-4 text-amber-400" />
            JanVaani • जनवाणी • 23 Languages
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('choose_language_title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Click any language below to start instantly / किसी भी भाषा पर टैप करें
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-4 max-h-[60vh] overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguagePickAndConfirm(lang.code)}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-emerald-400 hover:bg-emerald-950/40 hover:text-white transition-all flex flex-col justify-between h-28 text-left shadow-lg hover:scale-[1.03] active:scale-95 group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-950 font-bold transition-colors">
                    Select →
                  </span>
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight group-hover:text-emerald-300">
                    {lang.nativeName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang.name} • {lang.speakers}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: JANVAANI INTRODUCTION & MAIN GATEWAY ─────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              JV
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight">
                JanVaani <span className="text-emerald-400 text-xs ml-1 font-semibold">v2.0</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                {t('poweredBySarvam')}
              </p>
            </div>
          </div>

          <button
            onClick={() => confirmLanguageSelection('hi-IN')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-500 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">({t('change_language')})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-8 flex-1 flex flex-col justify-center">
        {/* JanVaani Banner Introduction */}
        <div className="janvaani-card bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 border border-emerald-500/40 text-center p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('brandTagline')}
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-snug">
            &ldquo;{t('janvaani_intro')}&rdquo;
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {t('welcomeSubtitle')}
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleReplayIntro}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{t('replay_intro')}</span>
            </button>
          </div>
        </div>

        {/* Primary Role Choice Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Patient Card */}
          <div
            onClick={handleDirectPatientPortal}
            className="janvaani-card hover:border-emerald-500/80 cursor-pointer p-6 space-y-4 group transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                1-Click Direct Access
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t('patientRole')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ओपीडी टोकन बुकिंग, आयुष्मान योजना, एम्बुलेंस सहायता, और ABDM मेडिकल रिकॉर्ड
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>प्रवेश करें (Enter Patient Dashboard) →</span>
            </div>
          </div>

          {/* Provider Card */}
          <div
            onClick={handleDirectDoctorPortal}
            className="janvaani-card hover:border-sky-500/80 cursor-pointer p-6 space-y-4 group transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
                RBAC Access
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                {t('providerRole')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                डॉक्टर टोकन कतार नियंत्रण, अस्पताल बेड, फार्मेसी स्टॉक, लैब और e-RaktKosh
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>पोर्टल खोलें (Open Provider Dashboard) →</span>
            </div>
          </div>
        </div>

        {/* Emergency SOS Shortcut */}
        <div className="text-center pt-2">
          <Link
            href="/emergency"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-red-600/90 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            <span>{t('emergencyButton')}</span>
          </Link>
        </div>
      </main>

      {/* Multi-Method Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="janvaani-card max-w-md w-full p-6 space-y-5 bg-slate-900 border-slate-700 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">
                  {authRole === 'patient' ? t('patientRole') : t('providerRole')} Login
                </h3>
                <p className="text-xs text-slate-400">Select verification method</p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl text-xs font-medium">
              {[
                { id: 'mobile_otp', label: 'Mobile OTP', icon: Smartphone },
                { id: 'abha_id', label: 'ABHA ID', icon: CreditCard },
                { id: 'email', label: 'Email/Pass', icon: Mail },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAuthMethod(id as AuthMethod)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
                    authMethod === id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {authMethod === 'mobile_otp'
                    ? 'Mobile Number (10 digits)'
                    : authMethod === 'abha_id'
                    ? 'ABHA Number / ABHA Address'
                    : 'Email Address'}
                </label>
                <input
                  type={authMethod === 'mobile_otp' ? 'tel' : 'text'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {authMethod === 'email' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50"
              >
                {authLoading ? 'Verifying...' : 'Proceed to Patient Dashboard →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
