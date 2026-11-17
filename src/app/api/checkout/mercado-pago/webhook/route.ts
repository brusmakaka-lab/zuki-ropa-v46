import { PaymentStatus, OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/checkout";
import { verifyMercadoPagoWebhook } from "@/lib/mercado-pago-webhook";
import { getPrisma } from "@/lib/prisma";
import { hasDatabase } from "@/lib/store";

function mapPaymentStatus(status?: string | null) {
  if (status === "approved") return PaymentStatus.APPROVED;
  if (status === "rejected" || status === "cancelled") return PaymentStatus.REJECTED;
  if (status === "refunded" || status === "charged_back") return PaymentStatus.REFUNDED;
  return PaymentStatus.PENDING;
}

function mapOrderStatus(status: PaymentStatus) {
  if (status === PaymentStatus.APPROVED) return OrderStatus.PAID;
  if (status === PaymentStatus.REJECTED || status === PaymentStatus.REFUNDED) return OrderStatus.CANCELLED;
  return OrderStatus.PENDING;
}

export async function POST(request: Request) {
  if (!hasDatabase()) return NextResponse.json({ ok: true, skipped: "database-not-configured" });

  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const type = url.searchParams.get("type") || url.searchParams.get("topic") || body.type;
  const id = url.searchParams.get("data.id") || url.searchParams.get("id") || body?.data?.id || body.id;
  const requestId = request.headers.get("x-request-id");
  const signature = request.headers.get("x-signature");

  if (type !== "payment" || !id) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const verified = verifyMercadoPagoWebhook({
    dataId: String(id),
    requestId,
    signature,
    secret: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
  });
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: "Invalid webhook signature" }, { status: 401 });
  }

  const db = getPrisma();
  const providerEventId = `${requestId || body.id || "mp"}:${id}`;
  const existingLog = await db.paymentLog.findUnique({ where: { providerEventId } });
  if (existingLog?.processedAt) {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const log = existingLog || await db.paymentLog.create({
    data: {
      providerEventId,
      providerPaymentId: String(id),
      eventType: String(body.action || type),
      payload: body,
    },
  });

  const payment = await getMercadoPagoPayment(String(id));
  if (!payment?.external_reference) {
    await db.paymentLog.update({
      where: { id: log.id },
      data: { processedAt: new Date(), status: PaymentStatus.PENDING },
    });
    return NextResponse.json({ ok: true, ignored: "missing-external-reference" });
  }

  const status = mapPaymentStatus(payment.status);
  const order = await db.order.update({
    where: { number: payment.external_reference },
    data: {
      status: mapOrderStatus(status),
      payment: {
        update: {
          status,
          providerPaymentId: String(payment.id || id),
        },
      },
    },
    include: { payment: true },
  });

  await db.paymentLog.update({
    where: { id: log.id },
    data: {
      paymentId: order.payment?.id,
      providerPaymentId: String(payment.id || id),
      status,
      processedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
