import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const products = await prisma.showcaseProduct.findMany({
    orderBy: { order: "asc" },
    include: { hotspots: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!hasPermission(user, "showcase.manage")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, nameEn, image, order, isActive, hotspots } = body;

    if (!name || !image) {
      return NextResponse.json({ error: "الاسم والصورة مطلوبين" }, { status: 400 });
    }

    const product = await prisma.showcaseProduct.create({
      data: {
        name,
        nameEn: nameEn || null,
        image,
        order: order ?? 0,
        isActive: isActive ?? true,
        hotspots: {
          create: (hotspots ?? []).map((h: any, i: number) => ({
            title: h.title,
            titleEn: h.titleEn || null,
            description: h.description,
            descriptionEn: h.descriptionEn || null,
            icon: h.icon ?? null,
            positionX: h.positionX,
            positionY: h.positionY,
            order: h.order ?? i,
          })),
        },
      },
      include: { hotspots: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/showcase error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء المنتج" }, { status: 500 });
  }
}