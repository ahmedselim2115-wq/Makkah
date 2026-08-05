import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { getCurrentUser } from '@/lib/auth'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

// مسار التخزين: بره public وبره .next/standalone تماماً
// لو حطيت متغير بيئة UPLOAD_DIR (مثلاً لما تربط Railway Volume) هيستخدمه
// وإلا هيستخدم مجلد "uploads" في جذر المشروع وقت التشغيل
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم، الرجاء رفع صورة (jpg, png, webp, gif) أو فيديو (mp4, webm, ogg)' },
        { status: 400 }
      )
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isVideo
            ? 'حجم الفيديو كبير جدًا، الحد الأقصى 50 ميجابايت'
            : 'حجم الصورة كبير جدًا، الحد الأقصى 5 ميجابايت',
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.jpg')
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`

    const subDir = isVideo ? 'videos' : 'images'
    const uploadDir = path.join(UPLOAD_ROOT, subDir)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // الرابط بيوجه لراوت التقديم الخاص بنا مش لمجلد public
    const url = `/api/files/${subDir}/${fileName}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء رفع الملف' }, { status: 500 })
  }
}