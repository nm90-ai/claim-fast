import { createFileRoute } from "@tanstack/react-router";

function pickHeader(request: Request, names: string[]) {
  for (const n of names) {
    const v = request.headers.get(n);
    if (v && v.trim()) {
      try {
        return decodeURIComponent(v.trim());
      } catch {
        return v.trim();
      }
    }
  }
  return null;
}

export const Route = createFileRoute("/api/public/geo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const json = (city: string | null) =>
          new Response(JSON.stringify({ city }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
            },
          });

        // Cloudflare exposes geolocation on Request.cf; other edge platforms
        // forward it in headers.
        const requestWithGeo = request as Request & { cf?: { city?: unknown } };
        const cloudflareCity = requestWithGeo.cf?.city;
        const edgeCity =
          (typeof cloudflareCity === "string" && cloudflareCity.trim()
            ? cloudflareCity.trim()
            : null) ?? pickHeader(request, [
          "cf-ipcity",
          "x-vercel-ip-city",
          "x-geo-city",
          "fly-client-city",
          ]);
        if (edgeCity) return json(edgeCity);

        const ip = pickHeader(request, [
          "cf-connecting-ip",
          "x-real-ip",
          "true-client-ip",
        ])
          ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          ?? null;

        if (!ip) return json(null);

        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 3500);
          const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
            signal: ctrl.signal,
          });
          clearTimeout(t);
          if (!res.ok) return json(null);
          const data: any = await res.json();
          if (data?.success === false) return json(null);
          return json(data?.city || data?.region || null);
        } catch {
          return json(null);
        }
      },
    },
  },
});
