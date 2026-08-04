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

export async function GET() {
  const { allowed } = await checkAccess()
  if (!allowed) return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })

  const users = await db.user.findMany({
    include: { permissions: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      isSuperAdmin: u.isSuperAdmin,
      permissions: u.permissions.map((p) => p.key),
      createdAt: u.createdAt,
    })),
  })
}

export async function POST(request: NextRequest) {
  const { allowed } = await checkAccess()
  if (!allowed) return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })

  const { name, email, password, permissions } = await request.json()
  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'كل الحقول مطلوبة' }, { status: 400 })
  }

  try {
    const hashed = await hashPassword(password)
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashed,
        permissions: {
          create: ((permissions as string[]) || []).map((key) => ({ key })),
        },
      },
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
  } catch {
    return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 400 })
  }
}