import React, { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Gamepad2, UserCircle, LogOut, Wifi } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGetRooms } from '../hooks/useQueries';
import { RoomType } from '../backend';
import RoomCard from '../components/RoomCard';
import WhatsAppChannelBanner from '../components/WhatsAppChannelBanner';

export default function LobbyPage() {
  const router = useRouter();
  const { isAuthenticated, userName, clearAuth } = useAuth();
  const { data: rooms, isLoading, error } = useGetRooms();
  const [filter, setFilter] = useState<string>('all');

  // Prevent back navigation to auth/landing screens
  useEffect(() => {
    window.history.replaceState(null, '', '/lobby');
    const handlePopState = () => {
      window.history.pushState(null, '', '/lobby');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/' });
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.navigate({ to: '/' });
  };

  const roomTypeLabels: { key: string; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: RoomType.solo, label: 'SOLO' },
    { key: RoomType.duo, label: 'DUO' },
    { key: RoomType.squad, label: 'SQUAD' },
    { key: RoomType.clashSquad, label: 'CLASH SQUAD' },
    { key: RoomType.fullMap, label: 'FULL MAP' },
  ];

  const filteredRooms = rooms?.filter((room) => {
    if (filter === 'all') return true;
    return room.roomType === filter;
  });

  return (
    <div className="min-h-screen bg-game-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 bg-black/80 border-b border-game-red/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-game-red" size={28} />
            <span className="font-orbitron text-lg font-black text-white tracking-widest">
              FF<span className="text-game-red">ARENA</span>
            </span>
          </div>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-game-red/10 border border-game-red/30 rounded-sm px-3 py-1">
            <Wifi size={14} className="text-game-red animate-pulse" />
            <span className="font-orbitron text-xs text-game-red tracking-widest">LIVE LOBBY</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-silver font-rajdhani text-sm">
              {userName}
            </span>
            {/* Profile Icon */}
            <button
              onClick={() => router.navigate({ to: '/profile' })}
              className="p-2 rounded-sm bg-gray-800/80 border border-gray-700 hover:border-gold hover:text-gold text-silver transition-all"
              title="User Profile"
            >
              <UserCircle size={22} />
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-sm bg-gray-800/80 border border-gray-700 hover:border-game-red hover:text-game-red text-silver transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* WhatsApp Banner */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-4">
        <WhatsAppChannelBanner />
      </div>

      {/* Filter tabs */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {roomTypeLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 px-4 py-1.5 rounded-sm font-orbitron text-xs tracking-wider transition-all border ${
                filter === key
                  ? 'bg-game-red border-game-red text-white shadow-red-glow'
                  : 'bg-black/40 border-gray-700 text-silver hover:border-game-red/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-4">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-900/60 border border-gray-800 rounded-sm animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-game-red font-rajdhani text-lg">Failed to load rooms. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && filteredRooms && filteredRooms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-silver font-rajdhani text-lg">No rooms available for this filter.</p>
          </div>
        )}

        {!isLoading && !error && filteredRooms && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room, index) => (
              <RoomCard key={index} room={room} />
            ))}
          </div>
        )}
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
