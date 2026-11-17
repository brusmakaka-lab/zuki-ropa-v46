import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 py-16 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Pedido recibido</p>
        <h1 className="mt-3 text-4xl font-black">Gracias por comprar en Zuki Zone.</h1>
        <p className="mt-4 max-w-xl text-muted">Estamos preparando la confirmacion del pago, envio y notificaciones transaccionales.</p>
        <Link href="/catalogo" className="mt-7 inline-flex rounded-md bg-ink px-6 py-3 font-semibold text-white">Volver al catalogo</Link>
      </div>
    </section>
  );
}
