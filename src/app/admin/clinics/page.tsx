'use client';

import { useState } from 'react';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, Stethoscope, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminClinicsPage() {
  const [clinics] = useState([
    {
      id: 'clinic_1',
      name: 'JanVaani Primary Health Center (PHC)',
      address: 'Sector 4, Dwarka, New Delhi',
      specialties: ['General OPD', 'Maternal Health', 'Vaccination'],
      isOpen: true,
      todayPatients: 28,
    },
    {
      id: 'clinic_2',
      name: 'Community Wellness Clinic',
      address: 'Lajpat Nagar, New Delhi',
      specialties: ['Dental Care', 'Eye OPD'],
      isOpen: true,
      todayPatients: 14,
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 pb-32">
      <header className="max-w-5xl mx-auto flex items-center justify-between py-4 border-b border-slate-800 mb-8">
        <Link href="/admin" className="flex items-center text-slate-400 hover:text-white text-sm font-medium">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Provider Hub</span>
        </Link>
        <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
          Outpatient Clinics Directory
        </span>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Stethoscope size={24} className="text-cyan-400 mr-2" />
          Primary Health Clinics & OPD Directory
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.address}</p>
                </div>
                <FreshnessBadge lastUpdated={new Date()} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.specialties.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-cyan-300">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-800">
                <span className="text-emerald-400 font-bold">● {c.isOpen ? 'Open Now' : 'Closed'}</span>
                <span>Today Consultations: {c.todayPatients}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
