import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createSessionToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await db.user.findUnique({
      where: { email },
      include: { permissions: true },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    const token = createSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        permissions: user.permissions.map((p) => p.key),
      },
    })
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'فشل في تسجيل الدخول' }, { status: 500 })
  }
}