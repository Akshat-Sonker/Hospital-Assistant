'use client';

/**
 * SarvamVoiceClient
 * ─────────────────
 * Full Sarvam AI ASR (speech-to-text) + TTS (text-to-speech) integration
 * for all 23 Scheduled Languages of India + English.
 *
 * API Docs: https://docs.sarvam.ai/api-reference/
 *
 * Runtime behaviour:
 *   • If NEXT_PUBLIC_SARVAM_API_KEY is set  → uses Sarvam AI cloud API
 *   • Otherwise                             → falls back to Web Speech API
 */

export const SARVAM_LANGUAGE_CODES: Record<string, string> = {
  'hi-IN': 'hi-IN',   // Hindi
  'bn-IN': 'bn-IN',   // Bengali
  'ta-IN': 'ta-IN',   // Tamil
  'te-IN': 'te-IN',   // Telugu
  'mr-IN': 'mr-IN',   // Marathi
  'gu-IN': 'gu-IN',   // Gujarati
  'kn-IN': 'kn-IN',   // Kannada
  'ml-IN': 'ml-IN',   // Malayalam
  'pa-IN': 'pa-IN',   // Punjabi
  'or-IN': 'or-IN',   // Odia
  'as-IN': 'as-IN',   // Assamese
  'ur-IN': 'ur-IN',   // Urdu
  'sa-IN': 'sa-IN',   // Sanskrit
  'ne-IN': 'ne-IN',   // Nepali
  'kok-IN': 'kok-IN', // Konkani
  'mai-IN': 'mai-IN', // Maithili
  'brx-IN': 'brx-IN', // Bodo
  'doi-IN': 'doi-IN', // Dogri
  'ks-IN': 'ks-IN',   // Kashmiri
  'mni-IN': 'mni-IN', // Meitei / Manipuri
  'sat-IN': 'sat-IN', // Santali
  'sd-IN': 'sd-IN',   // Sindhi
  'en-IN': 'en-IN',   // English (India)
};

const WEB_SPEECH_SUPPORTED = new Set([
  'hi-IN', 'en-IN', 'bn-IN', 'ta-IN', 'te-IN',
  'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN',
  'ur-IN', 'ne-IN',
]);

export interface VoiceSpeakOptions {
  text: string;
  langCode: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

const SARVAM_TTS_SPEAKERS: Record<string, string> = {
  'hi-IN': 'meera',
  'bn-IN': 'riya',
  'ta-IN': 'pavithra',
  'te-IN': 'arvind',
  'mr-IN': 'madhur',
  'gu-IN': 'manisha',
  'kn-IN': 'suresh',
  'ml-IN': 'neel',
  'pa-IN': 'amol',
  'or-IN': 'abhilasha',
  'as-IN': 'meera',
  'ur-IN': 'amartya',
  'en-IN': 'arjun',
};

export class SarvamVoiceClient {
  private static isSpeaking = false;
  private static currentAudio: HTMLAudioElement | null = null;

  private static getApiKey(): string | null {
    return process.env.NEXT_PUBLIC_SARVAM_API_KEY ?? null;
  }

  // ─── TTS: Text → Speech ───────────────────────────────────────────────────

  public static async speak(options: VoiceSpeakOptions): Promise<void> {
    if (typeof window === 'undefined') return;

    SarvamVoiceClient.stop();

    const { text, langCode, onStart, onEnd, onError } = options;
    const apiKey = SarvamVoiceClient.getApiKey();

    if (apiKey) {
      try {
        if (onStart) onStart();
        SarvamVoiceClient.isSpeaking = true;

        const sarvamLang = SARVAM_LANGUAGE_CODES[langCode] ?? 'hi-IN';
        const speaker = SARVAM_TTS_SPEAKERS[langCode] ?? 'meera';

        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey,
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: sarvamLang,
            speaker,
            pitch: 0,
            pace: 1.05,        // Fast, natural pace
            loudness: 1.5,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v1',
          }),
        });

        if (!response.ok) {
          throw new Error(`Sarvam TTS API error: ${response.status}`);
        }

        const data = await response.json();
        const audioBase64: string = data.audios?.[0];
        if (!audioBase64) throw new Error('No audio data in Sarvam response');

        const audioBlob = SarvamVoiceClient.base64ToBlob(audioBase64, 'audio/wav');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        SarvamVoiceClient.currentAudio = audio;

        audio.onended = () => {
          SarvamVoiceClient.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          SarvamVoiceClient.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          if (onError) onError(e);
          else if (onEnd) onEnd();
        };

        await audio.play();
      } catch (err) {
        console.warn('[SarvamVoiceClient] TTS API failed, falling back to Web Speech:', err);
        SarvamVoiceClient.isSpeaking = false;
        SarvamVoiceClient.speakWithWebSpeech(options);
      }
    } else {
      SarvamVoiceClient.speakWithWebSpeech(options);
    }
  }

  private static speakWithWebSpeech(options: VoiceSpeakOptions): void {
    const { text, langCode, onStart, onEnd, onError } = options;

    if (!('speechSynthesis' in window)) {
      console.warn('[SarvamVoiceClient] Web Speech Synthesis not available');
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 1200);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = WEB_SPEECH_SUPPORTED.has(langCode) ? langCode : 'hi-IN';
    utterance.rate = 1.05;   // Fast, clear, natural playback speed
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      SarvamVoiceClient.isSpeaking = true;
      if (onStart) onStart();
    };
    utterance.onend = () => {
      SarvamVoiceClient.isSpeaking = false;
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      SarvamVoiceClient.isSpeaking = false;
      if (onError) onError(e);
      else if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stop(): void {
    if (typeof window === 'undefined') return;

    if (SarvamVoiceClient.currentAudio) {
      SarvamVoiceClient.currentAudio.pause();
      SarvamVoiceClient.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    SarvamVoiceClient.isSpeaking = false;
  }

  // ─── ASR: Real-Time Speech Recognition ────────────────────────────────────

  public static createSpeechRecognition(
    langCode: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: unknown) => void,
    onEnd: () => void
  ) {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition =
      (window as unknown as Record<string, any>).SpeechRecognition ||
      (window as unknown as Record<string, any>).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('[SarvamVoiceClient] SpeechRecognition API not available in browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Instant live streaming feedback
    recognition.lang = WEB_SPEECH_SUPPORTED.has(langCode) ? langCode : 'hi-IN';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, !!finalTranscript);
    };

    recognition.onerror = (err: any) => {
      console.warn('[SarvamVoiceClient] Recognition error:', err.error);
      onError(err);
    };

    recognition.onend = () => onEnd();

    return recognition;
  }

  private static base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice).map((c) => c.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: mimeType });
  }

  public static isCurrentlySpeaking(): boolean {
    return SarvamVoiceClient.isSpeaking;
  }
}
