'use client';

import { useState } from 'react';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, Microchip, TestTube, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminPathologyPage() {
  const [labs] = useState([
    {
      id: 'lab_1',
      name: 'District Central Pathology Lab',
      availableTests: ['CBC Blood Count', 'HbA1c Diabetes', 'Thyroid Profile', 'RT-PCR'],
      nextAvailableSlot: 'Today, 2:30 PM',
    },
    {
      id: 'lab_2',
      name: 'Dr. Lal PathLabs Center',
      availableTests: ['Lipid Profile', 'Liver Function Test (LFT)', 'Vitamin D3'],
      nextAvailableSlot: 'Today, 3:00 PM',
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
          Diagnostic Pathology Directory
        </span>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <TestTube size={24} className="text-cyan-400 mr-2" />
          Diagnostic Pathology Labs & Test Slot Availability
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((l) => (
            <div key={l.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">{l.name}</h3>
                <FreshnessBadge lastUpdated={new Date()} />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400">Available Tests & Panels:</div>
                <div className="flex flex-wrap gap-1.5">
                  {l.availableTests.map((t, i) => (
                    <span key={i} className="text-xs bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center text-cyan-400 font-semibold"><Calendar size={14} className="mr-1" /> Next Slot: {l.nextAvailableSlot}</span>
                <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs">
                  Manage Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
