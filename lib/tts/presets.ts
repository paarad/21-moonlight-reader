import type { ModePreset, TTSSettings } from "@/lib/tts/types";

export function settingsForMode(mode: ModePreset): TTSSettings {
  switch (mode) {
    case "star":
      return { rate: 1.05, stability: 0.6, style: "bright", ambience: "none" };
    case "family":
      return { rate: 1.0, stability: 0.8, style: "natural", ambience: "none" };
    case "sleep":
      return { rate: 0.9, stability: 0.9, style: "soft", ambience: "soft-lull" };
    default:
      return {};
  }
} 