import { useEffect, useState } from "react";

const MIN_SPOTS = 2;
const START_SPOTS = 5;

export function useSpotCounter() {
  const [spots, setSpots] = useState(START_SPOTS);

  useEffect(() => {
    const stored = parseInt(sessionStorage.getItem("spotCount") ?? "", 10);
    const initial = Number.isNaN(stored) ? START_SPOTS : Math.max(stored, MIN_SPOTS);
    setSpots(initial);
    sessionStorage.setItem("spotCount", String(initial));

    const id = setInterval(() => {
      setSpots((current) => {
        if (current <= MIN_SPOTS) return current;
        const next = current - 1;
        sessionStorage.setItem("spotCount", String(next));
        return next;
      });
    }, 35000);

    return () => clearInterval(id);
  }, []);

  return { spots };
}
