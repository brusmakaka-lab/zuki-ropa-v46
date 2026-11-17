import { z } from "zod";

const slug = z
  .string()
  .min(3, "El slug debe tener al menos 3 caracteres")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minusculas, numeros y guiones");

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.email().toLowerCase(),
  phone: z.string().trim().min(8),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  province: z.string().trim().min(2),
  zipCode: z.string().trim().min(3),
  method: z.enum(["mercado-pago", "transferencia"]),
  notes: z.string().trim().max(500).optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(3),
  slug,
  price: z.coerce.number().positive(),
  compareAt: z.coerce.number().nonnegative().optional(),
  cost: z.coerce.number().nonnegative().optional(),
  categoryId: z.string().min(1),
  collectionId: z.string().optional(),
  type: z.string().trim().min(2),
  description: z.string().trim().min(10),
  isNew: z.coerce.boolean().default(false),
  isFeatured: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(false),
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  slug,
  imageUrl: z.url().optional().or(z.literal("")),
});

export const collectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  slug,
});

export const variantSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1),
  sku: z.string().trim().min(3),
  size: z.string().trim().min(1),
  color: z.string().trim().min(2),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  stock: z.coerce.number().int().min(0),
  price: z.coerce.number().nonnegative().optional(),
});

export const productImageSchema = z.object({
  productId: z.string().min(1),
  url: z.url(),
  alt: z.string().trim().min(2),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["DRAFT", "PENDING", "PAID", "PREPARING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

export const cartPayloadSchema = z.object({
  idempotencyKey: z.string().min(12).max(120).optional(),
  customer: checkoutSchema,
  items: z.array(
    z.object({
      product: z.object({ id: z.string().min(1) }),
      variant: z.object({ id: z.string().min(1) }),
      quantity: z.coerce.number().int().min(1).max(20),
    }),
  ).min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
