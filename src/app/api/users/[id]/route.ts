import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hashPassword } from '@/lib/auth'

async function checkAccess() {
  const currentUser = await getCurrentUser()
  const allowed =
    !!currentUser?.isSuperAdmin ||
    !!currentUser?.permissions.some((p) => p.key === 'users.manage')
  return { currentUser, allowed }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { currentUser, allowed } = await checkAccess()
  if (!allowed) return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })

  const targetUser = await db.user.findUnique({ where: { id } })
  if (!targetUser) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  if (targetUser.isSuperAdmin && targetUser.id !== currentUser?.id) {
    return NextResponse.json({ error: 'لا يمكن تعديل حساب المدير الرئيسي' }, { status: 403 })
  }

  const { name, isActive, permissions, password } = await request.json()
  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (isActive !== undefined) updateData.isActive = isActive
  if (password) updateData.password = await hashPassword(password)

  if (permissions !== undefined) {
    await db.permission.deleteMany({ where: { userId: id } })
    updateData.permissions = { create: (permissions as string[]).map((key) => ({ key })) }
  }

  const user = await db.user.update({
    where: { id },
    data: updateData,
    include: { permissions: true },
  })
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isSuperAdmin: user.isSuperAdmin,
      permissions: user.permissions.map((p) => p.key),
    },
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { allowed } = await checkAccess()
  if (!allowed) return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })

  const targetUser = await db.user.findUnique({ where: { id } })
  if (targetUser?.isSuperAdmin) {
    return NextResponse.json({ error: 'لا يمكن حذف حساب المدير الرئيسي' }, { status: 403 })
  }

  await db.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}