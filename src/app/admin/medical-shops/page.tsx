'use client';

import { useState } from 'react';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, Pill, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminMedicalShopsPage() {
  const [shops] = useState([
    {
      id: 'shop_1',
      name: 'Jan Aushadhi Kendra (Generic Pharmacy)',
      address: 'Near AIIMS Gate 2, Delhi',
      is24_7: true,
      inventory: [
        { med: 'Paracetamol 650mg', status: 'In Stock', count: 1200 },
        { med: 'Insulin Glargine', status: 'Limited Stock', count: 14 },
        { med: 'Amoxicillin 500mg', status: 'In Stock', count: 450 },
      ],
    },
    {
      id: 'shop_2',
      name: 'Apollo Pharmacy 24/7',
      address: 'Green Park, New Delhi',
      is24_7: true,
      inventory: [
        { med: 'Metformin 500mg', status: 'In Stock', count: 800 },
        { med: 'Amlodipine 5mg', status: 'In Stock', count: 600 },
      ],
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
          Pharmacy & Medicine Stock Directory
        </span>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Pill size={24} className="text-cyan-400 mr-2" />
          Pharmacy Medicine Inventory & Live Availability
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-slate-400">{s.address}</p>
                </div>
                <FreshnessBadge lastUpdated={new Date()} />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Inventory Status</div>
                {s.inventory.map((inv, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">{inv.med}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${inv.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                      {inv.status} ({inv.count} units)
                    </span>
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
