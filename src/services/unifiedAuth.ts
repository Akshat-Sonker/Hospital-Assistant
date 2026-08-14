'use client';

import { supabase } from '@/utils/supabase/client';

export type AuthMethod =
  | 'email'
  | 'mobile_otp'
  | 'abha_id'
  | 'digilocker'
  | 'ayushman_card'
  | 'gov_id';

export interface UnifiedAuthCredentials {
  method: AuthMethod;
  identifier: string; // email, mobile number, ABHA address, or ID number
  passwordOrOtp?: string;
  role?: 'patient' | 'doctor' | 'admin' | 'operator';
}

export class UnifiedAuthService {
  public static async login(credentials: UnifiedAuthCredentials) {
    const { method, identifier, passwordOrOtp } = credentials;

    if (method === 'email' && identifier && passwordOrOtp) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: passwordOrOtp || '',
        });
        if (!error && data?.user) {
          return { success: true, user: data.user };
        }
      } catch (err) {
        console.warn('[UnifiedAuth] Supabase auth failed, using sandbox fallback');
      }
    }

    // Unified sandbox mock authentication for Mobile OTP, ABHA ID, DigiLocker, Ayushman Card
    const safeIdentifier = identifier || 'guest_user';
    console.log(`[UnifiedAuth] Authenticating via ${method} for ${safeIdentifier}`);

    const mockUser = {
      id: `user_${method}_${safeIdentifier.replace(/[^a-zA-Z0-9]/g, '')}`,
      email: `${safeIdentifier}@janvaani.health.gov.in`,
      role: credentials.role || 'patient',
      user_metadata: {
        auth_method: method,
        identifier: safeIdentifier,
        name: `User (${safeIdentifier})`,
      },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('janvaani_session', JSON.stringify(mockUser));
    }

    return { success: true, user: mockUser };
  }

  public static getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('janvaani_session');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  public static async logout() {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('janvaani_session');
    }
  }
}
