import { supabaseAdmin } from "@/lib/supabase";

export const uploadsBucket = process.env.SUPABASE_UPLOADS_BUCKET || "uploads";
export const outputsBucket = process.env.SUPABASE_OUTPUTS_BUCKET || "outputs";

export async function uploadToBucket(
  bucket: string,
  path: string,
  file: File | Blob,
  opts?: { contentType?: string; upsert?: boolean }
) {
  const sb = supabaseAdmin();
  const { error } = await sb.storage.from(bucket).upload(path, file, {
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