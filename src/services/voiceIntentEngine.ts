'use client';

export type IntentType =
  | 'BOOK_TOKEN'
  | 'EMERGENCY_AMBULANCE'
  | 'CHECK_QUEUE_STATUS'
  | 'SEARCH_BEDS'
  | 'UNKNOWN';

export interface ParsedIntent {
  intent: IntentType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  entities: Record<string, string>;
  rawSpeech: string;
  clarifyingQuestion?: string;
}

export class VoiceIntentEngine {
  public static parseVoiceCommand(speechText: string): ParsedIntent {
    const text = speechText.toLowerCase().trim();

    // 1. Emergency Ambulance Intent
    if (
      text.includes('ambulance') ||
      text.includes('emergency') ||
      text.includes('एम्बुलेंस') ||
      text.includes('आपातकालीन') ||
      text.includes('அவசர') ||
      text.includes('అత్యవసర')
    ) {
      const isHigh = text.includes('icu') || text.includes('trauma') || text.includes('now') || text.includes('112');
      return {
        intent: 'EMERGENCY_AMBULANCE',
        confidence: isHigh ? 'HIGH' : 'MEDIUM',
        confidenceScore: isHigh ? 0.95 : 0.75,
        entities: {
          requiredCapability: text.includes('icu') ? 'ICU' : text.includes('trauma') ? 'Trauma' : 'ICU',
        },
        rawSpeech: speechText,
      };
    }

    // 2. Book Doctor Token Intent
    if (
      text.includes('book') ||
      text.includes('token') ||
      text.includes('doctor') ||
      text.includes('टोकन') ||
      text.includes('डॉक्टर') ||
      text.includes('முன்பதிவு')
    ) {
      let dept = 'General OPD';
      if (text.includes('skin') || text.includes('derma') || text.includes('चर्म')) dept = 'Dermatology';
      if (text.includes('heart') || text.includes('cardio') || text.includes('हृदय')) dept = 'Cardiology';
      if (text.includes('eye') || text.includes('आंख')) dept = 'Ophthalmology';

      return {
        intent: 'BOOK_TOKEN',
        confidence: dept !== 'General OPD' ? 'HIGH' : 'MEDIUM',
        confidenceScore: 0.85,
        entities: { department: dept },
        rawSpeech: speechText,
      };
    }

    // 3. Check Queue Status Intent
    if (text.includes('queue') || text.includes('status') || text.includes('wait') || text.includes('स्थिति')) {
      return {
        intent: 'CHECK_QUEUE_STATUS',
        confidence: 'HIGH',
        confidenceScore: 0.9,
        entities: {},
        rawSpeech: speechText,
      };
    }

    // Low confidence / Unknown
    return {
      intent: 'UNKNOWN',
      confidence: 'LOW',
      confidenceScore: 0.3,
      entities: {},
      rawSpeech: speechText,
      clarifyingQuestion:
        'क्षमा करें, मैं समझ नहीं पाया। क्या आप डॉक्टर टोकन बुक करना चाहते हैं या एम्बुलेंस बुलाना चाहते हैं?',
    };
  }
}
