import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  attachProductImageAction,
  deleteProductAction,
  deleteVariantAction,
  logoutAction,
  saveCategoryAction,
  saveCollectionAction,
  saveProductAction,
  saveVariantAction,
  updateOrderStatusAction,
} from "./actions";
import { getAdminSession } from "@/lib/auth";
import { formatPrice } from "@/lib/data";
import {
  getAdminOrders,
  getAdminProducts,
  getStoreCategories,
  getStoreCollections,
  hasDatabase,
} from "@/lib/store";

const orderStatuses = ["PENDING", "PAID", "PREPARING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/gestion-2002/login");
  const params = await searchParams;

  const [products, categories, collections, orders] = await Promise.all([
    getAdminProducts(),
    getStoreCategories(),
    getStoreCollections(),
    getAdminOrders(),
  ]);
  const filteredOrders = params.estado ? orders.filter((order) => order.status === params.estado) : orders;
  const totalStock = products.reduce((sum, product) => sum + product.variants.reduce((variantSum, variant) => variantSum + variant.stock, 0), 0);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const dbReady = hasDatabase();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Panel administrativo</p>
          <h1 className="mt-2 text-4xl font-black">Gestion Zuki Zone</h1>
          {!dbReady ? <p className="mt-3 rounded-md bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-800">Modo demo: configura DATABASE_URL de Neon para persistir cambios.</p> : null}
        </div>
        <form action={logoutAction}><button className="rounded-md bg-ink px-5 py-3 font-semibold text-white">Salir</button></form>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Ventas reales", formatPrice(revenue)],
          ["Productos", String(products.length)],
          ["Stock total", String(totalStock)],
          ["Pedidos", String(orders.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-white p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6">
          <section className="rounded-md bg-white p-5">
            <h2 className="text-xl font-bold">Productos</h2>
            <ProductForm categories={categories} collections={collections} disabled={!dbReady} />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                  <tr><th className="py-3">Producto</th><th>Categoria</th><th>Variantes</th><th>Stock</th><th>Precio</th><th>Accion</th></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-black/10 align-top">
                      <td className="py-3">
                        <form action={saveProductAction} className="grid gap-2">
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="slug" value={product.slug} />
                          <input type="hidden" name="type" value={product.type} />
                          <input type="hidden" name="description" value={product.description} />
                          <input type="hidden" name="categoryId" value={categories.find((category) => category.slug === product.category)?.id || ""} />
                          <input type="hidden" name="collectionId" value={collections.find((collection) => collection.slug === product.collection)?.id || ""} />
                          <input type="hidden" name="compareAt" value={product.compareAt || ""} />
                          <div className="flex items-center gap-3">
                            <Image src={product.images[0]} alt={product.name} width={44} height={44} className="size-11 rounded object-cover" />
                            <div className="grid gap-1">
                              <input name="name" defaultValue={product.name} className="h-9 rounded-md border border-black/10 px-2 font-semibold" />
                              <p className="text-xs text-muted">{product.slug}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <input name="price" type="number" defaultValue={product.price} className="h-8 w-28 rounded-md border border-black/10 px-2" />
                            <label><input name="isActive" value="1" type="checkbox" defaultChecked /> Activo</label>
                            <label><input name="isNew" value="1" type="checkbox" defaultChecked={Boolean(product.isNew)} /> Nuevo</label>
                            <label><input name="isFeatured" value="1" type="checkbox" defaultChecked={Boolean(product.isFeatured)} /> Destacado</label>
                            <label><input name="isBestSeller" value="1" type="checkbox" defaultChecked={Boolean(product.isBestSeller)} /> Best</label>
                            <button disabled={!dbReady} className="rounded-md bg-accent px-2 py-1 font-bold text-ink disabled:opacity-40">Guardar</button>
                            <Link href={`/producto/${product.slug}`} className="underline" target="_blank">Preview</Link>
                          </div>
                        </form>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.variants.length}</td>
                      <td><StockBadge stock={product.variants.reduce((sum, variant) => sum + variant.stock, 0)} /></td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="confirm" value="ARCHIVAR" />
                          <button disabled={!dbReady} className="rounded-md bg-black/5 px-3 py-2 text-xs font-bold disabled:opacity-40">Archivar</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md bg-white p-5">
            <h2 className="text-xl font-bold">Variantes talle/color</h2>
            <VariantForm products={products} disabled={!dbReady} />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {products.flatMap((product) =>
                product.variants.map((variant) => (
                  <div key={variant.id} className="rounded-md border border-black/10 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{variant.sku}</p>
                        <p className="text-sm text-muted">{product.name} - {variant.size} - {variant.color}</p>
                        <StockBadge stock={variant.stock} />
                      </div>
                      <span className="size-6 rounded-full border border-black/10" style={{ backgroundColor: variant.colorHex }} />
                    </div>
                    <form action={deleteVariantAction} className="mt-3">
                      <input type="hidden" name="id" value={variant.id} />
                      <input className="mr-2 h-8 w-24 rounded-md border border-black/10 px-2 text-xs" name="confirm" placeholder="ELIMINAR" />
                      <button disabled={!dbReady} className="text-xs font-bold underline disabled:opacity-40">Eliminar variante</button>
                    </form>
                  </div>
                )),
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6 self-start">
          <section className="rounded-md bg-white p-5">
            <h2 className="font-bold">Categorias</h2>
            <TaxonomyForm action={saveCategoryAction} disabled={!dbReady} fields={["name", "slug", "imageUrl"]} />
            <List items={categories.map((category) => `${category.name} / ${category.slug}`)} />
          </section>

          <section className="rounded-md bg-white p-5">
            <h2 className="font-bold">Colecciones</h2>
            <TaxonomyForm action={saveCollectionAction} disabled={!dbReady} fields={["name", "slug"]} />
            <List items={collections.map((collection) => `${collection.name} / ${collection.slug}`)} />
          </section>

          <section className="rounded-md bg-white p-5">
            <h2 className="font-bold">Imagenes Vercel Blob</h2>
            <p className="mt-2 text-sm text-muted">Subi archivos por `/api/admin/blob-upload` y pega la URL publica para ordenar la galeria.</p>
            <form action={attachProductImageAction} className="mt-4 grid gap-2">
              <select name="productId" className="field" disabled={!dbReady}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
              <input name="url" placeholder="URL publica Blob" className="field" disabled={!dbReady} />
              <input name="alt" placeholder="Alt" className="field" disabled={!dbReady} />
              <input name="sortOrder" placeholder="Orden" type="number" className="field" disabled={!dbReady} />
              <button disabled={!dbReady} className="h-11 rounded-md bg-ink font-semibold text-white disabled:opacity-40">Adjuntar imagen</button>
            </form>
          </section>

          <section className="rounded-md bg-white p-5">
            <h2 className="font-bold">Pedidos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/gestion-2002" className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold">Todos</Link>
              {orderStatuses.map((status) => (
                <Link key={status} href={`/gestion-2002?estado=${status}`} className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold">{status}</Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {filteredOrders.length ? filteredOrders.map((order) => (
                <div key={order.id} className="rounded-md border border-black/10 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{order.number}</p>
                      <p className="text-xs text-muted">{order.customerName} - {order.customerEmail}</p>
                      <p className="mt-1 text-sm font-bold">{formatPrice(order.total)}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${paymentBadge(order.paymentStatus)}`}>{order.paymentStatus}</span>
                  </div>
                  <form action={updateOrderStatusAction} className="mt-3 flex gap-2">
                    <input type="hidden" name="orderId" value={order.id} />
                    <select name="status" defaultValue={order.status} className="field min-h-10 flex-1 py-2">
                      {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button className="rounded-md bg-ink px-3 text-sm font-semibold text-white">Guardar</button>
                  </form>
                </div>
              )) : <p className="text-sm text-muted">No hay pedidos para ese filtro.</p>}
            </div>
          </section>

          <Panel title="Seguridad y auditoria" items={["Cookie httpOnly", "JWT firmado", "Rate limit login/admin", "AuditLog por mutacion admin"]} />
        </div>
      </div>
    </section>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const style = stock === 0 ? "bg-red-100 text-red-700" : stock <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-700";
  const label = stock === 0 ? "Sin stock" : stock <= 3 ? `Bajo (${stock})` : `OK (${stock})`;
  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${style}`}>{label}</span>;
}

function paymentBadge(status: string) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "REJECTED" || status === "REFUNDED") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-800";
}

function ProductForm({
  categories,
  collections,
  disabled,
}: {
  categories: { id?: string; name: string; slug: string }[];
  collections: { id?: string; name: string; slug: string }[];
  disabled: boolean;
}) {
  return (
    <form action={saveProductAction} className="mt-5 grid gap-3 rounded-md border border-black/10 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input name="name" placeholder="Nombre" className="field" disabled={disabled} />
        <input name="slug" placeholder="slug-producto" className="field" disabled={disabled} />
        <input name="type" placeholder="Tipo: hoodie, remera..." className="field" disabled={disabled} />
      </div>
      <textarea name="description" placeholder="Descripcion" className="field min-h-24" disabled={disabled} />
      <div className="grid gap-3 md:grid-cols-4">
        <input name="price" type="number" placeholder="Precio" className="field" disabled={disabled} />
        <input name="compareAt" type="number" placeholder="Precio anterior" className="field" disabled={disabled} />
        <input name="cost" type="number" placeholder="Costo" className="field" disabled={disabled} />
        <select name="categoryId" className="field" disabled={disabled}>
          {categories.map((category) => <option key={category.id || category.slug} value={category.id || category.slug}>{category.name}</option>)}
        </select>
      </div>
      <select name="collectionId" className="field" disabled={disabled}>
        <option value="">Sin coleccion</option>
        {collections.map((collection) => <option key={collection.id || collection.slug} value={collection.id || collection.slug}>{collection.name}</option>)}
      </select>
      <div className="flex flex-wrap gap-3 text-sm">
        {[
          ["isActive", "Activo"],
          ["isNew", "Nuevo"],
          ["isFeatured", "Destacado"],
          ["isBestSeller", "Best seller"],
        ].map(([name, label]) => (
          <label key={name} className="rounded-md border border-black/10 px-3 py-2">
            <input type="checkbox" name={name} value="1" defaultChecked={name === "isActive"} disabled={disabled} /> {label}
          </label>
        ))}
      </div>
      <button disabled={disabled} className="h-11 rounded-md bg-accent font-bold text-ink disabled:opacity-40">Crear producto</button>
    </form>
  );
}

function VariantForm({ products, disabled }: { products: { id: string; name: string }[]; disabled: boolean }) {
  return (
    <form action={saveVariantAction} className="mt-5 grid gap-3 rounded-md border border-black/10 p-4 md:grid-cols-4">
      <select name="productId" className="field md:col-span-2" disabled={disabled}>
        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
      </select>
      <input name="sku" placeholder="SKU" className="field" disabled={disabled} />
      <input name="stock" type="number" placeholder="Stock" className="field" disabled={disabled} />
      <input name="size" placeholder="Talle" className="field" disabled={disabled} />
      <input name="color" placeholder="Color" className="field" disabled={disabled} />
      <input name="colorHex" placeholder="#0b0b0d" className="field" disabled={disabled} />
      <input name="price" type="number" placeholder="Precio opcional" className="field" disabled={disabled} />
      <button disabled={disabled} className="h-11 rounded-md bg-ink font-semibold text-white disabled:opacity-40 md:col-span-4">Guardar variante</button>
    </form>
  );
}

function TaxonomyForm({
  action,
  fields,
  disabled,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: string[];
  disabled: boolean;
}) {
  return (
    <form action={action} className="mt-4 grid gap-2">
      {fields.map((field) => <input key={field} name={field} placeholder={field} className="field" disabled={disabled} />)}
      <button disabled={disabled} className="h-10 rounded-md bg-ink text-sm font-semibold text-white disabled:opacity-40">Guardar</button>
    </form>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-2 text-sm text-muted">
      {items.map((item) => <li key={item}>- {item}</li>)}
    </ul>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md bg-white p-5">
      <h2 className="font-bold">{title}</h2>
      <ul className="mt-3 grid gap-2 text-sm text-muted">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}
