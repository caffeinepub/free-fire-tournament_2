import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Flame, Swords, RefreshCw, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import RoomCard from '../components/RoomCard';
import { useGetRooms } from '../hooks/useQueries';

function LobbyHeader() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-center px-4 sm:px-6 py-3"
      style={{
        background: 'rgba(8,8,8,0.95)',
        borderBottom: '1px solid rgba(229,62,62,0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Flame
          className="w-5 h-5"
          style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.7))' }}
        />
        <span
          className="font-orbitron font-black text-sm sm:text-base tracking-widest uppercase"
          style={{ color: '#e53e3e', textShadow: '0 0 12px rgba(229,62,62,0.5)' }}
        >
          FREE FIRE
        </span>
        <span
          className="font-rajdhani font-semibold text-xs sm:text-sm tracking-widest uppercase hidden sm:inline"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          TOURNAMENT
        </span>
      </div>
    </header>
  );
}

function RoomCardSkeleton() {
  return (
    <div
      className="w-full p-4 sm:p-5"
      style={{
        background: 'linear-gradient(135deg, #111111 0%, #0d0d0d 100%)',
        border: '1px solid rgba(229,62,62,0.1)',
        borderLeft: '3px solid rgba(229,62,62,0.2)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-5 w-40" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <Skeleton className="h-5 w-16" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-16" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <Skeleton className="h-7 w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Skeleton className="h-14" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <Skeleton className="h-14" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <Skeleton className="h-3 w-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <Skeleton className="h-2 w-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <Skeleton className="h-11 w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

export default function LobbyPage() {
  const { data: rooms, isLoading, isError, refetch } = useGetRooms();
  const navigate = useNavigate();

  // Lock navigation: replace the current history entry with /lobby so that
  // pressing the browser back button from the lobby never lands on auth or
  // landing pages (/, /login, /signup, /home).
  useEffect(() => {
    // Replace the current history entry to ensure /lobby is the base
    navigate({ to: '/lobby', replace: true });

    // Push a duplicate /lobby entry so that if the user presses back,
    // they stay on /lobby rather than going to an auth screen.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(229,62,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        <LobbyHeader />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
          {/* Page title */}
          <div className="pt-8 pb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Swords
                className="w-6 h-6"
                style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.6))' }}
              />
              <h1
                className="font-orbitron font-black text-2xl sm:text-3xl tracking-widest uppercase"
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 20px rgba(229,62,62,0.4)',
                }}
              >
                LIVE LOBBY
              </h1>
              <Swords
                className="w-6 h-6"
                style={{ color: '#e53e3e', filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.6))', transform: 'scaleX(-1)' }}
              />
            </div>
            <p className="font-rajdhani text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Active Tournament Rooms
            </p>
            {/* Divider */}
            <div
              className="w-32 h-px mx-auto mt-4"
              style={{ background: 'linear-gradient(90deg, transparent, #e53e3e, transparent)' }}
            />
          </div>

          {/* Room list */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div
              className="flex flex-col items-center gap-4 py-12 px-6 text-center"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertTriangle className="w-10 h-10" style={{ color: '#ef4444' }} />
              <div>
                <p className="font-orbitron font-bold text-base" style={{ color: '#ef4444' }}>
                  Failed to Load Rooms
                </p>
                <p className="font-rajdhani text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Could not connect to the server. Please try again.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-5 py-2 font-rajdhani font-semibold text-sm tracking-wider uppercase transition-all duration-200"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && rooms && rooms.length === 0 && (
            <div
              className="flex flex-col items-center gap-4 py-16 px-6 text-center"
              style={{
                background: 'rgba(229,62,62,0.03)',
                border: '1px solid rgba(229,62,62,0.1)',
              }}
            >
              <Swords className="w-12 h-12" style={{ color: 'rgba(229,62,62,0.3)' }} />
              <div>
                <p className="font-orbitron font-bold text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  No Active Rooms
                </p>
                <p className="font-rajdhani text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Check back soon for upcoming tournament rooms.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && rooms && rooms.length > 0 && (
            <div className="flex flex-col gap-4">
              {rooms.map((room, index) => (
                <RoomCard key={index} room={room} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
