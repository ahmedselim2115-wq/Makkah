'use client'

import { Snowflake, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings: SiteSettings | null
  onAdminClick: () => void
}

export function Footer({ settings, onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* عمود الشركة */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">مصنع مكة للثلاجات</h3>
                <p className="text-xs text-background/70">روافد التبريد الحديثة</p>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              نحن نقدم حلول تبريد متكاملة بأعلى معايير الجودة والكفاءة
              لجميع القطاعات التجارية والصناعية
            </p>
            {/* روابط التواصل */}
            <div className="flex gap-2">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                  aria-label="فيسبوك"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                  aria-label="انستغرام"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                  aria-label="واتساب"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { href: '#home', label: 'الرئيسية' },
                { href: '#products', label: 'المنتجات' },
                { href: '#about', label: 'من نحن' },
                { href: '#contact', label: 'تواصل معنا' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* المنتجات */}
          <div>
            <h4 className="font-bold mb-4">منتجاتنا</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>ثلاجات تجارية</li>
              <li>ثلاجات عرض</li>
              <li>فريزرات صناعية</li>
              <li>غرف التبريد</li>
              <li>ثلاجات اللحوم</li>
              <li>ثلاجات المشروبات</li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="font-bold mb-4">معلومات التواصل</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 mt-1" />
                <span dir="ltr">{settings?.phone || '+966 12 345 6789'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>{settings?.email || 'info@meccarefrigerators.com'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>{settings?.address || 'مكة المكرمة، المملكة العربية السعودية'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* خط سفلي */}
        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60 text-center sm:text-right">
            © {currentYear} مصنع مكة للثلاجات. جميع الحقوق محفوظة.
          </p>
          <button
            onClick={onAdminClick}
            className="text-xs text-background/40 hover:text-background/70 transition-colors"
          >
            لوحة التحكم
          </button>
        </div>
      </div>
    </footer>
  )
}
