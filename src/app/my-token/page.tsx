'use client';
export const dynamic = 'force-dynamic';

// Prevent static pre-rendering — this page requires Supabase auth at runtime

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { getUserRole } from '@/utils/supabase/auth';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  Navigation,
  ArrowLeft,
  Loader2,
  Hospital,
  Users,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

// ----- Types -----
interface QueuedToken {
  id: string;
  doctor_id: string;
  token_number: number;
  status: string;
  created_at: string;
  doctors: {
    name: string;
    department: string;
  };
}

// ----- Page Component -----
export default function MyTokenPage() {
  const [tokens, setTokens] = useState<QueuedToken[]>([]);
  const [queuePositions, setQueuePositions] = useState<{ [tokenId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  // ----- Fetch tokens and compute positions -----
  const fetchTokens = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/');
      return;
    }

    // Role guard: doctors go to /admin
    const role = await getUserRole();
    if (role === 'doctor') {
      router.push('/admin');
      return;
    }

    // Fetch all tokens for this patient (waiting + done) most-recent first
    const { data, error: fetchErr } = await supabase
      .from('queue')
      .select('id, doctor_id, token_number, status, created_at, doctors(name, department)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (fetchErr) {
      setError('Failed to load tokens: ' + fetchErr.message);
      setLoading(false);
      return;
    }

    setTokens((data as unknown as QueuedToken[]) ?? []);

    // For each WAITING token, find how many people are ahead
    const waiting = (data ?? []).filter((t: any) => t.status === 'waiting');
    const positions: { [tokenId: string]: number } = {};

    await Promise.all(
      waiting.map(async (token: any) => {
        // Count queue entries for same doctor with lower token_number that are still waiting
        const { count } = await supabase
          .from('queue')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', token.doctor_id)
          .eq('status', 'waiting')
          .lt('token_number', token.token_number); // tokens BEFORE ours

        positions[token.id] = count ?? 0;
      })
    );

    setQueuePositions(positions);
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();

    // Real-time subscription — refresh when queue table changes
    const channel = supabase
      .channel('my-token-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, () => {
        fetchTokens();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Cancel a waiting token -----
  const cancelToken = async (tokenId: string) => {
    setCancellingId(tokenId);
    const { error: cancelErr } = await supabase
      .from('queue')
      .update({ status: 'cancelled' })
      .eq('id', tokenId);

    if (cancelErr) {
      setError('Cancel failed: ' + cancelErr.message);
    } else {
      await fetchTokens();
    }
    setCancellingId(null);
  };

  // ----- Loading state -----
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your queue status...</p>
      </div>
    );
  }

  // ----- Only show waiting + done (not cancelled) -----
  const visibleTokens = tokens.filter((t) => t.status !== 'cancelled');

  // ----- Main render -----
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* ── Header ── */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-300 dark:to-cyan-300">
            My Queue
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Active Tokens</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your live position and estimated wait time.
          </p>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-6 flex items-start space-x-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {visibleTokens.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hospital size={36} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Tokens</h3>
            <p className="text-slate-500 mb-6">You are not currently queued to see any doctors.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5"
            >
              <span>Find a Doctor</span>
              <Navigation size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleTokens.map((token) => {
              const ahead = queuePositions[token.id] ?? 0;
              const estimatedWait = ahead * 5; // 5 min per person

              return (
                <div
                  key={token.id}
                  className={`relative overflow-hidden rounded-3xl border transition-all ${
                    token.status === 'done'
                      ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-70'
                      : 'border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-800 shadow-xl shadow-teal-500/5'
                  }`}
                >
                  {/* Color bar at top */}
                  <div
                    className={`h-2 w-full ${
                      token.status === 'done'
                        ? 'bg-slate-300 dark:bg-slate-600'
                        : 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    }`}
                  />

                  <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    {/* Left: doctor info */}
                    <div className="flex-1 w-full text-center md:text-left">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-4">
                        {token.status === 'done' ? (
                          <><CheckCircle size={14} className="mr-1.5 text-green-500" /> Completed</>
                        ) : (
                          <><Clock size={14} className="mr-1.5 text-teal-500 animate-pulse" /> Waiting</>
                        )}
                      </span>

                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        Dr. {token.doctors?.name || 'Unknown'}
                      </h2>
                      <p className="text-slate-500 font-medium">
                        {token.doctors?.department || 'Department'}
                      </p>

                      {/* Position info for waiting tokens */}
                      {token.status === 'waiting' && (
                        <div className="mt-4 flex flex-col sm:flex-row items-center md:items-start gap-3 text-sm">
                          <div className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg font-medium">
                            <Users size={14} />
                            <span>
                              {ahead === 0
                                ? "You're next! 🎉"
                                : `${ahead} person${ahead > 1 ? 's' : ''} ahead of you`}
                            </span>
                          </div>
                          {ahead > 0 && (
                            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium">
                              <Clock size={14} />
                              <span>~{estimatedWait} min wait</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: token number */}
                    <div
                      className={`shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 ${
                        token.status === 'done'
                          ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                          : 'border-teal-100 dark:border-teal-800/60 bg-teal-50 dark:bg-teal-900/20 shadow-inner'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                        Token #
                      </span>
                      <span
                        className={`text-4xl font-black ${
                          token.status === 'done' ? 'text-slate-400' : 'text-teal-600 dark:text-teal-400'
                        }`}
                      >
                        {String(token.token_number).padStart(3, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom bar: cancel button for waiting tokens */}
                  {token.status === 'waiting' && (
                    <div className="bg-slate-50 dark:bg-slate-800/80 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">
                        Booked at{' '}
                        <span className="text-slate-700 dark:text-slate-300 font-bold">
                          {new Date(token.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                      <button
                        onClick={() => cancelToken(token.id)}
                        disabled={cancellingId === token.id}
                        className="flex items-center space-x-1.5 text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                      >
                        {cancellingId === token.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        <span>{cancellingId === token.id ? 'Cancelling...' : 'Cancel Token'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
