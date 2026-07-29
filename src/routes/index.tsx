import { createFileRoute } from "@tanstack/react-router";
import rewardHero from "@/assets/reward-hero.webp";
import { ActivityFeed } from "@/components/reward/ActivityFeed";
import { useCity } from "@/components/reward/useCity";
import { useCountdown } from "@/components/reward/useCountdown";
import { useSpotCounter } from "@/components/reward/useSpotCounter";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Gift Card Giveaway Entry — US, 18+, No Purchase Needed" },
      {
        name: "description",
        content:
          "US residents 18+ can enter for a chance to win gift cards, cash prizes or gaming credit. No purchase necessary, no credit card — entry takes under 60 seconds.",
      },
      {
        property: "og:title",
        content: "Free Gift Card Giveaway Entry — US, 18+, No Purchase Needed",
      },
      {
        property: "og:description",
        content:
          "US residents 18+ can enter for a chance to win gift cards, cash prizes or gaming credit. No purchase necessary, no credit card.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "dns-prefetch", href: "https://app.hawktrk.com" },
      { rel: "preload", href: rewardHero, as: "image", type: "image/webp" },
    ],
  }),
  component: Index,
});

const AFFILIATE_BASE =
  "https://app.hawktrk.com/sl?id=6a2050db46d3cf0d62f32aa4&pid=2&sub2=u342418&sub6=s2smartLink&sub5=s1";

// Params we forward to the offer page so the traffic source can be attributed.
function useAffiliateUrl() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  return useMemo(() => {
    if (!search) return AFFILIATE_BASE;

    try {
      const params = new URLSearchParams(search);
      // PropellerAds commonly uses clickid, but accepting its frequent aliases
      // prevents a macro naming difference from dropping attribution.
      const clickid =
        params.get("clickid") ??
        params.get("click_id") ??
        params.get("clickId") ??
        params.get("sub1") ??
        params.get("s1");
      if (!clickid) return AFFILIATE_BASE;

      // The network requires the ID directly after the existing sub5=s1
      // marker. Also send sub1 explicitly for downstream offer attribution.
      return `${AFFILIATE_BASE}${encodeURIComponent(clickid)}&sub1=${encodeURIComponent(clickid)}`;
    } catch {
      return AFFILIATE_BASE;
    }
  }, [search]);
}

function CTAButton({ className = "" }: { className?: string }) {
  const href = useAffiliateUrl();
  return (
    <a
      href={href}
      rel="nofollow sponsored noopener"
      referrerPolicy="no-referrer-when-downgrade"
      className={`cta-shine inline-flex min-h-[56px] w-full flex-col items-center justify-center rounded-full bg-primary px-6 py-4 text-center font-extrabold tracking-tight text-primary-foreground transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] ${className}`}
    >
      <span className="relative z-10 text-base sm:text-lg">Enter the Giveaway — It's Free</span>
      <span className="relative z-10 text-xs font-semibold opacity-80">
        Free entry · Takes 60 seconds · No card required
      </span>
    </a>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Start your free entry",
    body: "Tap the button to open the giveaway partner page. No purchase, no card details.",
  },
  {
    n: "2",
    title: "Pick a giveaway",
    body: "Choose which prize draw to enter — gift cards, cash prizes, gaming credit or tech.",
  },
  {
    n: "3",
    title: "Complete your entry",
    body: "Answer a few short questions and your entry is submitted. Winners are drawn by the partner.",
  },
];

const REWARDS = [
  { emoji: "💳", label: "$250 gift card draw" },
  { emoji: "💸", label: "$100 cash prize draw" },
  { emoji: "🎮", label: "$50 gaming credit draw" },
  { emoji: "🎧", label: "Wireless headphones draw" },
];

const REVIEWS = [
  {
    name: "Jordan P.",
    place: "Austin, TX 🇺🇸",
    age: 24,
    text: "Thought it was another scam page, honestly. Entry form was clear and took me under a minute.",
  },
  {
    name: "Chloe B.",
    place: "Miami, FL 🇺🇸",
    age: 29,
    text: "No card details asked at any point — that's what convinced me to finish my entry.",
  },
  {
    name: "Ryan T.",
    place: "Los Angeles, CA 🇺🇸",
    age: 33,
    text: "Clean process, no spam calls after. I pick a new draw to enter every few weeks.",
  },
  {
    name: "Alyssa M.",
    place: "New York, NY 🇺🇸",
    age: 26,
    text: "Entered during lunch on my phone. Upfront about the odds and what happens with my details.",
  },
];

