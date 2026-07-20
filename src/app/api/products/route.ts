import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/products - جلب جميع المنتجات
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
    return NextResponse.json(
      { error: 'فشل في جلب المنتجات' },
      { status: 500 }
    )
  }
}

// POST /api/products - إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        imageUrl: body.imageUrl || '',
        category: body.category || 'ثلاجات',
        capacity: body.capacity || null,
        temperature: body.temperature || null,
        power: body.power || null,
        featured: body.featured || false,
        inStock: body.inStock !== false,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة المنتج' },
      { status: 500 }
    )
  }
}
