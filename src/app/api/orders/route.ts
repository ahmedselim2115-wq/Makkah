import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

// POST: يُستخدم من صفحة الموقع (عام)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, productName, customerName, phone, address, notes, source } = body

    if (!customerName || !phone || !address || !productName) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })
    }

    const order = await db.order.create({
      data: {
        productId: productId || null,
        productName,
        customerName,
        phone,
        address,
        notes: notes || null,
        source: source || 'website',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ في إرسال الطلب' }, { status: 500 })
  }
}


export async function GET() {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'orders.manage')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { imageUrl: true, price: true, showPrice: true },
        },
      },
    })
    return NextResponse.json(orders)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ' }, { status: 500 })
  }
}