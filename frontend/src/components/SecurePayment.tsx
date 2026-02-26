import { useState } from 'react';
import { Copy, CheckCheck, ShieldCheck, CameraIcon } from 'lucide-react';

const UPI_ID = '8728872927@fam';

export default function SecurePayment() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = UPI_ID;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="payment"
      className="py-20 px-4 sm:px-6"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0404 40%, #150303 70%, #0a0a0a 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span
              className="font-rajdhani font-semibold text-sm tracking-widest uppercase"
              style={{ color: '#e53e3e' }}
            >
              Entry Fee
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl flex items-center justify-center gap-3"
            style={{ color: '#ffffff', textShadow: '0 0 24px rgba(229,62,62,0.35)' }}
          >
            <ShieldCheck
              className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 8px rgba(229,62,62,0.6))' }}
            />
            SECURE PAYMENT
          </h2>
          <p
            className="font-rajdhani text-base sm:text-lg mt-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Complete your payment before filling the registration form.
          </p>
        </div>

        {/* Payment Card */}
        <div
          className="relative p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, #1f0505 0%, #180404 50%, #120303 100%)',
            border: '1px solid rgba(229, 62, 62, 0.4)',
            boxShadow: '0 8px 40px rgba(229,62,62,0.12), inset 0 1px 0 rgba(229,62,62,0.1)',
          }}
        >
          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2"
            style={{ borderColor: '#e53e3e' }}
          />
          <div
            className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2"
            style={{ borderColor: '#e53e3e' }}
          />
          <div
            className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2"
            style={{ borderColor: '#e53e3e' }}
          />
          <div
            className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2"
            style={{ borderColor: '#e53e3e' }}
          />

          {/* Instruction text */}
          <p
            className="font-rajdhani text-base sm:text-lg text-center mb-6 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Pay the entry fee to the following UPI ID to participate:
          </p>

          {/* UPI ID display + Copy button */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 mb-6"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(229,62,62,0.3)',
            }}
          >
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span
                className="font-rajdhani text-xs tracking-widest uppercase"
                style={{ color: 'rgba(229,62,62,0.7)' }}
              >
                UPI ID
              </span>
              <span
                className="font-orbitron font-bold text-xl sm:text-2xl tracking-wide"
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 12px rgba(229,62,62,0.4)',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                }}
              >
                {UPI_ID}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-3 font-orbitron font-bold text-sm tracking-wider uppercase transition-all duration-300 flex-shrink-0"
              style={{
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(229,62,62,0.15)',
                border: copied ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(229,62,62,0.5)',
                color: copied ? '#22c55e' : '#e53e3e',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                boxShadow: copied
                  ? '0 0 12px rgba(34,197,94,0.2)'
                  : '0 0 12px rgba(229,62,62,0.2)',
                cursor: 'pointer',
                minWidth: '120px',
                justifyContent: 'center',
              }}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy ID
                </>
              )}
            </button>
          </div>

          {/* Screenshot note */}
          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: 'rgba(229,62,62,0.06)',
              border: '1px solid rgba(229,62,62,0.2)',
            }}
          >
            <CameraIcon
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: '#e53e3e' }}
            />
            <p
              className="font-rajdhani font-semibold text-sm sm:text-base"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Please keep the transaction screenshot ready for the form.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
