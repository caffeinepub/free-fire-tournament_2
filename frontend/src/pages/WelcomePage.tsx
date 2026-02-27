import { useRouter } from '@tanstack/react-router';
import { Flame, Swords, Shield, Trophy } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,62,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Free Fire character image — right side, full height */}
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: '55%',
          zIndex: 1,
          background:
            'linear-gradient(to right, #0a0a0a 0%, transparent 30%)',
        }}
      >
        <img
          src="/assets/generated/free-fire-character.dim_800x1200.png"
          alt="Free Fire Character"
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.75 }}
        />
        {/* Gradient overlay to blend character into background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.5) 35%, transparent 65%), linear-gradient(to top, #0a0a0a 0%, transparent 20%)',
          }}
        />
      </div>

      {/* Red accent glow behind character */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '10%',
          top: '20%',
          width: '300px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(229,62,62,0.12) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-5">
          <div className="flex items-center gap-2">
            <Flame
              className="w-6 h-6"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.8))' }}
            />
            <span
              className="font-orbitron font-black text-base sm:text-lg tracking-widest uppercase"
              style={{ color: '#e53e3e', textShadow: '0 0 12px rgba(229,62,62,0.5)' }}
            >
              FREE FIRE
            </span>
            <span
              className="font-rajdhani font-semibold text-xs sm:text-sm tracking-widest uppercase hidden sm:inline"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              TOURNAMENT
            </span>
          </div>

          {/* Top-right badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1"
            style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid rgba(229,62,62,0.3)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#e53e3e', boxShadow: '0 0 6px rgba(229,62,62,0.8)' }}
            />
            <span
              className="font-orbitron text-xs tracking-widest uppercase"
              style={{ color: '#e53e3e' }}
            >
              LIVE
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-16 max-w-lg">
          {/* Tag line */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 self-start"
            style={{
              background: 'rgba(229,62,62,0.08)',
              border: '1px solid rgba(229,62,62,0.25)',
              borderLeft: '3px solid #e53e3e',
            }}
          >
            <Swords className="w-3.5 h-3.5" style={{ color: '#e53e3e' }} />
            <span
              className="font-rajdhani font-bold text-xs tracking-widest uppercase"
              style={{ color: '#e53e3e' }}
            >
              BATTLE ROYALE TOURNAMENTS
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight uppercase mb-4 animate-slide-up"
            style={{
              color: '#ffffff',
              textShadow: '0 0 30px rgba(229,62,62,0.3)',
            }}
          >
            ENTER THE
            <br />
            <span
              style={{
                color: '#e53e3e',
                textShadow: '0 0 20px rgba(229,62,62,0.7), 0 0 40px rgba(229,62,62,0.3)',
              }}
            >
              ARENA
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-rajdhani text-base sm:text-lg mb-8 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '380px' }}
          >
            Compete in Free Fire tournaments, win real prizes, and prove you're the last one standing.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 mb-10">
            {[
              { icon: Trophy, label: 'Prize Pool', value: '₹100+' },
              { icon: Shield, label: 'Rooms', value: '5 Active' },
              { icon: Swords, label: 'Entry', value: '₹10' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className="w-3 h-3" style={{ color: '#e53e3e' }} />
                  <span
                    className="font-rajdhani text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  className="font-orbitron font-bold text-sm"
                  style={{ color: '#ffffff' }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            {/* Sign Up — primary */}
            <button
              onClick={() => router.navigate({ to: '/signup' })}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #e53e3e 0%, #c0392b 100%)',
                color: '#ffffff',
                border: '1px solid rgba(229,62,62,0.6)',
                boxShadow: '0 0 20px rgba(229,62,62,0.4), 0 4px 15px rgba(0,0,0,0.4)',
                clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
              }}
            >
              <Swords className="w-4 h-4" />
              SIGN UP
            </button>

            {/* Login — secondary */}
            <button
              onClick={() => router.navigate({ to: '/login' })}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 hover:scale-[1.02]"
              style={{
                background: 'transparent',
                color: '#e53e3e',
                border: '1px solid rgba(229,62,62,0.5)',
                boxShadow: '0 0 10px rgba(229,62,62,0.1)',
                clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
              }}
            >
              LOGIN
            </button>
          </div>

          {/* Hint */}
          <p
            className="font-rajdhani text-xs mt-4 tracking-wide"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            New player? Sign up to join tournaments. Already have an account? Login to continue.
          </p>
        </main>

        {/* Footer */}
        <footer
          className="px-6 sm:px-10 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p
            className="font-rajdhani text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            © {new Date().getFullYear()} Free Fire Tournament
          </p>
          <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Built with{' '}
            <span style={{ color: '#e53e3e' }}>♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'freefire-tournament')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors"
              style={{ color: '#e53e3e' }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
