'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, ChevronRight, ChevronLeft, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeroProps {
  settings: SiteSettings | null
}

const SLIDE_INTERVAL_MS = 5000

export function Hero({ settings }: HeroProps) {
  const { t, locale } = useLanguage()

  const images: string[] =
    (settings as unknown as { heroImages?: string[] })?.heroImages?.filter(Boolean) ??
    (settings?.heroImage ? [settings.heroImage] : [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (images.length ? (prev + 1) % images.length : 0))
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (images.length ? (prev - 1 + images.length) % images.length : 0))
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || !isPlaying) return
    const timer = setInterval(goToNext, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [images.length, isPlaying, goToNext])

  useEffect(() => {
    setProgress(0)
    if (images.length <= 1 || !isPlaying) return

    const stepMs = 50
    const steps = SLIDE_INTERVAL_MS / stepMs
    let current = 0

    const progressTimer = setInterval(() => {
      current += 1
      setProgress((current / steps) * 100)
      if (current >= steps) current = 0
    }, stepMs)

    return () => clearInterval(progressTimer)
  }, [currentIndex, images.length, isPlaying])

  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"
    >
      <div className="absolute inset-0 z-0">
        {images.length > 0 ? (
          images.map((src, idx) => (
            <img
              key={src + idx}
              src={src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <div className="w-full h-full gradient-primary" />
        )}

        <div className="absolute inset-0 bg-gradient-to-l from-foreground/95 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl space-y-4 md:space-y-6 ${locale === 'en' ? 'text-left' : 'text-right'}`}>
         <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {(locale === 'en' ? settings?.heroTitleEn : settings?.heroTitle) || t('hero_default_title')}
          </h1>

          <p className={`text-sm sm:text-base md:text-xl text-white/80 leading-relaxed max-w-xl ${locale === 'en' ? 'ml-0' : 'mr-0'}`}>
            {(locale === 'en' ? settings?.heroSubtitleEn : settings?.heroSubtitle) || t('hero_default_subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="gradient-primary text-white hover:opacity-90 text-sm sm:text-base md:text-lg px-5 sm:px-7 md:px-10 py-4 md:py-6 rounded-full"
            >
              {t('hero_browse_products')}
              <ArrowLeft className={`w-4 h-4 md:w-5 md:h-5 ${locale === 'en' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={scrollToContact}
              className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-4 md:py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white/20 hover:text-white"
            >
              {t('hero_contact_us')}
            </Button>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-4 md:px-8 pt-4">
            <div className="w-full h-px rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white/40 rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              onClick={goToNext}
              aria-label={t('hero_next_image')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="w-px h-4 bg-white/30" />
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? t('hero_pause') : t('hero_play')}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span className="w-px h-4 bg-white/30" />
            <button
              onClick={goToPrev}
              aria-label={t('hero_prev_image')}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}