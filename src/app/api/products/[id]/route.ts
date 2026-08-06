import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({ where: { id } })

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'فشل في جلب المنتج' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'products.edit')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const { id } = await params
    const body = await request.json()

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        nameEn: body.nameEn && body.nameEn.trim() !== '' ? body.nameEn : null,
        description: body.description,
        descriptionEn: body.descriptionEn && body.descriptionEn.trim() !== '' ? body.descriptionEn : null,
        price: body.price !== undefined && body.price !== '' ? parseFloat(body.price) : 0,
        
        // التحقق من السعر القديم وتحديثه بشكل آمن
        compareAtPrice: body.compareAtPrice !== undefined && body.compareAtPrice !== null && body.compareAtPrice !== '' && !isNaN(Number(body.compareAtPrice)) 
          ? parseFloat(body.compareAtPrice) 
          : null,

        imageUrl: body.imageUrl || '',
        category: body.category || 'ثلاجات عرض باب واحد',
        categoryEn: body.categoryEn && body.categoryEn.trim() !== '' ? body.categoryEn : null,
        capacity: body.capacity && body.capacity.trim() !== '' ? body.capacity : null,
        capacityEn: body.capacityEn && body.capacityEn.trim() !== '' ? body.capacityEn : null,
        temperature: body.temperature && body.temperature.trim() !== '' ? body.temperature : null,
        temperatureEn: body.temperatureEn && body.temperatureEn.trim() !== '' ? body.temperatureEn : null,
        power: body.power && body.power.trim() !== '' ? body.power : null,
        powerEn: body.powerEn && body.powerEn.trim() !== '' ? body.powerEn : null,
        featured: Boolean(body.featured),
        inStock: body.inStock !== false,
        showPrice: body.showPrice !== false,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'فشل في تحديث المنتج' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'products.delete')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'فشل في حذف المنتج' }, { status: 500 })
  }
}