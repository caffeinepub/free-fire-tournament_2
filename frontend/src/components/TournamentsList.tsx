import { Skeleton } from '@/components/ui/skeleton';
import TournamentCard from './TournamentCard';
import { useGetTournaments } from '../hooks/useQueries';
import { AlertCircle } from 'lucide-react';

export default function TournamentsList() {
  const { data: tournaments, isLoading, isError } = useGetTournaments();

  return (
    <section id="tournaments" className="py-20 px-4 sm:px-6" style={{ background: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span
              className="font-rajdhani font-semibold text-sm tracking-widest uppercase"
              style={{ color: '#e53e3e' }}
            >
              Upcoming Events
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl"
            style={{ color: '#ffffff', textShadow: '0 0 20px rgba(229,62,62,0.2)' }}
          >
            TOURNAMENTS
          </h2>
          <p
            className="font-rajdhani text-base sm:text-lg mt-3 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Join the battle. Choose your tournament and register your squad today.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 p-6" style={{ background: '#111111', border: '1px solid rgba(229,62,62,0.1)' }}>
                <Skeleton className="h-5 w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <Skeleton className="h-4 w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <Skeleton className="h-4 w-2/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <Skeleton className="h-10 w-full mt-4" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div
            className="flex items-center gap-3 p-6 max-w-md mx-auto"
            style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#e53e3e' }} />
            <p className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Failed to load tournaments. Please try again later.
            </p>
          </div>
        )}

        {/* Tournaments Grid */}
        {!isLoading && !isError && tournaments && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={Number(tournament.id)} tournament={tournament} />
            ))}
          </div>
        )}

        {!isLoading && !isError && (!tournaments || tournaments.length === 0) && (
          <p className="text-center font-rajdhani text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No tournaments available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
