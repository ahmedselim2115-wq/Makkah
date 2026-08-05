'use client'

import { useState, useEffect } from 'react'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminLanguageProvider } from '@/contexts/AdminLanguageContext'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const authStatus = localStorage.getItem('admin_logged_in')
    if (authStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <AdminLanguageProvider>
      <main className="min-h-screen bg-[#0b141a]">
        {!isLoggedIn ? (
          <AdminLogin 
            onClose={() => {
              window.location.href = '/'
            }}
            onLogin={() => {
              localStorage.setItem('admin_logged_in', 'true')
              // استخدام إعادة تحميل خفيفة للصفحة لضمان مسح أي حالات معلقة في المكونات
              window.location.reload()
            }} 
          />
        ) : (
          <AdminPanel 
            onClose={() => {
              localStorage.removeItem('admin_logged_in')
              setIsLoggedIn(false)
            }} 
            onSiteUpdate={() => {}}
          />
        )}
      </main>
    </AdminLanguageProvider>
  )
}