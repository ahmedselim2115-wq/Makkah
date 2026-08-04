'use client'

import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/site/Navbar'
import { Hero } from '@/components/site/Hero'
import ShowcaseSection from '@/components/site/ShowcaseSection'
import { ProductsSection } from '@/components/site/ProductsSection'
import { AboutSection } from '@/components/site/AboutSection'
import { ContactSection } from '@/components/site/ContactSection'
import { Footer } from '@/components/site/Footer'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { AdminLanguageProvider } from '@/contexts/AdminLanguageContext'
import type { Product, SiteSettings } from '@/lib/types'
import { WhatsAppWidget } from '@/components/site/WhatsAppWidget'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchProducts(), fetchSettings()])
      setLoading(false)
    }
    load()
  }, [fetchProducts, fetchSettings])

  const handleSiteUpdate = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchSettings()])
  }, [fetchProducts, fetchSettings])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onAdminClick={() => setShowAdmin(true)} />

      <main className="flex-1">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          </div>
        ) : (
         <>
          <Hero settings={settings} />
          
          <ProductsSection products={products} settings={settings} />
          <AboutSection settings={settings} />
          <ShowcaseSection settings={settings} />
          <ContactSection settings={settings} />
        </>
        )}
      </main>

      <Footer settings={settings} onAdminClick={() => setShowAdmin(true)} />

      {showAdmin && (
        <AdminLanguageProvider>
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            onSiteUpdate={handleSiteUpdate}
          />
        </AdminLanguageProvider>
      )}

      {!showAdmin && <WhatsAppWidget settings={settings} />}
    </div>
  )
}