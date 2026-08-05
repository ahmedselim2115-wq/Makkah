import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: يرجع متوسط التقييم وعدد المقيّمين لمنتج معين (للعرض في كارت المنتج)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

   const result = await db.rating.aggregate({
      where: { productId: id, status: 'approved' },
      _avg: { value: true },
      _count: { value: true },
    })

    const reviews = await db.rating.findMany({
      where: { productId: id, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        value: true,
        comment: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      average: result._avg.value || 0,
      count: result._count.value,
      reviews,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ' }, { status: 500 })
  }
}

// POST: يُستخدم من صفحة الموقع (عام) - يضيف تقييم كامل ببيانات العميل
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { value, customerName, phone, comment } = await req.json()

    if (!value || typeof value !== 'number' || value < 1 || value > 5) {
      return NextResponse.json({ error: 'قيمة التقييم غير صحيحة' }, { status: 400 })
    }
    if (!customerName || !phone) {
      return NextResponse.json({ error: 'الاسم ورقم الهاتف مطلوبين' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    await db.rating.create({
      data: {
        productId: id,
        productName: product.name,
        customerName,
        phone,
        value,
        comment: comment || null,
      },
    })

    const result = await db.rating.aggregate({
      where: { productId: id },
      _avg: { value: true },
      _count: { value: true },
    })

    return NextResponse.json({
      average: result._avg.value || 0,
      count: result._count.value,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ في إرسال التقييم' }, { status: 500 })
  }
}