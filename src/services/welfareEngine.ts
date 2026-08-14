'use client';

export interface PatientProfile {
  annualIncome: number;       // in INR/year
  age: number;
  hasAbhaId: boolean;
  state: string;
  isBelow18: boolean;
  isAbove60: boolean;
  isPregnant: boolean;
  hasDisability: boolean;
  familySize: number;
}

export interface SchemeEligibilityResult {
  schemeId: string;
  schemeName: string;
  eligible: boolean;
  benefit: string;
  reason: string;
  enrollmentUrl?: string;
  helplineNumber?: string;
  voiceSummary: string;
}

// Deterministic rules — no AI, no randomness
export class WelfareEngine {
  static checkEligibility(profile: PatientProfile): SchemeEligibilityResult[] {
    const results: SchemeEligibilityResult[] = [];

    // 1. Ayushman Bharat PM-JAY (AB-PMJAY)
    const pmjayEligible = profile.annualIncome <= 100000 || profile.familySize >= 5;
    results.push({
      schemeId: 'AB-PMJAY',
      schemeName: 'Ayushman Bharat PM-JAY',
      eligible: pmjayEligible,
      benefit: '₹5,00,000 per family per year — cashless hospitalisation at empanelled hospitals',
      reason: pmjayEligible
        ? 'Income ≤ ₹1L/year or large family size qualifies under SECC criteria'
        : 'Income > ₹1L/year and family size < 5 — may not qualify under SECC',
      enrollmentUrl: 'https://pmjay.gov.in',
      helplineNumber: '14555',
      voiceSummary:
        'आयुष्मान भारत योजना के तहत आपको प्रति वर्ष ₹5 लाख तक का मुफ्त इलाज मिल सकता है।',
    });

    // 2. Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)
    results.push({
      schemeId: 'PMSMA',
      schemeName: 'PM Surakshit Matritva Abhiyan',
      eligible: profile.isPregnant,
      benefit: 'Free antenatal care on 9th of every month at government health facilities',
      reason: profile.isPregnant
        ? 'Pregnancy status qualifies for free antenatal checkups'
        : 'Not applicable — pregnancy status not indicated',
      enrollmentUrl: 'https://pmsma.nhp.gov.in',
      helplineNumber: '1800-180-1104',
      voiceSummary: 'गर्भावस्था के दौरान हर माह 9 तारीख को मुफ्त जांच का लाभ उठाएं।',
    });

    // 3. Rashtriya Arogya Nidhi (RAN) — critical illness BPL
    const ranEligible = profile.annualIncome <= 50000;
    results.push({
      schemeId: 'RAN',
      schemeName: 'Rashtriya Arogya Nidhi (RAN)',
      eligible: ranEligible,
      benefit: 'One-time financial assistance up to ₹15 lakh for life-threatening illnesses at government hospitals',
      reason: ranEligible
        ? 'Income ≤ ₹50K/year qualifies as Below Poverty Line (BPL)'
        : 'Income > ₹50K/year — not BPL category',
      enrollmentUrl: 'https://nhp.gov.in/rashtriya-arogya-nidhi_pg',
      helplineNumber: '104',
      voiceSummary: 'गंभीर बीमारी पर सरकारी अस्पताल में ₹15 लाख तक की सहायता मिल सकती है।',
    });

    // 4. Janani Suraksha Yojana (JSY)
    const jsyEligible = profile.isPregnant && profile.annualIncome <= 75000;
    results.push({
      schemeId: 'JSY',
      schemeName: 'Janani Suraksha Yojana (JSY)',
      eligible: jsyEligible,
      benefit: 'Cash incentive of ₹1,400 (rural) / ₹1,000 (urban) for institutional delivery',
      reason: jsyEligible
        ? 'Pregnant + low income qualifies for delivery cash benefit'
        : 'Requires pregnancy status and income ≤ ₹75K/year',
      enrollmentUrl: 'https://nhm.gov.in/index1.php?lang=1&level=3&lid=309&sublinkid=841',
      helplineNumber: '104',
      voiceSummary: 'अस्पताल में प्रसव पर ₹1,400 की नकद सहायता मिलती है।',
    });

    // 5. National Disability Welfare Scheme
    results.push({
      schemeId: 'NDWS',
      schemeName: 'National Trust Disability Welfare Scheme',
      eligible: profile.hasDisability,
      benefit: 'Support for autism, cerebral palsy, mental retardation, multiple disabilities — caregiver support & aids',
      reason: profile.hasDisability
        ? 'Disability status qualifies for National Trust support'
        : 'No disability indicated',
      enrollmentUrl: 'https://thenationaltrust.gov.in',
      helplineNumber: '1800-599-0019',
      voiceSummary: 'दिव्यांगजन योजना के तहत सहायता उपकरण और देखभाल सहायता उपलब्ध है।',
    });

    // 6. Senior Citizen Health Insurance Scheme (SCHIS)
    results.push({
      schemeId: 'SCHIS',
      schemeName: 'Senior Citizen Health Insurance Scheme',
      eligible: profile.isAbove60,
      benefit: 'Special health coverage and OPD discount for senior citizens at CGHS-empanelled hospitals',
      reason: profile.isAbove60
        ? 'Age 60+ qualifies for senior citizen health benefits'
        : 'Must be 60 years or older',
      enrollmentUrl: 'https://cghs.gov.in',
      helplineNumber: '104',
      voiceSummary: '60 वर्ष से ऊपर के नागरिकों को विशेष स्वास्थ्य लाभ और OPD छूट मिलती है।',
    });

    // 7. ABHA Linked Benefits
    results.push({
      schemeId: 'ABHA',
      schemeName: 'ABHA Digital Health Benefits',
      eligible: profile.hasAbhaId,
      benefit: 'Linked health records, faster hospital check-in, telemedicine via eSanjeevani, ABDM data sharing',
      reason: profile.hasAbhaId
        ? 'ABHA ID linked — access to ABDM health data and digital services'
        : 'Create your free ABHA ID at healthid.ndhm.gov.in to unlock benefits',
      enrollmentUrl: 'https://healthid.ndhm.gov.in',
      helplineNumber: '1800-11-4477',
      voiceSummary: 'ABHA आईडी से आप अपना पूरा स्वास्थ्य इतिहास डिजिटल रूप से साझा कर सकते हैं।',
    });

    return results;
  }
}

// Legacy export for backward compatibility
export class WelfareEngineService {
  public static evaluateSchemes(patientProfile: {
    incomeBracket?: string;
    hasRationCard?: boolean;
    state?: string;
  }) {
    const income = patientProfile.incomeBracket === 'BPL' ? 30000 : 120000;
    return WelfareEngine.checkEligibility({
      annualIncome: income,
      age: 35,
      hasAbhaId: false,
      state: patientProfile.state ?? 'Uttar Pradesh',
      isBelow18: false,
      isAbove60: false,
      isPregnant: false,
      hasDisability: false,
      familySize: 4,
    });
  }
}
