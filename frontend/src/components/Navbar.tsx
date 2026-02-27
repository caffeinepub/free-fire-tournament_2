import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Menu, X, Flame } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Tournaments', id: 'tournaments' },
  { label: 'Rules', id: 'rules' },
  { label: 'Leaderboard', id: 'leaderboard' },
  { label: 'Contact', id: 'contact' },
];

function isAuthenticated(): boolean {
  return localStorage.getItem('isAuthenticated') === 'true';
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setMenuOpen(false);
    if (isAuthenticated()) {
      router.navigate({ to: '/lobby' });
    } else {
      router.navigate({ to: '/' });
    }
  };

  const handleRegisterClick = () => {
    setMenuOpen(false);
    router.navigate({ to: '/register' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled
          ? '1px solid rgba(229,62,62,0.3)'
          : '1px solid rgba(229,62,62,0.1)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={handleHomeClick}
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
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              TOURNAMENT
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home link */}
            <button
              onClick={handleHomeClick}
              className="px-3 py-2 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-colors duration-200 hover:text-red-500"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Home
            </button>

            {/* Section scroll links */}
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3 py-2 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-colors duration-200 hover:text-red-500"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {link.label}
              </button>
            ))}

            {/* Register CTA */}
            <button
              onClick={handleRegisterClick}
              className="ml-3 px-5 py-2 font-orbitron font-bold text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                color: '#ffffff',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                boxShadow: '0 0 16px rgba(229,62,62,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(229,62,62,0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(229,62,62,0.4)';
              }}
            >
              Register
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
          style={{
            background: 'rgba(8,8,8,0.98)',
            borderTop: '1px solid rgba(229,62,62,0.15)',
          }}
        >
          {/* Home link */}
          <button
            onClick={handleHomeClick}
            className="w-full text-left px-3 py-2.5 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-colors duration-200 hover:text-red-500"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Home
          </button>

          {/* Section scroll links */}
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="w-full text-left px-3 py-2.5 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-colors duration-200 hover:text-red-500"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {link.label}
            </button>
          ))}

          {/* Register CTA */}
          <button
            onClick={handleRegisterClick}
            className="mt-2 w-full py-3 font-orbitron font-bold text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(229,62,62,0.4)',
            }}
          >
            Register Now
          </button>
        </div>
      )}
    </nav>
  );
}
