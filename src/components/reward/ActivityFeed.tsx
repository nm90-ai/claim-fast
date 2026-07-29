import { useEffect, useState } from "react";

const NAMES = [
  "Jessica S.",
  "Marcus D.",
  "Taylor R.",
  "Brandon K.",
  "Ashley W.",
  "Tyler H.",
  "Megan L.",
  "Devin C.",
  "Kayla N.",
  "Austin F.",
  "Sierra J.",
  "Cody M.",
  "Bianca R.",
  "Ethan V.",
  "Nicole T.",
  "Jalen B.",
  "Hannah G.",
  "Trevor A.",
  "Priya D.",
  "Logan K.",
];

const CITIES = [
  "NYC",
  "Austin",
  "Miami",
  "Los Angeles",
  "Chicago",
  "Phoenix",
  "Denver",
  "Atlanta",
  "Seattle",
  "Dallas",
  "Boston",
  "Nashville",
  "San Diego",
  "Philadelphia",
  "Las Vegas",
  "Charlotte",
];

const ITEMS = [
  "the $250 gift card draw",
  "the $100 cash prize draw",
  "the gaming credit draw",
  "the $200 shopping voucher draw",
  "the weekly gift card draw",
  "the headphones giveaway",
  "the $50 gift card draw",
  "the tech bundle giveaway",
  "the $100 gift card draw",
  "the monthly cash draw",
];

type Entry = { id: number; name: string; city: string; item: string; mins: number };

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let uid = 0;
function makeEntry(mins: number): Entry {
  return { id: ++uid, name: pick(NAMES), city: pick(CITIES), item: pick(ITEMS), mins };
}

const INITIAL: Entry[] = [
  { id: -1, name: "Jessica S.", city: "NYC", item: "the $250 gift card draw", mins: 3 },
  { id: -2, name: "Marcus D.", city: "Austin", item: "the $100 cash prize draw", mins: 7 },
  { id: -3, name: "Taylor R.", city: "Miami", item: "the gaming credit draw", mins: 12 },
  { id: -4, name: "Brandon K.", city: "Los Angeles", item: "the tech bundle giveaway", mins: 18 },
];

export function ActivityFeed() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // rotate every 15-30 seconds
      const delay = 15000 + Math.random() * 15000;
      timer = setTimeout(() => {
        setEntries((prev) => {
          const next = makeEntry(1 + Math.floor(Math.random() * 3));
          const shifted = prev
            .slice(0, 3)
            .map((e) => ({ ...e, mins: e.mins + 2 + Math.floor(Math.random() * 4) }));
          return [next, ...shifted];
        });
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card/70 p-3 text-left">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Recent entries
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li
            key={e.id}
            className="feed-in flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2 text-base sm:text-sm"
          >
            <span className="text-card-foreground">
              <strong className="font-semibold">{e.name}</strong> from {e.city} entered{" "}
              <span className="text-accent">{e.item}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{e.mins} min ago</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
