import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TournamentsList from './components/TournamentsList';
import SecurePayment from './components/SecurePayment';
import RegistrationForm from './components/RegistrationForm';
import Rules from './pages/Rules';
import Leaderboard from './components/Leaderboard';
import Contact from './components/Contact';
import { Flame, Heart } from 'lucide-react';

function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'freefire-tournament'
  );

  return (
    <footer
      className="py-10 px-4 sm:px-6"
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(229,62,62,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Flame
              className="w-5 h-5"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 4px rgba(229,62,62,0.6))' }}
            />
            <span className="font-orbitron font-bold text-base" style={{ color: '#e53e3e' }}>
              FREE FIRE
            </span>
            <span className="font-rajdhani font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              TOURNAMENT
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['home', 'tournaments', 'register', 'rules', 'leaderboard', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
                className="font-rajdhani text-sm tracking-wider uppercase transition-colors duration-200 hover:text-red-500"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
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
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />
      <main>
        <Hero />
        <TournamentsList />
        <SecurePayment />
        <RegistrationForm />
        <Rules />
        <Leaderboard />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
