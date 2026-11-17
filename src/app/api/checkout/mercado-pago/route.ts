import { NextResponse } from "next/server";
import { createMercadoPagoPreference } from "@/lib/checkout";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createPersistentOrder, hasDatabase } from "@/lib/store";
import { cartPayloadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limited = rateLimit(`checkout:${ip}`, 20, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Demasiados intentos de checkout." }, { status: 429 });
  }
  const body = await request.json();
  const parsed = cartPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  try {
    const order = await createPersistentOrder(parsed.data);
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";
    const summary = order.items.map((item) => `${item.quantity}x ${item.product.name} ${item.variant.size}/${item.variant.color}`).join("%0A");
    const whatsappUrl = `https://wa.me/${whatsapp}?text=Hola%20Zuki%20Zone,%20quiero%20finalizar%20mi%20pedido%20${order.number}:%0A${summary}%0ATotal:%20${encodeURIComponent(
      new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(order.total),
    )}`;

    if (parsed.data.customer.method === "transferencia") {
      return NextResponse.json({ orderNumber: order.number, whatsappUrl });
    }

    const preference = await createMercadoPagoPreference(order.items, parsed.data.customer, order.number);
    if (preference?.id && hasDatabase()) {
      await getPrisma().payment.update({
        where: { orderId: order.id },
        data: { providerPaymentId: preference.id },
      });
    }
    return NextResponse.json({ orderNumber: order.number, initPoint: preference?.init_point || null, whatsappUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed" }, { status: 400 });
  }
}
