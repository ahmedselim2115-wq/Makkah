import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await getCurrentUser()
  if (!hasPermission(user, 'categories.edit')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  const { name, nameEn } = await request.json()
  const category = await db.category.update({
    where: { id },
    data: { name, nameEn: nameEn?.trim() || null },
  })
  return NextResponse.json({ category })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await getCurrentUser()
  if (!hasPermission(user, 'categories.delete')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  await db.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}