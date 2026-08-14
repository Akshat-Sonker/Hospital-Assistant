'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { WelfareEngine, PatientProfile, SchemeEligibilityResult } from '@/services/welfareEngine';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';

interface WelfareSchemeMatcherProps {
  patientProfile?: Partial<PatientProfile>;
}

const DEFAULT_PROFILE: PatientProfile = {
  annualIncome: 0,
  age: 35,
  hasAbhaId: false,
  state: 'Uttar Pradesh',
  isBelow18: false,
  isAbove60: false,
  isPregnant: false,
  hasDisability: false,
  familySize: 4,
};

export function WelfareSchemeMatcher({ patientProfile }: WelfareSchemeMatcherProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState<PatientProfile>({
    ...DEFAULT_PROFILE,
    ...patientProfile,
  });

  const results: SchemeEligibilityResult[] = useMemo(
    () => WelfareEngine.checkEligibility(profile),
    [profile]
  );

  const eligible = results.filter((r) => r.eligible);
  const ineligible = results.filter((r) => !r.eligible);

  return (
    <div className="janvaani-card border border-emerald-500/30 bg-emerald-950/20">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-300">
              Welfare Scheme Eligibility
            </h3>
            <p className="text-xs text-slate-400">
              {eligible.length > 0
                ? `✅ ${eligible.length} scheme${eligible.length > 1 ? 's' : ''} you may qualify for`
                : 'Check Ayushman Bharat & PM-JAY eligibility'}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Quick Profile Inputs */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Annual Income (₹)</label>
              <input
                type="number"
                value={profile.annualIncome}
                onChange={(e) =>
                  setProfile({ ...profile, annualIncome: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 50000"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Family Size</label>
              <input
                type="number"
                value={profile.familySize}
                onChange={(e) =>
                  setProfile({ ...profile, familySize: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 4"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => {
                  const age = Number(e.target.value);
                  setProfile({
                    ...profile,
                    age,
                    isBelow18: age < 18,
                    isAbove60: age >= 60,
                  });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. 35"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">State</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {[
                  'Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal',
                  'Madhya Pradesh', 'Rajasthan', 'Tamil Nadu', 'Karnataka',
                  'Gujarat', 'Andhra Pradesh', 'Odisha', 'Punjab',
                  'Telangana', 'Kerala', 'Jharkhand',
                ].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="col-span-2 flex flex-wrap gap-3">
              {[
                { key: 'hasAbhaId', label: 'Has ABHA ID' },
                { key: 'isPregnant', label: 'Pregnant' },
                { key: 'hasDisability', label: 'Person with Disability' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile[key as keyof PatientProfile] as boolean}
                    onChange={(e) =>
                      setProfile({ ...profile, [key]: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Eligible Schemes */}
          {eligible.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                ✅ You May Qualify
              </h4>
              {eligible.map((r) => (
                <div
                  key={r.schemeId}
                  className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/30 border border-emerald-700/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-200">{r.schemeName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.benefit}</p>
                    {r.enrollmentUrl && (
                      <a
                        href={r.enrollmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-1 transition-colors"
                      >
                        Apply / Check Status →
                      </a>
                    )}
                    {r.helplineNumber && (
                      <a
                        href={`tel:${r.helplineNumber}`}
                        className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 ml-3 mt-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        {r.helplineNumber}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {eligible.length === 0 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
              <p className="text-xs text-slate-300">
                Based on your inputs, no major central schemes match. State-specific schemes may still apply — visit your local CSC (Common Service Centre).
              </p>
            </div>
          )}

          {/* Why Not Eligible */}
          {ineligible.length > 0 && (
            <details className="group">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors list-none flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Show {ineligible.length} scheme(s) you don&apos;t currently qualify for
              </summary>
              <div className="mt-2 space-y-1.5">
                {ineligible.map((r) => (
                  <div
                    key={r.schemeId}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30"
                  >
                    <XCircle className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-400">{r.schemeName}</p>
                      <p className="text-xs text-slate-600">{r.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
