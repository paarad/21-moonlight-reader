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
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [download, setDownload] = useState<{ url: string; expiresAt: string } | null>(null);

  async function onGenerate() {
    setError(null);
    setDownload(null);
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload 1–3 minutes of voice clips.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("text", text);
      if (name.trim()) fd.set("name", name.trim());
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/quick-tts", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setDownload({ url: json.downloadUrl, expiresAt: json.expiresAt });
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Generate a bedtime read</h1>
      <p className="text-sm text-muted-foreground">
        Text is processed in-memory only and never stored.
      </p>

      <div className="grid gap-4">
        <div className="rounded-xl border border-border p-4 bg-card/60">
          <div className="space-y-2">
            <label className="text-sm">Voice name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
              placeholder="Grandma, Dad, Star Voice..."
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm">Clips (1–3 minutes)</label>
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-sm"
            />
            <div className="text-xs text-muted-foreground">We use clips only to create a temporary voice, then revoke it.</div>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card/60">
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
        </div>

        <div className="rounded-xl border border-border p-4 bg-card/60">
          <div className="space-y-2">
            <label className="text-sm">Mode</label>
            <div className="flex gap-2">
              {modes.map((m) => (
                <button
                  key={m.key}
                  type="button"
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
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 text-destructive text-sm p-3">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Estimated cost: —</div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {download && (
        <div className="space-y-3 rounded-md border border-border p-3">
          <audio controls className="w-full" src={download.url} />
          <div className="flex items-center justify-between text-sm">
            <a className="underline" href={download.url} target="_blank" rel="noreferrer">
              Download MP3
            </a>
            <span className="text-muted-foreground">Expires: {new Date(download.expiresAt).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
        Download links expire automatically; files are auto-purged.
      </div>
    </div>
  );
} 