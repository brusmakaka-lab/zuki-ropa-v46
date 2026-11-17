import type { Metadata } from "next";
import { CatalogFilters } from "@/components/filters";
import { SortSelect } from "@/components/sort-select";
import { ProductCard } from "@/components/product-card";
import { filterProductList, getStoreCategories, getStoreProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Catalogo Zuki Zone Store con filtros por categoria, talle, color, precio y disponibilidad.",
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [allProducts, categories] = await Promise.all([getStoreProducts(), getStoreCategories()]);
  const products = filterProductList(allProducts, params);
  const sizes = [...new Set(allProducts.flatMap((product) => product.variants.map((variant) => variant.size)))];
  const colors = [...new Set(allProducts.flatMap((product) => product.variants.map((variant) => variant.color)))];
  const types = [...new Set(allProducts.map((product) => product.type))];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Catalogo</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Streetwear premium</h1>
          <p className="mt-3 text-muted">{products.length} productos encontrados</p>
        </div>
        <SortSelect value={(params.orden as string) || "relevancia"} />
      </div>
      <div className="mb-4 lg:hidden"><CatalogFilters categories={categories} sizes={sizes} colors={colors} types={types} /></div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <CatalogFilters categories={categories} sizes={sizes} colors={colors} types={types} />
        {products.length ? (
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="grid min-h-96 place-items-center rounded-md border border-black/10 bg-white text-muted">No encontramos productos para esos filtros.</div>
        )}
      </div>
    </section>
  );
}
