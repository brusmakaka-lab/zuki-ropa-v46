import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyMercadoPagoWebhook } from "@/lib/mercado-pago-webhook";

describe("Mercado Pago webhook signature", () => {
  it("validates the documented HMAC manifest", () => {
    const secret = "test-secret";
    const dataId = "123456";
    const requestId = "request-1";
    const ts = "1742505638683";
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const signature = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    expect(
      verifyMercadoPagoWebhook({
        dataId,
        requestId,
        signature: `ts=${ts},v1=${signature}`,
        secret,
      }).ok,
    ).toBe(true);
  });

  it("rejects invalid signatures when a secret is configured", () => {
    expect(
      verifyMercadoPagoWebhook({
        dataId: "123456",
        requestId: "request-1",
        signature: "ts=1,v1=bad",
        secret: "test-secret",
      }).ok,
    ).toBe(false);
  });
});
