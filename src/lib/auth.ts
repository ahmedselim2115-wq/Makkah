import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
export const COOKIE_NAME = 'session'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // أسبوع
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createSessionToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { permissions: true },
    })
    if (!user || !user.isActive) return null
    return user
  } catch {
    return null
  }
}

export function hasPermission(
  user: { isSuperAdmin: boolean; permissions: { key: string }[] } | null,
  key: string
) {
  if (!user) return false
  if (user.isSuperAdmin) return true
  return user.permissions.some((p) => p.key === key)
}