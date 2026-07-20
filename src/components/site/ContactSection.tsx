'use client'

import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { SiteSettings } from '@/lib/types'

interface ContactSectionProps {
  settings: SiteSettings | null
}

export function ContactSection({ settings }: ContactSectionProps) {
  const contactCards = [
    {
      icon: Phone,
      title: 'الهاتف',
      value: settings?.phone || '+966 12 345 6789',
      action: settings?.phone ? `tel:${settings.phone}` : undefined,
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: settings?.email || 'info@meccarefrigerators.com',
      action: settings?.email ? `mailto:${settings.email}` : undefined,
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: settings?.address || 'مكة المكرمة، المملكة العربية السعودية',
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: settings?.workingHours || 'السبت - الخميس: 9 صباحاً - 6 مساءً',
    },
  ]

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            <span>تواصل معنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            نحن <span className="text-gradient">هنا لمساعدتك</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            تواصل معنا اليوم للحصول على استشارة مجانية أو طلب عرض سعر
            لاحتياجاتك من حلول التبريد
          </p>
        </div>

        {/* بطاقات التواصل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card, idx) => (
            <Card
              key={idx}
              className="card-hover text-center border-2 border-transparent hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                {card.action ? (
                  <a
                    href={card.action}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                    dir="ltr"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{card.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* قسم التواصل السريع */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* الخريطة / الموقع */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video lg:aspect-auto lg:h-full bg-muted flex items-center justify-center gradient-mesh">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">زورونا في مصنعنا</h3>
                  <p className="text-muted-foreground max-w-md">
                    {settings?.address || 'مكة المكرمة، المملكة العربية السعودية - المنطقة الصناعية'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* روابط التواصل الاجتماعي */}
          <Card className="flex flex-col">
            <CardContent className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">تابعنا على</h3>
              <p className="text-muted-foreground mb-6">
                تابع أحدث منتجاتنا وعروضنا الخاصة عبر منصات التواصل الاجتماعي
              </p>

              <div className="space-y-3">
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">واتساب</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">{settings.whatsapp}</p>
                    </div>
                  </a>
                )}

                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">فيسبوك</p>
                      <p className="text-sm text-muted-foreground">تابعنا على فيسبوك</p>
                    </div>
                  </a>
                )}

                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">انستغرام</p>
                      <p className="text-sm text-muted-foreground">شاهد أحدث أعمالنا</p>
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
