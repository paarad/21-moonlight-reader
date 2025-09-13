import Link from "next/link";
import { ModeCard } from "@/components/ModeCard";

export default function Home() {
  return (
    <div className="grid gap-16">
      <section className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">
            Close your eyes. We’ll read the rest.
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Moonlight Reader turns any text into a bedtime narration—read by a star
            or someone you love. We store voices, not texts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            href="/tts"
          >
            Generate a bedtime read
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-sm font-medium hover:bg-accent"
            href="/voices/new"
          >
            Save a voice
          </Link>
        </div>
        <div className="flex gap-3 pt-1">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
            No text stored
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
            Temporary downloads
          </span>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <ModeCard title="Star Mode">
          Presence and brightness with a slightly faster pace.
        </ModeCard>
        <ModeCard title="Family Mode">
          Use your saved voices with natural cadence.
        </ModeCard>
        <ModeCard title="Sleep Mode">
          Slower rate, softer dynamics, optional ambience.
        </ModeCard>
      </section>
    </div>
  );
}
