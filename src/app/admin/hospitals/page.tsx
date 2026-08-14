'use client';

import { useState } from 'react';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ArrowLeft, Building2, Bed, Ambulance, ShieldCheck, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([
    {
      id: 'hosp_1',
      name: 'Government District Hospital',
      district: 'South Delhi',
      totalBeds: 250,
      availableBeds: 42,
      icuBeds: 8,
      departments: ['Dermatology', 'Cardiology', 'General Medicine', 'Orthopedics'],
      ambulanceFleetCount: 6,
      lastUpdated: new Date(),
    },
    {
      id: 'hosp_2',
      name: 'Safdarjung Speciality Hospital',
      district: 'South Delhi',
      totalBeds: 500,
      availableBeds: 88,
      icuBeds: 14,
      departments: ['Neurology', 'Pediatrics', 'Oncology', 'Emergency'],
      ambulanceFleetCount: 12,
      lastUpdated: new Date(),
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
          Hospital Admin Directory
        </span>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Building2 size={24} className="text-cyan-400 mr-2" />
              Hospitals & Live Bed Inventory
            </h1>
            <p className="text-xs text-slate-400">Manage hospital infrastructure, department allocations, and ambulance fleet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((h) => (
            <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{h.name}</h3>
                  <p className="text-xs text-slate-400">{h.district}</p>
                </div>
                <FreshnessBadge lastUpdated={h.lastUpdated} />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Total Beds</div>
                  <div className="text-lg font-extrabold text-white">{h.totalBeds}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Available</div>
                  <div className="text-lg font-extrabold text-emerald-400">{h.availableBeds}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold">ICU Beds</div>
                  <div className="text-lg font-extrabold text-cyan-400">{h.icuBeds}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400">Departments:</div>
                <div className="flex flex-wrap gap-1.5">
                  {h.departments.map((d, i) => (
                    <span key={i} className="text-[11px] bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-lg text-slate-300">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center"><Ambulance size={14} className="mr-1 text-cyan-400" /> Fleet: {h.ambulanceFleetCount} units</span>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs transition">
                  Update Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
