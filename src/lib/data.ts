import type { Category, Product } from "./types";

export const freeShippingFrom = 90000;

export const categories: Category[] = [
  { slug: "remeras", name: "Remeras", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop" },
  { slug: "hoodies", name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop" },
  { slug: "pantalones", name: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop" },
  { slug: "accesorios", name: "Accesorios", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop" },
];

const details = {
  fit: "Calce urbano premium con estructura relajada y terminaciones reforzadas.",
  composition: "Algodon peinado, frisa compacta y avios metalicos segun modelo.",
  measures: "S 68x52, M 70x54, L 73x57, XL 76x60. Medidas en cm aproximadas.",
  shipping: "Despacho en 24/48 h habiles. Envio gratis superando el minimo vigente.",
  returns: "Cambio dentro de los 15 dias con prenda sin uso y etiqueta original.",
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "hoodie-shadow-core",
    name: "Hoodie Shadow Core",
    description: "Buzo hoodie pesado con capucha doble, bolsillo canguro y bordado tonal.",
    type: "hoodie",
    category: "hoodies",
    collection: "drop-01",
    price: 74900,
    compareAt: 89900,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    salesCount: 186,
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v1", sku: "ZK-HSC-BLK-M", size: "M", color: "Black", colorHex: "#0b0b0d", stock: 8 },
      { id: "v2", sku: "ZK-HSC-BLK-L", size: "L", color: "Black", colorHex: "#0b0b0d", stock: 3 },
      { id: "v3", sku: "ZK-HSC-GRY-M", size: "M", color: "Graphite", colorHex: "#4b5563", stock: 6 },
    ],
    details,
  },
  {
    id: "p2",
    slug: "remera-oversize-zuki",
    name: "Remera Oversize Zuki",
    description: "Remera oversize de jersey premium con estampa frontal de alta densidad.",
    type: "remera",
    category: "remeras",
    collection: "essentials",
    price: 32900,
    isNew: true,
    isFeatured: true,
    salesCount: 142,
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v4", sku: "ZK-ROZ-WHT-S", size: "S", color: "White", colorHex: "#f8fafc", stock: 14 },
      { id: "v5", sku: "ZK-ROZ-WHT-M", size: "M", color: "White", colorHex: "#f8fafc", stock: 9 },
      { id: "v6", sku: "ZK-ROZ-RED-L", size: "L", color: "Oxblood", colorHex: "#7f1d1d", stock: 2 },
    ],
    details,
  },
  {
    id: "p3",
    slug: "cargo-night-runner",
    name: "Cargo Night Runner",
    description: "Pantalon cargo recto con bolsillos utilitarios y cintura regulable.",
    type: "cargo",
    category: "pantalones",
    collection: "utility",
    price: 68900,
    compareAt: 78900,
    isBestSeller: true,
    salesCount: 201,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v7", sku: "ZK-CNR-OLV-40", size: "40", color: "Olive", colorHex: "#3f4f2f", stock: 7 },
      { id: "v8", sku: "ZK-CNR-BLK-42", size: "42", color: "Black", colorHex: "#0b0b0d", stock: 4 },
    ],
    details,
  },
  {
    id: "p4",
    slug: "campera-tech-shell",
    name: "Campera Tech Shell",
    description: "Campera liviana repelente al agua con cierres sellados y calce boxy.",
    type: "campera",
    category: "hoodies",
    collection: "outerwear",
    price: 119900,
    isFeatured: true,
    salesCount: 77,
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v9", sku: "ZK-CTS-BLK-M", size: "M", color: "Black", colorHex: "#0b0b0d", stock: 5 },
      { id: "v10", sku: "ZK-CTS-SLV-L", size: "L", color: "Silver", colorHex: "#cbd5e1", stock: 1 },
    ],
    details,
  },
  {
    id: "p5",
    slug: "beanie-zuki-rib",
    name: "Beanie Zuki Rib",
    description: "Gorro rib con etiqueta tejida y ajuste suave.",
    type: "accesorio",
    category: "accesorios",
    collection: "essentials",
    price: 18900,
    salesCount: 64,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v11", sku: "ZK-BZR-BLK-U", size: "U", color: "Black", colorHex: "#0b0b0d", stock: 18 },
      { id: "v12", sku: "ZK-BZR-GRY-U", size: "U", color: "Graphite", colorHex: "#4b5563", stock: 10 },
    ],
    details,
  },
  {
    id: "p6",
    slug: "denim-wide-fade",
    name: "Denim Wide Fade",
    description: "Jean wide leg con lavado vintage y costuras reforzadas.",
    type: "denim",
    category: "pantalones",
    collection: "denim-lab",
    price: 82900,
    isNew: true,
    salesCount: 93,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v13", sku: "ZK-DWF-BLU-40", size: "40", color: "Washed Blue", colorHex: "#64748b", stock: 9 },
      { id: "v14", sku: "ZK-DWF-BLU-42", size: "42", color: "Washed Blue", colorHex: "#64748b", stock: 6 },
    ],
    details,
  },
  {
    id: "p7",
    slug: "longsleeve-atelier-ink",
    name: "Longsleeve Atelier Ink",
    description: "Manga larga de algodon pesado con silueta relajada y estampa minimal en manga.",
    type: "longsleeve",
    category: "remeras",
    collection: "essentials",
    price: 42900,
    isNew: true,
    salesCount: 58,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691229-88d47f285158?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v15", sku: "ZK-LAI-BLK-S", size: "S", color: "Black", colorHex: "#0b0b0d", stock: 8 },
      { id: "v16", sku: "ZK-LAI-BLK-M", size: "M", color: "Black", colorHex: "#0b0b0d", stock: 12 },
      { id: "v17", sku: "ZK-LAI-SND-L", size: "L", color: "Sand", colorHex: "#A99B8D", stock: 5 },
    ],
    details,
  },
  {
    id: "p8",
    slug: "jogger-minimal-taupe",
    name: "Jogger Minimal Taupe",
    description: "Jogger premium con botamanga limpia, cintura elastizada y textura compacta.",
    type: "jogger",
    category: "pantalones",
    collection: "utility",
    price: 63900,
    compareAt: 71900,
    isBestSeller: true,
    salesCount: 117,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v18", sku: "ZK-JMT-TPE-40", size: "40", color: "Taupe", colorHex: "#A99B8D", stock: 6 },
      { id: "v19", sku: "ZK-JMT-TPE-42", size: "42", color: "Taupe", colorHex: "#A99B8D", stock: 0 },
      { id: "v20", sku: "ZK-JMT-BLK-42", size: "42", color: "Black", colorHex: "#0b0b0d", stock: 4 },
    ],
    details,
  },
  {
    id: "p9",
    slug: "overshirt-noir-canvas",
    name: "Overshirt Noir Canvas",
    description: "Sobrecamisa canvas de peso medio con bolsillos amplios y botones metalicos.",
    type: "overshirt",
    category: "hoodies",
    collection: "outerwear",
    price: 96900,
    isFeatured: true,
    salesCount: 43,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v21", sku: "ZK-ONC-BLK-M", size: "M", color: "Black", colorHex: "#0b0b0d", stock: 5 },
      { id: "v22", sku: "ZK-ONC-BLK-L", size: "L", color: "Black", colorHex: "#0b0b0d", stock: 2 },
    ],
    details,
  },
  {
    id: "p10",
    slug: "cap-signature-zs",
    name: "Cap Signature ZS",
    description: "Gorra six panel con bordado ZS tonal, regulador metalico y visera curva.",
    type: "accesorio",
    category: "accesorios",
    collection: "essentials",
    price: 24900,
    isNew: true,
    salesCount: 81,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      { id: "v23", sku: "ZK-CSZ-BLK-U", size: "U", color: "Black", colorHex: "#0b0b0d", stock: 16 },
      { id: "v24", sku: "ZK-CSZ-TPE-U", size: "U", color: "Taupe", colorHex: "#A99B8D", stock: 9 },
    ],
    details,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
