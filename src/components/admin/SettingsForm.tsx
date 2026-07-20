'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { SiteSettings } from '@/lib/types'

interface SettingsFormProps {
  settings: SiteSettings | null
  onClose: () => void
  onSaved: () => void
}

export function SettingsForm({ settings, onClose, onSaved }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    aboutTitle: '',
    aboutText: '',
    aboutImage: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        heroImage: settings.heroImage || '',
        aboutTitle: settings.aboutTitle || '',
        aboutText: settings.aboutText || '',
        aboutImage: settings.aboutImage || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        workingHours: settings.workingHours || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        whatsapp: settings.whatsapp || '',
      })
    }
  }, [settings])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('تم حفظ الإعدادات بنجاح')
        onSaved()
      } else {
        toast.error('حدث خطأ')
      }
    } catch (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <h2 className="text-xl font-bold">إعدادات الموقع</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* القسم الرئيسي */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 pb-2 border-b">
              <span className="w-1 h-6 bg-primary rounded-full" />
              القسم الرئيسي (Hero)
            </h3>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">العنوان الرئيسي</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="مصنع مكة للثلاجات"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">العنوان الفرعي</Label>
              <Textarea
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="وصف موجز يظهر في القسم الرئيسي"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImage">رابط صورة القسم الرئيسي</Label>
              <div className="flex gap-2">
                <Input
                  id="heroImage"
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                {formData.heroImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={formData.heroImage}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قسم من نحن */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 pb-2 border-b">
              <span className="w-1 h-6 bg-primary rounded-full" />
              قسم من نحن
            </h3>
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">عنوان القسم</Label>
              <Input
                id="aboutTitle"
                value={formData.aboutTitle}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                placeholder="من نحن"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutText">نص التعريف</Label>
              <Textarea
                id="aboutText"
                value={formData.aboutText}
                onChange={(e) => handleChange('aboutText', e.target.value)}
                placeholder="نص تعريفي شامل عن المصنع"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutImage">رابط صورة القسم</Label>
              <div className="flex gap-2">
                <Input
                  id="aboutImage"
                  type="url"
                  value={formData.aboutImage}
                  onChange={(e) => handleChange('aboutImage', e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                />
                {formData.aboutImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={formData.aboutImage}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 pb-2 border-b">
              <span className="w-1 h-6 bg-primary rounded-full" />
              معلومات التواصل
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+966 12 345 6789"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@example.com"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="العنوان الكامل"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workingHours">ساعات العمل</Label>
              <Input
                id="workingHours"
                value={formData.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                placeholder="السبت - الخميس: 9 صباحاً - 6 مساءً"
              />
            </div>
          </div>

          {/* التواصل الاجتماعي */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 pb-2 border-b">
              <span className="w-1 h-6 bg-primary rounded-full" />
              التواصل الاجتماعي
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">رقم واتساب</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+966500000000"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">رابط فيسبوك</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">رابط انستغرام</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </form>

        {/* الأزرار */}
        <div className="flex gap-3 p-6 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 gradient-primary text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعدادات
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
