// المسار: src/app/api/showcase/route.ts
import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { hasPermission } from "@/lib/auth"

export async function GET() {
  const products = await prisma.showcaseProduct.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { hotspots: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ products });
}