import { useGetLeaderboard } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Crown } from 'lucide-react';

const RANK_STYLES: Record<number, { color: string; bg: string; label: string }> = {
  1: { color: '#f6c90e', bg: 'rgba(246,201,14,0.08)', label: '🥇' },
  2: { color: '#c0c0c0', bg: 'rgba(192,192,192,0.06)', label: '🥈' },
  3: { color: '#cd7f32', bg: 'rgba(205,127,50,0.06)', label: '🥉' },
};

export default function Leaderboard() {
  const { data: entries, isLoading, isError } = useGetLeaderboard();

  const sortedEntries = entries
    ? [...entries].sort((a, b) => Number(b.totalPoints) - Number(a.totalPoints))
    : [];

  return (
    <section id="leaderboard" className="py-20 px-4 sm:px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span className="font-rajdhani font-semibold text-sm tracking-widest uppercase" style={{ color: '#e53e3e' }}>
              Hall of Fame
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl"
            style={{ color: '#ffffff', textShadow: '0 0 20px rgba(229,62,62,0.2)' }}
          >
            LEADERBOARD
          </h2>
          <p className="font-rajdhani text-base sm:text-lg mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            The elite warriors who dominate the battlefield.
          </p>
        </div>

        {/* Top 3 Podium */}
        {!isLoading && !isError && sortedEntries.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <div
              className="flex flex-col items-center p-4 sm:p-5 order-1"
              style={{
                background: 'rgba(192,192,192,0.06)',
                border: '1px solid rgba(192,192,192,0.25)',
                marginTop: '24px',
              }}
            >
              <span className="text-2xl mb-2">🥈</span>
              <Crown className="w-5 h-5 mb-2" style={{ color: '#c0c0c0' }} />
              <p className="font-orbitron font-bold text-xs sm:text-sm text-center" style={{ color: '#c0c0c0' }}>
                {sortedEntries[1]?.playerName}
              </p>
              <p className="font-rajdhani text-xs mt-1 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {sortedEntries[1]?.teamName}
              </p>
              <p className="font-orbitron font-bold text-lg mt-2" style={{ color: '#c0c0c0' }}>
                {Number(sortedEntries[1]?.totalPoints)}
              </p>
              <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>pts</p>
            </div>

            {/* 1st Place */}
            <div
              className="flex flex-col items-center p-4 sm:p-5 order-2 relative"
              style={{
                background: 'rgba(246,201,14,0.08)',
                border: '1px solid rgba(246,201,14,0.35)',
                boxShadow: '0 0 30px rgba(246,201,14,0.15)',
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 font-orbitron font-bold text-xs"
                style={{ background: '#f6c90e', color: '#000' }}
              >
                #1
              </div>
              <span className="text-3xl mb-2">🥇</span>
              <Crown className="w-6 h-6 mb-2" style={{ color: '#f6c90e', filter: 'drop-shadow(0 0 6px rgba(246,201,14,0.6))' }} />
              <p className="font-orbitron font-bold text-sm sm:text-base text-center" style={{ color: '#f6c90e' }}>
                {sortedEntries[0]?.playerName}
              </p>
              <p className="font-rajdhani text-xs mt-1 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {sortedEntries[0]?.teamName}
              </p>
              <p className="font-orbitron font-bold text-2xl mt-2" style={{ color: '#f6c90e' }}>
                {Number(sortedEntries[0]?.totalPoints)}
              </p>
              <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>pts</p>
            </div>

            {/* 3rd Place */}
            <div
              className="flex flex-col items-center p-4 sm:p-5 order-3"
              style={{
                background: 'rgba(205,127,50,0.06)',
                border: '1px solid rgba(205,127,50,0.25)',
                marginTop: '40px',
              }}
            >
              <span className="text-2xl mb-2">🥉</span>
              <Crown className="w-5 h-5 mb-2" style={{ color: '#cd7f32' }} />
              <p className="font-orbitron font-bold text-xs sm:text-sm text-center" style={{ color: '#cd7f32' }}>
                {sortedEntries[2]?.playerName}
              </p>
              <p className="font-rajdhani text-xs mt-1 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {sortedEntries[2]?.teamName}
              </p>
              <p className="font-orbitron font-bold text-lg mt-2" style={{ color: '#cd7f32' }}>
                {Number(sortedEntries[2]?.totalPoints)}
              </p>
              <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>pts</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
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
              Failed to load leaderboard. Please try again later.
            </p>
          </div>
        )}

        {/* Full Table */}
        {!isLoading && !isError && sortedEntries.length > 0 && (
          <div
            className="overflow-x-auto scrollbar-hide"
            style={{ border: '1px solid rgba(229,62,62,0.2)' }}
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ background: 'rgba(229,62,62,0.12)', borderBottom: '1px solid rgba(229,62,62,0.3)' }}>
                  <th className="px-4 sm:px-6 py-4 text-left font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                    RANK
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                    PLAYER
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                    TEAM
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                    POINTS
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                    KILLS
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry, index) => {
                  const rank = index + 1;
                  const rankStyle = RANK_STYLES[rank];
                  return (
                    <tr
                      key={`${entry.playerName}-${index}`}
                      style={{
                        background: rankStyle ? rankStyle.bg : index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        borderLeft: rankStyle ? `3px solid ${rankStyle.color}` : '3px solid transparent',
                      }}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {rankStyle ? (
                            <span className="text-lg">{rankStyle.label}</span>
                          ) : (
                            <span
                              className="w-7 h-7 flex items-center justify-center font-orbitron font-bold text-xs"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.1)',
                              }}
                            >
                              {rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className="font-rajdhani font-bold text-sm sm:text-base"
                          style={{ color: rankStyle ? rankStyle.color : '#ffffff' }}
                        >
                          {entry.playerName}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {entry.teamName}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span
                          className="font-orbitron font-bold text-sm sm:text-base"
                          style={{ color: rankStyle ? rankStyle.color : '#ffffff' }}
                        >
                          {Number(entry.totalPoints)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="font-rajdhani font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {Number(entry.kills)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
