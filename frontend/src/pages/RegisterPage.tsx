import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import RegistrationForm from '../components/RegistrationForm';
import SecurePayment from '../components/SecurePayment';

export default function RegisterPage() {
  const router = useRouter();

  const handleBack = () => {
    router.navigate({ to: '/lobby', replace: true });
  };

  return (
    <div className="min-h-screen bg-game-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-black/90 border-b border-game-red/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-silver hover:text-gold transition-colors font-rajdhani text-sm"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Lobby</span>
          </button>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Gamepad2 className="text-game-red" size={22} />
            <span className="font-orbitron text-base font-black text-white tracking-widest">
              FF<span className="text-game-red">ARENA</span>
            </span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-widest">
            TOURNAMENT <span className="text-game-red">REGISTRATION</span>
          </h1>
          <p className="text-silver font-rajdhani text-sm mt-2">
            Complete payment and fill in your details to secure your slot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurePayment />
          <RegistrationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-8 py-6 text-center">
        <p className="text-gray-600 font-rajdhani text-xs">
          © {new Date().getFullYear()} FFArena. Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
