'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { SarvamVoiceClient } from '@/services/sarvamVoiceClient';
import { useRouter } from 'next/navigation';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceContextType {
  voiceState: VoiceState;
  transcript: string;
  assistantText: string;
  speak: (text: string, onDone?: () => void) => void;
  stopSpeaking: () => void;
  startListening: (onRecognized?: (text: string) => void) => void;
  stopListening: () => void;
  setAssistantText: (text: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const router = useRouter();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [assistantText, setAssistantText] = useState<string>('');
  const [recognitionObj, setRecognitionObj] = useState<any>(null);

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      setAssistantText(text);
      setVoiceState('speaking');

      SarvamVoiceClient.speak({
        text,
        langCode: language,
        onStart: () => setVoiceState('speaking'),
        onEnd: () => {
          setVoiceState('idle');
          if (onDone) onDone();
        },
        onError: () => {
          setVoiceState('idle');
          if (onDone) onDone();
        },
      });
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    SarvamVoiceClient.stop();
    setVoiceState('idle');
  }, []);

  // Voice Command Intent Router
  const handleVoiceCommandNavigation = useCallback(
    (text: string) => {
      const lower = text.toLowerCase();

      if (lower.includes('emergency') || lower.includes('ambulance') || lower.includes('112') || lower.includes('आपातकाल')) {
        speak('आपातकालीन मार्ग पर भेजा जा रहा है।');
        router.push('/emergency');
        return true;
      }

      if (lower.includes('token') || lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('मरीज़')) {
        speak('मरीज़ डैशबोर्ड पर भेजा जा रहा है।');
        router.push('/dashboard');
        return true;
      }

      if (lower.includes('admin') || lower.includes('provider') || lower.includes('प्रदाता')) {
        speak('प्रदाता पोर्टल खोला जा रहा है।');
        router.push('/admin');
        return true;
      }

      if (lower.includes('my token') || lower.includes('मेरा टोकन')) {
        speak('आपके एक्टिव टोकन की स्थिति खोली जा रही है।');
        router.push('/my-token');
        return true;
      }

      return false;
    },
    [router, speak]
  );

  const startListening = useCallback(
    (onRecognized?: (text: string) => void) => {
      if (voiceState === 'speaking') {
        stopSpeaking();
      }

      setTranscript('');
      setVoiceState('listening');

      const rec = SarvamVoiceClient.createSpeechRecognition(
        language,
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal && text.trim()) {
            setVoiceState('processing');
            const isHandled = handleVoiceCommandNavigation(text);
            if (onRecognized) onRecognized(text);

            if (!isHandled) {
              speak(`आपने कहा: ${text}`);
            }

            setTimeout(() => {
              setVoiceState('idle');
            }, 600);
          }
        },
        (_err) => {
          setVoiceState('idle');
        },
        () => {
          setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
        }
      );

      if (rec) {
        setRecognitionObj(rec);
        try {
          rec.start();
        } catch (e) {
          console.error(e);
          setVoiceState('idle');
        }
      } else {
        const promptText = prompt('Voice Command Simulation: Enter text command');
        if (promptText) {
          setTranscript(promptText);
          handleVoiceCommandNavigation(promptText);
          if (onRecognized) onRecognized(promptText);
        }
        setVoiceState('idle');
      }
    },
    [language, voiceState, stopSpeaking, handleVoiceCommandNavigation, speak]
  );

  const stopListening = useCallback(() => {
    if (recognitionObj) {
      try {
        recognitionObj.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setVoiceState('idle');
  }, [recognitionObj]);

  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        transcript,
        assistantText,
        speak,
        stopSpeaking,
        startListening,
        stopListening,
        setAssistantText,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return ctx;
};
