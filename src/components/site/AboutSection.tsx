'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, Users, Factory, Wrench, Truck, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface AboutSectionProps {
  settings: SiteSettings | null
}

const STAT_ICONS = [Users, Factory, Wrench, Truck]

const DEFAULT_POINTS = [
  'تصنيع محلي بأعلى المعايير العالمية',
  'فريق فني متخصص للتركيب والصيانة',
  'ضمان شامل على جميع المنتجات',
  'خدمة ما بعد البيع على مدار الساعة',
  'تقنيات تبريد موفرة للطاقة',
  'تصاميم مخصصة حسب الطلب',
]

const DEFAULT_STATS = [
  { value: '500+', label: 'عميل سعيد' },
  { value: '15+', label: 'سنة خبرة' },
  { value: '50+', label: 'نموذج منتج' },
  { value: '1000+', label: 'طلب تم تسليمه' },
]

export function AboutSection({ settings }: AboutSectionProps) {
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

 const points =
    isEn && settings?.aboutPointsEn && settings.aboutPointsEn.length > 0
      ? settings.aboutPointsEn
      : settings?.aboutPoints && settings.aboutPoints.length > 0
      ? settings.aboutPoints
      : DEFAULT_POINTS

  const statsData =
    settings?.aboutStats && settings.aboutStats.length > 0 ? settings.aboutStats : DEFAULT_STATS

  const stats = statsData.map((stat, idx) => ({
    ...stat,
    displayLabel: isEn && (stat as any).labelEn ? (stat as any).labelEn : stat.label,
    icon: STAT_ICONS[idx] || Factory,
  }))

  const headingHighlight =
    (isEn ? settings?.aboutHeadingHighlightEn : settings?.aboutHeadingHighlight)?.trim() ||
    t('about_default_heading_highlight')
  const headingRest =
    (isEn ? settings?.aboutHeadingRestEn : settings?.aboutHeadingRest)?.trim() ||
    t('about_default_heading_rest')

  const experienceStatRaw = statsData[1] || DEFAULT_STATS[1]
  const experienceStat = {
    value: experienceStatRaw.value,
    label:
      isEn && (experienceStatRaw as any).labelEn
        ? (experienceStatRaw as any).labelEn
        : experienceStatRaw.label,
  }

  const aboutVideo = settings?.aboutVideo?.trim()
  const aboutImage = settings?.aboutImage?.trim()

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-muted group">
              {aboutVideo ? (
                <>
                  <video
                    ref={videoRef}
                    key={aboutVideo}
                    src={aboutVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    {aboutImage && (
                      <img
                        src={aboutImage}
                        alt={settings?.aboutTitle || t('about_default_title')}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </video>

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? t('hero_pause') : t('hero_play')}
                      className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 -mr-0.5" fill="currentColor" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </>
              ) : aboutImage ? (
                <img
                  src={aboutImage}
                  alt={settings?.aboutTitle || t('about_default_title')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <Factory className="w-32 h-32 text-white/80" strokeWidth={1} />
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                  <Factory className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{experienceStat.value}</p>
                  <p className="text-sm text-muted-foreground">{experienceStat.label}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Factory className="w-4 h-4" />
              <span>{(isEn ? settings?.aboutTitleEn : settings?.aboutTitle)?.trim() || t('about_default_title')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-gradient">{headingHighlight}</span> {headingRest}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {(isEn ? settings?.aboutTextEn : settings?.aboutText)?.trim() || t('about_default_text')}
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.displayLabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}