const TRUST_POINTS = [
  {
    icon: "🧾",
    title: "Partner-funded, not user-funded",
    body: "Prize draws are funded by advertisers who want anonymous feedback. That is why entry is free and card details are never needed.",
  },
  {
    icon: "🔐",
    title: "Your data stays yours",
    body: "Encrypted over 256-bit SSL, never sold, and deletable on request at any time from our Privacy Policy page.",
  },
  {
    icon: "📋",
    title: "Clear rules, no purchase",
    body: "Each giveaway lists its own entry rules and eligibility on the partner page. No purchase is necessary, and buying nothing does not change your chances.",
  },
];

const FAQS = [
  {
    q: "Am I guaranteed to win a prize?",
    a: "No. This is a prize draw, so entering gives you a chance to win — it is never a guaranteed prize. Winners are selected by the giveaway partner under their published rules.",
  },
  {
    q: "Is entry actually free?",
    a: "Yes. No purchase is necessary, there is no subscription and no credit card at any stage. Partners fund the prizes in exchange for anonymous survey feedback.",
  },
  {
    q: "Who can enter?",
    a: "Residents of the United States who are 18 or older. One entry per person per draw, void where prohibited by law.",
  },
  {
    q: "What do you do with my details?",
    a: "We only pass what the giveaway partner needs to process your entry. We never sell your data and you can request deletion at any time from our Privacy Policy page.",
  },
  {
    q: "How are winners contacted?",
    a: "Each giveaway partner announces and contacts its own winners using the details submitted with the entry. Timing and prize details are set out in that giveaway's rules.",
  },
];

