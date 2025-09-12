import { NextResponse, type NextRequest } from "next/server";
import { SID_COOKIE_NAME, createSignedSid, verifySignedSid, cookieOptions } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(SID_COOKIE_NAME)?.value;
  const validSid = await verifySignedSid(existing);
  if (!validSid) {
    const signed = await createSignedSid();
    response.cookies.set(SID_COOKIE_NAME, signed, cookieOptions);
  }
  return response;
}

export const config = {
  matcher: "/:path*",
}; 