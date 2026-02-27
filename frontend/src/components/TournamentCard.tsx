import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { Trophy, Calendar, Users, Zap } from 'lucide-react';
import type { Tournament } from '../backend';
import { EntryFeeType } from '../backend';

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();

  const handleJoinNow = () => {
    router.navigate({ to: '/register' });
  };

  const isFree = tournament.entryFeeType === EntryFeeType.free;

  return (
    <div className="relative bg-gray-900/80 border border-game-red/30 rounded-sm overflow-hidden group hover:border-game-red/60 transition-all hover:shadow-red-glow">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-game-red via-red-500 to-game-red" />

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-game-red/40" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-gold shrink-0" />
            <h3 className="font-orbitron text-sm font-bold text-white leading-tight">
              {tournament.name}
            </h3>
          </div>
          <span
            className={`text-xs font-orbitron px-2 py-0.5 rounded-sm border shrink-0 ml-2 ${
              isFree
                ? 'text-green-400 border-green-500/40 bg-green-900/20'
                : 'text-gold border-gold/40 bg-gold/10'
            }`}
          >
            {isFree ? 'FREE' : 'PAID'}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-silver">
            <Calendar size={14} className="text-game-red shrink-0" />
            <span className="font-rajdhani text-sm">{tournament.dateTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-silver">
              <Zap size={14} className="text-game-red shrink-0" />
              <span className="font-rajdhani text-sm">Entry: {tournament.entryFee}</span>
            </div>
            <div className="flex items-center gap-2 text-silver">
              <Users size={14} className="text-gold shrink-0" />
              <span className="font-rajdhani text-sm font-semibold text-gold">
                Prize: {tournament.prizePool}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleJoinNow}
          className="w-full bg-game-red hover:bg-red-700 text-white font-orbitron font-bold py-2.5 rounded-sm transition-all tracking-wider text-xs group-hover:shadow-red-glow"
        >
          JOIN NOW
        </button>
      </div>
    </div>
  );
}
