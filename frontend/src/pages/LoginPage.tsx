import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Eye, EyeOff, Gamepad2, ArrowLeft, Loader2 } from 'lucide-react';
import { useLoginUser } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const loginMutation = useLoginUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
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
      const result = await loginMutation.mutateAsync({ email: email.trim(), password });
      if (result.__kind__ === 'success') {
        const user = result.success;
        setAuth(user.name, user.email, user.freefireUid);
        router.navigate({ to: '/lobby' });
      } else if (result.__kind__ === 'userNotFound') {
        setErrors({ general: 'No account found with this email.' });
      } else if (result.__kind__ === 'passwordIncorrect') {
        setErrors({ password: 'Incorrect password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-game-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
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
            PLAYER LOGIN
          </h1>
          <p className="text-silver text-sm text-center font-rajdhani mb-6">
            Enter your credentials to access the arena
          </p>

          {errors.general && (
            <div className="bg-game-red/20 border border-game-red/50 rounded-sm px-4 py-3 mb-4 text-game-red text-sm font-rajdhani">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-game-red hover:bg-red-700 disabled:opacity-60 text-white font-orbitron font-bold py-3 rounded-sm transition-colors flex items-center justify-center gap-2 tracking-wider text-sm"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  LOGGING IN...
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          <p className="text-center text-silver text-sm font-rajdhani mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => router.navigate({ to: '/signup' })}
              className="text-gold hover:text-yellow-300 transition-colors font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
