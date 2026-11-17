"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      name="orden"
      defaultValue={value}
      onChange={(event) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set("orden", event.currentTarget.value);
        router.push(`/catalogo?${next.toString()}`);
      }}
      className="h-11 rounded-md border border-black/10 bg-white px-4 text-sm font-semibold"
    >
      <option value="relevancia">Relevancia</option>
      <option value="mas-vendidos">Mas vendidos</option>
      <option value="precio-asc">Precio menor</option>
      <option value="precio-desc">Precio mayor</option>
      <option value="fecha">Mas nuevos</option>
    </select>
  );
}
