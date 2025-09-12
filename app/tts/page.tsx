"use client";

import { useState } from "react";

const modes = [
  { key: "star", label: "Star" },
  { key: "family", label: "Family" },
  { key: "sleep", label: "Sleep" },
] as const;

type ModeKey = typeof modes[number]["key"];

export default function TTSPage() {
  const [mode, setMode] = useState<ModeKey>("family");
  const [text, setText] = useState("");

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Generate a bedtime read</h1>
      <p className="text-sm text-muted-foreground">
        Text is processed in-memory only and never stored.
      </p>

      <div className="space-y-2">
        <label className="text-sm">Voice</label>
        <select className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm">
          <option value="">Select a voice…</option>
          <option value="voice1">Voice 1</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a chapter or paragraph…"
          className="w-full min-h-40 rounded-md border border-border bg-background p-3 text-sm"
        />
        <div className="text-xs text-muted-foreground">Max 20k characters per request.</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Mode</label>
        <div className="flex gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`h-9 rounded-md border px-3 text-sm ${
                mode === m.key ? "bg-primary text-primary-foreground border-transparent" : "border-border hover:bg-accent"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Estimated cost: —</div>
        <button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50" disabled>
          Generate
        </button>
      </div>

      <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
        Download links expire automatically; files are auto-purged.
      </div>
    </div>
  );
} 