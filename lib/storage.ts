import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "auto";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

export const uploadsBucket = process.env.S3_BUCKET_UPLOADS || "uploads";
export const outputsBucket = process.env.S3_BUCKET_OUTPUTS || "outputs";

export function createS3() {
  return new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });
}

export async function presignDownload(
  bucket: string,
  key: string,
  expiresSeconds: number
): Promise<{ url: string; expiresAt: string }> {
  const s3 = createS3();
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
  const expiresAt = new Date(Date.now() + expiresSeconds * 1000).toISOString();
  return { url, expiresAt };
} 