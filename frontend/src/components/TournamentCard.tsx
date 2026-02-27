import { Calendar, Trophy, Users, IndianRupee } from 'lucide-react';
import type { Tournament, EntryFeeType } from '../backend';
import { useRouter } from '@tanstack/react-router';

interface TournamentCardProps {
  tournament: Tournament;
}

function formatDateTime(dateTime: string): string {
  try {
    const date = new Date(dateTime.replace(' ', 'T'));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateTime;
  }
}

function isEntryFree(entryFeeType: EntryFeeType): boolean {
  return entryFeeType === 'free' || (entryFeeType as unknown as { free?: null })?.free !== undefined;
}

const PRIZE_DISTRIBUTION = [
  { place: '1st', prize: '₹50', color: '#f6c90e' },
  { place: '2nd', prize: '₹30', color: '#c0c0c0' },
  { place: '3rd', prize: '₹20', color: '#cd7f32' },
];

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const isFree = isEntryFree(tournament.entryFeeType);
  const router = useRouter();

  const handleRegister = () => {
    router.navigate({ to: '/register' });
  };

  return (
    <div
      className="relative group overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, #161616 0%, #111111 100%)',
        border: '1px solid rgba(229, 62, 62, 0.2)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(229, 62, 62, 0.5)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(229,62,62,0.15), 0 4px 24px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(229, 62, 62, 0.2)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: isFree ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #e53e3e, #c0392b)' }}
      />

      {/* Corner decoration */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-10"
        style={{
          background: isFree ? '#22c55e' : '#e53e3e',
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        }}
      />

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <h3
            className="font-orbitron font-bold text-base sm:text-lg leading-tight flex-1 mr-3"
            style={{ color: '#ffffff' }}
          >
            {tournament.name}
          </h3>
          <span
            className="flex-shrink-0 px-3 py-1 font-rajdhani font-bold text-xs tracking-widest uppercase"
            style={{
              background: isFree ? 'rgba(34, 197, 94, 0.15)' : 'rgba(229, 62, 62, 0.15)',
              border: `1px solid ${isFree ? 'rgba(34, 197, 94, 0.5)' : 'rgba(229, 62, 62, 0.5)'}`,
              color: isFree ? '#22c55e' : '#e53e3e',
            }}
          >
            {isFree ? 'FREE' : 'PAID'}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(229,62,62,0.7)' }} />
            <span className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {formatDateTime(tournament.dateTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: '#f6c90e' }} />
            <span className="font-rajdhani font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Prize Pool:{' '}
              <span style={{ color: '#f6c90e', fontWeight: 700 }}>
                {tournament.prizePool}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(229,62,62,0.7)' }} />
            <span className="font-rajdhani font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Entry Fee:{' '}
              <span style={{ color: isFree ? '#22c55e' : '#e53e3e', fontWeight: 700 }}>
                {isFree ? 'FREE' : tournament.entryFee}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Squad Mode — 4 Players
            </span>
          </div>
        </div>

        {/* Prize Distribution */}
        <div
          className="mb-5 p-3"
          style={{
            background: 'rgba(229, 62, 62, 0.05)',
            border: '1px solid rgba(229, 62, 62, 0.15)',
          }}
        >
          <p
            className="font-rajdhani font-bold text-xs tracking-widest uppercase mb-2"
            style={{ color: 'rgba(229,62,62,0.8)' }}
          >
            Prize Distribution
          </p>
          <div className="flex items-center justify-between gap-2">
            {PRIZE_DISTRIBUTION.map(({ place, prize, color }) => (
              <div key={place} className="flex flex-col items-center gap-0.5">
                <span
                  className="font-rajdhani font-bold text-base"
                  style={{ color }}
                >
                  {prize}
                </span>
                <span
                  className="font-rajdhani text-xs"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {place}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Register CTA */}
        <button
          onClick={handleRegister}
          className="w-full py-3 font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 50%, #c53030 100%)',
            color: '#ffffff',
            clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
            boxShadow: '0 0 16px rgba(229,62,62,0.3)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(229,62,62,0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(229,62,62,0.3)';
          }}
        >
          Register Now →
        </button>
      </div>
    </div>
  );
}
