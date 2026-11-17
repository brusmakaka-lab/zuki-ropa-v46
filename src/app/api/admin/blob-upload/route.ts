import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const files = form.getAll("file").filter((file): file is File => file instanceof File);
  if (!files.length) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  const blobs = await Promise.all(
    files.map((file) => put(`products/${Date.now()}-${file.name}`, file, { access: "public" })),
  );
  return NextResponse.json({ blobs });
}
