'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { getUserRole } from '@/utils/supabase/auth';
import { useRouter } from 'next/navigation';
import { useVoice } from '@/context/VoiceContext';
import { useLanguage } from '@/context/LanguageContext';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { PrescriptionScanner } from '@/components/patient/PrescriptionScanner';
import { AbdmHistoryWizard } from '@/components/patient/AbdmHistoryWizard';
import { AbdmClientService, MedicalRecord } from '@/services/abdmClient';
import { WelfareEngine, SchemeEligibilityResult } from '@/services/welfareEngine';
import { WelfareSchemeMatcher } from '@/components/patient/WelfareSchemeMatcher';
import { VoiceConsentModal } from '@/components/voice/VoiceConsentModal';
import {
  User,
  LogOut,
  Clock,
  Activity,
  CalendarDays,
  ChevronRight,
  AlertCircle,
  Users,
  Building2,
  FileText,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface ExtendedDoctor {
  id: string;
  name: string;
  department: string;
  hospital_id?: string;
  hospital_name?: string;
  is_available: boolean; // Controls "Accepting new tokens"
  room_number?: string;
}

interface QueueCount {
  [doctorId: string]: number;
}

const DEFAULT_MOCK_DOCTORS: ExtendedDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    department: 'General Medicine',
    hospital_name: 'AIIMS New Delhi',
    is_available: true,
    room_number: 'OPD-101',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    department: 'Pediatrics',
    hospital_name: 'Safdarjung Hospital',
    is_available: true,
    room_number: 'OPD-204',
  },
  {
    id: 'doc-3',
    name: 'Dr. Amit Verma',
    department: 'Dermatology',
    hospital_name: 'RML Hospital',
    is_available: false, // PAUSED for offline test
    room_number: 'OPD-305',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sunita Rao',
    department: 'Dermatology',
    hospital_name: 'RML Hospital',
    is_available: true, // Available alternative
    room_number: 'OPD-306',
  },
];

export default function PatientDashboardPage() {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const router = useRouter();

  const [doctors, setDoctors] = useState<ExtendedDoctor[]>(DEFAULT_MOCK_DOCTORS);
  const [queueCounts, setQueueCounts] = useState<QueueCount>({
    'doc-1': 4,
    'doc-2': 2,
    'doc-3': 8,
    'doc-4': 1,
  });
  const [loading, setLoading] = useState(false); // Immediate load!
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>({ email: 'citizen@janvaani.gov.in', id: 'mock_patient_123' });

  // ABDM & Welfare State
  const [abdmProfile, setAbdmProfile] = useState<MedicalRecord | null>(null);
  const [showVoiceWizard, setShowVoiceWizard] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingBookDoctor, setPendingBookDoctor] = useState<ExtendedDoctor | null>(null);

  useEffect(() => {
    // Load ABDM sandbox history
    AbdmClientService.fetchMedicalHistory('ABHA-9876-5432-1098').then((abdm) => {
      if (abdm) setAbdmProfile(abdm);
    });
  }, []);

  const handleBookClick = (doctor: ExtendedDoctor) => {
    if (!doctor.is_available) {
      // Find alternative doctor in the same department
      const altDoctor = doctors.find(
        (d) => d.department === doctor.department && d.is_available && d.id !== doctor.id
      );

      speak(
        t('doctorPausedMsg', { doctor: doctor.name, dept: doctor.department })
      );

      if (altDoctor) {
        setPendingBookDoctor(altDoctor);
      }
      return;
    }

    // Doctor is available -> Navigate to booking page
    router.push(`/dashboard/book/${doctor.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('patientRole')}
          </div>
          <h1 className="text-2xl font-extrabold text-white">JanVaani Health Portal</h1>
          <p className="text-xs text-slate-400">Welcome, {user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/my-token"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Clock className="w-4 h-4" />
            <span>{t('myTokens')}</span>
          </Link>
          <Link
            href="/emergency"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white text-xs transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS (112)</span>
          </Link>
        </div>
      </div>

      {/* Welfare Scheme Matcher */}
      <WelfareSchemeMatcher />

      {/* ABDM Profile Summary Card */}
      {abdmProfile && (
        <div className="janvaani-card bg-slate-900/80 border-slate-800 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                ABDM
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{abdmProfile.patientName}</h3>
                <p className="text-xs text-slate-400">ABHA ID: {abdmProfile.abhaId}</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-semibold">
              Blood: {abdmProfile.bloodGroup}
            </span>
          </div>

          <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-200">Conditions: {abdmProfile.conditions.join(', ')}</p>
            <p className="text-slate-400 mt-1">Allergies: {abdmProfile.allergies.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Prescription Scanner Component */}
      <PrescriptionScanner />

      {/* OPD Doctor Queue Locator */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">OPD Queue & Doctor Availability</h2>
            <p className="text-xs text-slate-400">Hierarchical Department & Doctor Queue Controls</p>
          </div>
          <FreshnessBadge status="LIVE" lastUpdated="Just now" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {doctors.map((doc) => {
            const count = queueCounts[doc.id] || 0;
            return (
              <div
                key={doc.id}
                className={`janvaani-card space-y-3 border transition-all ${
                  !doc.is_available
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{doc.name}</h3>
                    <p className="text-xs text-emerald-400 font-semibold">{doc.department}</p>
                    <p className="text-xs text-slate-400">{doc.hospital_name} • {doc.room_number}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      doc.is_available
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                    }`}
                  >
                    {doc.is_available ? t('acceptingTokens') : t('offline')}
                  </span>
                </div>

                {!doc.is_available ? (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 space-y-2">
                    <p className="font-semibold">
                      {t('doctorPausedMsg', { doctor: doc.name, dept: doc.department })}
                    </p>
                    <button
                      onClick={() => handleBookClick(doc)}
                      className="text-xs font-bold text-emerald-400 underline hover:text-emerald-300 text-left block"
                    >
                      {t('suggestAlternative', { altDoctor: 'Dr. Sunita Rao' })} →
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
                    <div className="text-slate-300">
                      <span>{t('patients_ahead')}: </span>
                      <strong className="text-amber-400 text-sm">{count}</strong>
                    </div>

                    <button
                      onClick={() => handleBookClick(doc)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs transition-colors shadow-md shadow-emerald-500/20"
                    >
                      {t('bookToken')} →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
