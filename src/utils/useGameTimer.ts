import { useEffect, useRef, useState } from "react";

export function useGameTimer(paused: boolean) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const formattedGameTime = formatTime(secondsElapsed);

  return { secondsElapsed, formattedGameTime, resetTimer: (seconds: number) => setSecondsElapsed(seconds) };
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function formatAsText(totalSeconds: number): string {
    if (totalSeconds < 60) {
        return `${totalSeconds} שניות`;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minutesText = minutes === 1 ? 'דקה' : `${minutes} דקות`;
    return `${minutesText} ו-${seconds} שניות`;
}
