export type ModePreset = "star" | "family" | "sleep";

export type TTSSettings = {
  rate?: number;
  stability?: number;
  style?: string;
  ambience?: "none" | "pink-noise" | "soft-lull";
};

export interface TTSProvider {
  createVoice(
    clips: Buffer[],
    opts?: { consentText?: string }
  ): Promise<{ providerVoiceId: string }>;

  synthesize(
    providerVoiceId: string,
    text: string,
    settings?: TTSSettings
  ): Promise<ReadableStream<Uint8Array>>;

  revokeVoice(providerVoiceId: string): Promise<void>;
} 