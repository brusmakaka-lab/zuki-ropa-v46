"use server";

import { PaymentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { getAdminSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { hasDatabase } from "@/lib/store";
import {
  categorySchema,
  collectionSchema,
  orderStatusSchema,
  productImageSchema,
  productSchema,
  variantSchema,
} from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const requestHeaders = await headers();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const ip = getClientIp(requestHeaders);
  const limited = rateLimit(`login:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!limited.ok) redirect("/gestion-2002/login?error=rate-limit");
  const valid = await verifyAdminCredentials(email, password);
  if (!valid) redirect("/gestion-2002/login?error=1");
  await createAdminSession(email);
  redirect("/gestion-2002");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/gestion-2002/login");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/gestion-2002/login");
  const requestHeaders = await headers();
  const ip = getClientIp(requestHeaders);
  const limited = rateLimit(`admin-action:${session.email}:${ip}`, 90, 60 * 1000);
  if (!limited.ok) throw new Error("Demasiadas acciones administrativas. Espera un minuto.");
  if (!hasDatabase()) return null;
  return session;
}

async function audit(action: string, entity: string, entityId?: string, metadata?: Prisma.InputJsonObject) {
  const session = await getAdminSession();
  if (!session || !hasDatabase()) return;
  const db = getPrisma();
  const user = await db.user.findUnique({ where: { email: session.email } });
  await db.auditLog.create({
    data: {
      userId: user?.id,
      action,
      entity,
      entityId,
      metadata,
    },
  });
}

function optionalDecimal(value?: number) {
  return value && value > 0 ? value : null;
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = productSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    compareAt: formData.get("compareAt") || undefined,
    cost: formData.get("cost") || undefined,
    categoryId: formData.get("categoryId"),
    collectionId: formData.get("collectionId") || undefined,
    type: formData.get("type"),
    description: formData.get("description"),
    isNew: formData.get("isNew") === "1",
    isFeatured: formData.get("isFeatured") === "1",
    isBestSeller: formData.get("isBestSeller") === "1",
    isActive: formData.get("isActive") === "1",
  });
  const db = getPrisma();
  const data = {
    name: parsed.name,
    slug: parsed.slug,
    price: parsed.price,
    compareAt: optionalDecimal(parsed.compareAt),
    cost: optionalDecimal(parsed.cost),
    categoryId: parsed.categoryId,
    collectionId: parsed.collectionId || null,
    type: parsed.type,
    description: parsed.description,
    isNew: parsed.isNew,
    isFeatured: parsed.isFeatured,
    isBestSeller: parsed.isBestSeller,
    isActive: parsed.isActive,
  };

  const product = parsed.id
    ? await db.product.update({ where: { id: parsed.id }, data })
    : await db.product.create({ data });

  await audit(parsed.id ? "update" : "create", "Product", product.id, { slug: product.slug });
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  if (formData.get("confirm") !== "ARCHIVAR") throw new Error("Confirmacion requerida para archivar producto.");
  const id = String(formData.get("id") || "");
  if (!id) return;
  const db = getPrisma();
  await db.product.update({ where: { id }, data: { isActive: false } });
  await audit("archive", "Product", id);
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = categorySchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    imageUrl: formData.get("imageUrl") || "",
  });
  const db = getPrisma();
  const data = { name: parsed.name, slug: parsed.slug, imageUrl: parsed.imageUrl || null };
  const category = parsed.id ? await db.category.update({ where: { id: parsed.id }, data }) : await db.category.create({ data });
  await audit(parsed.id ? "update" : "create", "Category", category.id, { slug: category.slug });
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function saveCollectionAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = collectionSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
  });
  const db = getPrisma();
  const data = { name: parsed.name, slug: parsed.slug };
  const collection = parsed.id ? await db.collection.update({ where: { id: parsed.id }, data }) : await db.collection.create({ data });
  await audit(parsed.id ? "update" : "create", "Collection", collection.id, { slug: collection.slug });
  revalidatePath("/gestion-2002");
}

export async function saveVariantAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = variantSchema.parse({
    id: formData.get("id") || undefined,
    productId: formData.get("productId"),
    sku: formData.get("sku"),
    size: formData.get("size"),
    color: formData.get("color"),
    colorHex: formData.get("colorHex"),
    stock: formData.get("stock"),
    price: formData.get("price") || undefined,
  });
  const db = getPrisma();
  const data = {
    productId: parsed.productId,
    sku: parsed.sku,
    size: parsed.size,
    color: parsed.color,
    colorHex: parsed.colorHex,
    stock: parsed.stock,
    price: optionalDecimal(parsed.price),
  };
  const variant = parsed.id ? await db.productVariant.update({ where: { id: parsed.id }, data }) : await db.productVariant.create({ data });
  await audit(parsed.id ? "update" : "create", "ProductVariant", variant.id, { sku: variant.sku });
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function deleteVariantAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  if (formData.get("confirm") !== "ELIMINAR") throw new Error("Confirmacion requerida para eliminar variante.");
  const id = String(formData.get("id") || "");
  if (!id) return;
  await getPrisma().productVariant.delete({ where: { id } });
  await audit("delete", "ProductVariant", id);
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function attachProductImageAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = productImageSchema.parse({
    productId: formData.get("productId"),
    url: formData.get("url"),
    alt: formData.get("alt"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const image = await getPrisma().productImage.create({ data: parsed });
  await audit("create", "ProductImage", image.id, { productId: parsed.productId });
  revalidatePath("/catalogo");
  revalidatePath("/gestion-2002");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  if (!hasDatabase()) return;
  const parsed = orderStatusSchema.parse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  const db = getPrisma();
  await db.order.update({
    where: { id: parsed.orderId },
    data: {
      status: parsed.status,
      payment: parsed.status === "PAID" ? { update: { status: PaymentStatus.APPROVED } } : undefined,
    },
  });
  await audit("status", "Order", parsed.orderId, { status: parsed.status });
  revalidatePath("/gestion-2002");
}
