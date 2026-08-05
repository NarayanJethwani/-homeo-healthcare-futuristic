import { useState, useEffect } from "react";

export interface ConsultationTimeOptions {
  startedAt?: string;
  pausedAt?: string;
  isPaused?: boolean;
  isCompleted?: boolean;
}

export interface FormattedElapsedTime {
  elapsedSeconds: number;
  formattedTime: string; // "MM:SS" or "HH:MM:SS"
}

export function formatElapsedSeconds(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;

  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  if (hrs > 0) {
    const hh = String(hrs).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
}

export function useConsultationElapsedTime(options: ConsultationTimeOptions): FormattedElapsedTime {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!options.startedAt) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startMs = new Date(options.startedAt!).getTime();
      const endMs = options.isPaused && options.pausedAt
        ? new Date(options.pausedAt).getTime()
        : Date.now();

      const diffSec = Math.max(0, Math.floor((endMs - startMs) / 1000));
      setElapsedSeconds(diffSec);
    };

    calculateElapsed();

    if (options.isPaused || options.isCompleted) {
      return;
    }

    const timerId = setInterval(calculateElapsed, 1000);
    return () => clearInterval(timerId);
  }, [options.startedAt, options.pausedAt, options.isPaused, options.isCompleted]);

  return {
    elapsedSeconds,
    formattedTime: formatElapsedSeconds(elapsedSeconds),
  };
}
