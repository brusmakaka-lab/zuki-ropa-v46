# Zuki Store V4 Predeploy Audit

Fecha: 2026-06-09

## Evidencia local

Servidor local verificado:

- `/` 200
- `/catalogo` 200
- `/producto/hoodie-shadow-core` 200
- `/checkout` 200
- `/gestion-2002/login` 200
- `/api/health` 200

Capturas generadas con Chrome headless:

- `audits/screenshots/desktop-home.png`
- `audits/screenshots/mobile-home-v4.png`
- `audits/screenshots/desktop-catalogo.png`
- `audits/screenshots/mobile-catalogo.png`
- `audits/screenshots/desktop-producto.png`
- `audits/screenshots/mobile-producto-v4.png`
- `audits/screenshots/desktop-checkout.png`
- `audits/screenshots/mobile-checkout-v4.png`
- `audits/screenshots/desktop-admin-login.png`
- `audits/screenshots/mobile-admin-login.png`

## Visual

- Logo presente en header, footer, login admin, favicon y OpenGraph.
- Logo mobile centrado y visible.
- Header usa blanco humo/translucido, nav negra y hover taupe.
- Footer usa negro premium, texto blanco humo y acentos dorados.
- Cards usan fondo smoke, borde suave y sombra sutil.
- Botones principales negros con texto blanco; secundarios transparentes con borde.

## Contraste

Ratios calculados:

- `#0E0E0E` sobre `#F7F6F3`: 17.86:1
- texto muted `#6E665E` sobre `#F7F6F3`: 5.22:1
- `#F7F6F3` sobre `#1C1C1C`: 15.77:1
- `#0E0E0E` sobre `#A99B8D`: 7.13:1
- `#0E0E0E` sobre `#C6A86B`: 8.47:1

## Flujo de compra

Flujo server-side local probado:

- POST `/api/checkout/mercado-pago`
- metodo `transferencia`
- item `p1/v1`
- respuesta 200 con `orderNumber` y `whatsappUrl`

Nota: en local sin `DATABASE_URL`, la orden usa fallback y no persiste en admin. La persistencia admin debe validarse contra Neon real.

## Stock por variante

- Checkout valida `product.id`, `variant.id`, cantidad y stock.
- En DB real, la transaccion descuenta stock con condicion `stock >= quantity`.
- Seed incluye variante sin stock: `ZK-JMT-TPE-42`.

## OpenGraph / WhatsApp

Metas detectadas en home:

- `og:title`: Zuki Store
- `og:description`: Moda urbana premium con estetica boutique.
- `og:image`: `/brand/zuki-og.png`
- `twitter:card`: `summary_large_image`

Validacion final de WhatsApp requiere dominio HTTPS publico y cache de preview de WhatsApp.

## Productos

Catalogo ampliado a 10 productos en fallback y seed:

- Hoodie Shadow Core
- Remera Oversize Zuki
- Cargo Night Runner
- Campera Tech Shell
- Beanie Zuki Rib
- Denim Wide Fade
- Longsleeve Atelier Ink
- Jogger Minimal Taupe
- Overshirt Noir Canvas
- Cap Signature ZS

## Imagenes

- Logo optimizado en JPEG, WebP y AVIF.
- `next/image` configurado para servir AVIF/WebP.
- Imagenes remotas de producto usan Unsplash con `auto=format`; en Vercel pasan por Image Optimization.

## Bloqueos externos

No ejecutado por falta de credenciales/env reales en esta maquina:

- Mercado Pago sandbox end-to-end.
- `npx prisma db push` contra Neon.
- `npm run seed` contra Neon.
- Deploy `vercel --prod`.
- Verificacion de dominio final.
- Lighthouse real sobre dominio productivo.

## Comandos para cerrar produccion

```bash
vercel link --yes --project zuki-zone-store --scope <team>
vercel env pull .env.local --environment=production
npx prisma db push
npm run seed
npm run lint
npm run test
npm run build
vercel build --prod
vercel deploy --prebuilt --prod
```

Despues del deploy:

```bash
vercel inspect <deployment-url>
vercel logs <deployment-url> --since 1h --level error
```
