'use client'

import { useState } from 'react'
import { X, ShoppingCart, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Product, SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface OrderModalProps {
  product: Product
  settings?: SiteSettings | null
  onClose: () => void
}

export function OrderModal({ product, settings, onClose }: OrderModalProps) {
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'

  // اختيار الاسم المناسب حسب اللغة الحالية
  const displayName = isEn && product.nameEn ? product.nameEn : product.name

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isFormValid = customerName.trim() && phone.trim() && address.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid) {
      toast.error(t('order_modal_validation'))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || null,
          source: 'website',
        }),
      })

      if (res.ok) {
        toast.success(t('order_modal_success'))
        onClose()
      } else {
        const data = await res.json()
        toast.error(data.error || t('order_modal_error'))
      }
    } catch {
      toast.error(t('order_modal_error_generic'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleWhatsApp() {
    const rawNumber = settings?.whatsapp || ''
    let cleanNumber = rawNumber.replace(/[^\d]/g, '')

    if (!cleanNumber) {
      toast.error('WhatsApp number not available')
      return
    }

    if (cleanNumber.startsWith('0')) {
      cleanNumber = '20' + cleanNumber.slice(1)
    } else if (!cleanNumber.startsWith('20')) {
      cleanNumber = '20' + cleanNumber
    }

    const imageUrl = product.imageUrl
      ? `${window.location.origin}${product.imageUrl}`
      : null

    const lines = [
      isEn ? `Hello, I'd like to order: ${displayName}` : `مرحباً، عايز أطلب: ${displayName}`,
      customerName.trim() ? (isEn ? `Name: ${customerName.trim()}` : `الاسم: ${customerName.trim()}`) : null,
      phone.trim() ? (isEn ? `Phone: ${phone.trim()}` : `التليفون: ${phone.trim()}`) : null,
      address.trim() ? (isEn ? `Address: ${address.trim()}` : `العنوان: ${address.trim()}`) : null,
      notes.trim() ? (isEn ? `Notes: ${notes.trim()}` : `ملاحظات: ${notes.trim()}`) : null,
      imageUrl ? (isEn ? `Product Image: ${imageUrl}` : `صورة المنتج: ${imageUrl}`) : null,
    ].filter(Boolean)

    const message = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="font-bold text-lg">{t('order_modal_title')}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{displayName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('close_label')}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('order_modal_name')}</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              placeholder={t('order_modal_name_placeholder')}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('order_modal_phone')}</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className={`w-full px-3 py-2 rounded-lg border text-sm ${isEn ? 'text-left' : 'text-right'}`}
              placeholder="01xxxxxxxxx"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('order_modal_address')}</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              placeholder={t('order_modal_address_placeholder')}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('order_modal_notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              placeholder={t('order_modal_notes_placeholder')}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 gradient-primary text-white"
            >
              {submitting ? (
                <Loader2 className={`w-4 h-4 ${isEn ? 'mr-2' : 'ml-2'} animate-spin`} />
              ) : (
                <ShoppingCart className={`w-4 h-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
              )}
              {t('order_modal_submit')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
            >
              <MessageCircle className={`w-4 h-4 ${isEn ? 'mr-2' : 'ml-2'}`} />
              {t('order_modal_whatsapp')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}