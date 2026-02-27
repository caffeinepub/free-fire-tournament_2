import { Flame, LogIn, UserPlus, Swords } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface LandingGateProps {
  onLogin: () => void;
}

export default function LandingGate({ onLogin }: LandingGateProps) {
  const router = useRouter();

  const handleRegister = () => {
    router.navigate({ to: '/register' });
  };

  const handleLogin = () => {
    router.navigate({ to: '/lobby' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,62,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(229,62,62,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
        style={{
          borderTop: '2px solid rgba(229,62,62,0.4)',
          borderLeft: '2px solid rgba(229,62,62,0.4)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          borderTop: '2px solid rgba(229,62,62,0.4)',
          borderRight: '2px solid rgba(229,62,62,0.4)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none"
        style={{
          borderBottom: '2px solid rgba(229,62,62,0.4)',
          borderLeft: '2px solid rgba(229,62,62,0.4)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          borderBottom: '2px solid rgba(229,62,62,0.4)',
          borderRight: '2px solid rgba(229,62,62,0.4)',
        }}
      />

      {/* Main content card */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 py-10 sm:py-14 w-full max-w-lg mx-4"
        style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(229,62,62,0.25)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Icon + brand */}
        <div className="flex items-center gap-3 mb-3">
          <Flame
            className="w-8 h-8"
            style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 8px rgba(229,62,62,0.8))' }}
          />
          <Swords
            className="w-7 h-7"
            style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.6))' }}
          />
          <Flame
            className="w-8 h-8"
            style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 8px rgba(229,62,62,0.8))' }}
          />
        </div>

        <h1
          className="font-orbitron font-black text-3xl sm:text-4xl tracking-widest uppercase mb-1"
          style={{
            color: '#e53e3e',
            textShadow: '0 0 20px rgba(229,62,62,0.6), 0 0 40px rgba(229,62,62,0.3)',
          }}
        >
          FREE FIRE
        </h1>
        <p
          className="font-rajdhani font-bold text-lg sm:text-xl tracking-[0.3em] uppercase mb-2"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          TOURNAMENT
        </p>

        {/* Divider */}
        <div
          className="w-24 h-px mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, #e53e3e, transparent)' }}
        />

        {/* Tagline */}
        <p
          className="font-rajdhani text-base sm:text-lg mb-2"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Compete. Dominate. Claim the Prize.
        </p>
        <p
          className="font-rajdhani text-sm mb-10"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Entry Fee: ₹10 &nbsp;|&nbsp; Prize Pool: ₹100
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Register button */}
          <button
            onClick={handleRegister}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 50%, #c53030 100%)',
              color: '#fff',
              border: '1px solid rgba(229,62,62,0.6)',
              boxShadow: '0 0 20px rgba(229,62,62,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 30px rgba(229,62,62,0.7), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 20px rgba(229,62,62,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            <UserPlus className="w-4 h-4" />
            Register Now
          </button>

          {/* Login / Already Registered button */}
          <button
            onClick={handleLogin}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(229,62,62,0.35)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,62,62,0.7)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 12px rgba(229,62,62,0.2), inset 0 1px 0 rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,62,62,0.35)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                'inset 0 1px 0 rgba(255,255,255,0.05)';
            }}
          >
            <LogIn className="w-4 h-4" />
            Already Registered
          </button>
        </div>

        {/* Sub-hint */}
        <p
          className="font-rajdhani text-xs mt-6"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Click "Already Registered" to view active tournament rooms
        </p>
      </div>

      {/* Bottom attribution */}
      <p
        className="absolute bottom-4 font-rajdhani text-xs"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        © {new Date().getFullYear()} Free Fire Tournament
      </p>
    </div>
  );
}
