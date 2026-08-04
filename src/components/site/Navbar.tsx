'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavbarProps {
  onAdminClick: () => void
}

export function Navbar({ onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, locale, setLocale } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#home', label: t('nav_home') },
    { href: '#products', label: t('nav_products') },
    { href: '#about', label: t('nav_about') },
    { href: '#contact', label: t('nav_contact') },
  ]

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleLanguage = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3">
            <div className="w-[60px] h-[60px] rounded-[20px] bg-white shadow-sm border border-gray-50 overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt={t('company_name')}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight text-foreground">
                {t('company_name')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('company_tagline')}</p>
            </div>
          </div>

          {/* روابط سطح المكتب */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors mr-1"
            >
              <Globe className="w-4 h-4" />
              {t('lang_switch')}
            </button>
            <Button
              onClick={() => scrollToSection('#products')}
              className="mr-2 gradient-primary text-white hover:opacity-90"
            >
              {t('nav_browse')}
            </Button>
          </nav>

          {/* زر القائمة للجوال */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* قائمة الجوال */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-3 text-right text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              {t('lang_switch')}
            </button>
            <Button
              onClick={() => scrollToSection('#products')}
              className="mt-2 gradient-primary text-white"
            >
              {t('nav_browse')}
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}