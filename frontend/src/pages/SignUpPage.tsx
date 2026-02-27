import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Eye, EyeOff, Gamepad2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRegisterUser } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { RegisterUserResult } from '../backend';

const CREDS_KEY = 'ff_creds';

interface StoredCred {
  name: string;
  email: string;
  uid: string;
  password: string;
}

function saveCredentials(cred: StoredCred) {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    const existing: StoredCred[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((c) => c.email.toLowerCase() !== cred.email.toLowerCase());
    filtered.push(cred);
    localStorage.setItem(CREDS_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const registerMutation = useRegisterUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string;
    freefireUid?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    if (!freefireUid.trim()) newErrors.freefireUid = 'Free Fire UID is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const result = await registerMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        freefireUid: freefireUid.trim(),
        password,
      });

      if (result === RegisterUserResult.success) {
        // Persist credentials locally for future logins
        saveCredentials({
          name: name.trim(),
          email: email.trim(),
          uid: freefireUid.trim(),
          password,
        });
        setAuth(name.trim(), email.trim(), freefireUid.trim());
        router.navigate({ to: '/lobby' });
      } else if (result === RegisterUserResult.emailExists) {
        setErrors({ email: 'An account with this email already exists.' });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-game-black flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => router.navigate({ to: '/' })}
        className="absolute top-6 left-6 flex items-center gap-2 text-silver hover:text-gold transition-colors font-rajdhani text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Gamepad2 className="text-game-red" size={36} />
          <span className="font-orbitron text-2xl font-black text-white tracking-widest">
            FF<span className="text-game-red">ARENA</span>
          </span>
        </div>

        <div className="bg-gray-900/80 border border-game-red/30 rounded-sm p-8 shadow-red-glow">
          <h1 className="font-orbitron text-xl font-bold text-white mb-2 text-center">
            CREATE ACCOUNT
          </h1>
          <p className="text-silver text-sm text-center font-rajdhani mb-6">
            Join the arena and start competing
          </p>

          {errors.general && (
            <div className="bg-game-red/20 border border-game-red/50 rounded-sm px-4 py-3 mb-4 text-game-red text-sm font-rajdhani">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                PLAYER NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.name && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.email && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.email}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                WHATSAPP NUMBER
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.whatsapp && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.whatsapp}</p>
              )}
            </div>

            {/* Free Fire UID */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                FREE FIRE UID
              </label>
              <input
                type="text"
                value={freefireUid}
                onChange={(e) => setFreefireUid(e.target.value)}
                placeholder="Your in-game UID"
                className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.freefireUid && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.freefireUid}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 pr-12 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-silver transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                CONFIRM PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
              />
              {errors.confirmPassword && (
                <p className="text-game-red text-xs mt-1 font-rajdhani">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-game-red hover:bg-red-700 disabled:opacity-60 text-white font-orbitron font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2 tracking-wider text-sm mt-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>

          <p className="text-center text-silver text-sm font-rajdhani mt-6">
            Already have an account?{' '}
            <button
              onClick={() => router.navigate({ to: '/login' })}
              className="text-gold hover:text-yellow-300 transition-colors font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
