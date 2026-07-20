import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats - إحصائيات لوحة التحكم
export async function GET() {
  try {
    const totalProducts = await db.product.count()
    const featuredProducts = await db.product.count({ where: { featured: true } })
    const inStockProducts = await db.product.count({ where: { inStock: true } })
    const outOfStockProducts = await db.product.count({ where: { inStock: false } })

    return NextResponse.json({
      stats: {
        totalProducts,
        featuredProducts,
        inStockProducts,
        outOfStockProducts,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
