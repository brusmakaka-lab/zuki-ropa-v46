import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import type { CheckoutInput } from "./validations";
import type { CartItem } from "./types";

export async function createMercadoPagoPreference(items: CartItem[], customer: CheckoutInput, orderNumber: string) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) return null;

  const client = new MercadoPagoConfig({ accessToken: token });
  const preference = new Preference(client);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return preference.create({
    body: {
      items: items.map((item) => ({
        id: item.variant.sku,
        title: `${item.product.name} - ${item.variant.size} / ${item.variant.color}`,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
      },
      external_reference: orderNumber,
      notification_url: `${siteUrl}/api/checkout/mercado-pago/webhook`,
      back_urls: {
        success: `${siteUrl}/checkout/exito?pedido=${orderNumber}`,
        failure: `${siteUrl}/checkout`,
        pending: `${siteUrl}/checkout`,
      },
      auto_return: "approved",
    },
  });
}

export async function getMercadoPagoPayment(paymentId: string) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) return null;
  const client = new MercadoPagoConfig({ accessToken: token });
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
