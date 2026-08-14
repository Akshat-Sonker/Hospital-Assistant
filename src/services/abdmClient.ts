'use client';

export interface MedicalRecord {
  abhaId: string;
  patientName: string;
  age: number;
  bloodGroup: string;
  conditions: string[];
  allergies: string[];
  recentPrescriptions: Array<{ doctor: string; date: string; meds: string[] }>;
  voiceSummary: string;
}

export class AbdmClientService {
  public static async fetchMedicalHistory(abhaId: string): Promise<MedicalRecord | null> {
    console.log(`[ABDM Client Sandbox] Fetching profile for ABHA ID: ${abhaId}`);

    // Sandbox check for mock record vs new patient
    if (abhaId && abhaId.length > 3) {
      return {
        abhaId,
        patientName: 'Ramesh Kumar',
        age: 48,
        bloodGroup: 'B+',
        conditions: ['Type-2 Diabetes', 'Hypertension'],
        allergies: ['Penicillin'],
        recentPrescriptions: [
          {
            doctor: 'Dr. Sharma (Cardiology)',
            date: '2026-07-15',
            meds: ['Metformin 500mg (Twice daily)', 'Amlodipine 5mg (Morning)'],
          },
        ],
        voiceSummary:
          'ABDM रिकॉर्ड मिला। मरीज का नाम रमेश कुमार है। बी+ ब्लड ग्रुप, टाइप 2 डायबिटीज और हाइपरटेंशन दर्ज है। पेनिसिलिन से एलर्जी है।',
      };
    }

    return null; // Triggers Guided Voice Profile Wizard if not found
  }
}
