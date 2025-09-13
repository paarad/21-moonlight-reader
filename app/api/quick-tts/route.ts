import { NextResponse, type NextRequest } from "next/server";
import { outputsBucket, presignDownload, uploadToBucket } from "@/lib/storage";
import { elCreateVoice, elSynthesizeToArrayBuffer, elDeleteVoice, type ElevenLabsSynthesisSettings } from "@/lib/vendors/elevenlabs";

export const runtime = "nodejs";

function requireEnv() {
  const missing: string[] = [];
  if (!process.env.ELEVENLABS_API_KEY) missing.push("ELEVENLABS_API_KEY");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.SUPABASE_OUTPUTS_BUCKET) missing.push("SUPABASE_OUTPUTS_BUCKET");
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}

function settingsForMode(mode: string | null): ElevenLabsSynthesisSettings {
  // Tuned defaults for FR: multilingual model, higher similarity, speaker boost
  switch (mode) {
    case "star":
      return { modelId: "eleven_multilingual_v2", stability: 0.5, similarityBoost: 0.9, useSpeakerBoost: true, optimizeStreamingLatency: 2 };
    case "sleep":
      return { modelId: "eleven_multilingual_v2", stability: 0.7, similarityBoost: 0.85, useSpeakerBoost: true, optimizeStreamingLatency: 3 };
    case "family":
    default:
      return { modelId: "eleven_multilingual_v2", stability: 0.6, similarityBoost: 0.88, useSpeakerBoost: true, optimizeStreamingLatency: 3 };
  }
}

export async function POST(request: NextRequest) {
  try {
    requireEnv();

    const form = await request.formData();
    const text = String(form.get("text") || "").trim();
    if (!text) return NextResponse.json({ error: "text_required", message: "Text is required" }, { status: 400 });

    const files: File[] = [];
    for (const [key, value] of form.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }
    if (files.length === 0) {
      return NextResponse.json({ error: "files_required", message: "Upload 1–3 minutes of clips" }, { status: 400 });
    }
    const name = String(form.get("name") || "Moonlight Voice").slice(0, 60);
    const mode = String(form.get("mode") || "family");

    // 1) Create temporary voice from clips
    const { voiceId } = await elCreateVoice(name, files);

    // 2) Synthesize to MP3 buffer with tuned settings
    const synthSettings = settingsForMode(mode);
    const audioBuffer = await elSynthesizeToArrayBuffer(voiceId, text, synthSettings);

    // 3) Upload to Supabase outputs
    const key = `mlr/${voiceId}/${Date.now()}.mp3`;
    await uploadToBucket(process.env.SUPABASE_OUTPUTS_BUCKET || outputsBucket, key, audioBuffer, { contentType: "audio/mpeg", upsert: true });

    // 4) Revoke temp voice (we are stateless by default)
    await elDeleteVoice(voiceId).catch(() => {});

    // 5) Presign and return
    const ttl = parseInt(process.env.OUTPUT_URL_TTL_SECONDS || "3600", 10);
    const { url, expiresAt } = await presignDownload(process.env.SUPABASE_OUTPUTS_BUCKET || outputsBucket, key, ttl);
    return NextResponse.json({ downloadUrl: url, expiresAt });
  } catch (err: unknown) {
    console.error("/api/quick-tts error", err);
    const message = err instanceof Error ? err.message : typeof err === "string" ? err : "unknown error";
    return NextResponse.json({ error: "server_error", message }, { status: 500 });
  }
} 