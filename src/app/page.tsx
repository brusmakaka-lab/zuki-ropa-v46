import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getStoreCategories, getStoreProducts } from "@/lib/store";
import type { Product } from "@/lib/types";

export default async function Home() {
  const [categories, products] = await Promise.all([getStoreCategories(), getStoreProducts()]);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newest = products.filter((product) => product.isNew).slice(0, 4);
  const look = {
    hoodie: products.find((product) => product.type === "hoodie" || product.type === "overshirt") || products[0],
    bottom: products.find((product) => product.category === "pantalones") || products[1],
    accessory: products.find((product) => product.category === "accesorios") || products[2],
  };

  return (
    <>
      <section className="relative min-h-[calc(100dvh-128px)] overflow-hidden bg-[#DDD4C9] text-white">
        <Image
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1800&auto=format&fit=crop"
          alt="Zuki Essentials editorial urbano"
          fill
          priority
          className="object-cover object-center opacity-90 saturate-[0.9] md:object-contain md:object-right"
        />
        <div className="absolute inset-0 bg-accent-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-dark/80 via-accent-dark/28 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/55 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100dvh-128px)] max-w-7xl flex-col justify-end px-4 pb-14 md:pb-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-gold">DROP 01</p>
          <h1 className="max-w-5xl text-4xl font-black uppercase leading-[0.92] tracking-tight sm:text-5xl md:text-8xl">
            <span className="block">Zuki</span>
            <span className="block">Essentials</span>
          </h1>
          <p className="mt-5 max-w-md text-xl leading-8 text-white/[0.88]">Siluetas premium.<br />Diseno urbano.<br />Stock limitado.</p>
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
            <Link href="/catalogo?nuevo=1" className="rounded-md bg-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent hover:text-ink sm:text-sm">Comprar ahora</Link>
            <Link href="/catalogo" className="rounded-md border border-white/70 bg-transparent px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:border-accent hover:bg-accent hover:text-ink sm:text-sm">Ver coleccion</Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-[72px] md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted">Nuestra filosofia</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Disenamos prendas pensadas para durar.</h2>
          <div className="mx-auto mt-7 max-w-2xl space-y-5 text-lg leading-8 text-muted">
            <p>Menos ruido. Mas identidad.</p>
            <p>Prendas seleccionadas para quienes valoran diseno, calidad y presencia.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Campanas</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">Categorias destacadas</h2>
          </div>
          <Link href="/catalogo" className="hidden text-sm font-semibold uppercase tracking-[0.12em] underline decoration-accent underline-offset-4 transition hover:text-accent sm:block">Ver todo</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {categories.slice(0, 4).map((category) => (
            <Link href={`/catalogo?categoria=${category.slug}`} key={category.slug} className="group relative min-h-[360px] overflow-hidden rounded-md bg-accent-dark shadow-[0_18px_60px_rgba(14,14,14,0.08)] md:min-h-[520px]">
              <Image src={category.image} alt={category.name} fill className="object-cover opacity-90 saturate-[0.9] transition duration-700 group-hover:scale-105 group-hover:saturate-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Zuki campaign</p>
                <h3 className="mt-2 text-4xl font-black uppercase md:text-5xl">{category.name}</h3>
                <span className="mt-5 inline-flex rounded-md border border-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition group-hover:border-accent group-hover:bg-accent group-hover:text-ink">Comprar categoria</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRail title="New In" eyebrow="Drop activo" products={newest} />
      <ProductRail title="Best Sellers" eyebrow="Lo mas elegido" products={bestSellers} />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-[88px]">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Editorial</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">Completa el outfit</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Link href={`/producto/${look.hoodie.slug}`} className="group relative min-h-[520px] overflow-hidden rounded-md bg-accent-dark text-white">
            <Image src={look.hoodie.images[0]} alt={look.hoodie.name} fill className="object-cover opacity-[0.88] saturate-[0.9] transition duration-700 group-hover:scale-105 group-hover:saturate-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Pieza principal</p>
              <h3 className="mt-2 text-4xl font-black">{look.hoodie.name}</h3>
            </div>
          </Link>
          <div className="grid gap-5">
            {[look.bottom, look.accessory].map((product) => (
              <Link href={`/producto/${product.slug}`} key={product.id} className="group grid grid-cols-[140px_1fr] items-center gap-5 rounded-md border border-black/10 bg-white p-3 shadow-[0_12px_40px_rgba(14,14,14,0.04)]">
                <Image src={product.images[0]} alt={product.name} width={220} height={280} className="aspect-[4/5] rounded-md object-cover saturate-[0.9] transition duration-500 group-hover:scale-[1.02] group-hover:saturate-100" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{product.type}</p>
                  <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
                  <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.14em] underline decoration-accent underline-offset-4">Ver producto</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted px-4 py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {["Envios a todo el pais", "Cambios faciles", "Compra segura", "Atencion personalizada"].map((item) => (
            <div key={item} className="rounded-md border border-black/10 bg-surface/70 p-6">
              <p className="text-2xl font-black">OK</p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Comunidad</p>
              <h2 className="mt-2 text-3xl font-black">@zukizone.store</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {products.slice(0, 6).map((product) => (
              <Image key={product.id} src={product.images[0]} alt={product.name} width={360} height={450} className="aspect-square rounded-md object-cover saturate-[0.9] shadow-[0_10px_30px_rgba(14,14,14,0.05)]" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Social proof</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">Elegido por nuestra comunidad</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Excelente calidad.", "La tela supera lo que esperaba."],
              ["Llego rapido.", "El calce es perfecto y se siente premium."],
              ["Muy buena presencia.", "Es de esas prendas que levantan todo el outfit."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-md border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(14,14,14,0.035)]">
                <p className="text-sm font-black tracking-[0.18em] text-gold">★★★★★</p>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-[72px] pt-8 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black">Acceso anticipado a drops</h2>
          <p className="mt-3 text-muted">Accede antes que nadie a nuevos drops, reposiciones limitadas y beneficios exclusivos para miembros Zuki.</p>
          <form className="mt-6 flex gap-2 rounded-md border border-black/10 bg-white p-2 shadow-[0_12px_40px_rgba(14,14,14,0.04)]">
            <input className="min-w-0 flex-1 bg-transparent px-3 outline-none" placeholder="tu@email.com" type="email" />
            <button className="rounded-md bg-ink px-5 py-3 font-semibold text-white transition hover:bg-accent hover:text-ink">Suscribirme</button>
          </form>
        </div>
      </section>
    </>
  );
}

function ProductRail({ title, eyebrow, products: railProducts }: { title: string; eyebrow: string; products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">{title}</h2>
        </div>
        <Link href="/catalogo" className="hidden text-sm font-semibold uppercase tracking-[0.12em] underline decoration-accent underline-offset-4 transition hover:text-accent sm:block">Ver catalogo</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {railProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
