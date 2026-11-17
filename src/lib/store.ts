import "server-only";
import { Prisma, OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { products as fallbackProducts, categories as fallbackCategories, freeShippingFrom } from "./data";
import { getPrisma } from "./prisma";
import type { AdminOrder, Category, Collection, Product } from "./types";
import type { CheckoutInput } from "./validations";

const productInclude = {
  category: true,
  collection: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
} satisfies Prisma.ProductInclude;

type DbProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function defaultDetails(product: Pick<DbProduct, "description">) {
  return {
    fit: "Calce urbano premium con estructura relajada y terminaciones reforzadas.",
    composition: product.description,
    measures: "S 68x52, M 70x54, L 73x57, XL 76x60. Medidas en cm aproximadas.",
    shipping: "Despacho en 24/48 h habiles. Envio gratis superando el minimo vigente.",
    returns: "Cambio dentro de los 15 dias con prenda sin uso y etiqueta original.",
  };
}

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    type: product.type,
    category: product.category.slug,
    collection: product.collection?.slug || "sin-coleccion",
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : undefined,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    salesCount: product.salesCount,
    images: product.images.length ? product.images.map((image) => image.url) : [fallbackProducts[0].images[0]],
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      stock: variant.stock,
    })),
    details: defaultDetails(product),
  };
}

export async function getStoreProducts() {
  if (!hasDatabase()) return fallbackProducts;
  try {
    const db = getPrisma();
    const products = await db.product.findMany({
      where: { isActive: true },
      include: productInclude,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return products.map(mapProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getAdminProducts() {
  if (!hasDatabase()) return fallbackProducts;
  try {
    const db = getPrisma();
    const products = await db.product.findMany({
      include: productInclude,
      orderBy: { updatedAt: "desc" },
    });
    return products.map(mapProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getStoreProduct(slug: string) {
  if (!hasDatabase()) return fallbackProducts.find((product) => product.slug === slug);
  try {
    const db = getPrisma();
    const product = await db.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    return product && product.isActive ? mapProduct(product) : undefined;
  } catch {
    return fallbackProducts.find((product) => product.slug === slug);
  }
}

export async function getStoreCategories(): Promise<Category[]> {
  if (!hasDatabase()) return fallbackCategories;
  try {
    const db = getPrisma();
    const categories = await db.category.findMany({ orderBy: { name: "asc" } });
    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      image: category.imageUrl || fallbackCategories[0].image,
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function getStoreCollections(): Promise<Collection[]> {
  if (!hasDatabase()) {
    return [
      { slug: "drop-01", name: "Drop 01" },
      { slug: "essentials", name: "Essentials" },
      { slug: "utility", name: "Utility" },
    ];
  }
  try {
    const db = getPrisma();
    return db.collection.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!hasDatabase()) return [];
  try {
    const db = getPrisma();
    const orders = await db.order.findMany({
      include: { customer: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return orders.map((order) => ({
      id: order.id,
      number: order.number,
      customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Cliente invitado",
      customerEmail: order.customer?.email || "-",
      status: order.status,
      paymentStatus: order.payment?.status || "PENDING",
      paymentMethod: order.payment?.method || "-",
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

function mapOrderPayload(order: Prisma.OrderGetPayload<{ include: { items: { include: { product: { include: typeof productInclude }, variant: true } } } }>) {
  return {
    id: order.id,
    number: order.number,
    total: Number(order.total),
    items: order.items.map((item) => ({
      product: mapProduct(item.product),
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        colorHex: item.variant.colorHex,
        stock: item.variant.stock,
      },
      quantity: item.quantity,
    })),
  };
}

export function filterProductList(productList: Product[], searchParams: Record<string, string | string[] | undefined>) {
  let result = [...productList];
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

export async function createPersistentOrder({
  customer,
  items,
  idempotencyKey,
}: {
  customer: CheckoutInput;
  items: { product: { id: string }; variant: { id: string }; quantity: number }[];
  idempotencyKey?: string;
}) {
  const subtotal = items.reduce((sum, item) => {
    const product = fallbackProducts.find((fallback) => fallback.id === item.product.id);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);
  const number = `ZK-${Date.now().toString(36).toUpperCase()}`;

  if (!hasDatabase()) {
    return {
      id: number,
      number,
      total: subtotal,
      items: items.flatMap((item) => {
        const product = fallbackProducts.find((fallback) => fallback.id === item.product.id);
        const variant = product?.variants.find((candidate) => candidate.id === item.variant.id);
        return product && variant ? [{ product, variant, quantity: item.quantity }] : [];
      }),
    };
  }

  const db = getPrisma();
  return db.$transaction(async (tx) => {
    if (idempotencyKey) {
      const existing = await tx.order.findUnique({
        where: { idempotencyKey },
        include: { items: { include: { product: { include: productInclude }, variant: true } } },
      });
      if (existing) return mapOrderPayload(existing);
    }

    const fullItems = await Promise.all(
      items.map(async (item) => {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variant.id },
          include: { product: true },
        });
        if (!variant || variant.productId !== item.product.id || !variant.product.isActive) throw new Error("Producto no disponible");
        if (variant.stock < item.quantity) throw new Error(`Stock insuficiente para ${variant.sku}`);
        return { variant, product: variant.product, quantity: item.quantity, unitPrice: Number(variant.price || variant.product.price) };
      }),
    );

    const subtotal = fullItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingCost = subtotal >= freeShippingFrom ? 0 : 5500;
    const total = subtotal + shippingCost;
    const customerRecord = await tx.customer.upsert({
      where: { email: customer.email },
      create: {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        province: customer.province,
        zipCode: customer.zipCode,
      },
      update: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        province: customer.province,
        zipCode: customer.zipCode,
      },
    });

    const order = await tx.order.create({
      data: {
        number,
        idempotencyKey,
        customerId: customerRecord.id,
        status: customer.method === "mercado-pago" ? OrderStatus.PENDING : OrderStatus.PENDING,
        subtotal,
        shippingCost,
        total,
        notes: customer.notes,
        items: {
          create: fullItems.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            name: item.product.name,
            size: item.variant.size,
            color: item.variant.color,
            price: item.unitPrice,
            quantity: item.quantity,
          })),
        },
        payment: {
          create: {
            method: customer.method === "mercado-pago" ? PaymentMethod.MERCADO_PAGO : PaymentMethod.TRANSFER,
            status: PaymentStatus.PENDING,
          },
        },
        shipment: {
          create: {
            method: "standard",
            recipient: `${customer.firstName} ${customer.lastName}`,
            address: customer.address,
            city: customer.city,
            province: customer.province,
            zipCode: customer.zipCode,
          },
        },
      },
      include: { items: { include: { product: { include: productInclude }, variant: true } } },
    });

    for (const item of fullItems) {
      const updated = await tx.productVariant.updateMany({
        where: { id: item.variant.id, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) throw new Error(`Stock insuficiente para ${item.variant.sku}`);
      await tx.product.update({
        where: { id: item.product.id },
        data: { salesCount: { increment: item.quantity } },
      });
    }

    return mapOrderPayload(order);
  });
}
