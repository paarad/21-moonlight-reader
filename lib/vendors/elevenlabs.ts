const BASE_URL = "https://api.elevenlabs.io";

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY missing");
  return key;
}

export async function elCreateVoice(name: string, files: File[]): Promise<{ voiceId: string }> {
  const form = new FormData();
  form.set("name", name || "Moonlight Voice");
  for (const f of files) {
    form.append("files", f, (f as any).name || "clip.wav");
  }
  const res = await fetch(`${BASE_URL}/v1/voices/add`, {
    method: "POST",
    headers: { "xi-api-key": apiKey() },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`elevenlabs add voice failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return { voiceId: json?.voice_id as string };
}

export type ElevenLabsSynthesisSettings = {
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  useSpeakerBoost?: boolean;
  optimizeStreamingLatency?: 0 | 1 | 2 | 3;
};

export async function elSynthesizeToArrayBuffer(
  voiceId: string,
  text: string,
  settings?: ElevenLabsSynthesisSettings
): Promise<ArrayBuffer> {
  const body = {
    text,
    model_id: settings?.modelId || "eleven_multilingual_v2",
    optimize_streaming_latency: settings?.optimizeStreamingLatency ?? 3,
    voice_settings: {
      stability: settings?.stability ?? 0.6,
      similarity_boost: settings?.similarityBoost ?? 0.85,
      use_speaker_boost: settings?.useSpeakerBoost ?? true,
    },
  } as any;
  const res = await fetch(`${BASE_URL}/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey(),
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const textErr = await res.text().catch(() => "");
    throw new Error(`elevenlabs tts failed: ${res.status} ${textErr}`);
  }
  return await res.arrayBuffer();
}

export async function elDeleteVoice(voiceId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/v1/voices/${encodeURIComponent(voiceId)}`, {
    method: "DELETE",
    headers: { "xi-api-key": apiKey() },
  });
  if (!res.ok) {
    // Non-fatal for cleanup
    return;
  }
} 