import { useEffect, useState } from "react";

const DURATION = 5 * 60;

export function useCountdown() {
  const [remaining, setRemaining] = useState(DURATION);

  useEffect(() => {
    const startedAt = Number(sessionStorage.getItem("timerStart")) || Date.now();
    sessionStorage.setItem("timerStart", String(startedAt));

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(DURATION - elapsed, 0));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return {
    remaining,
    label: `${mm}:${ss}`,
    isFinal: remaining > 0 && remaining <= 30,
    isLocked: remaining === 0,
  };
}