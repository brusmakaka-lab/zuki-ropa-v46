import Image from "next/image";
import { loginAction } from "../actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 py-16">
      <form action={loginAction} className="w-full max-w-sm rounded-md border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(14,14,14,0.08)]">
        <div className="mb-6 flex justify-center">
          <Image src="/brand/zuki-logo.webp" alt="Zuki Store" width={150} height={86} className="h-20 w-auto object-contain mix-blend-multiply" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Gestion 2002</p>
        <h1 className="mt-2 text-3xl font-black">Admin boutique</h1>
        <div className="mt-6 grid gap-3">
          <input name="email" type="email" placeholder="Email" className="field" />
          <input name="password" type="password" placeholder="Password" className="field" />
        </div>
        {params.error ? <p className="mt-3 text-sm font-semibold text-red-600">{params.error === "rate-limit" ? "Demasiados intentos. Proba de nuevo en unos minutos." : "Credenciales invalidas."}</p> : null}
        <button className="mt-5 h-12 w-full rounded-md bg-ink font-semibold text-white transition hover:bg-accent hover:text-ink">Ingresar</button>
        <p className="mt-3 text-xs text-muted">Dev fallback: admin@zukizone.store / ZukiAdmin2002! si no hay hash configurado.</p>
      </form>
    </section>
  );
}
