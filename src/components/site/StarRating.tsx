'use client'

import { useState, useEffect } from 'react'
import { Star, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

interface StarRatingProps {
  productId: string
}

export function StarRating({ productId }: StarRatingProps) {
  const { t } = useLanguage()
  const [average, setAverage] = useState(0)
  const [count, setCount] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedValue, setSelectedValue] = useState(0)
  const [hoveredValue, setHoveredValue] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const ratedKey = `rated_${productId}`
    if (typeof window !== 'undefined' && localStorage.getItem(ratedKey)) {
      setHasRated(true)
    }

    fetch(`/api/products/${productId}/ratings`)
      .then((res) => res.json())
      .then((data) => {
        setAverage(data.average || 0)
        setCount(data.count || 0)
      })
      .catch(() => {})
  }, [productId])

  function openModal(e: React.MouseEvent) {
    e.stopPropagation()
    if (hasRated) return
    setSelectedValue(5)
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedValue) {
      toast.error(t('rating_validation_stars'))
      return
    }
    if (!customerName.trim() || !phone.trim()) {
      toast.error(t('rating_validation_fields'))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: selectedValue,
          customerName: customerName.trim(),
          phone: phone.trim(),
          comment: comment.trim() || null,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setAverage(data.average || 0)
        setCount(data.count || 0)
        setHasRated(true)
        localStorage.setItem(`rated_${productId}`, '1')
        toast.success(t('rating_thanks'))
        setShowModal(false)
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

  return (
    <>
      <div
        className="flex items-center gap-1.5"
        onClick={hasRated ? (e) => e.stopPropagation() : openModal}
        role={hasRated ? undefined : 'button'}
      >
        <div className="flex items-center" dir="ltr">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(average)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/40'
              } ${!hasRated ? 'cursor-pointer' : ''}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {count > 0 ? `(${average.toFixed(1)} · ${count})` : t('rating_rate_product')}
        </span>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-lg">{t('rating_rate_product')}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} aria-label={t('close_label')}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('rating_your_rating')}</label>
                <div className="flex items-center gap-1" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredValue(star)}
                      onMouseLeave={() => setHoveredValue(0)}
                      onClick={() => setSelectedValue(star)}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoveredValue || selectedValue)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

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
                  className="w-full px-3 py-2 rounded-lg border text-sm text-right"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('rating_comment')}</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  placeholder={t('rating_comment_placeholder')}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full gradient-primary text-white">
                {submitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                {t('rating_submit')}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}