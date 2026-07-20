'use client'

import { Snowflake, ShieldCheck, Zap, Award, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/types'

interface HeroProps {
  settings: SiteSettings | null
}

export function Hero({ settings }: HeroProps) {
  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const features = [
    { icon: ShieldCheck, title: 'جودة مضمونة', text: 'ضمان شامل على جميع المنتجات' },
    { icon: Zap, title: 'كفاءة عالية', text: 'استهلاك اقتصادي للطاقة' },
    { icon: Award, title: 'خبرة واسعة', text: 'سنوات من التميز في التبريد' },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center gradient-mesh overflow-hidden pt-24 pb-12"
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النص */}
          <div className="space-y-6 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Snowflake className="w-4 h-4" />
              <span>الرائدة في صناعة الثلاجات</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gradient">
                {settings?.heroTitle || 'مصنع مكة للثلاجات'}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mr-0">
              {settings?.heroSubtitle ||
                'روافد التبريد الحديثة - حلول تبريد متكاملة لكل القطاعات'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="gradient-primary text-white hover:opacity-90 text-lg px-8 py-6"
              >
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToContact}
                className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/5"
              >
                تواصل معنا
              </Button>
            </div>

            {/* المميزات */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-primary/10 text-center sm:text-right"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الصورة / الرسم */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* دائرة الخلفية */}
              <div className="absolute inset-0 gradient-primary rounded-full opacity-20 blur-2xl" />

              {/* البطاقة الرئيسية */}
              <div className="relative w-full h-full">
                {settings?.heroImage ? (
                  <img
                    src={settings.heroImage}
                    alt="مصنع مكة للثلاجات"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-3xl gradient-primary flex items-center justify-center shadow-2xl">
                    <Snowflake className="w-48 h-48 text-white/90" strokeWidth={1} />
                  </div>
                )}
              </div>

              {/* بطاقات عائمة */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[200px]">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">ضمان</p>
                  <p className="text-xs text-muted-foreground">من سنتين إلى 5 سنوات</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[220px]">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">شهادات الجودة</p>
                  <p className="text-xs text-muted-foreground">معايير ISO و CE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
