"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/lib/types";

export function CatalogFilters({
  categories,
  sizes,
  colors,
  types,
}: {
  categories: Category[];
  sizes: string[];
  colors: string[];
  types: string[];
}) {
  const [open, setOpen] = useState(false);
  const filterProps = { categories, sizes, colors, types };
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-11 items-center gap-2 rounded-md border border-black/10 px-4 text-sm font-semibold lg:hidden">
        <SlidersHorizontal size={18} /> Filtros
      </button>
      <aside className="hidden lg:block"><FilterForm {...filterProps} /></aside>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button className="fixed inset-0 z-40 bg-black/45 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm overflow-y-auto bg-background p-5 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>
              <div className="mb-5 flex items-center justify-between">
                <p className="font-semibold">Filtros</p>
                <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-black/5" aria-label="Cerrar"><X /></button>
              </div>
              <FilterForm close={() => setOpen(false)} {...filterProps} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function FilterForm({
  close,
  categories,
  sizes,
  colors,
  types,
}: {
  close?: () => void;
  categories: Category[];
  sizes: string[];
  colors: string[];
  types: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/catalogo?${next.toString()}`);
    close?.();
  };

  return (
    <div className="grid gap-6 text-sm">
      <FilterGroup title="Categoria" options={categories.map((c) => [c.slug, c.name])} param="categoria" setParam={setParam} />
      <FilterGroup title="Talle" options={sizes.map((s) => [s, s])} param="talle" setParam={setParam} />
      <FilterGroup title="Color" options={colors.map((c) => [c, c])} param="color" setParam={setParam} />
      <FilterGroup title="Tipo" options={types.map((t) => [t, t])} param="tipo" setParam={setParam} />
      <FilterGroup title="Disponibilidad" options={[["disponible", "En stock"]]} param="stock" setParam={setParam} />
      <FilterGroup title="Etiquetas" options={[["1", "Oferta"]]} param="oferta" setParam={setParam} />
      <FilterGroup title="Drop" options={[["1", "Nuevo"]]} param="nuevo" setParam={setParam} />
      <div className="grid grid-cols-2 gap-2">
        <input className="h-10 rounded-md border border-black/10 bg-white px-3" placeholder="Min" onBlur={(event) => setParam("min", event.currentTarget.value)} />
        <input className="h-10 rounded-md border border-black/10 bg-white px-3" placeholder="Max" onBlur={(event) => setParam("max", event.currentTarget.value)} />
      </div>
      <button className="h-11 rounded-md bg-ink text-white" onClick={() => { router.push("/catalogo"); close?.(); }}>Limpiar filtros</button>
    </div>
  );
}

function FilterGroup({ title, options, param, setParam }: { title: string; options: string[][]; param: string; setParam: (key: string, value: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, label]) => (
          <button key={value} onClick={() => setParam(param, value)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em]">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
