import type { TTSProvider, TTSSettings } from "@/lib/tts/types";

export class ElevenLabsAdapter implements TTSProvider {
  async createVoice(clips: Buffer[], opts?: { consentText?: string }): Promise<{ providerVoiceId: string }> {
    void clips;
    void opts;
    throw new Error("ElevenLabsAdapter.createVoice not implemented");
  }

  async synthesize(providerVoiceId: string, text: string, settings?: TTSSettings): Promise<ReadableStream<Uint8Array>> {
    void providerVoiceId;
    void text;
    void settings;
    throw new Error("ElevenLabsAdapter.synthesize not implemented");
  }

  async revokeVoice(providerVoiceId: string): Promise<void> {
    void providerVoiceId;
    throw new Error("ElevenLabsAdapter.revokeVoice not implemented");
  }
} 