"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ruler, ShoppingBag, Truck } from "lucide-react";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function ProductDetail({ product }: { product: Product }) {
  const [image, setImage] = useState(product.images[0]);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const { addItem } = useCart();
  const variant = useMemo(() => product.variants.find((item) => item.id === variantId) || product.variants[0], [product.variants, variantId]);
  const colors = [...new Map(product.variants.map((item) => [item.color, item])).values()];

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 lg:grid-cols-[92px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:block lg:space-y-3">
          {product.images.map((src) => (
            <button key={src} onClick={() => setImage(src)} className="shrink-0 overflow-hidden rounded-md border border-black/10">
              <Image src={src} alt={product.name} width={92} height={116} className="aspect-[4/5] object-cover" />
            </button>
          ))}
        </div>
        <motion.div className="order-1 overflow-hidden rounded-md bg-white lg:order-2" layout>
          <Image src={image} alt={product.name} width={1100} height={1350} priority className="aspect-[4/5] w-full object-cover transition hover:scale-105" />
        </motion.div>
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{product.collection}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{product.name}</h1>
        <p className="mt-4 max-w-[calc(100vw-2rem)] text-muted sm:max-w-xl">{product.description}</p>
        <div className="mt-6 flex items-end gap-3">
          <p className="text-2xl font-black">{formatPrice(product.price)}</p>
          {product.compareAt ? <p className="text-lg text-muted line-through">{formatPrice(product.compareAt)}</p> : null}
        </div>
        <p className="mt-1 text-sm text-muted">3 cuotas de {formatPrice(product.price / 3)}</p>
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold">Color</p>
          <div className="flex gap-2">
            {colors.map((item) => (
              <button key={item.id} onClick={() => setVariantId(item.id)} className="grid size-11 place-items-center rounded-full border border-black/15" aria-label={item.color}>
                <span className="size-8 rounded-full border border-black/10" style={{ backgroundColor: item.colorHex }} />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Talle</p>
            <button className="flex items-center gap-1 text-sm underline"><Ruler size={16} /> Guia de talles</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.variants.map((item) => (
              <button key={item.id} disabled={item.stock === 0} onClick={() => setVariantId(item.id)} className={`h-12 rounded-md border text-sm font-semibold ${variant?.id === item.id ? "border-ink bg-ink text-white" : "border-black/10 bg-white"} disabled:opacity-35`}>
                {item.size}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{variant && variant.stock > 0 ? `Stock disponible: ${variant.stock} unidades` : "Sin stock para esta variante"}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button disabled={!variant || variant.stock === 0} onClick={() => variant && addItem(product, variant)} className="flex h-13 items-center justify-center gap-2 rounded-md bg-ink px-5 font-semibold text-white transition hover:bg-accent hover:text-ink disabled:opacity-45">
            <ShoppingBag size={18} /> Agregar al carrito
          </button>
          <button disabled={!variant || variant.stock === 0} onClick={() => variant && addItem(product, variant)} className="h-13 rounded-md border border-ink bg-transparent px-5 font-semibold text-ink transition hover:border-accent hover:bg-accent disabled:opacity-45">Comprar ahora</button>
        </div>
        <div className="mt-8 grid gap-3 rounded-md border border-black/10 bg-white p-4 text-sm text-muted">
          <p className="flex gap-2"><Truck size={18} /> Envio gratis superando el minimo. Retiro coordinado por WhatsApp.</p>
          {[
            ["Descripcion", product.details.composition],
            ["Medidas", product.details.measures],
            ["Envios", product.details.shipping],
            ["Devoluciones", product.details.returns],
            ["Pagos", "Mercado Pago, transferencia y cuotas segun promociones vigentes."],
          ].map(([title, body]) => (
            <details key={title} className="border-t border-black/10 pt-3" open={title === "Descripcion"}>
              <summary className="cursor-pointer font-semibold text-ink">{title}</summary>
              <p className="mt-2 leading-6">{body}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
