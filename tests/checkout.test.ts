import { describe, expect, it } from "vitest";
import { cartPayloadSchema, checkoutSchema } from "@/lib/validations";
import { filterProducts } from "@/lib/filters";

describe("checkout validation", () => {
  it("accepts a valid customer and idempotency key", () => {
    const parsed = cartPayloadSchema.safeParse({
      idempotencyKey: "checkout-test-key-123",
      customer: {
        firstName: "Zuki",
        lastName: "Cliente",
        email: "CLIENTE@MAIL.COM",
        phone: "1122334455",
        address: "Calle 123",
        city: "Buenos Aires",
        province: "CABA",
        zipCode: "1000",
        method: "mercado-pago",
      },
      items: [{ product: { id: "p1" }, variant: { id: "v1" }, quantity: 1 }],
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.customer.email).toBe("cliente@mail.com");
  });

  it("rejects invalid checkout forms", () => {
    expect(checkoutSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("catalog stock filters", () => {
  it("returns only available products when stock filter is active", () => {
    const products = filterProducts({ stock: "disponible" });
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.variants.some((variant) => variant.stock > 0))).toBe(true);
  });
});
