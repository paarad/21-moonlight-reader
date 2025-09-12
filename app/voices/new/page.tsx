"use client";

import { useState } from "react";

export default function NewVoicePage() {
  const [consent, setConsent] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Save a voice</h1>
      <p className="text-sm text-muted-foreground">
        Upload 1–3 minute clips (wav/mp3/m4a). We store voice IDs at the provider, not your text.
      </p>

      <div className="space-y-2">
        <label className="text-sm">Voice name (optional)</label>
        <input
          type="text"
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
          placeholder="Grandma, Dad, Star Voice..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Clips (1–3 minutes)</label>
        <input
          type="file"
          accept="audio/*"
          multiple
          className="w-full text-sm"
        />
      </div>

      <div className="rounded-md border border-border p-3 text-sm space-y-3">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I confirm I have rights and consent to create an AI voice from these clips.
          </span>
        </label>
        <div className="text-xs text-muted-foreground">
          Suggested consent script: “I allow my voice to be cloned for Moonlight Reader. I understand I can revoke this later.”
        </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={!consent}
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Create voice
        </button>
        <button className="h-10 rounded-md border border-border px-4 text-sm hover:bg-accent">
          Cancel
        </button>
      </div>
    </div>
  );
} 