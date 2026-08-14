import { supabase } from './client';

export type UserRole = 'patient' | 'doctor';

/**
 * Fetches the role of the currently logged-in user from the profiles table.
 * Returns null if not logged in or no profile found.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !data) return null;

  return data.role as UserRole;
}

/**
 * Returns the full profile (id, name, role) of the currently logged-in user.
 * Returns null if not logged in or no profile found.
 */
export async function getUserProfile(): Promise<{ id: string; name: string; role: UserRole } | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', session.user.id)
    .single();

  if (error || !data) return null;

  return data as { id: string; name: string; role: UserRole };
}
