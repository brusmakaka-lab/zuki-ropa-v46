"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/data";
import { useCart } from "./cart-provider";

const navItems = [
  { label: "NEW IN", href: "/catalogo?nuevo=1" },
  { label: "REMERAS", href: "/catalogo?categoria=remeras" },
  { label: "HOODIES", href: "/catalogo?categoria=hoodies" },
  { label: "PANTALONES", href: "/catalogo?categoria=pantalones" },
  { label: "ACCESORIOS", href: "/catalogo?categoria=accesorios" },
  { label: "SALE", href: "/catalogo?oferta=1" },
];

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(14px)"]);

  const nav = navItems.map((item) => (
    <Link key={item.href} href={item.href}>{item.label}</Link>
  ));

  return (
    <motion.header className="sticky top-0 z-30 border-b border-black/10 bg-surface/92 shadow-[0_8px_30px_rgba(14,14,14,0.035)]" style={{ backdropFilter: blur }}>
      <div className="bg-accent-dark px-3 py-2 text-center text-[10px] font-medium uppercase leading-5 tracking-[0.12em] text-[#F7F6F3] sm:text-xs sm:tracking-[0.18em]">
        <span className="sm:hidden">3 cuotas - envio gratis</span>
        <span className="hidden sm:inline">3 cuotas sin interes - Envio gratis desde $90.000 - +4.8 en resenas</span>
      </div>
      <div className="mx-auto grid h-24 max-w-7xl grid-cols-3 items-center px-4 lg:flex lg:h-28 lg:justify-between lg:gap-6">
        <button className="grid size-10 place-items-center rounded-full transition duration-200 hover:bg-accent/20 lg:hidden" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <Link href="/" className="justify-self-center px-2 py-2 lg:justify-self-auto" aria-label="Zuki Store inicio">
          <Image src="/brand/zuki-header.svg" alt="Zuki Store" width={220} height={82} priority className="h-[76px] w-auto object-contain lg:h-[86px]" />
        </Link>
        <nav className="hidden items-center gap-4 text-[12px] font-bold uppercase tracking-[0.14em] text-foreground lg:flex xl:gap-5 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-accent" onMouseEnter={() => setMegaOpen(true)}>
          {nav}
        </nav>
        <div className="flex items-center justify-end gap-1">
          <Link href="/catalogo" className="grid size-10 place-items-center rounded-full transition duration-200 hover:bg-accent/20 hover:text-accent" aria-label="Buscar"><Search size={20} /></Link>
          <button className="hidden size-10 place-items-center rounded-full transition duration-200 hover:bg-accent/20 hover:text-accent sm:grid" aria-label="Favoritos">
            <Heart size={19} />
          </button>
          <button className="relative grid size-10 place-items-center rounded-full transition duration-200 hover:bg-accent/20 hover:text-accent" onClick={openCart} aria-label="Carrito">
            <ShoppingBag size={20} />
            {count ? <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-gold text-xs font-bold text-ink">{count}</span> : null}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {megaOpen ? (
          <motion.div
            onMouseLeave={() => setMegaOpen(false)}
            className="absolute left-0 right-0 top-full hidden border-b border-black/10 bg-accent-dark px-4 py-8 text-[#F7F6F3] shadow-2xl lg:block"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-5">
              {categories.map((category) => (
                <Link href={`/catalogo?categoria=${category.slug}`} key={category.slug} className="group rounded-md border border-white/10 p-5 transition duration-200 hover:border-accent hover:bg-white/10">
                  <p className="text-lg font-semibold uppercase tracking-[0.12em]">{category.name}</p>
                  <p className="mt-2 text-sm text-white/55">Seleccion premium, stock real y variantes listas.</p>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div className="fixed inset-0 z-50 bg-accent-dark text-[#F7F6F3] lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>
            <div className="grid h-16 grid-cols-3 items-center border-b border-white/10 px-4">
              <span />
              <Image src="/brand/zuki-header.svg" alt="Zuki Store" width={170} height={64} className="h-16 w-auto justify-self-center rounded-sm bg-[#F7F6F3]" />
              <button className="grid size-10 place-items-center justify-self-end" onClick={() => setMobileOpen(false)} aria-label="Cerrar"><X /></button>
            </div>
            <nav className="grid gap-6 p-6 text-xl font-semibold uppercase tracking-[0.14em] [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-accent" onClick={() => setMobileOpen(false)}>{nav}</nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
