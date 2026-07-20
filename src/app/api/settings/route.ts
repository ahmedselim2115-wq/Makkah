import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings - جلب الإعدادات
export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {},
      })
    }

    // لا نرجع كلمة المرور
    const { adminPassword, ...safeSettings } = settings
    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الإعدادات' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - تحديث الإعدادات
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          heroTitle: body.heroTitle,
          heroSubtitle: body.heroSubtitle,
          heroImage: body.heroImage,
          aboutTitle: body.aboutTitle,
          aboutText: body.aboutText,
          aboutImage: body.aboutImage,
          phone: body.phone,
          email: body.email,
          address: body.address,
          workingHours: body.workingHours,
          facebook: body.facebook,
          instagram: body.instagram,
          whatsapp: body.whatsapp,
        },
      })
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: {
          heroTitle: body.heroTitle,
          heroSubtitle: body.heroSubtitle,
          heroImage: body.heroImage,
          aboutTitle: body.aboutTitle,
          aboutText: body.aboutText,
          aboutImage: body.aboutImage,
          phone: body.phone,
          email: body.email,
          address: body.address,
          workingHours: body.workingHours,
          facebook: body.facebook,
          instagram: body.instagram,
          whatsapp: body.whatsapp,
        },
      })
    }

    const { adminPassword, ...safeSettings } = settings
    return NextResponse.json({ settings: safeSettings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الإعدادات' },
      { status: 500 }
    )
  }
}
