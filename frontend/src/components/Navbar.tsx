import { useState, useEffect } from 'react';
import { Menu, X, Flame } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Register', href: '#register' },
  { label: 'Rules', href: '#rules' },
  { label: 'Leaderboard', href: '#leaderboard' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10, 10, 10, 0.97)'
          : 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(229, 62, 62, 0.3)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2 group"
          >
            <Flame
              className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.7))' }}
            />
            <span
              className="font-orbitron font-bold text-lg tracking-wider"
              style={{ color: '#e53e3e', textShadow: '0 0 10px rgba(229,62,62,0.4)' }}
            >
              FREE FIRE
            </span>
            <span className="font-rajdhani font-semibold text-sm tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
              TOURNAMENT
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-4 py-2 font-rajdhani font-semibold text-sm tracking-wider transition-all duration-200 group"
                  style={{
                    color: isActive ? '#e53e3e' : 'rgba(255,255,255,0.7)',
                    textShadow: isActive ? '0 0 8px rgba(229,62,62,0.5)' : 'none',
                  }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200"
                    style={{
                      background: '#e53e3e',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      boxShadow: '0 0 6px rgba(229,62,62,0.6)',
                    }}
                  />
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{
                      background: '#e53e3e',
                      transform: 'scaleX(1)',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 transition-colors duration-200"
            style={{ color: isOpen ? '#e53e3e' : 'rgba(255,255,255,0.8)' }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? '400px' : '0',
          background: 'rgba(10, 10, 10, 0.98)',
          borderTop: isOpen ? '1px solid rgba(229, 62, 62, 0.2)' : 'none',
        }}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 font-rajdhani font-semibold text-base tracking-wider transition-all duration-200"
                style={{
                  color: isActive ? '#e53e3e' : 'rgba(255,255,255,0.8)',
                  borderLeft: isActive ? '3px solid #e53e3e' : '3px solid transparent',
                  background: isActive ? 'rgba(229, 62, 62, 0.08)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
