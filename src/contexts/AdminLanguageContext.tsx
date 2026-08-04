'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { adminTranslations, AdminLocale, AdminTranslationKey } from '@/lib/admin-translations'

type AdminLanguageContextType = {
  locale: AdminLocale
  setLocale: (locale: AdminLocale) => void
  t: (key: AdminTranslationKey, ...args: any[]) => any
  dir: 'rtl' | 'ltr'
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'admin_locale'

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('ar')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (saved === 'ar' || saved === 'en') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  const t = (key: AdminTranslationKey, ...args: any[]): any => {
    const entry = adminTranslations[locale][key] ?? adminTranslations.ar[key] ?? key
    return typeof entry === 'function' ? (entry as (...a: any[]) => string)(...args) : entry
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <AdminLanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir}>{children}</div>
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const ctx = useContext(AdminLanguageContext)
  if (!ctx) throw new Error('useAdminLanguage must be used inside AdminLanguageProvider')
  return ctx
}