function Index() {
  const city = useCity();
  const { spots } = useSpotCounter();
  const { label, isFinal, isLocked } = useCountdown();
  const claimRef = useRef<HTMLDivElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  const [anyCtaVisible, setAnyCtaVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const check = () => {
      frame = 0;
      const els = [claimRef.current, bottomCtaRef.current].filter(Boolean) as HTMLDivElement[];
      if (!els.length) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = els.some((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 8 && r.top < vh - 8;
      });
      setAnyCtaVisible((prev) => (prev === visible ? prev : visible));
    };

    const request = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    check();
    // capture:true also catches scrolls inside nested scroll containers (some
    // in-app browsers scroll a wrapper element instead of the window).
    window.addEventListener("scroll", request, { passive: true, capture: true });
    window.addEventListener("resize", request);
    window.addEventListener("orientationchange", request);
    window.addEventListener("pageshow", request);
    document.addEventListener("visibilitychange", request);

    const ro = new ResizeObserver(request);
    ro.observe(document.body);
    // Safety net for browsers that miss momentum-scroll events (iOS Safari).
    const poll = setInterval(check, 500);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request, true);
      window.removeEventListener("resize", request);
      window.removeEventListener("orientationchange", request);
      window.removeEventListener("pageshow", request);
      document.removeEventListener("visibilitychange", request);
      ro.disconnect();
      clearInterval(poll);
    };
  }, []);

  return (
    <main className="surface-glow min-h-screen bg-background px-4 pt-6 pb-32 text-foreground">
      <div className="mx-auto max-w-xl space-y-5 text-center">
        <img
          src={rewardHero}
          alt="Three unbranded gift cards representing the gift card, cash and gaming credit prize draws"
          width={1376}
          height={768}
          className="mx-auto w-full max-w-md rounded-2xl bg-card shadow-2xl"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full border border-border bg-card px-3 py-1 tracking-wide text-accent uppercase">
            Free to enter · No purchase
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1">🇺🇸 USA · 18+</span>
        </div>

        <h1 className="text-3xl leading-tight font-black tracking-tight text-balance sm:text-5xl">
          🎁 Giveaway entries are open to <span className="text-primary">{city}</span> residents
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">
          Enter for a chance to win prizes worth up to{" "}
          <strong className="text-foreground">$250</strong> — gift cards, cash prizes or gaming
          credit. Free entry, no purchase necessary, no credit card. Winning is not guaranteed.
        </p>

        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="flex -space-x-2">
            {["JP", "CB", "RT", "AM"].map((i) => (
              <span
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-secondary text-[10px] font-bold text-secondary-foreground"
              >
                {i}
              </span>
            ))}
          </span>
          <span className="text-muted-foreground">
            <strong className="text-foreground">12,400+</strong> entries submitted ·{" "}
            <span className="text-accent">★ 4.9/5</span>
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-lg">
          <p className="soft-pulse text-base font-semibold text-muted-foreground">
            Only{" "}
            <span
              id="spotNumber"
              className="inline-block align-middle text-2xl font-black text-primary"
            >
              {spots}
            </span>{" "}
            entry slots left in this round for <span className="text-foreground">{city}</span>
          </p>

          <div className="mt-4 border-t border-border pt-4">
            {isLocked ? (
              <p className="text-lg font-bold text-success">
                ✅ This round is closing — entries still open
              </p>
            ) : isFinal ? (
              <p className="urgent-pulse text-lg font-bold">
                ⏳ Few seconds left in this entry round! {label}
              </p>
            ) : (
              <p className="text-lg font-bold">
                <span className="text-muted-foreground">This entry round closes in </span>
                <span className="font-mono tabular-nums text-primary">{label}</span>
              </p>
            )}
          </div>
        </div>

        <ActivityFeed />

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base font-medium">
          <li>✅ No Credit Card</li>
          <li>✅ No Purchase Required</li>
          <li>✅ Free Entry</li>
        </ul>

        <div id="claim" ref={claimRef}>
          <CTAButton />
        </div>

        <p className="text-xs text-muted-foreground">
          🔒 256-bit SSL <span className="opacity-40">|</span> 🛡️ Privacy First{" "}
          <span className="opacity-40">|</span> ⭐ 4.9/5 TrustScore
        </p>

        <section className="pt-6 text-left">
          <h2 className="text-center text-lg font-bold">Giveaways you can enter</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {REWARDS.map((r) => (
              <div
                key={r.label}
                className="rounded-xl border border-border bg-card/70 p-4 text-center"
              >
                <div className="text-2xl">{r.emoji}</div>
                <div className="mt-1 text-base font-semibold">{r.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-4 text-left">
          <h2 className="text-center text-lg font-bold">How it works</h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="flex gap-3 rounded-xl border border-border bg-card/70 p-4 text-base"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                  {s.n}
                </span>
                <span>
                  <strong className="block font-semibold">{s.title}</strong>
                  <span className="text-muted-foreground">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-4 text-left">
          <h2 className="text-center text-lg font-bold">What entrants say</h2>
          <div className="mt-4 space-y-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="rounded-xl border border-border bg-card/70 p-4">
                <div className="text-sm text-accent">★★★★★</div>
                <blockquote className="mt-1 text-base text-card-foreground">“{r.text}”</blockquote>
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">{r.name}</strong>, {r.age} · {r.place} ·{" "}
                  <span className="text-success">Verified entrant</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="pt-4 text-left">
          <h2 className="text-center text-lg font-bold">Why members trust us</h2>
          <div className="mt-4 space-y-3">
            {TRUST_POINTS.map((t) => (
              <div
                key={t.title}
                className="flex gap-3 rounded-xl border border-border bg-card/70 p-4 text-base"
              >
                <span className="text-xl leading-none">{t.icon}</span>
                <span>
                  <strong className="block font-semibold">{t.title}</strong>
                  <span className="text-muted-foreground">{t.body}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-4 text-left">
          <h2 className="text-center text-lg font-bold">Questions, answered</h2>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Straight answers — no small print games.
          </p>
          <div className="mt-4 space-y-2">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-border bg-card/70 p-4 [&_summary]:cursor-pointer"
              >
                <summary className="text-base font-semibold">{f.q}</summary>
                <p className="mt-2 text-base text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="pt-2" ref={bottomCtaRef}>
          <CTAButton />
          <p className="mt-3 text-xs text-muted-foreground">
            No card. No purchase necessary. Entering gives you a chance to win — it is not a
            guaranteed prize.
          </p>
        </div>

        <footer className="pt-6 text-xs text-muted-foreground/70">
          <p className="mb-2">
            Open to residents of the United States only. No purchase necessary; a purchase does not
            improve your chance of winning. Void where prohibited. Prize draws are run and funded by
            independent advertising partners under their own rules; this page is not affiliated
            with, sponsored by or endorsed by any brand, retailer or payment provider.
          </p>
          18+ only. Terms apply.{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground">
            Privacy Policy
          </a>
        </footer>
      </div>

      <div
        aria-hidden={anyCtaVisible}
        className={`fixed right-4 bottom-4 left-4 z-50 transition-opacity duration-200 sm:hidden ${
          anyCtaVisible ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <CTAButton />
      </div>
    </main>
  );
}
