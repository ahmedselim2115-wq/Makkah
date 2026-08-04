import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'categories.create')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }

  const { name, nameEn } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'اسم الفئة مطلوب' }, { status: 400 })
  }

  try {
    const category = await db.category.create({
      data: { name: name.trim(), nameEn: nameEn?.trim() || null },
    })
    return NextResponse.json({ category })
  } catch {
    return NextResponse.json({ error: 'الفئة موجودة بالفعل' }, { status: 400 })
  }
}