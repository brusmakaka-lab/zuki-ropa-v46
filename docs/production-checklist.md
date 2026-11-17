# Zuki Zone Store - Production Checklist

## Vercel + Neon

1. Link project:
   `vercel link --yes --project zuki-zone-store --scope <team>`
2. Add required production env vars:
   `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
   Generate the admin hash with:
   `npm run hash:admin -- "your-long-admin-password"`
3. Pull env locally if needed:
   `vercel env pull .env.local --environment=production`
4. Push schema:
   `npx prisma db push`
5. Seed initial catalog:
   `npm run seed`
6. Build and deploy:
   `vercel build --prod`
   `vercel deploy --prebuilt --prod`
7. Verify custom domain in Vercel dashboard and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain.

## Manual QA

1. Compra completa: add to cart, checkout transfer, WhatsApp URL, order in admin.
2. Producto sin stock: variant with stock `0` cannot be bought.
3. Mercado Pago pending/approved/rejected/refunded: send test webhooks and confirm `PaymentLog`, `Payment.status`, and `Order.status`.
4. Admin login: valid credentials work, invalid credentials hit rate limit after repeated attempts.
5. Mobile: test home, catalog filters drawer, cart drawer, product gallery and checkout at 390px width.
6. Lighthouse production: run against final domain and target 90+ Performance/SEO/Best Practices.

## Metadata

Confirm favicon, OpenGraph title/description/image and product JSON-LD on product pages after domain is live.
