import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { hasPermission, getCurrentUser } from "@/lib/auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!hasPermission(user, "showcase.manage")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { name, nameEn, image, order, isActive, hotspots } = body;

    // نمسح النقاط القديمة ونعمل الجديدة بدل ما نعمل diff معقد
    await prisma.showcaseHotspot.deleteMany({
      where: { showcaseProductId: id },
    });

    const product = await prisma.showcaseProduct.update({
      where: { id: id },
      data: {
        name,
        nameEn: nameEn || null,
        image,
        order,
        isActive,
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

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PUT /api/admin/showcase/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل المنتج" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!hasPermission(user, "showcase.manage")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    // نمسح النقاط المرتبطة الأول بشكل صريح، احتياطاً لو الـ cascade مش مفعّل فعلياً على الداتابيز
    await prisma.showcaseHotspot.deleteMany({
      where: { showcaseProductId: id },
    });

    await prisma.showcaseProduct.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/showcase/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المنتج" },
      { status: 500 }
    );
  }
}