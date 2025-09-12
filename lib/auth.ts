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

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    fromUtf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function generateSid(): Promise<string> {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toBase64Url(bytes.buffer);
}

export async function signSid(value: string): Promise<string> {
  const key = await importKey(getSecret());
  const sig = await crypto.subtle.sign("HMAC", key, fromUtf8(value));
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