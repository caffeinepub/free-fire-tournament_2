import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, Flame } from 'lucide-react';
import SecurePayment from '../components/SecurePayment';
import WhatsAppChannelBanner from '../components/WhatsAppChannelBanner';
import RegistrationForm from '../components/RegistrationForm';
import { Heart } from 'lucide-react';

function RegisterFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'freefire-tournament'
  );
  return (
    <footer
      className="py-8 px-4 sm:px-6"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(229,62,62,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © {year} Free Fire Tournament. All rights reserved.
        </p>
        <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Built with{' '}
          <Heart
            className="w-3 h-3 inline"
            style={{ color: '#e53e3e', fill: '#e53e3e' }}
          />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:underline"
            style={{ color: '#e53e3e' }}
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  // Always navigate back to the Live Lobby, never to auth/landing pages
  const handleBackToHome = () => {
    router.navigate({ to: '/lobby' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-6"
        style={{
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229,62,62,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-all duration-200 group"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#e53e3e';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to Lobby
          </button>

          {/* Brand */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 group"
          >
            <Flame
              className="w-5 h-5 transition-all duration-300 group-hover:scale-110"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.7))' }}
            />
            <span
              className="font-orbitron font-bold text-base tracking-wider"
              style={{ color: '#e53e3e', textShadow: '0 0 10px rgba(229,62,62,0.4)' }}
            >
              FREE FIRE
            </span>
            <span
              className="hidden sm:inline font-rajdhani font-semibold text-sm tracking-widest"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              TOURNAMENT
            </span>
          </button>
        </div>
      </header>

      {/* Page title */}
      <div
        className="py-10 px-4 sm:px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #150303 100%)',
          borderBottom: '1px solid rgba(229,62,62,0.15)',
        }}
      >
        {/* Accent line */}
        <div
          className="h-1 w-24 mx-auto mb-6"
          style={{
            background: 'linear-gradient(90deg, transparent, #e53e3e, transparent)',
            boxShadow: '0 0 12px rgba(229,62,62,0.6)',
          }}
        />
        <h1
          className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase"
          style={{
            color: '#ffffff',
            textShadow: '0 0 30px rgba(229,62,62,0.4), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          TOURNAMENT{' '}
          <span
            style={{
              color: '#e53e3e',
              textShadow: '0 0 40px rgba(229,62,62,0.7)',
            }}
          >
            REGISTRATION
          </span>
        </h1>
        <p
          className="font-rajdhani text-base sm:text-lg mt-3"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Complete payment first, then fill in your details below.
        </p>
      </div>

      {/* Main content */}
      <main>
        {/* Step 1: Secure Payment */}
        <SecurePayment />

        {/* WhatsApp Channel Banner */}
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderTop: '1px solid rgba(37,211,102,0.15)',
            borderBottom: '1px solid rgba(37,211,102,0.15)',
          }}
        >
          <WhatsAppChannelBanner />
        </div>

        {/* Step 2: Registration Form */}
        <RegistrationForm />
      </main>

      <RegisterFooter />
    </div>
  );
}
