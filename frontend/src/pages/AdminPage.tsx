import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  RefreshCw,
  AlertTriangle,
  Gamepad2,
} from 'lucide-react';
import { useGetPendingDeposits, useApproveDeposit, useRejectDeposit } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';

function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

function formatPrincipal(p: { toString(): string }): string {
  const s = p.toString();
  if (s.length <= 16) return s;
  return `${s.slice(0, 8)}…${s.slice(-8)}`;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage() {
  const router = useRouter();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: deposits, isLoading: depositsLoading, refetch, error } = useGetPendingDeposits();
  const approveMutation = useApproveDeposit();
  const rejectMutation = useRejectDeposit();

  const [actionError, setActionError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const handleApprove = async (depositId: bigint) => {
    setActionError('');
    setActionSuccess('');
    try {
      await approveMutation.mutateAsync(depositId);
      setActionSuccess(`Deposit #${depositId} approved and wallet credited.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed.';
      setActionError(msg);
    }
  };

  const handleReject = async (depositId: bigint) => {
    setActionError('');
    setActionSuccess('');
    try {
      await rejectMutation.mutateAsync(depositId);
      setActionSuccess(`Deposit #${depositId} rejected.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed.';
      setActionError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-game-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 border-b border-game-red/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.navigate({ to: '/lobby' })}
            className="flex items-center gap-2 text-silver hover:text-gold transition-colors font-rajdhani text-sm"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Lobby</span>
          </button>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Gamepad2 className="text-game-red" size={22} />
            <span className="font-orbitron text-base font-black text-white tracking-widest">
              FF<span className="text-game-red">ARENA</span>
            </span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-2xl font-black text-white tracking-widest flex items-center gap-3">
              <ShieldCheck className="text-game-red" size={28} />
              ADMIN <span className="text-game-red">PANEL</span>
            </h1>
            <p className="text-silver font-rajdhani text-sm mt-1">Deposit Approval Management</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={depositsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 text-silver font-orbitron text-xs font-bold rounded-sm transition-all"
          >
            <RefreshCw size={14} className={depositsLoading ? 'animate-spin' : ''} />
            REFRESH
          </button>
        </div>

        {/* Admin check loading */}
        {adminLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-game-red" />
          </div>
        )}

        {/* Access denied */}
        {!adminLoading && isAdmin === false && (
          <div className="bg-gray-900/80 border border-game-red/40 rounded-sm p-10 text-center">
            <AlertTriangle size={48} className="text-game-red mx-auto mb-4" />
            <p className="font-orbitron text-lg font-bold text-white tracking-wider">ACCESS DENIED</p>
            <p className="text-gray-400 font-rajdhani text-sm mt-2">
              You do not have admin privileges to view this page.
            </p>
            <button
              onClick={() => router.navigate({ to: '/lobby' })}
              className="mt-6 px-6 py-2.5 bg-game-red/20 hover:bg-game-red/30 border border-game-red/40 text-game-red font-orbitron text-xs font-bold rounded-sm transition-all tracking-wider"
            >
              GO TO LOBBY
            </button>
          </div>
        )}

        {/* Admin content */}
        {!adminLoading && isAdmin === true && (
          <>
            {/* Feedback messages */}
            {actionError && (
              <div className="bg-red-900/30 border border-game-red/40 rounded-sm px-4 py-3 flex items-center gap-2 text-game-red font-rajdhani text-sm">
                <XCircle size={16} />
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="bg-green-900/30 border border-green-500/40 rounded-sm px-4 py-3 flex items-center gap-2 text-green-400 font-rajdhani text-sm">
                <CheckCircle2 size={16} />
                {actionSuccess}
              </div>
            )}

            {/* Error fetching */}
            {error && (
              <div className="bg-red-900/30 border border-game-red/40 rounded-sm px-4 py-3 text-game-red font-rajdhani text-sm">
                Failed to load deposits: {error.message}
              </div>
            )}

            {/* Loading deposits */}
            {depositsLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-gold" />
                <span className="ml-3 text-gray-400 font-rajdhani">Loading pending deposits...</span>
              </div>
            )}

            {/* Empty state */}
            {!depositsLoading && deposits && deposits.length === 0 && (
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-sm p-12 text-center">
                <Clock size={40} className="text-gray-600 mx-auto mb-4" />
                <p className="font-orbitron text-base font-bold text-white tracking-wider">
                  NO PENDING DEPOSITS
                </p>
                <p className="text-gray-500 font-rajdhani text-sm mt-2">
                  All deposit requests have been processed.
                </p>
              </div>
            )}

            {/* Deposits list */}
            {!depositsLoading && deposits && deposits.length > 0 && (
              <div className="space-y-4">
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest">
                  {deposits.length} PENDING DEPOSIT{deposits.length !== 1 ? 'S' : ''}
                </p>
                {deposits.map((deposit) => (
                  <DepositCard
                    key={deposit.id.toString()}
                    deposit={deposit}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isApproving={approveMutation.isPending}
                    isRejecting={rejectMutation.isPending}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-8 py-6 text-center">
        <p className="text-gray-600 font-rajdhani text-xs">
          © {new Date().getFullYear()} FFArena. Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

interface DepositCardProps {
  deposit: import('../backend').DepositRecord;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function DepositCard({ deposit, onApprove, onReject, isApproving, isRejecting }: DepositCardProps) {
  const [imgError, setImgError] = useState(false);
  const screenshotUrl = deposit.screenshot.getDirectURL();

  return (
    <div className="bg-gray-900/80 border border-gold/20 rounded-sm p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-orbitron text-xs text-gray-500 tracking-widest">DEPOSIT</span>
            <span className="font-orbitron text-xs text-gold font-bold">#{deposit.id.toString()}</span>
            <span className="px-2 py-0.5 bg-yellow-900/40 border border-yellow-600/40 text-yellow-400 font-rajdhani text-xs rounded-sm">
              PENDING
            </span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee size={16} className="text-gold" />
            <span className="font-orbitron text-xl font-black text-gold">
              {deposit.amount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-rajdhani text-xs">Submitted</p>
          <p className="text-silver font-rajdhani text-xs">{formatDate(deposit.submittedAt)}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-black/40 border border-gray-700/50 rounded-sm px-3 py-2">
          <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-0.5">USER</p>
          <p className="text-white font-rajdhani text-sm font-semibold break-all">
            {formatPrincipal(deposit.user)}
          </p>
        </div>
        <div className="bg-black/40 border border-gray-700/50 rounded-sm px-3 py-2">
          <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-0.5">TRANSACTION ID</p>
          <p className="text-white font-rajdhani text-sm font-semibold break-all">
            {deposit.transactionId || '—'}
          </p>
        </div>
      </div>

      {/* Screenshot preview */}
      <div>
        <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">PAYMENT SCREENSHOT</p>
        {!imgError ? (
          <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={screenshotUrl}
              alt="Payment screenshot"
              onError={() => setImgError(true)}
              className="max-h-48 rounded-sm border border-gray-700/50 object-contain bg-black/40 cursor-pointer hover:opacity-90 transition-opacity"
            />
          </a>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 font-rajdhani text-sm">
            <AlertTriangle size={14} />
            Screenshot unavailable
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onReject(deposit.id)}
          disabled={isRejecting || isApproving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed border border-game-red/40 text-game-red font-orbitron text-xs font-bold rounded-sm transition-all tracking-wider"
        >
          {isRejecting ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
          REJECT
        </button>
        <button
          onClick={() => onApprove(deposit.id)}
          disabled={isApproving || isRejecting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-700/80 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed border border-green-600/50 text-white font-orbitron text-xs font-bold rounded-sm transition-all tracking-wider"
        >
          {isApproving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          APPROVE & CREDIT WALLET
        </button>
      </div>
    </div>
  );
}
