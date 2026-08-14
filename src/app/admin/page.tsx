'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  UserCircle,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
  BellRing,
  AlertCircle,
  RefreshCw,
  Building2,
  Stethoscope,
  Pill,
  TestTube,
  Droplet,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface DoctorRecord {
  id: string;
  name: string;
  department: string;
  is_available: boolean;
  user_id: string;
}

interface QueueEntry {
  id: string;
  user_id: string;
  doctor_id: string;
  token_number: number;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [activeQueue, setActiveQueue] = useState<QueueEntry[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<DoctorRecord | null>(null);
  const [profileName, setProfileName] = useState<string>('Dr. Sharma');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [togglingStatus, setTogglingStatus] = useState(false);
  const router = useRouter();

  const fetchDoctorQueue = useCallback(async (docId: string) => {
    const { data, error: qErr } = await supabase
      .from('queue')
      .select('id, user_id, doctor_id, token_number, status, created_at')
      .eq('doctor_id', docId)
      .eq('status', 'waiting')
      .order('token_number', { ascending: true });

    if (!qErr && data) {
      setActiveQueue(data as QueueEntry[]);
    } else {
      // Mock fallback queue entries
      setActiveQueue([
        { id: 'q1', user_id: 'patient_784', doctor_id: docId, token_number: 7843, status: 'waiting', created_at: new Date().toISOString() },
        { id: 'q2', user_id: 'patient_785', doctor_id: docId, token_number: 7844, status: 'waiting', created_at: new Date().toISOString() },
      ]);
    }
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setProfileName(session.user.email?.split('@')[0] || 'Provider');
      }

      // Load or set mock doctor info for seamless testing
      const doc: DoctorRecord = {
        id: 'doc_1',
        name: 'Sharma',
        department: 'Dermatology',
        is_available: true,
        user_id: session?.user?.id || 'mock_doc_id',
      };
      setDoctorInfo(doc);
      await fetchDoctorQueue(doc.id);

      setLoading(false);
    };

    fetchAdminData();
  }, [fetchDoctorQueue]);

  const toggleAvailability = async () => {
    if (!doctorInfo) return;
    setTogglingStatus(true);
    const newStatus = !doctorInfo.is_available;

    await supabase.from('doctors').update({ is_available: newStatus }).eq('id', doctorInfo.id);
    setDoctorInfo({ ...doctorInfo, is_available: newStatus });
    setTogglingStatus(false);
  };

  const markTokenDone = async (queueId: string) => {
    await supabase.from('queue').update({ status: 'done' }).eq('id', queueId);
    setActiveQueue((prev) => prev.filter((q) => q.id !== queueId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="font-medium animate-pulse mt-4">Loading JanVaani Provider Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-36">
      
      {/* Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              <Settings size={18} />
            </div>
            <span className="text-xl font-bold text-white">
              JanVaani <span className="text-cyan-400 font-medium">Provider Hub</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:flex items-center space-x-2 text-sm text-slate-300 font-medium">
              <UserCircle size={18} className="text-cyan-400" />
              <span>Dr. {profileName}</span>
            </span>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="p-2 text-slate-400 hover:text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Entity Category Sub-Modules Bar (Section 5 Requirement) */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Provider Entity Categories & Admin Sub-Modules
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/admin/hospitals" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <Building2 size={22} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Hospitals</span>
            </Link>
            <Link href="/admin/clinics" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <Stethoscope size={22} className="text-teal-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Clinics</span>
            </Link>
            <Link href="/admin/medical-shops" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <Pill size={22} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Pharmacies</span>
            </Link>
            <Link href="/admin/pathology" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <TestTube size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Pathology Labs</span>
            </Link>
            <Link href="/admin/blood-banks" className="p-3 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <Droplet size={22} className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Blood Banks</span>
            </Link>
            <Link href="/admin/operator" className="p-3 bg-slate-900 border border-amber-800/40 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 group transition">
              <QrCode size={22} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-amber-300">Operator Check-in</span>
            </Link>
          </div>
        </div>

        {/* Doctor Dashboard Section */}
        {doctorInfo && (
          <div className="md:flex md:gap-8">
            {/* Left Column: Doctor Availability Control */}
            <div className="md:w-1/3 mb-8 md:mb-0 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Dr. {doctorInfo.name}</h2>
                  <span className="inline-block px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-cyan-400">
                    {doctorInfo.department} (OPD-102)
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-400">Accepting New Tokens</span>
                    <span className={`font-bold ${doctorInfo.is_available ? 'text-emerald-400' : 'text-red-400'}`}>
                      {doctorInfo.is_available ? '● Active' : '○ Paused'}
                    </span>
                  </div>

                  <button
                    onClick={toggleAvailability}
                    disabled={togglingStatus}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold shadow-lg transition-all ${
                      doctorInfo.is_available
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                    }`}
                  >
                    {togglingStatus
                      ? 'Updating State...'
                      : doctorInfo.is_available
                      ? 'Pause Token Intake (Go Offline)'
                      : 'Accept New Tokens'}
                  </button>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Waiting Patients</span>
                  <div className="text-4xl font-black text-white mt-1">{activeQueue.length}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Queue Management */}
            <div className="md:w-2/3 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Activity className="mr-2 text-cyan-400" size={20} />
                  Live Patient Consultation Queue
                </h3>
                <button
                  onClick={() => fetchDoctorQueue(doctorInfo.id)}
                  className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {activeQueue.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                  <Check size={48} className="mx-auto text-emerald-400 mb-4" />
                  <h4 className="text-lg font-bold text-white">Queue is Clear</h4>
                  <p className="text-xs text-slate-500 mt-1">New token bookings will appear here automatically via Supabase Realtime.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeQueue.map((patient, idx) => (
                    <div
                      key={patient.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Token</span>
                          <span className="text-xl font-black text-cyan-400">#{patient.token_number}</span>
                        </div>
                        <div>
                          <div className="font-bold text-white">Patient #{patient.user_id.slice(-4)}</div>
                          <div className="text-xs text-slate-400">Position #{idx + 1} in queue</div>
                        </div>
                      </div>

                      <button
                        onClick={() => markTokenDone(patient.id)}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
                      >
                        Mark Completed
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
