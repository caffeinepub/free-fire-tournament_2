import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Smartphone,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSubmitDeposit } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface ManualDepositModalProps {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
}

const UPI_PA = '8728872927@fam';
const UPI_PN = 'FreeFireTournament';
const UPI_TN = 'FFArena Wallet Deposit';
const MIN_AMOUNT = 10;
const UTR_LENGTH = 12;

type Step = 'amount' | 'utr' | 'success';

function triggerUpiIntent(upiLink: string) {
  const anchor = document.createElement('a');
  anchor.href = upiLink;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export default function ManualDepositModal({ open, onClose, userEmail }: ManualDepositModalProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);
  // Tracks whether the UPI intent has been launched — controls "Verify Payment" button visibility
  const [upiLaunched, setUpiLaunched] = useState(false);

  const queryClient = useQueryClient();
  const submitDepositMutation = useSubmitDeposit();

  const buildUpiLink = (parsedAmount: number) =>
    `upi://pay?pa=${encodeURIComponent(UPI_PA)}&pn=${encodeURIComponent(UPI_PN)}&am=${parsedAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(UPI_TN)}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_PA).then(() => {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2500);
    });
  };

  // Launches the UPI deep link and marks it as launched — does NOT auto-advance the step.
  // The user must explicitly click "Verify Payment" to proceed to UTR entry.
  const handleProceedToPay = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < MIN_AMOUNT) {
      setAmountError(`Minimum deposit amount is ₹${MIN_AMOUNT}.`);
      return;
    }
    setAmountError('');
    const upiLink = buildUpiLink(parsed);
    triggerUpiIntent(upiLink);
    // Mark UPI as launched so the "Verify Payment" button appears.
    // No auto-advance — the modal stays on this step until the user confirms.
    setUpiLaunched(true);
  };

  // Called when the user manually confirms they have completed the payment.
  const handleVerifyPayment = () => {
    setStep('utr');
  };

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric characters, max 12 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, UTR_LENGTH);
    setUtrNumber(val);
    if (utrError) setUtrError('');
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async () => {
    if (utrNumber.length !== UTR_LENGTH) {
      setUtrError(`Please enter a valid ${UTR_LENGTH}-digit UTR / Transaction ID.`);
      return;
    }
    setUtrError('');
    setSubmitError('');

    try {
      const result = await submitDepositMutation.mutateAsync({
        amount: parseFloat(amount),
        utrNumber: utrNumber,
      });

      if (result.__kind__ === 'utrDuplicate') {
        setUtrError('This Transaction ID has already been used.');
        return;
      }

      // Success
      setSuccessAmount(parseFloat(amount));
      if (userEmail) {
        queryClient.invalidateQueries({ queryKey: ['walletBalance', userEmail] });
      }
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      setStep('success');
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      if (raw.toLowerCase().includes('unauthorized') || raw.toLowerCase().includes('only authenticated')) {
        setSubmitError('Session error: please log out and log back in, then try again.');
      } else if (raw.toLowerCase().includes('utr') || raw.toLowerCase().includes('12')) {
        setUtrError(raw);
      } else {
        setSubmitError(raw || 'Submission failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setAmountError('');
    setUtrNumber('');
    setUtrError('');
    setSubmitError('');
    setUpiCopied(false);
    setSuccessAmount(0);
    setUpiLaunched(false);
    onClose();
  };

  const steps: Step[] = ['amount', 'utr'];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="bg-gray-950 border border-gold/30 rounded-sm max-w-md w-full p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-sm border border-gold/30">
              <IndianRupee size={18} className="text-gold" />
            </div>
            <div>
              <DialogTitle className="font-orbitron text-sm font-bold text-white tracking-wider">
                ADD FUNDS
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-rajdhani text-xs mt-0.5">
                {step === 'amount'
                  ? upiLaunched
                    ? 'Complete payment in your UPI app'
                    : 'Enter deposit amount'
                  : step === 'utr'
                  ? 'Enter UTR / Transaction ID'
                  : 'Submission received'}
              </DialogDescription>
            </div>
          </div>

          {/* Step indicator */}
          {step !== 'success' && (
            <div className="flex items-center gap-2 mt-4">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-sm text-xs font-orbitron font-bold border transition-all ${
                      step === s
                        ? 'bg-gold/20 border-gold text-gold'
                        : i < steps.indexOf(step)
                        ? 'bg-green-900/40 border-green-500/50 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}
                  >
                    {i < steps.indexOf(step) ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px transition-all ${
                        i < steps.indexOf(step) ? 'bg-green-500/50' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* ── STEP 1: Amount Input + UPI Pay Button ── */}
          {step === 'amount' && (
            <>
              {/* Show waiting state after UPI intent is launched */}
              {upiLaunched ? (
                <div className="bg-amber-900/20 border border-amber-500/40 rounded-sm p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-amber-400 shrink-0" />
                    <p className="text-amber-400 font-orbitron text-xs font-bold tracking-wider">
                      UPI APP OPENED
                    </p>
                  </div>
                  <p className="text-gray-300 font-rajdhani text-sm leading-relaxed">
                    Complete your payment of{' '}
                    <span className="text-gold font-bold">₹{parseFloat(amount).toFixed(2)}</span>{' '}
                    in your UPI app. Once done, tap <span className="text-game-red font-semibold">Verify Payment</span> below.
                  </p>
                  <p className="text-gray-500 font-rajdhani text-xs leading-relaxed">
                    Do not close this screen. The app will wait for your confirmation.
                  </p>
                </div>
              ) : (
                <div className="bg-black/60 border border-gold/20 rounded-sm p-4">
                  <p className="text-white font-rajdhani text-sm leading-relaxed">
                    Enter the amount you want to deposit. Minimum deposit is{' '}
                    <span className="text-gold font-bold">₹{MIN_AMOUNT}</span>.
                  </p>
                </div>
              )}

              {/* Amount input — hidden after UPI is launched to prevent accidental changes */}
              {!upiLaunched && (
                <div>
                  <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">AMOUNT (₹)</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-orbitron font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={MIN_AMOUNT}
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (amountError) setAmountError('');
                      }}
                      placeholder="Enter amount"
                      className="w-full bg-black/60 border border-gray-600/50 focus:border-gold rounded-sm pl-8 pr-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>
                  {amountError && (
                    <p className="text-game-red font-rajdhani text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {amountError}
                    </p>
                  )}
                </div>
              )}

              {/* Amount summary when UPI is launched */}
              {upiLaunched && (
                <div className="bg-gold/10 border border-gold/30 rounded-sm px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-400 font-rajdhani text-sm">Deposit Amount</span>
                  <span className="text-gold font-orbitron font-bold text-base">
                    ₹{parseFloat(amount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* UPI ID display with copy fallback */}
              <div className="bg-black/40 border border-gray-700/50 rounded-sm p-3 space-y-3">
                <div>
                  <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-1.5">UPI ID</p>
                  <div className="flex items-center justify-between gap-2 bg-black/60 border border-gray-700/50 rounded-sm px-3 py-2">
                    <span className="text-white font-rajdhani text-sm font-semibold">{UPI_PA}</span>
                    <button
                      onClick={handleCopyUpiId}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-700/80 hover:bg-gray-600 border border-gray-600/50 rounded-sm text-xs font-rajdhani text-silver transition-all shrink-0"
                      title="Copy UPI ID"
                    >
                      {upiCopied ? (
                        <>
                          <Check size={12} className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy UPI ID
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!upiLaunched && (
                  <div>
                    <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-1.5">SUPPORTED UPI APPS</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span
                          key={app}
                          className="px-2 py-1 bg-gray-800/80 border border-gray-700/50 rounded-sm text-gray-400 font-rajdhani text-xs"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                {!upiLaunched ? (
                  <>
                    <button
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 text-silver font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                    >
                      <X size={14} />
                      CANCEL
                    </button>
                    <button
                      onClick={handleProceedToPay}
                      disabled={!amount}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold/20 hover:bg-gold/30 disabled:opacity-40 disabled:cursor-not-allowed border border-gold/40 text-gold font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                    >
                      <Smartphone size={14} />
                      OPEN UPI APP
                      <ExternalLink size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Re-open UPI app button */}
                    <button
                      onClick={() => {
                        const parsed = parseFloat(amount);
                        triggerUpiIntent(buildUpiLink(parsed));
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 hover:bg-gray-700 border border-gray-600/50 text-silver font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                    >
                      <ExternalLink size={14} />
                      RE-OPEN
                    </button>
                    {/* Verify Payment button — only shown after UPI intent is launched */}
                    <button
                      onClick={handleVerifyPayment}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-game-red/80 hover:bg-game-red border border-game-red/60 text-white font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                    >
                      <ShieldCheck size={14} />
                      VERIFY PAYMENT
                      <ArrowRight size={12} />
                    </button>
                  </>
                )}
              </div>

              {!upiLaunched && (
                <p className="text-gray-600 font-rajdhani text-xs text-center leading-relaxed">
                  Tap "Open UPI App" to pay via GPay/PhonePe/BHIM, or copy the UPI ID above to pay manually.
                  After completing payment, tap "Verify Payment" to enter your UTR.
                </p>
              )}

              {upiLaunched && (
                <p className="text-gray-600 font-rajdhani text-xs text-center leading-relaxed">
                  Paid manually? Copy the UPI ID above and pay in your bank app, then tap "Verify Payment".
                </p>
              )}
            </>
          )}

          {/* ── STEP 2: UTR / Transaction ID Entry ── */}
          {step === 'utr' && (
            <>
              {/* Amount summary */}
              <div className="bg-gold/10 border border-gold/30 rounded-sm px-4 py-3 flex items-center justify-between">
                <span className="text-gray-400 font-rajdhani text-sm">Deposit Amount</span>
                <span className="text-gold font-orbitron font-bold text-base">
                  ₹{parseFloat(amount).toFixed(2)}
                </span>
              </div>

              {/* Payment confirmation notice */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-sm px-4 py-3 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-blue-400 font-orbitron text-xs font-bold tracking-wider">
                    PAYMENT INITIATED
                  </p>
                  <p className="text-gray-400 font-rajdhani text-xs mt-0.5 leading-relaxed">
                    Complete the payment in your UPI app, then enter the 12-digit UTR / Transaction ID from your payment receipt below.
                  </p>
                </div>
              </div>

              {/* Re-open UPI app + Copy UPI ID fallback */}
              <div className="flex items-center gap-3 justify-center flex-wrap">
                <button
                  onClick={() => {
                    const parsed = parseFloat(amount);
                    triggerUpiIntent(buildUpiLink(parsed));
                  }}
                  className="inline-flex items-center gap-1.5 text-gold font-rajdhani text-xs hover:underline"
                >
                  <ExternalLink size={12} />
                  Re-open UPI app
                </button>
                <span className="text-gray-700 text-xs">|</span>
                <button
                  onClick={handleCopyUpiId}
                  className="inline-flex items-center gap-1.5 font-rajdhani text-xs transition-colors"
                >
                  {upiCopied ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      <span className="text-green-400">UPI ID Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-gray-400" />
                      <span className="text-gray-400 hover:text-silver">Copy UPI ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* UTR / Transaction ID input */}
              <div>
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">
                  UTR / TRANSACTION ID
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold">
                    <Hash size={15} />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={UTR_LENGTH}
                    value={utrNumber}
                    onChange={handleUtrChange}
                    placeholder="Enter 12-digit UTR / Transaction ID"
                    className={`w-full bg-black/60 border rounded-sm pl-9 pr-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600 tracking-widest ${
                      utrError ? 'border-game-red/60 focus:border-game-red' : 'border-gray-600/50 focus:border-gold'
                    }`}
                  />
                </div>
                {/* Character counter */}
                <div className="flex items-center justify-between mt-1.5">
                  {utrError ? (
                    <p className="text-game-red font-rajdhani text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {utrError}
                    </p>
                  ) : (
                    <p className="text-gray-600 font-rajdhani text-xs">
                      Numeric only · exactly {UTR_LENGTH} digits required
                    </p>
                  )}
                  <span className={`font-rajdhani text-xs ml-2 shrink-0 ${utrNumber.length === UTR_LENGTH ? 'text-green-400' : 'text-gray-600'}`}>
                    {utrNumber.length}/{UTR_LENGTH}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-game-red/30 rounded-sm px-3 py-2">
                  <AlertCircle size={14} className="text-game-red mt-0.5 shrink-0" />
                  <p className="text-game-red font-rajdhani text-xs leading-relaxed">{submitError}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setStep('amount');
                    setUtrError('');
                    setSubmitError('');
                  }}
                  disabled={submitDepositMutation.isPending}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-40 border border-gray-600/50 text-silver font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                >
                  <ArrowRight size={14} className="rotate-180" />
                  BACK
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitDepositMutation.isPending || utrNumber.length !== UTR_LENGTH}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-game-red/80 hover:bg-game-red disabled:opacity-40 disabled:cursor-not-allowed border border-game-red/60 text-white font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                >
                  {submitDepositMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      SUBMIT DEPOSIT
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 'success' && (
            <div className="py-4 text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-sm bg-green-900/30 border border-green-500/40 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
              </div>

              <div>
                <p className="font-orbitron text-sm font-bold text-white tracking-wider mb-1">
                  DEPOSIT SUBMITTED
                </p>
                <p className="text-gray-400 font-rajdhani text-sm">
                  ₹{successAmount.toFixed(2)} is pending admin verification.
                </p>
              </div>

              <div className="bg-black/60 border border-gray-700/50 rounded-sm px-4 py-3 text-left space-y-2">
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest">WHAT HAPPENS NEXT</p>
                <ul className="space-y-1.5">
                  {[
                    'Admin reviews your UTR / Transaction ID',
                    'Payment is verified against UPI records',
                    'Wallet balance is credited upon approval',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 font-rajdhani text-xs">
                      <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 py-3 bg-game-red/80 hover:bg-game-red border border-game-red/60 text-white font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
              >
                <CheckCircle2 size={14} />
                DONE
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
