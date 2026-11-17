"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasStock = product.variants.some((variant) => variant.stock > 0);
  const lowStock = product.variants.some((variant) => variant.stock > 0 && variant.stock <= 3);
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const discount = product.compareAt ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;
  const colors = [...new Map(product.variants.map((variant) => [variant.color, variant])).values()];
  const sizes = [...new Set(product.variants.map((variant) => variant.size))];
  const primaryImage = product.images[0] || "/brand/zuki-logo.webp";
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="group rounded-md border border-black/10 bg-white p-2 shadow-[0_12px_40px_rgba(14,14,14,0.035)] transition duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_18px_60px_rgba(14,14,14,0.075)]">
      <div className="relative overflow-hidden rounded-md bg-[#F0EEE9]">
        <Link href={`/producto/${product.slug}`}>
          <Image className="aspect-[4/5] w-full object-cover saturate-[0.9] transition duration-700 group-hover:opacity-0" src={primaryImage} alt={product.name} width={720} height={900} />
          <Image className="absolute inset-0 aspect-[4/5] w-full object-cover opacity-0 saturate-[0.9] transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-100" src={secondaryImage} alt={`${product.name} detalle`} width={720} height={900} />
        </Link>
        <div className="absolute left-3 top-3 flex max-w-[72%] flex-wrap gap-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
          {product.isNew ? <span className="rounded-sm bg-surface/92 px-2.5 py-1 text-ink shadow-sm">NUEVO</span> : null}
          {product.isBestSeller ? <span className="rounded-sm bg-ink px-2.5 py-1 text-white shadow-sm">BEST SELLER</span> : null}
          {discount ? <span className="rounded-sm bg-accent px-2.5 py-1 text-ink shadow-sm">-{discount}%</span> : null}
          {totalStock > 0 && totalStock <= 12 ? <span className="rounded-sm bg-accent-dark px-2.5 py-1 text-white shadow-sm">LIMITADO</span> : null}
          {lowStock ? <span className="rounded-sm bg-accent-dark px-2.5 py-1 text-white shadow-sm">POCAS UNIDADES</span> : null}
        </div>
        <button className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm transition duration-200 hover:bg-accent hover:text-ink" aria-label="Wishlist">
          <Heart size={18} />
        </button>
        <button
          onClick={() => hasStock && addItem(product)}
          disabled={!hasStock}
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-4 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white opacity-0 transition duration-300 hover:bg-accent hover:text-ink group-hover:translate-y-0 group-hover:opacity-100 disabled:bg-black/45"
        >
          <ShoppingBag size={17} /> {hasStock ? "Agregar rapido" : "Sin stock"}
        </button>
      </div>
      <div className="px-1 pb-2 pt-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <Link href={`/producto/${product.slug}`} className="font-semibold transition hover:text-accent">{product.name}</Link>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{product.type}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatPrice(product.price)}</p>
            {product.compareAt ? <p className="text-sm text-muted line-through">{formatPrice(product.compareAt)}</p> : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {colors.map((variant) => <span key={variant.id} className="size-4 rounded-full border border-black/15" style={{ backgroundColor: variant.colorHex }} />)}
          </div>
          <div className="flex gap-1 text-[11px] font-semibold text-muted">{sizes.slice(0, 4).map((size) => <span key={size}>{size}</span>)}</div>
        </div>
        <p className="mt-2 text-xs text-muted">3 cuotas de {formatPrice(product.price / 3)}</p>
        {totalStock > 0 && totalStock <= 5 ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-accent-dark">Quedan {totalStock} unidades</p> : null}
      </div>
    </motion.article>
  );
}
