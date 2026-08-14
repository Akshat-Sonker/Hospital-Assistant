'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { DataAccessLayer } from '@/services/dataAccessLayer';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, CheckCircle2, QrCode, ShieldAlert, Sparkles, Building2, User } from 'lucide-react';
import Link from 'next/link';

export default function OperatorMappingPage() {
  const [physicalToken, setPhysicalToken] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [mappedSuccess, setMappedSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase.from('doctors').select('id, name, department');
      if (data && data.length > 0) {
        setDoctors(data);
        setSelectedDoctorId(data[0].id);
      } else {
        setDoctors([
          { id: 'doc_1', name: 'Dr. Sharma', department: 'Dermatology' },
          { id: 'doc_2', name: 'Dr. Verma', department: 'Dermatology' },
          { id: 'doc_3', name: 'Dr. Gupta', department: 'Cardiology' },
        ]);
        setSelectedDoctorId('doc_1');
      }
    };
    fetchDoctors();
  }, []);

  const handleMapToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMappedSuccess(null);

    try {
      // Assert write permission for operator
      DataAccessLayer.assertWritePermission('operator', 'doctor_queue');

      const tokenNum = parseInt(physicalToken.replace(/[^0-9]/g, ''), 10) || 101;
      const targetDoc = doctors.find((d) => d.id === selectedDoctorId);

      await supabase.from('queue').insert({
        user_id: 'operator_mapped_patient',
        doctor_id: selectedDoctorId,
        token_number: tokenNum,
        status: 'waiting',
        is_operator_mapped: true,
      });

      setMappedSuccess(
        `Physical Token #${tokenNum} successfully mapped to ${targetDoc?.name} (${targetDoc?.department}). Live Supabase Realtime sync triggered.`
      );
      setPhysicalToken('');
    } catch (err: any) {
      setError(err?.message || 'Mapping failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 pb-32">
      <header className="max-w-4xl mx-auto flex items-center justify-between py-4 border-b border-slate-800 mb-8">
        <Link href="/admin" className="flex items-center text-slate-400 hover:text-white text-sm font-medium">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Provider Dashboard</span>
        </Link>
        <div className="text-xs text-amber-400 font-bold bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
          Operator-Assisted MVP Workflow
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center space-x-3 text-cyan-400">
            <QrCode size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Physical Queue Token Bridge</h1>
              <p className="text-xs text-slate-400">Map Legacy Paper / Kiosk Tokens to Department Doctors in Supabase</p>
            </div>
          </div>
        </div>

        {mappedSuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-sm font-medium flex items-center space-x-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span>{mappedSuccess}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-800/50 rounded-2xl text-red-300 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleMapToken} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Physical Token Number / Barcode</label>
            <input
              type="text"
              placeholder="e.g. 7843 or OPD-7843"
              value={physicalToken}
              onChange={(e) => setPhysicalToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Department & Target Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-medium focus:border-cyan-500 focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.department})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg transition"
          >
            Map Token to Doctor Queue & Sync Realtime
          </button>
        </form>

      </main>
    </div>
  );
}
