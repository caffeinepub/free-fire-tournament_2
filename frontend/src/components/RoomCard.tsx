import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Clock, Users, Trophy, Zap, ChevronRight } from 'lucide-react';
import type { Room } from '../backend';
import { RoomType, RoomJoinStatus } from '../backend';

interface RoomCardProps {
  room: Room;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getRoomTypeConfig(roomType: RoomType): { label: string; color: string; bg: string; border: string } {
  switch (roomType) {
    case RoomType.solo:
      return { label: 'SOLO', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.4)' };
    case RoomType.duo:
      return { label: 'DUO', color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.4)' };
    case RoomType.squad:
      return { label: 'SQUAD', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.4)' };
    case RoomType.clashSquad:
      return { label: 'CLASH SQUAD', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.4)' };
    case RoomType.fullMap:
      return { label: 'FULL MAP', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.4)' };
    default:
      return { label: 'ROOM', color: '#e5e7eb', bg: 'rgba(229,231,235,0.1)', border: 'rgba(229,231,235,0.3)' };
  }
}

function getStatusConfig(status: RoomJoinStatus): { label: string; color: string } {
  switch (status) {
    case RoomJoinStatus.open:
      return { label: 'OPEN', color: '#4ade80' };
    case RoomJoinStatus.closed:
      return { label: 'CLOSED', color: '#f87171' };
    case RoomJoinStatus.inProgress:
      return { label: 'IN PROGRESS', color: '#fb923c' };
    default:
      return { label: 'UNKNOWN', color: '#9ca3af' };
  }
}

function calculateTimeLeft(startTimeNs: bigint): TimeLeft {
  // startTime is in nanoseconds (Int from Motoko), convert to ms
  const startTimeMs = Number(startTimeNs) / 1_000_000;
  const now = Date.now();
  const diff = startTimeMs - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

export default function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const typeConfig = getRoomTypeConfig(room.roomType);
  const statusConfig = getStatusConfig(room.joinStatus);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(room.startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(room.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [room.startTime]);

  const joinedSlots = Number(room.joinedSlots);
  const totalSlots = Number(room.totalSlots);
  const fillPercent = totalSlots > 0 ? Math.min((joinedSlots / totalSlots) * 100, 100) : 0;

  const isJoinable = room.joinStatus === RoomJoinStatus.open;

  const handleJoinNow = () => {
    router.navigate({ to: '/register' });
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #111111 0%, #0d0d0d 100%)',
        border: '1px solid rgba(229,62,62,0.2)',
        borderLeft: `3px solid ${typeConfig.color}`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${typeConfig.color}60, transparent)` }}
      />

      <div className="p-4 sm:p-5">
        {/* Header row: Room name + type badge + status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <h3
              className="font-orbitron font-bold text-sm sm:text-base tracking-wide"
              style={{ color: '#ffffff' }}
            >
              {room.name}
            </h3>
            <div className="flex items-center gap-2">
              {/* Room type badge */}
              <span
                className="font-orbitron font-bold text-xs px-2.5 py-0.5 tracking-widest"
                style={{
                  color: typeConfig.color,
                  background: typeConfig.bg,
                  border: `1px solid ${typeConfig.border}`,
                  clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                }}
              >
                {typeConfig.label}
              </span>
              {/* Status badge */}
              <span
                className="font-rajdhani font-bold text-xs px-2 py-0.5 tracking-wider"
                style={{
                  color: statusConfig.color,
                  background: `${statusConfig.color}18`,
                  border: `1px solid ${statusConfig.color}50`,
                  borderRadius: '2px',
                }}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Prize pool highlight */}
          <div
            className="flex flex-col items-end flex-shrink-0"
            style={{ minWidth: '80px' }}
          >
            <span className="font-rajdhani text-xs tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Prize Pool
            </span>
            <span
              className="font-orbitron font-black text-lg sm:text-xl"
              style={{
                color: '#fbbf24',
                textShadow: '0 0 12px rgba(251,191,36,0.5)',
              }}
            >
              {room.prizePool}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Entry Fee */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px',
            }}
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#e53e3e' }} />
            <div>
              <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Entry Fee</p>
              <p className="font-orbitron font-bold text-sm" style={{ color: '#ffffff' }}>{room.entryFee}</p>
            </div>
          </div>

          {/* Countdown */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px',
            }}
          >
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#fb923c' }} />
            <div>
              <p className="font-rajdhani text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Starts In</p>
              {timeLeft.expired ? (
                <p className="font-orbitron font-bold text-xs" style={{ color: '#fb923c' }}>STARTED</p>
              ) : (
                <p className="font-orbitron font-bold text-xs" style={{ color: '#fb923c' }}>
                  {timeLeft.days > 0 && `${timeLeft.days}d `}
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Slots progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span className="font-rajdhani text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                SLOTS
              </span>
            </div>
            <span className="font-orbitron text-xs font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {joinedSlots}/{totalSlots} Joined
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '1px',
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${fillPercent}%`,
                background: fillPercent >= 80
                  ? 'linear-gradient(90deg, #ef4444, #f87171)'
                  : fillPercent >= 50
                  ? 'linear-gradient(90deg, #fb923c, #fbbf24)'
                  : 'linear-gradient(90deg, #4ade80, #22d3ee)',
                boxShadow: fillPercent >= 80
                  ? '0 0 8px rgba(239,68,68,0.6)'
                  : fillPercent >= 50
                  ? '0 0 8px rgba(251,146,60,0.5)'
                  : '0 0 8px rgba(74,222,128,0.5)',
                borderRadius: '1px',
              }}
            />
          </div>

          {/* Slots remaining hint */}
          <p className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {totalSlots - joinedSlots} slots remaining
          </p>
        </div>

        {/* Join Now button */}
        <button
          onClick={handleJoinNow}
          disabled={!isJoinable}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 font-orbitron font-black text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isJoinable
              ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)'
              : 'rgba(255,255,255,0.08)',
            color: isJoinable ? '#ffffff' : 'rgba(255,255,255,0.4)',
            border: isJoinable ? '1px solid rgba(34,197,94,0.6)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: isJoinable ? '0 0 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}
          onMouseEnter={(e) => {
            if (!isJoinable) return;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 30px rgba(34,197,94,0.65), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            if (!isJoinable) return;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';
          }}
        >
          {isJoinable ? (
            <>
              <Trophy className="w-4 h-4" />
              JOIN NOW
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            'ROOM CLOSED'
          )}
        </button>
      </div>
    </div>
  );
}
