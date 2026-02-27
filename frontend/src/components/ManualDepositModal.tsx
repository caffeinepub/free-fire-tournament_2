import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Smartphone,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSubmitDeposit } from '../hooks/useQueries';

interface ManualDepositModalProps {
  open: boolean;
  onClose: () => void;
}

const UPI_PA = '8728872927@fam';
const UPI_PN = 'FreeFireTournament';
const MIN_AMOUNT = 20;

type Step = 'amount' | 'upload' | 'success';

export default function ManualDepositModal({ open, onClose }: ManualDepositModalProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [upiLaunched, setUpiLaunched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitDepositMutation = useSubmitDeposit();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleProceedToPay = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < MIN_AMOUNT) {
      setAmountError(`Minimum deposit amount is ₹${MIN_AMOUNT}.`);
      return;
    }
    setAmountError('');

    // Build UPI deep link
    const upiLink = `upi://pay?pa=${UPI_PA}&pn=${encodeURIComponent(UPI_PN)}&am=${parsed.toFixed(2)}&cu=INR`;

    // Trigger the UPI intent — opens installed UPI apps chooser on mobile
    window.location.href = upiLink;
    setUpiLaunched(true);

    // Advance to upload step after a short delay so the UPI app can open
    setTimeout(() => {
      setStep('upload');
    }, 800);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setSubmitError('Please upload a payment screenshot.');
      return;
    }
    if (!transactionId.trim()) {
      setSubmitError('Please enter the Transaction ID.');
      return;
    }
    setSubmitError('');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      await submitDepositMutation.mutateAsync({
        amount: parseFloat(amount),
        transactionId: transactionId.trim(),
        screenshotBytes: bytes,
      });
      setStep('success');
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      // Provide a friendly message for auth errors
      if (raw.toLowerCase().includes('unauthorized') || raw.toLowerCase().includes('only authenticated')) {
        setSubmitError(
          'Session error: please log out and log back in, then try again.'
        );
      } else {
        setSubmitError(raw || 'Submission failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setAmountError('');
    setSelectedFile(null);
    setTransactionId('');
    setSubmitError('');
    setUpiLaunched(false);
    onClose();
  };

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
                  ? 'Enter deposit amount'
                  : step === 'upload'
                  ? 'Upload payment proof'
                  : 'Submission received'}
              </DialogDescription>
            </div>
          </div>

          {/* Step indicator */}
          {step !== 'success' && (
            <div className="flex items-center gap-2 mt-4">
              {(['amount', 'upload'] as const).map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-sm text-xs font-orbitron font-bold border transition-all ${
                      step === s
                        ? 'bg-gold/20 border-gold text-gold'
                        : i < (['amount', 'upload'] as const).indexOf(step)
                        ? 'bg-green-900/40 border-green-500/50 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-600'
                    }`}
                  >
                    {i < (['amount', 'upload'] as const).indexOf(step) ? '✓' : i + 1}
                  </div>
                  {i < 1 && (
                    <div
                      className={`flex-1 h-px transition-all ${
                        i < (['amount', 'upload'] as const).indexOf(step)
                          ? 'bg-green-500/50'
                          : 'bg-gray-700'
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
              <div className="bg-black/60 border border-gold/20 rounded-sm p-4">
                <p className="text-white font-rajdhani text-sm leading-relaxed">
                  Enter the amount you want to deposit. Minimum deposit is{' '}
                  <span className="text-gold font-bold">₹{MIN_AMOUNT}</span>.
                </p>
              </div>

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

              {/* UPI apps info */}
              <div className="bg-black/40 border border-gray-700/50 rounded-sm p-3">
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">SUPPORTED UPI APPS</p>
                <div className="flex items-center gap-3">
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

              <div className="flex gap-3 pt-1">
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
                  PROCEED TO PAY
                  <ExternalLink size={12} />
                </button>
              </div>

              <p className="text-gray-600 font-rajdhani text-xs text-center leading-relaxed">
                Tapping "Proceed to Pay" will open your UPI app to complete the payment.
                After paying, you'll be asked to upload the screenshot.
              </p>
            </>
          )}

          {/* ── STEP 2: Screenshot Upload ── */}
          {step === 'upload' && (
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
                    Complete the payment in your UPI app, then upload the screenshot below for verification.
                  </p>
                </div>
              </div>

              {/* Re-open UPI app link */}
              <div className="text-center">
                <button
                  onClick={() => {
                    const parsed = parseFloat(amount);
                    const upiLink = `upi://pay?pa=${UPI_PA}&pn=${encodeURIComponent(UPI_PN)}&am=${parsed.toFixed(2)}&cu=INR`;
                    window.location.href = upiLink;
                  }}
                  className="inline-flex items-center gap-1.5 text-gold font-rajdhani text-xs hover:underline"
                >
                  <ExternalLink size={12} />
                  Re-open UPI app to pay
                </button>
              </div>

              {/* Transaction ID */}
              <div>
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">
                  TRANSACTION ID
                </p>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter UPI transaction ID"
                  className="w-full bg-black/60 border border-gray-600/50 focus:border-gold rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Screenshot upload */}
              <div>
                <p className="text-gray-500 font-rajdhani text-xs tracking-widest mb-2">
                  PAYMENT SCREENSHOT
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm p-6 cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-green-500/50 bg-green-900/10'
                      : 'border-gray-700 hover:border-gold/40 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <>
                      <CheckCircle2 size={28} className="text-green-400" />
                      <div className="text-center">
                        <p className="text-green-400 font-rajdhani text-sm font-semibold">
                          {selectedFile.name}
                        </p>
                        <p className="text-gray-500 font-rajdhani text-xs mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB — tap to change
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-600" />
                      <div className="text-center">
                        <p className="text-gray-400 font-rajdhani text-sm">
                          Tap to upload screenshot
                        </p>
                        <p className="text-gray-600 font-rajdhani text-xs mt-0.5">
                          JPG, PNG, WEBP supported
                        </p>
                      </div>
                    </>
                  )}
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
                    setSubmitError('');
                    setUpiLaunched(false);
                  }}
                  disabled={submitDepositMutation.isPending}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-40 border border-gray-600/50 text-silver font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                >
                  <ArrowRight size={14} className="rotate-180" />
                  BACK
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !selectedFile || !transactionId.trim() || submitDepositMutation.isPending
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700/80 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed border border-green-600/50 text-white font-orbitron font-bold rounded-sm transition-all tracking-wider text-xs"
                >
                  {submitDepositMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      SUBMIT FOR REVIEW
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="p-4 bg-green-900/30 rounded-full border border-green-500/40">
                <CheckCircle2 size={36} className="text-green-400" />
              </div>
              <div>
                <p className="font-orbitron text-base font-bold text-white tracking-wider">
                  PAYMENT SUBMITTED
                </p>
                <p className="text-gray-400 font-rajdhani text-sm mt-2 leading-relaxed">
                  Your payment screenshot is under review.{' '}
                  <span className="text-gold font-semibold">
                    ₹{parseFloat(amount).toFixed(2)}
                  </span>{' '}
                  will be credited to your wallet once verified by our team.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold font-orbitron text-xs font-bold rounded-sm transition-all tracking-wider"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
