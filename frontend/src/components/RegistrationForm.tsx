import { useState } from 'react';
import { useRegisterPlayer } from '../hooks/useQueries';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  playerName: string;
  inGameId: string;
  teamName: string;
  whatsappNumber: string;
}

interface FormErrors {
  playerName?: string;
  inGameId?: string;
  teamName?: string;
  whatsappNumber?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    playerName: '',
    inGameId: '',
    teamName: '',
    whatsappNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { mutate: registerPlayer, isPending, isError, error } = useRegisterPlayer();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.playerName.trim()) newErrors.playerName = 'Player name is required';
    if (!formData.inGameId.trim()) newErrors.inGameId = 'In-Game ID is required';
    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = 'Enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    registerPlayer(
      {
        playerName: formData.playerName.trim(),
        inGameId: formData.inGameId.trim(),
        teamName: formData.teamName.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setFormData({ playerName: '', inGameId: '', teamName: '', whatsappNumber: '' });
        },
      }
    );
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(229, 62, 62, 0.25)',
    color: '#ffffff',
    borderRadius: '0',
    height: '52px',
    fontSize: '15px',
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: '500',
  };

  const inputFocusStyle = 'focus:border-red-500 focus:ring-1 focus:ring-red-500/50';

  return (
    <section id="register" className="py-20 px-4 sm:px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span className="font-rajdhani font-semibold text-sm tracking-widest uppercase" style={{ color: '#e53e3e' }}>
              Join the Battle
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl"
            style={{ color: '#ffffff', textShadow: '0 0 20px rgba(229,62,62,0.2)' }}
          >
            REGISTER
          </h2>
          <p className="font-rajdhani text-base sm:text-lg mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Fill in your details to secure your spot in the tournament.
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div
            className="flex items-start gap-4 p-6 mb-8"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
            }}
          >
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
            <div>
              <p className="font-orbitron font-bold text-base" style={{ color: '#22c55e' }}>
                Registration Successful!
              </p>
              <p className="font-rajdhani text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                You're in! We'll contact you via WhatsApp with further details. Get ready to dominate!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-rajdhani font-semibold text-sm mt-3 underline"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Register another player
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, #141414 0%, #111111 100%)',
              border: '1px solid rgba(229, 62, 62, 0.2)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#e53e3e' }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#e53e3e' }} />

            {/* Player Name */}
            <div className="space-y-2">
              <Label
                htmlFor="playerName"
                className="font-rajdhani font-semibold text-sm tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Player Name <span style={{ color: '#e53e3e' }}>*</span>
              </Label>
              <Input
                id="playerName"
                type="text"
                placeholder="Enter your player name"
                value={formData.playerName}
                onChange={handleChange('playerName')}
                className={`${inputFocusStyle} placeholder:text-gray-600`}
                style={inputStyle}
              />
              {errors.playerName && (
                <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: '#e53e3e' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.playerName}
                </p>
              )}
            </div>

            {/* In-Game ID */}
            <div className="space-y-2">
              <Label
                htmlFor="inGameId"
                className="font-rajdhani font-semibold text-sm tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                In-Game ID <span style={{ color: '#e53e3e' }}>*</span>
              </Label>
              <Input
                id="inGameId"
                type="text"
                placeholder="Enter your Free Fire UID"
                value={formData.inGameId}
                onChange={handleChange('inGameId')}
                className={`${inputFocusStyle} placeholder:text-gray-600`}
                style={inputStyle}
              />
              {errors.inGameId && (
                <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: '#e53e3e' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.inGameId}
                </p>
              )}
            </div>

            {/* Team Name */}
            <div className="space-y-2">
              <Label
                htmlFor="teamName"
                className="font-rajdhani font-semibold text-sm tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Team Name <span style={{ color: '#e53e3e' }}>*</span>
              </Label>
              <Input
                id="teamName"
                type="text"
                placeholder="Enter your squad/team name"
                value={formData.teamName}
                onChange={handleChange('teamName')}
                className={`${inputFocusStyle} placeholder:text-gray-600`}
                style={inputStyle}
              />
              {errors.teamName && (
                <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: '#e53e3e' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.teamName}
                </p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label
                htmlFor="whatsappNumber"
                className="font-rajdhani font-semibold text-sm tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                WhatsApp Number <span style={{ color: '#e53e3e' }}>*</span>
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.whatsappNumber}
                onChange={handleChange('whatsappNumber')}
                className={`${inputFocusStyle} placeholder:text-gray-600`}
                style={inputStyle}
              />
              {errors.whatsappNumber && (
                <p className="font-rajdhani text-xs flex items-center gap-1" style={{ color: '#e53e3e' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.whatsappNumber}
                </p>
              )}
            </div>

            {/* Error from backend */}
            {isError && (
              <div
                className="flex items-center gap-2 p-3"
                style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#e53e3e' }} />
                <p className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {error instanceof Error ? error.message : 'Registration failed. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 font-orbitron font-bold text-base tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 mt-2"
              style={{
                background: isPending ? 'rgba(229,62,62,0.5)' : '#e53e3e',
                color: '#ffffff',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                boxShadow: isPending ? 'none' : '0 0 20px rgba(229,62,62,0.4)',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                '🔥 Confirm Registration'
              )}
            </button>

            <p className="font-rajdhani text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              By registering, you agree to follow all tournament rules and fair play guidelines.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
