import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'ratings.manage')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const ratings = await db.rating.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { imageUrl: true },
        },
      },
    })
    return NextResponse.json(ratings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ' }, { status: 500 })
  }
}