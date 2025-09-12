import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifySignedSid } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const sid = await verifySignedSid(request.cookies.get("mlr_sid")?.value);
  if (!sid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const parsed = z.object({ displayName: z.string().min(1).max(120) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  await prisma.voice.update({ where: { id }, data: { displayName: parsed.data.displayName } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const sid = await verifySignedSid(request.cookies.get("mlr_sid")?.value);
  if (!sid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  // TODO: provider revoke
  await prisma.voice.update({ where: { id }, data: { revokedAt: new Date() } }).catch(() => null);
  return NextResponse.json({ ok: true });
} 