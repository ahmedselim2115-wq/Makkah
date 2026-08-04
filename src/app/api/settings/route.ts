import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

const SIMPLE_FIELDS = [
  'heroTitle',
  'heroTitleEn',
  'heroSubtitle',
  'heroSubtitleEn',
  'heroImage',
  'heroImages',
  'aboutTitle',
  'aboutTitleEn',
  'aboutText',
  'aboutTextEn',
  'aboutImage',
  'aboutVideo',
  'aboutHeadingHighlight',
  'aboutHeadingHighlightEn',
  'aboutHeadingRest',
  'aboutHeadingRestEn',
  'aboutPoints',
  'aboutPointsEn',
  'aboutStats',
  'productsBadge',
  'productsBadgeEn',
  'productsHeadingRest',
  'productsHeadingRestEn',
  'productsHeadingHighlight',
  'productsHeadingHighlightEn',
  'productsText',
  'productsTextEn',
  'showcaseTitle',
  'showcaseTitleEn',
  'showcaseSubtitle',
  'showcaseSubtitleEn',
  'phone',
  'email',
  'address',
  'mapLocation',
  'workingHours',
  'workingHoursEn',
  'facebook',
  'instagram',
  'tiktok', 
  'whatsapp',
  'whatsappWidgetEnabled',
  'whatsappWelcomeMessage',
  'whatsappWelcomeMessageEn',
] as const

function parseJsonField(value: unknown, fallback: any = []): any {
  if (!value) return fallback
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed !== null ? parsed : fallback
    } catch {
      return fallback
    }
  }
  return value
}

function serializeSettings(settings: any) {
  const { adminPassword, ...safeSettings } = settings
  
  const parsedHeroImages = parseJsonField(settings.heroImages, [])
  const parsedAboutPoints = parseJsonField(settings.aboutPoints, [])
  const parsedAboutPointsEn = parseJsonField(settings.aboutPointsEn, [])
  const parsedAboutStats = parseJsonField(settings.aboutStats, [])

  return {
    ...safeSettings,
    heroImages: Array.isArray(parsedHeroImages) ? parsedHeroImages : [],
    aboutPoints: Array.isArray(parsedAboutPoints) ? parsedAboutPoints : [],
    aboutPointsEn: Array.isArray(parsedAboutPointsEn) ? parsedAboutPointsEn : [],
    aboutStats: Array.isArray(parsedAboutStats) ? parsedAboutStats : [],
  }
}

// GET /api/settings - جلب الإعدادات
export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {},
      })
    }

    return NextResponse.json({
      settings: serializeSettings(settings),
    })
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
  const user = await getCurrentUser()
  if (!hasPermission(user, 'settings.manage')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const body = await request.json()
    let settings = await db.siteSettings.findFirst()

    const dataToSave: Record<string, unknown> = {}

    for (const key of SIMPLE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const val = body[key]
        if (key === 'heroImages' || key === 'aboutPoints' || key === 'aboutPointsEn' || key === 'aboutStats') {
          // التأكد من حفظها كمصيغة نصية سليمة لشبكة الـ JSON
          const arrayData = Array.isArray(val) ? val : []
          dataToSave[key] = JSON.stringify(arrayData)
        } else {
          dataToSave[key] = val
        }
      }
    }

    if (!settings) {
      settings = await db.siteSettings.create({
        data: dataToSave,
      })
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: dataToSave,
      })
    }

    return NextResponse.json({
      settings: serializeSettings(settings),
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الإعدادات' },
      { status: 500 }
    )
  }
}