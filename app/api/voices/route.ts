import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifySignedSid } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sid = await verifySignedSid(request.cookies.get("mlr_sid")?.value);
  if (!sid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const voices = await prisma.voice.findMany({ where: { ownerSid: sid } });
  return NextResponse.json(voices);
}

const postSchema = z.object({
  consent: z.boolean(),
  displayName: z.string().max(120).optional(),
});

export async function POST(request: NextRequest) {
  const sid = await verifySignedSid(request.cookies.get("mlr_sid")?.value);
  if (!sid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // In MVP we expect a multipart/form-data for files; accept JSON stub for now.
  const body = await request.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  // Not implemented yet: provider voice creation and file handling
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
} 