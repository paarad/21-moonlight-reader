import type { TTSProvider, TTSSettings } from "@/lib/tts/types";

export class PlayHTAdapter implements TTSProvider {
  async createVoice(clips: Buffer[], opts?: { consentText?: string }): Promise<{ providerVoiceId: string }> {
    void clips;
    void opts;
    throw new Error("PlayHTAdapter.createVoice not implemented");
  }

  async synthesize(providerVoiceId: string, text: string, settings?: TTSSettings): Promise<ReadableStream<Uint8Array>> {
    void providerVoiceId;
    void text;
    void settings;
    throw new Error("PlayHTAdapter.synthesize not implemented");
  }

  async revokeVoice(providerVoiceId: string): Promise<void> {
    void providerVoiceId;
    throw new Error("PlayHTAdapter.revokeVoice not implemented");
  }
} 