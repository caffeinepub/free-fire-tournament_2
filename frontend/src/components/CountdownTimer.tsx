import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                border: '1px solid rgba(229, 62, 62, 0.4)',
                boxShadow: '0 0 15px rgba(229, 62, 62, 0.2)',
              }}
            >
              <span
                className="font-orbitron font-bold text-2xl sm:text-3xl"
                style={{ color: '#e53e3e', textShadow: '0 0 10px rgba(229, 62, 62, 0.6)' }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500" />
            </div>
            <span className="font-rajdhani font-semibold text-xs sm:text-sm mt-1 tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="font-orbitron font-bold text-2xl sm:text-3xl mb-5" style={{ color: '#e53e3e' }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
