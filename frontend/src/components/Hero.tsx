import CountdownTimer from './CountdownTimer';
import { ChevronDown } from 'lucide-react';

// Next tournament date: 30 days from now
const TOURNAMENT_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export default function Hero() {
  const handleRegisterClick = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    const el = document.getElementById('tournaments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.png')" }}
      />

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(10,0,0,0.75) 50%, rgba(0,0,0,0.9) 100%)',
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Red accent lines */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #e53e3e, transparent)', boxShadow: '0 0 20px rgba(229,62,62,0.8)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(229,62,62,0.4), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className="px-4 py-1.5 font-rajdhani font-semibold text-sm tracking-widest uppercase"
            style={{
              background: 'rgba(229, 62, 62, 0.15)',
              border: '1px solid rgba(229, 62, 62, 0.5)',
              color: '#e53e3e',
            }}
          >
            ⚡ Season 2026 — Now Open
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-4 animate-flicker"
          style={{
            color: '#ffffff',
            textShadow: '0 0 30px rgba(229,62,62,0.4), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          FREE FIRE
          <br />
          <span
            style={{
              color: '#e53e3e',
              textShadow: '0 0 40px rgba(229,62,62,0.7), 0 0 80px rgba(229,62,62,0.3)',
            }}
          >
            TOURNAMENT
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-rajdhani font-medium text-lg sm:text-xl md:text-2xl mb-3 tracking-wide"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Prove your dominance. Claim the throne. Win the glory.
        </p>
        <p
          className="font-rajdhani text-base sm:text-lg mb-10"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Grand Prize Pool: <span style={{ color: '#f6c90e', fontWeight: 700 }}>$5,000+</span> &nbsp;|&nbsp; Open to all squads
        </p>

        {/* Countdown */}
        <div className="flex flex-col items-center mb-10">
          <p
            className="font-rajdhani font-semibold text-sm tracking-widest uppercase mb-4"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Next Tournament Starts In
          </p>
          <CountdownTimer targetDate={TOURNAMENT_DATE} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleRegisterClick}
            className="relative group px-10 py-4 font-orbitron font-bold text-base tracking-widest uppercase transition-all duration-300 overflow-hidden"
            style={{
              background: '#e53e3e',
              color: '#ffffff',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              boxShadow: '0 0 20px rgba(229,62,62,0.5)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(229,62,62,0.8)';
              (e.currentTarget as HTMLButtonElement).style.background = '#c0392b';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(229,62,62,0.5)';
              (e.currentTarget as HTMLButtonElement).style.background = '#e53e3e';
            }}
          >
            🔥 Register Now
          </button>

          <button
            onClick={() => document.getElementById('tournaments')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 font-orbitron font-bold text-base tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.3)',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(229,62,62,0.6)';
              (e.currentTarget as HTMLButtonElement).style.color = '#e53e3e';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
            }}
          >
            View Tournaments
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-300 hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <span className="font-rajdhani text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}
