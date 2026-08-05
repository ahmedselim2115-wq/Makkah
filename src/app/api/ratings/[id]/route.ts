import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'ratings.manage')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const { id } = await params
    await db.rating.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ' }, { status: 500 })
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!hasPermission(user, 'ratings.manage')) {
    return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
  }
  try {
    const { id } = await params
    const { status } = await req.json()

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 })
    }

    const rating = await db.rating.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(rating)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حصل خطأ' }, { status: 500 })
  }
}