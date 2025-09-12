import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="text-center sm:text-left space-y-6">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          Close your eyes. We’ll read the rest.
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Moonlight Reader turns any text into a bedtime narration—read by a star
          or someone you love. We store voices, not texts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            href="/tts"
          >
            Generate a bedtime read
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent"
            href="/voices/new"
          >
            Save a voice
          </Link>
        </div>
        <div className="flex gap-2 pt-2">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            No text stored
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Temporary downloads
          </span>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 bg-card">
          <h3 className="font-medium">Star Mode</h3>
          <p className="text-sm text-muted-foreground">
            Presence and brightness with a slightly faster pace.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <h3 className="font-medium">Family Mode</h3>
          <p className="text-sm text-muted-foreground">
            Use your saved voices with natural cadence.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <h3 className="font-medium">Sleep Mode</h3>
          <p className="text-sm text-muted-foreground">
            Slower rate, softer dynamics, optional ambience.
          </p>
        </div>
      </section>
    </div>
  );
}
