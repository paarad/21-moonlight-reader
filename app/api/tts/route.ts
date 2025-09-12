import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifySignedSid } from "@/lib/auth";
import { z } from "zod";
import { logInfo } from "@/lib/log";

export const runtime = "nodejs";

const schema = z.object({
  voiceId: z.string().uuid(),
  text: z.string().min(1).max(20000),
  mode: z.enum(["star", "family", "sleep"]).default("family"),
});

export async function POST(request: NextRequest) {
  const sid = await verifySignedSid(request.cookies.get("mlr_sid")?.value);
  if (!sid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const { voiceId, text, mode } = parsed.data;
  const voice = await prisma.voice.findUnique({ where: { id: voiceId } });
  if (!voice || voice.revokedAt) return NextResponse.json({ error: "voice_unavailable" }, { status: 400 });

  logInfo("tts_request", { chars: text.length, mode });

  // Not implemented: streaming to provider, storing temp file, presign
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
} 