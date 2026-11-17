import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { slug: "remeras", name: "Remeras", imageUrl: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop" },
  { slug: "hoodies", name: "Hoodies", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop" },
  { slug: "pantalones", name: "Pantalones", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop" },
  { slug: "accesorios", name: "Accesorios", imageUrl: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?q=80&w=1200&auto=format&fit=crop" },
];

const collections = [
  { slug: "drop-01", name: "Drop 01" },
  { slug: "essentials", name: "Essentials" },
  { slug: "utility", name: "Utility" },
  { slug: "denim-lab", name: "Denim Lab" },
  { slug: "outerwear", name: "Outerwear" },
];

const products = [
  {
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
      ["ZK-HSC-BLK-M", "M", "Black", "#0b0b0d", 8],
      ["ZK-HSC-BLK-L", "L", "Black", "#0b0b0d", 3],
      ["ZK-HSC-GRY-M", "M", "Graphite", "#4b5563", 6],
    ],
  },
  {
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
      ["ZK-ROZ-WHT-S", "S", "White", "#f8fafc", 14],
      ["ZK-ROZ-WHT-M", "M", "White", "#f8fafc", 9],
      ["ZK-ROZ-RED-L", "L", "Oxblood", "#7f1d1d", 2],
    ],
  },
  {
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
      ["ZK-CNR-OLV-40", "40", "Olive", "#3f4f2f", 7],
      ["ZK-CNR-BLK-42", "42", "Black", "#0b0b0d", 4],
    ],
  },
  {
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
      ["ZK-CTS-BLK-M", "M", "Black", "#0b0b0d", 5],
      ["ZK-CTS-SLV-L", "L", "Silver", "#cbd5e1", 1],
    ],
  },
  {
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
      ["ZK-DWF-BLU-40", "40", "Washed Blue", "#64748b", 9],
      ["ZK-DWF-BLU-42", "42", "Washed Blue", "#64748b", 6],
    ],
  },
  {
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
      ["ZK-LAI-BLK-S", "S", "Black", "#0b0b0d", 8],
      ["ZK-LAI-BLK-M", "M", "Black", "#0b0b0d", 12],
      ["ZK-LAI-SND-L", "L", "Sand", "#A99B8D", 5],
    ],
  },
  {
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
      "https://images.unsplash.com/photo-1506629905607-d9e297d19d74?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: [
      ["ZK-JMT-TPE-40", "40", "Taupe", "#A99B8D", 6],
      ["ZK-JMT-TPE-42", "42", "Taupe", "#A99B8D", 0],
      ["ZK-JMT-BLK-42", "42", "Black", "#0b0b0d", 4],
    ],
  },
  {
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
      ["ZK-ONC-BLK-M", "M", "Black", "#0b0b0d", 5],
      ["ZK-ONC-BLK-L", "L", "Black", "#0b0b0d", 2],
    ],
  },
  {
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
      ["ZK-CSZ-BLK-U", "U", "Black", "#0b0b0d", 16],
      ["ZK-CSZ-TPE-U", "U", "Taupe", "#A99B8D", 9],
    ],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@zukizone.store";
  const adminPassword = process.env.ADMIN_PASSWORD || "ZukiAdmin2002!";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash(adminPassword, 12));

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: UserRole.ADMIN, active: true },
    create: { email: adminEmail, name: "Zuki Admin", passwordHash, role: UserRole.ADMIN },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: product.category } });
    const collection = await prisma.collection.findUniqueOrThrow({ where: { slug: product.collection } });
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        compareAt: product.compareAt || null,
        isNew: Boolean(product.isNew),
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        salesCount: product.salesCount,
        categoryId: category.id,
        collectionId: collection.id,
        isActive: true,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        compareAt: product.compareAt || null,
        isNew: Boolean(product.isNew),
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        salesCount: product.salesCount,
        categoryId: category.id,
        collectionId: collection.id,
        isActive: true,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productImage.createMany({
      data: product.images.map((url, sortOrder) => ({ productId: saved.id, url, alt: product.name, sortOrder })),
    });

    for (const [sku, size, color, colorHex, stock] of product.variants) {
      await prisma.productVariant.upsert({
        where: { sku },
        update: { productId: saved.id, size, color, colorHex, stock },
        create: { productId: saved.id, sku, size, color, colorHex, stock },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: "ZUKI10" },
    update: { percentOff: 10, minAmount: 60000, active: true },
    create: { code: "ZUKI10", description: "Bienvenida comunidad Zuki", percentOff: 10, minAmount: 60000, active: true },
  });

  await prisma.siteSetting.upsert({
    where: { key: "store" },
    update: { value: { freeShippingFrom: 90000, whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000" } },
    create: { key: "store", value: { freeShippingFrom: 90000, whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000" } },
  });

  await prisma.contentBlock.upsert({
    where: { key: "home-hero" },
    update: { title: "Zuki Zone Store", payload: { eyebrow: "Drop 01", cta: "Comprar drop" }, active: true },
    create: { key: "home-hero", title: "Zuki Zone Store", payload: { eyebrow: "Drop 01", cta: "Comprar drop" }, active: true },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
