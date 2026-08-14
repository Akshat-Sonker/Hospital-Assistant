'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { VoiceProvider } from '@/context/VoiceContext';
import { VoiceShell } from '@/components/voice/VoiceShell';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <VoiceProvider>
        {children}
        <VoiceShell />
      </VoiceProvider>
    </LanguageProvider>
  );
};
