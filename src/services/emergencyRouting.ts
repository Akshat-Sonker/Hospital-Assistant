'use client';

export interface HospitalOption {
  id: string;
  name: string;
  district: string;
  hasCapability: boolean;
  requiredCapability: string;
  hasBedAvailability: boolean;
  icuBedsAvailable: number;
  availableBeds: number;
  etaMinutes: number;
  distanceKm: number;
  isRecommended: boolean;
  bypassReason?: string;
  lastUpdatedMinutesAgo: number;
}

export interface EmergencyRouteRequest {
  patientLatitude: number;
  patientLongitude: number;
  requiredCapability: 'ICU' | 'Trauma' | 'Burn' | 'Cardiac' | 'Pediatric';
}

export class EmergencyRoutingService {
  // Mock hospital database with exact capabilities & availability for deterministic ranking demo
  private static mockHospitals = [
    {
      id: 'hosp_a',
      name: 'AIIMS Central Hospital',
      district: 'South Delhi',
      capabilities: ['ICU', 'Trauma', 'Burn', 'Cardiac'],
      availableBeds: 18,
      icuBedsAvailable: 3,
      lat: 28.5672,
      lng: 77.2100,
      baseEtaMinutes: 18,
      distanceKm: 8.5,
      lastUpdatedMinutesAgo: 4,
    },
    {
      id: 'hosp_b',
      name: 'Safdarjung Super Speciality Hospital',
      district: 'South Delhi',
      capabilities: ['ICU', 'Trauma', 'Cardiac'],
      availableBeds: 24,
      icuBedsAvailable: 6,
      lat: 28.5695,
      lng: 77.2066,
      baseEtaMinutes: 11,
      distanceKm: 5.2,
      lastUpdatedMinutesAgo: 2,
    },
    {
      id: 'hosp_c',
      name: 'Local City Community Clinic (Nearest)',
      district: 'South Delhi',
      capabilities: ['General OPD'], // Lacks ICU / Trauma capability!
      availableBeds: 10,
      icuBedsAvailable: 0,
      lat: 28.5710,
      lng: 77.2010,
      baseEtaMinutes: 7,
      distanceKm: 2.1,
      lastUpdatedMinutesAgo: 8,
    },
  ];

  public static async calculateEmergencyRoutes(
    request: EmergencyRouteRequest
  ): Promise<{
    recommended: HospitalOption;
    options: HospitalOption[];
    disclaimer: string;
  }> {
    const { requiredCapability } = request;

    // 1. Evaluate capability, availability, and ETA for each hospital
    const evaluated: HospitalOption[] = this.mockHospitals.map((h) => {
      const hasCapability = h.capabilities.includes(requiredCapability);
      const hasBedAvailability = h.availableBeds > 0 && (requiredCapability !== 'ICU' || h.icuBedsAvailable > 0);

      let bypassReason = undefined;
      if (!hasCapability) {
        bypassReason = `Lacks required '${requiredCapability}' capability (Only offers ${h.capabilities.join(', ')})`;
      } else if (!hasBedAvailability) {
        bypassReason = `No ${requiredCapability} beds currently available`;
      }

      return {
        id: h.id,
        name: h.name,
        district: h.district,
        hasCapability,
        requiredCapability,
        hasBedAvailability,
        icuBedsAvailable: h.icuBedsAvailable,
        availableBeds: h.availableBeds,
        etaMinutes: h.baseEtaMinutes,
        distanceKm: h.distanceKm,
        isRecommended: false,
        bypassReason,
        lastUpdatedMinutesAgo: h.lastUpdatedMinutesAgo,
      };
    });

    // 2. Filter to viable options (capable + available)
    const viable = evaluated.filter((h) => h.hasCapability && h.hasBedAvailability);

    // 3. Sort viable options by ETA (fastest realistic traffic-aware route)
    viable.sort((a, b) => a.etaMinutes - b.etaMinutes);

    // 4. Mark top recommended option
    let recommended: HospitalOption;
    if (viable.length > 0) {
      recommended = viable[0];
      recommended.isRecommended = true;
    } else {
      recommended = evaluated[0];
    }

    return {
      recommended,
      options: evaluated,
      disclaimer: 'Simulated provider network — MVP demo. JanVaani orchestrates into ERSS-112.',
    };
  }
}
