import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/login - التحقق من كلمة المرور
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    let settings = await db.siteSettings.findFirst()
    if (!settings) {
      settings = await db.siteSettings.create({ data: {} })
    }

    if (password === settings.adminPassword) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'كلمة المرور غير صحيحة' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'فشل في تسجيل الدخول' },
      { status: 500 }
    )
  }
}
