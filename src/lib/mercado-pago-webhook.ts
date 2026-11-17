import crypto from "node:crypto";

function timingSafeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function verifyMercadoPagoWebhook({
  dataId,
  requestId,
  signature,
  secret,
}: {
  dataId: string;
  requestId: string | null;
  signature: string | null;
  secret: string | undefined;
}) {
  if (!secret) return { ok: true, skipped: true };
  if (!signature || !requestId || !dataId) return { ok: false, skipped: false };

  const parts = Object.fromEntries(
    signature.split(",").flatMap((part) => {
      const [key, value] = part.split("=");
      return key && value ? [[key.trim(), value.trim()]] : [];
    }),
  );
  const ts = parts.ts;
  const hash = parts.v1;
  if (!ts || !hash) return { ok: false, skipped: false };

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return { ok: timingSafeEqualHex(expected, hash), skipped: false };
}
