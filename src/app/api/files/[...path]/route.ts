import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params

    // حماية بسيطة من الخروج بره المجلد (path traversal)
    if (segments.some((s) => s.includes('..'))) {
      return NextResponse.json({ error: 'مسار غير صالح' }, { status: 400 })
    }

    const filePath = path.join(UPLOAD_ROOT, ...segments)

    const fileStat = await stat(filePath).catch(() => null)
    if (!fileStat || !fileStat.isFile()) {
      return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 })
    }

    const buffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(fileStat.size),
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}