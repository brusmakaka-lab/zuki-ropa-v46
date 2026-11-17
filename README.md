# Zuki Ropa · V4.6

Variante visual de tienda de ropa identificada como V4.6 en su documentación; package.json conserva la versión técnica 0.1.0.

Respaldo público del código local seleccionado el **16 de noviembre de 2026**. Las cuatro variantes Zuki se revisaron por archivos y esquema; tienen diferencias funcionales y se conservan en repositorios independientes. Este respaldo identifica el estado vigente encontrado; no presenta los prototipos como productos terminados.

## Qué contiene

- Home de indumentaria, catálogo con filtros, colecciones, detalle de producto y carrito.
- Código de checkout y preferencias de Mercado Pago, con verificación de webhook.
- Panel de administración en `/gestion-2002`, sesión JWT y subida de imágenes a Blob.
- Esquema de productos, variantes, pedidos y pagos; fixtures y seed de demostración.
- Recursos de marca en `public/`, documentación V4.6 y 5 pruebas unitarias de checkout/filtros y webhook.

**Tecnologías:** Next.js 16.2.7 · React 19.2.4 · Prisma 7.8 · Tailwind CSS 4 · Vitest · jose. Las versiones exactas de las dependencias están fijadas en `package-lock.json`. El indicador `private: true` de package.json evita publicar el paquete en npm; no define la visibilidad de GitHub.

## Instalación local

Entorno verificado: Node.js 24.13.1 y npm 11.8.0 en Windows, con el lockfile incluido. Crear una configuración local desde `.env.example`, completar únicamente valores propios y preparar una base de desarrollo cuando corresponda.

```bash
npm ci
npx prisma generate
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run dev
```

Los pasos de base que aparecen abajo deben realizarse antes de usar las pantallas que consultan datos. `npm run start` sirve el build ya generado. Los comandos anteriores no publican un despliegue.

## Configuración

| Variables | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión prevista a PostgreSQL; requiere completar la integración Prisma 7 |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Administrador y hash bcrypt |
| `JWT_SECRET`, `AUTH_SECRET` | Secretos propios para sesiones/configuración |
| `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` | Mercado Pago; esta variante usa `MERCADO_PAGO_` con guiones bajos |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | URL y contacto |
| `BLOB_READ_WRITE_TOKEN` | Imágenes |

Las variables de servidor no deben usar el prefijo `NEXT_PUBLIC_`. Los secretos y credenciales reales no forman parte del repositorio.

## Datos y esquema

Se incluye `prisma/schema.prisma`, pero no hay historial de migraciones SQL. Hay un bloqueo de ejecución conocido: `src/lib/prisma.ts` y el seed construyen `new PrismaClient()` sin las opciones/adapter requeridas por el Prisma 7 instalado. Una comprobación local del constructor produjo `PrismaClientInitializationError`. También falta la configuración de conexión de CLI. Antes de usar una base o ejecutar el seed, completar esa integración y crear/revisar una migración inicial en desarrollo. El respaldo conserva este código tal como estaba; no se aplicaron cambios funcionales.

## Validación y límites

Pasaron generación/validación del esquema, lint, tipos, 5 tests unitarios y build con configuración sintética. El build y los fixtures permiten verificar el frontend, pero no resuelven el bloqueo Prisma señalado. No se validaron persistencia, checkout real, autenticación completa ni servicios externos.

Más detalles en [VALIDACION-GITHUB.md](VALIDACION-GITHUB.md). Una compilación correcta no certifica una tienda operativa en producción.

## Procedencia y alcance del respaldo

Se conserva el commit inicial y se añade el código modificado/no rastreado más reciente junto con documentación. En `.env.example` se dejó `JWT_SECRET` vacío para evitar reutilizar un marcador de ejemplo como secreto. Se conservaron recursos de marca; las capturas de auditoría quedaron fuera y algunos documentos históricos pueden referenciarlas.

Incluye fuentes, configuración versionable, lockfile, esquema y migraciones existentes, tests existentes y recursos locales seleccionados. No incluye `.env` privados, credenciales, bases de datos, pedidos/clientes reales, archivos de sesión, imágenes alojadas únicamente en servicios externos, capturas privadas, `node_modules`, `.next` ni otros derivados. Los datos de operación y medios externos necesitan un respaldo privado aparte. No se movió ni borró la fuente original.

## Variantes relacionadas

| Repositorio | Identidad |
| --- | --- |
| [zuki-zone-ecommerce](https://github.com/brusmakaka-lab/zuki-zone-ecommerce) | Tienda con Auth.js, contenido administrable y checkout WhatsApp |
| [zuki-shop](https://github.com/brusmakaka-lab/zuki-shop) | Tienda con variantes, JWT y código de pagos |
| [zuki-ropa-v46](https://github.com/brusmakaka-lab/zuki-ropa-v46) | Variante visual V4.6; integración Prisma 7 pendiente |
| [zuki-commerce-os](https://github.com/brusmakaka-lab/zuki-commerce-os) | Gestión comercial por organización en desarrollo |

