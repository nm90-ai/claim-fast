import { useEffect, useState } from "react";

type Provider = { url: string; pick: (d: any) => string | null };

// Server route first (uses the real visitor IP, never blocked by ad-blockers),
// then public providers as fallback.
const PROVIDERS: Provider[] = [
  { url: "/api/public/geo", pick: (d) => d?.city || null },
  { url: "https://ipwho.is/", pick: (d) => (d?.success === false ? null : d?.city || d?.region) },
  { url: "https://get.geojs.io/v1/ip/geo.json", pick: (d) => d?.city || d?.region || null },
  { url: "https://ipapi.co/json/", pick: (d) => d?.city || d?.region || null },
];

const CACHE_KEY = "visitorCity:v2";
const LOOKUP_BUDGET_MS = 1900;

async function queryProvider(provider: Provider, signal: AbortSignal) {
  const res = await fetch(provider.url, {
    signal,
    cache: provider.url.startsWith("/") ? "default" : "no-store",
  });
  if (!res.ok) throw new Error("Location lookup failed");
  const detected = provider.pick(await res.json());
  if (typeof detected !== "string" || !detected.trim()) {
    throw new Error("No city returned");
  }
  return detected.trim();
}

export function useCity() {
  const [city, setCity] = useState("Your Area");

  useEffect(() => {
    // A versioned cache avoids retaining an inaccurate value produced by the
    // older sequential lookup implementation.
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setCity(cached);
      return;
    }

    sessionStorage.removeItem("userCity");

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      const timeout = setTimeout(() => controller.abort(), LOOKUP_BUDGET_MS);
      try {
        // Race independent sources instead of waiting up to four seconds for
        // each blocked provider. Promise.any returns the first valid city.
        const detected = await Promise.any(
          PROVIDERS.map((provider) => queryProvider(provider, controller.signal)),
        );
        if (cancelled) return;
        sessionStorage.setItem(CACHE_KEY, detected);
        setCity(detected);
      } catch {
        // Keep the neutral fallback when privacy tools hide the visitor IP.
      } finally {
        clearTimeout(timeout);
        controller.abort();
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return city;
}
