import { useEffect, useState, useMemo, useCallback } from "react";

export type TimerState = "idle" | "focus" | "break" | "paused";

const FOCUS_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

export function useFocusTimer(onStart?: () => void, onEnd?: () => void) {
  const [state, setState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (state !== "focus" && state !== "break") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (timeLeft !== 0) return;
    if (state === "focus") {
      const nextCount = sessionCount + 1;
      setSessionCount(nextCount);
      const isLong = nextCount % 4 === 0;
      setIsBreak(true);
      setTimeLeft(isLong ? LONG_BREAK : SHORT_BREAK);
      setState("break");
      onEnd?.();
    } else if (state === "break") {
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
      setState("idle");
    }
  }, [timeLeft, state, sessionCount, onEnd]);

  const start = useCallback(() => {
    if (state === "idle") {
      setState("focus");
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
      onStart?.();
    } else if (state === "paused") {
      setState(isBreak ? "break" : "focus");
    }
  }, [state, isBreak, onStart]);

  const pause = useCallback(() => setState("paused"), []);
  const stop = useCallback(() => {
    setState("idle");
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
    if (state !== "idle") onEnd?.();
  }, [state, onEnd]);

  const total = isBreak ? (sessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK) : FOCUS_TIME;
  const progress = useMemo(() => ((total - timeLeft) / total) * 100, [total, timeLeft]);

  return { state, timeLeft, isBreak, sessionCount, start, pause, stop, progress };
}


