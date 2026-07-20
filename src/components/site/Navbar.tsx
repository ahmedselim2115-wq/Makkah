'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Snowflake } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  onAdminClick: () => void
}

export function Navbar({ onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#home', label: 'الرئيسية' },
    { href: '#products', label: 'المنتجات' },
    { href: '#about', label: 'من نحن' },
    { href: '#contact', label: 'تواصل معنا' },
  ]

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
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
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Snowflake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight text-foreground">
                مصنع مكة للثلاجات
              </h1>
              <p className="text-xs text-muted-foreground">روافد التبريد الحديثة</p>
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
            <Button
              onClick={() => scrollToSection('#products')}
              className="mr-2 gradient-primary text-white hover:opacity-90"
            >
              تصفح المنتجات
            </Button>
          </nav>

          {/* زر القائمة للجوال */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="القائمة"
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
            <Button
              onClick={() => scrollToSection('#products')}
              className="mt-2 gradient-primary text-white"
            >
              تصفح المنتجات
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
