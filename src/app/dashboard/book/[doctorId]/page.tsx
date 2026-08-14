'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useVoice } from '@/context/VoiceContext';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ActionPreviewModal } from '@/components/voice/ActionPreviewModal';
import { FieldVoiceInput } from '@/components/patient/FieldVoiceInput';
import { ArrowLeft, Calendar, Clock, Stethoscope, User, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface DoctorDetail {
  id: string;
  name: string;
  department: string;
  hospital: string;
  isAcceptingTokens: boolean;
  currentQueueLength: number;
  estWaitPerPatientMinutes: number;
}

const MOCK_DOCTORS: Record<string, DoctorDetail> = {
  'doc-1': {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    department: 'General Medicine',
    hospital: 'AIIMS New Delhi',
    isAcceptingTokens: true,
    currentQueueLength: 4,
    estWaitPerPatientMinutes: 12,
  },
  'doc-2': {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    department: 'Pediatrics',
    hospital: 'Safdarjung Hospital',
    isAcceptingTokens: true,
    currentQueueLength: 2,
    estWaitPerPatientMinutes: 15,
  },
  'doc-3': {
    id: 'doc-3',
    name: 'Dr. Amit Verma',
    department: 'Dermatology',
    hospital: 'RML Hospital',
    isAcceptingTokens: false, // Paused/Offline
    currentQueueLength: 8,
    estWaitPerPatientMinutes: 10,
  },
  'doc-4': {
    id: 'doc-4',
    name: 'Dr. Sunita Rao',
    department: 'Dermatology',
    hospital: 'RML Hospital',
    isAcceptingTokens: true,
    currentQueueLength: 1,
    estWaitPerPatientMinutes: 10,
  },
};

export default function BookTokenPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = (params.doctorId as string) || 'doc-1';
  const { t, language } = useLanguage();
  const { speak } = useVoice();

  const doctor = MOCK_DOCTORS[doctorId] || MOCK_DOCTORS['doc-1'];

  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [assignedToken, setAssignedToken] = useState<string | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    if (!doctor.isAcceptingTokens) {
      speak(
        t('doctorPausedMsg', {
          doctor: doctor.name,
          dept: doctor.department,
        })
      );
      return;
    }

    setShowConfirmationModal(true);
  };

  const executeBooking = () => {
    setShowConfirmationModal(false);
    const tokenNum = `JV-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignedToken(tokenNum);
    setBookingSuccess(true);

    speak(
      `आपका टोकन नंबर ${tokenNum} सफलतापूर्वक बुक हो गया है। डॉक्टर ${doctor.name} के पास कतार में आपका स्थान दर्ज है।`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{t('bookToken')}</h1>
          <p className="text-xs text-slate-400">JanVaani Direct OPD Booking</p>
        </div>
      </div>

      {bookingSuccess ? (
        <div className="janvaani-card bg-emerald-950/30 border border-emerald-500/40 text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-300">
            Token Booked Successfully!
          </h2>
          <div className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl max-w-sm mx-auto">
            <p className="text-xs text-slate-400 uppercase tracking-widest">{t('current_token')}</p>
            <p className="text-3xl font-black text-amber-400 my-1">{assignedToken}</p>
            <p className="text-xs text-slate-300">{doctor.name} • {doctor.hospital}</p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/my-token"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-950 text-sm transition-colors"
            >
              {t('myTokens')} →
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Doctor Info Card */}
          <div className="janvaani-card space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{doctor.name}</h2>
                <p className="text-xs text-emerald-400 font-medium">{doctor.department}</p>
                <p className="text-xs text-slate-400 mt-0.5">{doctor.hospital}</p>
              </div>
              <FreshnessBadge status="LIVE" lastUpdated="Just now" />
            </div>

            {!doctor.isAcceptingTokens ? (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t('offline')}</p>
                  <p className="text-amber-400/80 mt-0.5">
                    {t('doctorPausedMsg', { doctor: doctor.name, dept: doctor.department })}
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block mt-2 font-semibold text-emerald-400 underline hover:text-emerald-300"
                  >
                    {t('suggestAlternative', { altDoctor: 'Dr. Sunita Rao' })} →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-4 h-4 text-sky-400" />
                  <span>{t('patients_ahead')}: <strong>{doctor.currentQueueLength}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Est. Wait: <strong>~{doctor.currentQueueLength * doctor.estWaitPerPatientMinutes} mins</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form with FieldVoiceInput for Every Field */}
          {doctor.isAcceptingTokens && (
            <form onSubmit={handleBookingSubmit} className="janvaani-card space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>Patient Details / मरीज विवरण</span>
                <span className="text-xs text-emerald-400 font-normal">
                  {t('speak_option')} OR {t('type_option')}
                </span>
              </h3>

              {/* Patient Name Field (Field Voice Input) */}
              <FieldVoiceInput
                label="Patient Full Name"
                required
                fieldContext="name"
                value={patientName}
                onChange={setPatientName}
                placeholder="e.g. Ramesh Kumar / रमेश कुमार"
              />

              {/* Mobile Number Field (Field Voice Input) */}
              <FieldVoiceInput
                label="Mobile Number (10 Digits)"
                type="tel"
                fieldContext="mobile"
                value={mobileNumber}
                onChange={setMobileNumber}
                placeholder="e.g. 9876543210"
              />

              {/* Chief Symptoms Field (Field Voice Input) */}
              <FieldVoiceInput
                label="Chief Symptoms / Reason for Visit"
                type="textarea"
                rows={2}
                fieldContext="symptoms"
                value={symptoms}
                onChange={setSymptoms}
                placeholder="e.g. Fever for 2 days / 2 दिन से बुखार है"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
              >
                {t('confirmAction')} ({t('bookToken')}) →
              </button>
            </form>
          )}
        </div>
      )}

      {/* Safety Confirmation Modal */}
      {showConfirmationModal && (
        <ActionPreviewModal
          title={t('confirmAction')}
          actionDetails={`Booking OPD Token for ${patientName} with ${doctor.name} (${doctor.department}) at ${doctor.hospital}. Estimated wait time: ~${doctor.currentQueueLength * doctor.estWaitPerPatientMinutes} mins.`}
          onConfirm={executeBooking}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
}
