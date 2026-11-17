import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/store";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "zuki-zone-store",
    databaseConfigured: hasDatabase(),
  });
}
