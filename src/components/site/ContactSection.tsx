'use client'
import { useMemo } from 'react'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle, Music } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface ContactSectionProps {
  settings: SiteSettings | null
}
const TikTokIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76c0-3.74 3.02-6.76 6.76-6.76.43 0 .85.04 1.27.12V16.33a3.125 3.125 0 0 0-1.27-.26 3.125 3.125 0 0 0-3.13 3.13 3.125 3.125 0 0 0 3.13 3.13 3.125 3.125 0 0 0 3.13-3.13V.02Z"/>
  </svg>
 );

export function ContactSection({ settings }: ContactSectionProps) {
  const { t } = useLanguage()

  const contactCards = [
    { icon: Phone, title: t('contact_phone'), value: settings?.phone || '+966 12 345 6789', action: settings?.phone ? `tel:${settings.phone}` : undefined },
    { icon: Mail, title: t('contact_email'), value: settings?.email || 'info@meccarefrigerators.com', action: settings?.email ? `mailto:${settings.email}` : undefined },
    { icon: MapPin, title: t('contact_address'), value: settings?.address || 'مكة المكرمة، المملكة العربية السعودية' },
    { icon: Clock, title: t('contact_working_hours'), value: settings?.workingHours || 'السبت - الخميس: 9 صباحاً - 6 مساءً' },
  ]

  const mapQuery = settings?.mapLocation?.trim() || settings?.address?.trim() || 'مكة المكرمة، المملكة العربية السعودية'
  const mapEmbedUrl = useMemo(() => `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`, [mapQuery])

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            <span>{t('contact_badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('contact_heading')} <span className="text-gradient">{t('contact_heading_highlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('contact_text')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card, idx) => (
            <Card key={idx} className="card-hover text-center border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                {card.action ? (
                  <a href={card.action} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all" dir="ltr">
                    {card.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{card.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Card className="overflow-hidden flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="text-center p-6 border-b">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{t('contact_visit_us')}</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {settings?.address || 'مكة المكرمة، المملكة العربية السعودية - المنطقة الصناعية'}
                </p>
              </div>
              <div className="flex-1 min-h-[280px]">
                <iframe src={mapEmbedUrl} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location Map" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardContent className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">{t('contact_follow_us')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('contact_follow_text')}
              </p>

              <div className="space-y-3">
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{t('contact_whatsapp')}</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">{settings.whatsapp}</p>
                    </div>
                  </a>
                )}

                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{t('contact_facebook')}</p>
                      <p className="text-sm text-muted-foreground">{t('contact_facebook_text')}</p>
                    </div>
                  </a>
                )}

                {settings?.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{t('contact_instagram')}</p>
                      <p className="text-sm text-muted-foreground">{t('contact_instagram_text')}</p>
                    </div>
                  </a>
                )}

                {settings?.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                      <TikTokIcon  className="w-5 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{t('contact_tiktok') || 'تيك توك'}</p>
                      <p className="text-sm text-muted-foreground">{t('contact_tiktok_text') || 'تابعنا على تيك توك'}</p>
                    </div>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}