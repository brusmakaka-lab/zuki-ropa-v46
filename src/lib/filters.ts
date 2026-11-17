import { products } from "./data";

export function filterProducts(searchParams: Record<string, string | string[] | undefined>) {
  let result = [...products];
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const category = get("categoria");
  const size = get("talle");
  const color = get("color");
  const type = get("tipo");
  const availability = get("stock");
  const offer = get("oferta");
  const newest = get("nuevo");
  const min = Number(get("min") || 0);
  const max = Number(get("max") || 0);
  const sort = get("orden") || "relevancia";

  if (category) result = result.filter((p) => p.category === category);
  if (size) result = result.filter((p) => p.variants.some((v) => v.size === size));
  if (color) result = result.filter((p) => p.variants.some((v) => v.color === color));
  if (type) result = result.filter((p) => p.type === type);
  if (availability === "disponible") result = result.filter((p) => p.variants.some((v) => v.stock > 0));
  if (offer === "1") result = result.filter((p) => p.compareAt);
  if (newest === "1") result = result.filter((p) => p.isNew);
  if (min) result = result.filter((p) => p.price >= min);
  if (max) result = result.filter((p) => p.price <= max);

  if (sort === "mas-vendidos") result.sort((a, b) => b.salesCount - a.salesCount);
  if (sort === "precio-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "fecha") result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));

  return result;
}
