import { supabaseAdmin } from "@/lib/supabase";

export const uploadsBucket = process.env.SUPABASE_UPLOADS_BUCKET || "uploads";
export const outputsBucket = process.env.SUPABASE_OUTPUTS_BUCKET || "outputs";

function isBlobLike(input: unknown): input is Blob {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as { arrayBuffer?: unknown; slice?: unknown };
  return typeof obj.arrayBuffer === "function" && typeof obj.slice === "function";
}

function toBlob(input: Blob | File | ArrayBuffer | ArrayBufferView): Blob {
  if (isBlobLike(input)) return input as Blob;
  if (ArrayBuffer.isView(input)) {
    const view = input as ArrayBufferView;
    const ab = (view.buffer as ArrayBuffer).slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
    return new Blob([ab]);
  }
  if (input instanceof ArrayBuffer) return new Blob([input as ArrayBuffer]);
  throw new TypeError("Unsupported input type for toBlob");
}

export async function uploadToBucket(
  bucket: string,
  path: string,
  file: Blob | File | ArrayBuffer | ArrayBufferView,
  opts?: { contentType?: string; upsert?: boolean }
) {
  const sb = supabaseAdmin();
  const blob = toBlob(file);
  const filename = path.split("/").pop() || "file";
  let body: Blob | File = blob;
  if (typeof File !== "undefined" && opts?.contentType) {
    body = new File([blob], filename, { type: opts.contentType });
  }
  const { error } = await sb.storage.from(bucket).upload(path, body, {
    contentType: opts?.contentType,
    upsert: opts?.upsert ?? false,
  });
  if (error) throw error;
}

export async function presignDownload(
  bucket: string,
  path: string,
  expiresSeconds: number
): Promise<{ url: string; expiresAt: string }> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.storage
    .from(bucket)
    .createSignedUrl(path, expiresSeconds);
  if (error || !data) throw error || new Error("presign failed");
  return { url: data.signedUrl, expiresAt: new Date(Date.now() + expiresSeconds * 1000).toISOString() };
}

export async function removeFromBucket(bucket: string, paths: string[]) {
  const sb = supabaseAdmin();
  const { error } = await sb.storage.from(bucket).remove(paths);
  if (error) throw error;
} 