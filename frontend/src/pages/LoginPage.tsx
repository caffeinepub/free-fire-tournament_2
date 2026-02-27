import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Flame, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useLoginUser } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const loginMutation = useLoginUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await loginMutation.mutateAsync({ email: email.trim(), password });

      if (result.__kind__ === 'success') {
        setAuth(result.success.name, result.success.email);
        router.navigate({ to: '/lobby' });
      } else if (result.__kind__ === 'userNotFound') {
        setErrors({ general: 'No account found with this email. Please sign up first.' });
      } else if (result.__kind__ === 'passwordIncorrect') {
        setErrors({ general: 'Incorrect password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
  };

  const inputStyle = (hasError: boolean) => ({
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${hasError ? '#e53e3e' : 'rgba(255,255,255,0.12)'}`,
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

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
            'linear-gradient(rgba(229,62,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Character image — faded background */}
      <div
        className="absolute inset-y-0 right-0 pointer-events-none hidden md:block"
        style={{ width: '45%', zIndex: 1 }}
      >
        <img
          src="/assets/generated/free-fire-character.dim_800x1200.png"
          alt=""
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.2 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.7) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Red glow accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(229,62,62,0.06) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-5">
          <button
            onClick={() => router.navigate({ to: '/' })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Flame
              className="w-5 h-5"
              style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.8))' }}
            />
            <span
              className="font-orbitron font-black text-sm tracking-widest uppercase"
              style={{ color: '#e53e3e' }}
            >
              FREE FIRE
            </span>
          </button>
        </header>

        {/* Form area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Card */}
            <div
              className="p-6 sm:p-8"
              style={{
                background: 'rgba(17,17,17,0.95)',
                border: '1px solid rgba(229,62,62,0.2)',
                borderTop: '3px solid #e53e3e',
                boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(229,62,62,0.05)',
              }}
            >
              {/* Title */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <LogIn className="w-5 h-5" style={{ color: '#e53e3e' }} />
                  <h1
                    className="font-orbitron font-black text-xl sm:text-2xl tracking-widest uppercase"
                    style={{ color: '#ffffff' }}
                  >
                    LOGIN
                  </h1>
                </div>
                <p className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Welcome back, soldier. Enter your credentials.
                </p>
                <div
                  className="w-16 h-0.5 mt-3"
                  style={{ background: 'linear-gradient(90deg, #e53e3e, transparent)' }}
                />
              </div>

              {/* General error */}
              {errors.general && (
                <div
                  className="flex items-center gap-2 px-4 py-3 mb-6"
                  style={{
                    background: 'rgba(229,62,62,0.08)',
                    border: '1px solid rgba(229,62,62,0.3)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#e53e3e' }} />
                  <p className="font-rajdhani text-sm" style={{ color: '#e53e3e' }}>
                    {errors.general}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-rajdhani font-bold text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 font-rajdhani text-sm"
                    style={inputStyle(!!errors.email)}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="font-rajdhani text-xs" style={{ color: '#e53e3e' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-rajdhani font-bold text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 font-rajdhani text-sm"
                      style={inputStyle(!!errors.password)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="font-rajdhani text-xs" style={{ color: '#e53e3e' }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{
                    background: loginMutation.isPending
                      ? 'rgba(229,62,62,0.5)'
                      : 'linear-gradient(135deg, #e53e3e 0%, #c0392b 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(229,62,62,0.6)',
                    boxShadow: loginMutation.isPending ? 'none' : '0 0 20px rgba(229,62,62,0.3)',
                  }}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      LOGGING IN...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      LOGIN
                    </>
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-rajdhani text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  New player?{' '}
                  <button
                    onClick={() => router.navigate({ to: '/signup' })}
                    className="font-bold transition-colors hover:underline"
                    style={{ color: '#e53e3e' }}
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
