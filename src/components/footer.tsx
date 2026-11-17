import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent-dark px-4 py-12 text-[#F7F6F3]">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/brand/zuki-logo.webp" alt="Zuki Store" width={150} height={90} className="h-20 w-auto rounded-sm object-contain brightness-110" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">Boutique online de ropa urbana premium: drops medidos, calce cuidado y una experiencia de compra sobria, rapida y segura.</p>
        </div>
        <div className="grid gap-3 text-sm text-white/65">
          <p className="font-semibold text-gold">Tienda</p>
          <Link href="/catalogo">Catalogo</Link>
          <Link href="/catalogo?nuevo=1">Nuevos ingresos</Link>
          <Link href="/catalogo?oferta=1">Ofertas</Link>
        </div>
        <div className="grid gap-3 text-sm text-white/65">
          <p className="font-semibold text-gold">Ayuda</p>
          <span>Envios y cambios</span>
          <span>Guia de talles</span>
          <span>Pagos y cuotas</span>
        </div>
        <div className="grid gap-3 text-sm text-white/65">
          <p className="font-semibold text-gold">Contacto</p>
          <span>WhatsApp comercial</span>
          <span>Instagram @zukizone.store</span>
          <span>Buenos Aires, Argentina</span>
        </div>
      </div>
    </footer>
  );
}
