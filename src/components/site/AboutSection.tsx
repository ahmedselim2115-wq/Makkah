'use client'

import { CheckCircle2, Users, Factory, Wrench, Truck } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'

interface AboutSectionProps {
  settings: SiteSettings | null
}

export function AboutSection({ settings }: AboutSectionProps) {
  const stats = [
    { icon: Users, value: '500+', label: 'عميل سعيد' },
    { icon: Factory, value: '15+', label: 'سنة خبرة' },
    { icon: Wrench, value: '50+', label: 'نموذج منتج' },
    { icon: Truck, value: '1000+', label: 'طلب تم تسليمه' },
  ]

  const points = [
    'تصنيع محلي بأعلى المعايير العالمية',
    'فريق فني متخصص للتركيب والصيانة',
    'ضمان شامل على جميع المنتجات',
    'خدمة ما بعد البيع على مدار الساعة',
    'تقنيات تبريد موفرة للطاقة',
    'تصاميم مخصصة حسب الطلب',
  ]

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* الصورة */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {settings?.aboutImage ? (
                <img
                  src={settings.aboutImage}
                  alt={settings?.aboutTitle || 'من نحن'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <Factory className="w-32 h-32 text-white/80" strokeWidth={1} />
                </div>
              )}
            </div>

            {/* بطاقة إحصائية عائمة */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                  <Factory className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">سنة من الخبرة</p>
                </div>
              </div>
            </div>
          </div>

          {/* النص */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Factory className="w-4 h-4" />
              <span>{settings?.aboutTitle || 'من نحن'}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-gradient">مصنع متكامل</span> لتصنيع حلول التبريد
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {settings?.aboutText ||
                'مصنع مكة للثلاجات هو مصنع رائد في تصنيع الثلاجات التجارية والصناعية'}
            </p>

            {/* النقاط المميزة */}
            <div className="grid sm:grid-cols-2 gap-3">
              {points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
