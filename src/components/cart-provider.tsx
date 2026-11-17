"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, freeShippingFrom, products } from "@/lib/data";
import type { CartItem, Product, Variant } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  isOpen: boolean;
  addItem: (product: Product, variant?: Variant) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem("zuki-cart");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as { productId: string; variantId: string; quantity: number }[];
      return parsed.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        return product && variant ? [{ product, variant, quantity: item.quantity }] : [];
      });
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const persist = (next: CartItem[]) => {
    setItems(next);
    window.localStorage.setItem(
      "zuki-cart",
      JSON.stringify(next.map((item) => ({ productId: item.product.id, variantId: item.variant.id, quantity: item.quantity }))),
    );
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total,
      count,
      isOpen,
      addItem(product, variant = product.variants.find((v) => v.stock > 0) || product.variants[0]) {
        const next = [...items];
        const existing = next.find((item) => item.variant.id === variant.id);
        if (existing) existing.quantity += 1;
        else next.push({ product, variant, quantity: 1 });
        persist(next);
        setIsOpen(true);
        toast.success("Producto agregado al carrito");
      },
      updateQuantity(variantId, quantity) {
        persist(items.map((item) => (item.variant.id === variantId ? { ...item, quantity } : item)).filter((item) => item.quantity > 0));
      },
      removeItem(variantId) {
        persist(items.filter((item) => item.variant.id !== variantId));
      },
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [count, isOpen, items, total],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

function CartDrawer() {
  const { items, total, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const remaining = Math.max(freeShippingFrom - total, 0);
  const recommendedProducts = products.filter((product) => product.isBestSeller || product.isNew).slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-40 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-[#111315] text-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <p className="font-semibold">Tu carrito</p>
              </div>
              <button className="grid size-10 place-items-center rounded-full bg-white/10" onClick={closeCart} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>
            <div className="border-b border-white/10 p-5">
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gold" style={{ width: `${Math.min((total / freeShippingFrom) * 100, 100)}%` }} />
              </div>
              <p className="text-sm text-white/70">{remaining > 0 ? `Te faltan ${formatPrice(remaining)} para envio gratis.` : "Ya tenes envio gratis."}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex min-h-full flex-col justify-center">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Carrito vacio</p>
                    <h2 className="mt-3 text-3xl font-black">Tu proximo outfit empieza aca.</h2>
                    <p className="mt-3 text-sm leading-6 text-white/62">Explora los favoritos de la comunidad y suma una pieza Zuki a tu rotacion.</p>
                    <Link href="/catalogo" onClick={closeCart} className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-accent">
                      Volver al catalogo
                    </Link>
                  </div>
                  <div className="mt-9 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Recomendados</p>
                    {recommendedProducts.map((product) => (
                      <Link href={`/producto/${product.slug}`} onClick={closeCart} key={product.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-md border border-white/10 bg-white/5 p-2 transition hover:border-accent/60 hover:bg-white/10">
                        <Image className="aspect-square rounded-md object-cover saturate-[0.9]" src={product.images[0] || "/brand/zuki-logo.webp"} alt={product.name} width={96} height={96} />
                        <div className="self-center">
                          <p className="text-sm font-semibold">{product.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/45">{product.type}</p>
                          <p className="mt-2 text-sm font-bold">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div className="grid grid-cols-[84px_1fr] gap-4" key={item.variant.id}>
                      <Image className="aspect-square rounded-md object-cover" src={item.product.images[0]} alt={item.product.name} width={120} height={120} />
                      <div>
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs uppercase text-white/50">{item.variant.size} / {item.variant.color}</p>
                          </div>
                          <button onClick={() => removeItem(item.variant.id)} aria-label="Eliminar" className="text-white/50 hover:text-white">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-white/15">
                            <button className="grid size-8 place-items-center" onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} aria-label="Restar">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button className="grid size-8 place-items-center" onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} aria-label="Sumar">
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-white/10 p-5">
              <input className="mb-4 h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none placeholder:text-white/35" placeholder="Cupon de descuento" />
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="flex h-12 items-center justify-center rounded-md bg-white px-5 font-semibold text-ink transition hover:bg-accent">
                Iniciar checkout
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
