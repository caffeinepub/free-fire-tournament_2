import React, { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowLeft,
  User,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  Gamepad2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGetWalletBalance, useDeposit, useWithdraw } from '../hooks/useQueries';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, userName, userEmail, userUid } = useAuth();
  const { data: balance, isLoading: balanceLoading } = useGetWalletBalance(userEmail);

  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showDepositInput, setShowDepositInput] = useState(false);
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');
  const [uidCopied, setUidCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/' });
    }
  }, [isAuthenticated, router]);

  const handleBack = () => {
    router.navigate({ to: '/lobby', replace: true });
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setTxError('Enter a valid deposit amount.');
      return;
    }
    setTxError('');
    setTxSuccess('');
    try {
      await depositMutation.mutateAsync({ uid: userEmail, amount });
      setTxSuccess(`₹${amount.toFixed(2)} deposited successfully!`);
      setDepositAmount('');
      setShowDepositInput(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deposit failed.';
      setTxError(msg);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setTxError('Enter a valid withdrawal amount.');
      return;
    }
    setTxError('');
    setTxSuccess('');
    try {
      await withdrawMutation.mutateAsync({ uid: userEmail, amount });
      setTxSuccess(`₹${amount.toFixed(2)} withdrawn successfully!`);
      setWithdrawAmount('');
      setShowWithdrawInput(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Withdrawal failed. Check your balance.';
      setTxError(msg);
    }
  };

  const copyUid = () => {
    if (userUid) {
      navigator.clipboard.writeText(userUid);
      setUidCopied(true);
      setTimeout(() => setUidCopied(false), 2000);
    }
  };

  const formattedBalance =
    balance !== undefined ? `₹${balance.toFixed(2)}` : '₹0.00';

  return (
    <div className="min-h-screen bg-game-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Header — sticky only (no conflicting relative) */}
      <header className="sticky top-0 z-10 bg-black/80 border-b border-game-red/30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
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
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Page title */}
        <div className="text-center">
          <h1 className="font-orbitron text-2xl font-black text-white tracking-widest">
            PLAYER <span className="text-game-red">PROFILE</span>
          </h1>
          <p className="text-silver font-rajdhani text-sm mt-1">Manage your account and wallet</p>
        </div>

        {/* Account Details Card */}
        <div className="bg-gray-900/80 border border-game-red/30 rounded-sm p-6 shadow-red-glow">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-game-red/20 rounded-sm border border-game-red/40">
              <User size={20} className="text-game-red" />
            </div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wider">
              ACCOUNT DETAILS
            </h2>
          </div>

          <div className="space-y-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="w-14 h-14 rounded-sm bg-game-red/20 border border-game-red/40 flex items-center justify-center">
                <span className="font-orbitron text-xl font-black text-game-red">
                  {userName ? userName.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <p className="font-orbitron text-white font-bold text-base">{userName || '—'}</p>
                <p className="text-silver font-rajdhani text-xs">{userEmail || '—'}</p>
              </div>
            </div>

            {/* Player Name */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-rajdhani text-sm tracking-wider">PLAYER NAME</span>
              <span className="text-white font-rajdhani font-semibold">{userName || '—'}</span>
            </div>

            {/* Free Fire UID */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-rajdhani text-sm tracking-wider">FREE FIRE UID</span>
              <div className="flex items-center gap-2">
                <span className="text-gold font-orbitron text-sm font-bold">
                  {userUid || '—'}
                </span>
                {userUid && (
                  <button
                    onClick={copyUid}
                    className="text-gray-500 hover:text-gold transition-colors"
                    title="Copy UID"
                  >
                    {uidCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-rajdhani text-sm tracking-wider">EMAIL</span>
              <span className="text-silver font-rajdhani text-sm">{userEmail || '—'}</span>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-gray-900/80 border border-gold/30 rounded-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-gold/10 rounded-sm border border-gold/30">
              <Wallet size={20} className="text-gold" />
            </div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wider">WALLET</h2>
          </div>

          {/* Balance display */}
          <div className="bg-black/60 border border-gold/20 rounded-sm p-5 mb-5 text-center">
            <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-1">CURRENT BALANCE</p>
            {balanceLoading ? (
              <div className="flex items-center justify-center gap-2 text-gold">
                <Loader2 size={18} className="animate-spin" />
                <span className="font-orbitron text-lg">Loading...</span>
              </div>
            ) : (
              <p className="font-orbitron text-3xl font-black text-gold">{formattedBalance}</p>
            )}
          </div>

          {/* Feedback messages */}
          {txError && (
            <div className="bg-game-red/20 border border-game-red/50 rounded-sm px-4 py-2 mb-4 text-game-red text-sm font-rajdhani">
              {txError}
            </div>
          )}
          {txSuccess && (
            <div className="bg-green-900/30 border border-green-500/40 rounded-sm px-4 py-2 mb-4 text-green-400 text-sm font-rajdhani">
              {txSuccess}
            </div>
          )}

          {/* Deposit section */}
          <div className="mb-3">
            {!showDepositInput ? (
              <button
                onClick={() => { setShowDepositInput(true); setShowWithdrawInput(false); setTxError(''); setTxSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 bg-green-700/80 hover:bg-green-600 border border-green-600/50 text-white font-orbitron font-bold py-3 rounded-sm transition-all tracking-wider text-sm"
              >
                <ArrowDownCircle size={18} />
                DEPOSIT
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount (₹)"
                    className="flex-1 bg-black/60 border border-green-700/50 focus:border-green-500 rounded-sm px-4 py-2.5 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={depositMutation.isPending}
                    className="px-4 py-2.5 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-orbitron text-xs font-bold rounded-sm transition-colors flex items-center gap-1"
                  >
                    {depositMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'ADD'}
                  </button>
                  <button
                    onClick={() => { setShowDepositInput(false); setDepositAmount(''); }}
                    className="px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-silver font-rajdhani text-xs rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Withdraw section */}
          <div>
            {!showWithdrawInput ? (
              <button
                onClick={() => { setShowWithdrawInput(true); setShowDepositInput(false); setTxError(''); setTxSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 text-white font-orbitron font-bold py-3 rounded-sm transition-all tracking-wider text-sm"
              >
                <ArrowUpCircle size={18} />
                WITHDRAW
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (₹)"
                    className="flex-1 bg-black/60 border border-gray-600/50 focus:border-silver rounded-sm px-4 py-2.5 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawMutation.isPending}
                    className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-60 text-white font-orbitron text-xs font-bold rounded-sm transition-colors flex items-center gap-1"
                  >
                    {withdrawMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'OUT'}
                  </button>
                  <button
                    onClick={() => { setShowWithdrawInput(false); setWithdrawAmount(''); }}
                    className="px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-silver font-rajdhani text-xs rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-sm p-5">
          <button
            onClick={() => router.navigate({ to: '/rules' })}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-sm border border-gray-700">
                <FileText size={18} className="text-silver" />
              </div>
              <div className="text-left">
                <p className="font-orbitron text-sm font-bold text-white tracking-wider group-hover:text-gold transition-colors">
                  TERMS & CONDITIONS
                </p>
                <p className="text-gray-500 font-rajdhani text-xs mt-0.5">
                  Tournament rules and regulations
                </p>
              </div>
            </div>
            <ArrowLeft size={16} className="text-gray-600 rotate-180 group-hover:text-gold transition-colors" />
          </button>
        </div>
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
