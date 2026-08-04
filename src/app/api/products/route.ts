import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const products = await db.product.findMany({
      where: featured === 'true' ? { featured: true } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'فشل في جلب المنتجات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'products.create')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const body = await request.json()

    const product = await db.product.create({
      data: {
        name: body.name,
        nameEn: body.nameEn && body.nameEn.trim() !== '' ? body.nameEn : null,
        description: body.description,
        descriptionEn: body.descriptionEn && body.descriptionEn.trim() !== '' ? body.descriptionEn : null,
        price: body.price !== undefined && body.price !== '' ? parseFloat(body.price) : 0,
        
        // التحقق من السعر القديم وحفظه بشكل صحيح أو تحويله لـ null
        compareAtPrice: body.compareAtPrice !== undefined && body.compareAtPrice !== null && body.compareAtPrice !== '' && !isNaN(Number(body.compareAtPrice)) 
          ? parseFloat(body.compareAtPrice) 
          : null,

        imageUrl: body.imageUrl || '',
        category: body.category || 'ثلاجات',
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

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'فشل في إضافة المنتج' }, { status: 500 })
  }
}