const gameplayRules = [
  {
    id: 1,
    title: 'Fair Play Only',
    desc: 'Any form of cheating, hacking, or use of unauthorized third-party software is strictly prohibited and will result in immediate disqualification and a permanent ban.',
  },
  {
    id: 2,
    title: 'Squad Composition',
    desc: 'Each team must consist of exactly 4 players. Substitutions must be declared before the match begins. Playing with fewer than 4 players is not permitted.',
  },
  {
    id: 3,
    title: 'Disconnection Policy',
    desc: 'If a player disconnects during a match, the game will continue. No restarts will be granted for technical issues on the player\'s side. Ensure a stable internet connection before joining.',
  },
  {
    id: 4,
    title: 'Match Scheduling',
    desc: 'All teams must be ready and in the lobby 10 minutes before the scheduled match time. Teams that fail to join within 5 minutes of the start time will be disqualified.',
  },
  {
    id: 5,
    title: 'Map & Mode',
    desc: 'All matches will be played on the designated map announced before the tournament. Game mode will be Squad Battle Royale. Custom room codes will be shared via WhatsApp.',
  },
  {
    id: 6,
    title: 'Spectator & Streaming Rules',
    desc: 'Players may not stream their gameplay during active matches unless explicitly permitted by the organizers. Sharing room codes or match details publicly is prohibited.',
  },
  {
    id: 7,
    title: 'Conduct & Sportsmanship',
    desc: 'Toxic behavior, harassment, or unsportsmanlike conduct in chat or voice will result in disqualification. Treat all opponents with respect at all times.',
  },
  {
    id: 8,
    title: 'Dispute Resolution',
    desc: 'All disputes must be reported to the admin team within 15 minutes of the match ending with supporting screenshots or video evidence. Admin decisions are final.',
  },
  {
    id: 9,
    title: 'Device & Account Rules',
    desc: 'Players must use their own registered Free Fire account. Account sharing or playing on behalf of another player is strictly forbidden.',
  },
  {
    id: 10,
    title: 'Prize Distribution',
    desc: 'Prizes will be distributed within 48 hours of the tournament conclusion. Winners must provide valid payment details. Taxes on winnings are the responsibility of the winner.',
  },
];

const pointsTable = [
  { rank: '1st', placement: 12, killPoints: 1, description: 'Booyah!' },
  { rank: '2nd', placement: 9, killPoints: 1, description: 'Runner Up' },
  { rank: '3rd', placement: 7, killPoints: 1, description: 'Top 3' },
  { rank: '4th', placement: 5, killPoints: 1, description: 'Top 5' },
  { rank: '5th', placement: 4, killPoints: 1, description: 'Top 5' },
  { rank: '6th–10th', placement: 3, killPoints: 1, description: 'Top 10' },
  { rank: '11th–15th', placement: 2, killPoints: 1, description: 'Mid Field' },
  { rank: '16th–20th', placement: 1, killPoints: 1, description: 'Survivor' },
  { rank: '21st–25th', placement: 0, killPoints: 1, description: 'Eliminated' },
];

export default function Rules() {
  return (
    <section id="rules" className="py-20 px-4 sm:px-6" style={{ background: '#0d0d0d' }}>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
            <span className="font-rajdhani font-semibold text-sm tracking-widest uppercase" style={{ color: '#e53e3e' }}>
              Know Before You Play
            </span>
            <div className="h-px w-12" style={{ background: '#e53e3e' }} />
          </div>
          <h2
            className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl"
            style={{ color: '#ffffff', textShadow: '0 0 20px rgba(229,62,62,0.2)' }}
          >
            RULES & REGULATIONS
          </h2>
          <p className="font-rajdhani text-base sm:text-lg mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Read all rules carefully. Ignorance is not an excuse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gameplay Rules */}
          <div>
            <h3
              className="font-orbitron font-bold text-xl mb-6 pb-3 flex items-center gap-3"
              style={{
                color: '#ffffff',
                borderBottom: '1px solid rgba(229,62,62,0.3)',
              }}
            >
              <span
                className="w-8 h-8 flex items-center justify-center text-sm font-orbitron"
                style={{ background: '#e53e3e', color: '#fff' }}
              >
                §
              </span>
              Gameplay Rules
            </h3>
            <div className="space-y-4">
              {gameplayRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex gap-4 p-4 transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: '3px solid rgba(229,62,62,0.5)',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center font-orbitron font-bold text-xs"
                    style={{ background: 'rgba(229,62,62,0.15)', color: '#e53e3e', border: '1px solid rgba(229,62,62,0.3)' }}
                  >
                    {rule.id}
                  </span>
                  <div>
                    <p className="font-rajdhani font-bold text-sm mb-1" style={{ color: '#ffffff' }}>
                      {rule.title}
                    </p>
                    <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {rule.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points Table */}
          <div>
            <h3
              className="font-orbitron font-bold text-xl mb-6 pb-3 flex items-center gap-3"
              style={{
                color: '#ffffff',
                borderBottom: '1px solid rgba(229,62,62,0.3)',
              }}
            >
              <span
                className="w-8 h-8 flex items-center justify-center text-sm font-orbitron"
                style={{ background: '#e53e3e', color: '#fff' }}
              >
                ★
              </span>
              Points System
            </h3>

            <div
              className="overflow-x-auto scrollbar-hide"
              style={{ border: '1px solid rgba(229,62,62,0.2)' }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(229,62,62,0.15)', borderBottom: '1px solid rgba(229,62,62,0.3)' }}>
                    <th className="px-4 py-3 text-left font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                      RANK
                    </th>
                    <th className="px-4 py-3 text-center font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                      PLACEMENT PTS
                    </th>
                    <th className="px-4 py-3 text-center font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                      KILL PTS
                    </th>
                    <th className="px-4 py-3 text-right font-orbitron font-bold text-xs tracking-wider" style={{ color: '#e53e3e' }}>
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pointsTable.map((row, index) => (
                    <tr
                      key={row.rank}
                      style={{
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <td className="px-4 py-3 font-rajdhani font-bold text-sm" style={{ color: index === 0 ? '#f6c90e' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.7)' }}>
                        {row.rank}
                      </td>
                      <td className="px-4 py-3 text-center font-orbitron font-bold text-sm" style={{ color: '#ffffff' }}>
                        {row.placement}
                      </td>
                      <td className="px-4 py-3 text-center font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        +{row.killPoints}/kill
                      </td>
                      <td className="px-4 py-3 text-right font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Kill Points Note */}
            <div
              className="mt-4 p-4"
              style={{ background: 'rgba(246,201,14,0.06)', border: '1px solid rgba(246,201,14,0.2)' }}
            >
              <p className="font-rajdhani font-semibold text-sm" style={{ color: '#f6c90e' }}>
                ⚡ Kill Points
              </p>
              <p className="font-rajdhani text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Each kill earns 1 point regardless of placement. Total Score = Placement Points + Kill Points.
                Maximum kill points per match is capped at 10.
              </p>
            </div>

            {/* Additional Info */}
            <div
              className="mt-4 p-4"
              style={{ background: 'rgba(229,62,62,0.05)', border: '1px solid rgba(229,62,62,0.15)' }}
            >
              <p className="font-rajdhani font-semibold text-sm" style={{ color: '#e53e3e' }}>
                🏆 Tournament Format
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  'Group Stage: 3 matches per group',
                  'Semi-Finals: Top 12 teams advance',
                  'Grand Finals: Top 6 teams compete',
                  'Final standings based on cumulative points',
                ].map((item) => (
                  <li key={item} className="font-rajdhani text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: '#e53e3e' }}>›</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
