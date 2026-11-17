"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { checkoutSchema } from "@/lib/validations";
import { formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [error, setError] = useState("");
  const [idempotencyKey] = useState(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `checkout-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  });
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";
  const summary = useMemo(() => items.map((item) => `${item.quantity}x ${item.product.name} ${item.variant.size}/${item.variant.color}`).join("%0A"), [items]);

  async function submit(formData: FormData) {
    setError("");
    const raw = Object.fromEntries(formData.entries());
    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      setError("Revisa los datos del checkout.");
      return;
    }
    if (parsed.data.method === "mercado-pago") {
      const response = await fetch("/api/checkout/mercado-pago", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customer: parsed.data, items, idempotencyKey }),
      });
      const data = (await response.json()) as { initPoint?: string; error?: string };
      if (!response.ok) {
        setError(data.error || "No pudimos crear el pedido.");
        return;
      }
      if (data.initPoint) window.location.href = data.initPoint;
      else setError("Mercado Pago no esta configurado. Usa transferencia o configura MERCADO_PAGO_ACCESS_TOKEN.");
      return;
    }
    const response = await fetch("/api/checkout/mercado-pago", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: parsed.data, items, idempotencyKey }),
    });
    const data = (await response.json()) as { whatsappUrl?: string; error?: string };
    if (!response.ok) {
      setError(data.error || "No pudimos crear el pedido.");
      return;
    }
    window.location.href = data.whatsappUrl || `https://wa.me/${whatsapp}?text=Hola%20Zuki%20Zone,%20quiero%20finalizar%20mi%20pedido:%0A${summary}%0ATotal:%20${encodeURIComponent(formatPrice(total))}`;
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Checkout</p>
        <h1 className="mt-2 text-4xl font-black">Finalizar compra</h1>
        <form action={submit} className="mt-8 grid gap-6 rounded-md bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="firstName" placeholder="Nombre" className="field" />
            <input name="lastName" placeholder="Apellido" className="field" />
            <input name="email" placeholder="Email" type="email" className="field" />
            <input name="phone" placeholder="Telefono" className="field" />
          </div>
          <div className="grid gap-3">
            <input name="address" placeholder="Direccion" className="field" />
            <div className="grid gap-3 sm:grid-cols-3">
              <input name="city" placeholder="Ciudad" className="field" />
              <input name="province" placeholder="Provincia" className="field" />
              <input name="zipCode" placeholder="CP" className="field" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-md border border-black/10 p-4"><input type="radio" name="method" value="mercado-pago" defaultChecked /> Mercado Pago</label>
            <label className="rounded-md border border-black/10 p-4"><input type="radio" name="method" value="transferencia" /> Transferencia + comprobante</label>
          </div>
          <textarea name="notes" placeholder="Notas para el pedido" className="field min-h-24" />
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <button className="h-13 rounded-md bg-ink px-5 font-semibold text-white">Pagar pedido</button>
          <p className="text-sm leading-6 text-muted">Emails transaccionales preparados para conectar con Resend o proveedor SMTP en produccion.</p>
        </form>
      </div>
      <aside className="rounded-md bg-[#111315] p-5 text-white lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-xl font-bold">Resumen</h2>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.variant.id} className="grid grid-cols-[64px_1fr] gap-3">
              <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="aspect-square rounded object-cover" />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-xs text-white/50">{item.variant.size} / {item.variant.color} · x{item.quantity}</p>
                <p className="mt-1 font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </aside>
    </section>
  );
}
