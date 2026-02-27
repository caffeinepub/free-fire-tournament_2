import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Eye, EyeOff, Gamepad2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRegisterUser } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { RegisterUserResult } from '../backend';

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const registerMutation = useRegisterUser();

  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    freefireUid: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    else if (!/^\d{10,15}$/.test(form.whatsapp.replace(/\s/g, '')))
      newErrors.whatsapp = 'Enter a valid phone number';
    if (!form.freefireUid.trim()) newErrors.freefireUid = 'Free Fire UID is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        freefireUid: form.freefireUid.trim(),
        password: form.password,
      });

      if (result === RegisterUserResult.success) {
        setAuth(form.name.trim(), form.email.trim(), form.freefireUid.trim());
        router.navigate({ to: '/lobby' });
      } else if (result === RegisterUserResult.emailExists) {
        setErrors({ email: 'An account with this email already exists.' });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-game-black flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
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
            Join the arena and compete for glory
          </p>

          {errors.general && (
            <div className="bg-game-red/20 border border-game-red/50 rounded-sm px-4 py-3 mb-4 text-game-red text-sm font-rajdhani">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'FULL NAME', type: 'text', placeholder: 'Your full name' },
              { field: 'email', label: 'EMAIL', type: 'email', placeholder: 'your@email.com' },
              { field: 'whatsapp', label: 'WHATSAPP NUMBER', type: 'tel', placeholder: '10-digit number' },
              { field: 'freefireUid', label: 'FREE FIRE UID', type: 'text', placeholder: 'Your in-game UID' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-black/60 border border-gray-700 focus:border-game-red rounded-sm px-4 py-3 text-white font-rajdhani text-sm outline-none transition-colors placeholder:text-gray-600"
                />
                {errors[field] && (
                  <p className="text-game-red text-xs mt-1 font-rajdhani">{errors[field]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
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

            <div>
              <label className="block text-silver text-xs font-orbitron mb-1 tracking-wider">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
