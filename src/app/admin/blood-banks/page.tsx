'use client';

import { useState } from 'react';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, Droplet, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminBloodBanksPage() {
  const [bloodBanks] = useState([
    {
      id: 'bb_1',
      name: 'District Red Cross Blood Bank (e-RaktKosh)',
      district: 'South Delhi',
      stock: { 'A+': 18, 'O+': 32, 'O-': 3, 'B+': 24, 'AB+': 7, 'AB-': 2 },
    },
    {
      id: 'bb_2',
      name: 'Rotary Club Regional Blood Bank',
      district: 'Central Delhi',
      stock: { 'A+': 12, 'O+': 15, 'O-': 1, 'B+': 19, 'AB+': 4, 'AB-': 0 },
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 pb-32">
      <header className="max-w-5xl mx-auto flex items-center justify-between py-4 border-b border-slate-800 mb-8">
        <Link href="/admin" className="flex items-center text-slate-400 hover:text-white text-sm font-medium">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Provider Hub</span>
        </Link>
        <span className="text-xs font-bold text-red-400 bg-red-950 border border-red-800 px-3 py-1 rounded-full">
          e-RaktKosh Blood Stock Directory
        </span>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Droplet size={24} className="text-red-500 mr-2" />
          Blood Bank Stock Inventory (Group-wise)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloodBanks.map((bb) => (
            <div key={bb.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{bb.name}</h3>
                  <p className="text-xs text-slate-400">{bb.district}</p>
                </div>
                <FreshnessBadge lastUpdated={new Date()} />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
                {Object.entries(bb.stock).map(([grp, units]) => (
                  <div
                    key={grp}
                    className={`p-3 rounded-2xl border text-center ${
                      units < 3
                        ? 'bg-red-950/60 border-red-800 text-red-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400">{grp}</div>
                    <div className="text-lg font-black">{units} <span className="text-[10px] font-normal">units</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
