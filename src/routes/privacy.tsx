import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Reward Claim" },
      {
        name: "description",
        content:
          "How we handle your data on our reward claim page: what we collect, why we collect it, and your choices.",
      },
      { property: "og:title", content: "Privacy Policy — Reward Claim" },
      {
        property: "og:description",
        content: "What data we collect on the reward claim page and how it is used.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="min-h-screen bg-background px-4 py-14 text-foreground">
      <div className="mx-auto max-w-2xl space-y-5">
        <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          We use your approximate location (derived from your IP address) only to personalize the
          reward offer shown on this page. We do not sell personal data.
        </p>
        <p className="text-sm text-muted-foreground">
          Session information such as your remaining time and reserved spot count is stored in your
          browser session storage and is cleared when you close the tab.
        </p>
        <p className="text-sm text-muted-foreground">18+ only. Terms apply.</p>
        <Link to="/" className="inline-block text-sm font-semibold text-primary underline">
          Back to the reward page
        </Link>
      </div>
    </main>
  );
}