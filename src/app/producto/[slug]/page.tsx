import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";
import { formatPrice } from "@/lib/data";
import { getStoreProduct, getStoreProducts } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) notFound();
  const products = await getStoreProducts();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: "Zuki Zone Store" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.price,
      availability: product.variants.some((variant) => variant.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Completa el look</p>
          <h2 className="mt-2 text-3xl font-black">Tambien va con esto</h2>
          {related.length ? <p className="mt-2 text-muted">Desde {formatPrice(Math.min(...related.map((item) => item.price)))}</p> : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </>
  );
}
