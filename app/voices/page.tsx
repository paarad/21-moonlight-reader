import Link from "next/link";

export default function VoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Voices</h1>
        <Link
          href="/voices/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Save a new voice
        </Link>
      </div>

      <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
        Sign in is anonymous via a private cookie. Voices below are bound to your browser.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Voice {i}</div>
                <div className="text-xs text-muted-foreground">Provider • Date</div>
              </div>
              <span className="text-xs rounded-full border border-border px-2 py-0.5 text-muted-foreground">
                active
              </span>
            </div>
            <div className="flex gap-2">
              <button className="h-9 rounded-md border border-border px-3 text-sm hover:bg-accent">Rename</button>
              <button className="h-9 rounded-md border border-border px-3 text-sm hover:bg-accent">Use</button>
              <button className="h-9 rounded-md border border-destructive/50 px-3 text-sm text-destructive hover:bg-destructive/10">
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 