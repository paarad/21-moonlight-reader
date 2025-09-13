export const SID_COOKIE_NAME = process.env.SID_COOKIE_NAME || "mlr_sid";
const SID_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // ~180 days

function getSecret(): string {
  const secret = process.env.SID_COOKIE_SECRET || "dev-secret-change-me";
  return secret;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bytesArr = new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < bytesArr.byteLength; i++) bin += String.fromCharCode(bytesArr[i]);
  const b64 = typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const { buffer, byteOffset, byteLength } = view;
  if (byteOffset === 0 && byteLength === buffer.byteLength) return buffer as ArrayBuffer;
  return buffer.slice(byteOffset, byteOffset + byteLength) as ArrayBuffer;
}

async function importKey(secret: string): Promise<CryptoKey> {
  const rawAb = toArrayBuffer(fromUtf8(secret));
  return crypto.subtle.importKey(
    "raw",
    rawAb,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function generateSid(): Promise<string> {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toBase64Url(toArrayBuffer(bytes));
}

export async function signSid(value: string): Promise<string> {
  const key = await importKey(getSecret());
  const dataAb = toArrayBuffer(fromUtf8(value));
  const sig = await crypto.subtle.sign("HMAC", key, dataAb);
  return toBase64Url(sig);
}

export async function createSignedSid(): Promise<string> {
  const sid = await generateSid();
  const sig = await signSid(sid);
  return `${sid}.${sig}`;
}

export async function verifySignedSid(cookieValue: string | undefined | null): Promise<string | null> {
  if (!cookieValue) return null;
  const [sid, sig] = cookieValue.split(".");
  if (!sid || !sig) return null;
  const expected = await signSid(sid);
  if (expected !== sig) return null;
  return sid;
}

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SID_COOKIE_MAX_AGE_SECONDS,
}; 