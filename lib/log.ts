type LogMeta = Record<string, unknown>;

export function logInfo(message: string, meta?: LogMeta) {
  // Never include raw text
  const safe = sanitize(meta);
  console.info(message, safe);
}

export function logError(message: string, meta?: LogMeta) {
  const safe = sanitize(meta);
  console.error(message, safe);
}

function sanitize(meta?: LogMeta) {
  if (!meta) return undefined;
  const copy: LogMeta = { ...meta };
  if (typeof copy["text"] === "string") {
    const text = String(copy["text"]);
    copy["text"] = `[redacted:${text.length} chars]`;
  }
  return copy;
} 