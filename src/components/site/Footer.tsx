'use client'

import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

// 1. أضفنا مكون أيقونة تيك توك هنا
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76c0-3.74 3.02-6.76 6.76-6.76.43 0 .85.04 1.27.12V16.33a3.125 3.125 0 0 0-1.27-.26 3.125 3.125 0 0 0-3.13 3.13 3.125 3.125 0 0 0 3.13 3.13 3.125 3.125 0 0 0 3.13-3.13V.02Z"/>
  </svg>
 );

interface FooterProps {
  settings: SiteSettings | null
  onAdminClick: () => void
}

export function Footer({ settings, onAdminClick }: FooterProps) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-[68px] h-[68px] flex-shrink-0">
                <img src="/logo.png" alt={t('company_name')} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">{t('company_name')}</h3>
                <p className="text-xs text-background/70">{t('company_tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              {t('footer_description')}
            </p>
            <div className="flex gap-2">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {/* 2. إضافة أيقونة تيك توك هنا */}
              {settings?.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="TikTok">
                  <TikTokIcon className="w-4 h-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '' )}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* ... بقية الكود كما هو ... */}
          <div>
            <h4 className="font-bold mb-4">{t('footer_quick_links')}</h4>
            <ul className="space-y-2">
              {[
                { href: '#home', label: t('nav_home') },
                { href: '#products', label: t('nav_products') },
                { href: '#about', label: t('nav_about') },
                { href: '#contact', label: t('nav_contact') },
              ].map((link) => (
                <li key={link.href}>
                  <button onClick={() => scrollToSection(link.href)} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer_our_products')}</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>{t('footer_product_commercial')}</li>
              <li>{t('footer_product_display')}</li>
              <li>{t('footer_product_industrial_freezers')}</li>
              <li>{t('footer_product_cold_rooms')}</li>
              <li>{t('footer_product_meat_fridges')}</li>
              <li>{t('footer_product_drink_fridges')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer_contact_info')}</h4>
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

        <div className="border-t border-background/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60 text-center sm:text-right">
            © {currentYear} {t('company_name')}. {t('footer_rights')}.
          </p>
          <button onClick={onAdminClick} className="text-xs text-background/40 hover:text-background/70 transition-colors">
            {t('footer_admin_panel')}
          </button>
        </div>
      </div>
    </footer>
  )
}
