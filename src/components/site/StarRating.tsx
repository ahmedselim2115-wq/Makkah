'use client'

import { useState, useEffect } from 'react'
import { Star, X, Loader2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

interface StarRatingProps {
  productId: string
}

interface Review {
  id: string
  customerName: string
  value: number
  comment: string | null
  createdAt: string
}

export function StarRating({ productId }: StarRatingProps) {
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const [average, setAverage] = useState(0)
  const [count, setCount] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [hasRated, setHasRated] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
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
        setReviews(data.reviews || [])
      })
      .catch(() => {})
  }, [productId])

  function openModal(e: React.MouseEvent) {
    e.stopPropagation()
    if (hasRated) return
    setSelectedValue(5)
    setShowModal(true)
  }

  function openReviewsModal(e: React.MouseEvent) {
    e.stopPropagation()
    setShowReviewsModal(true)
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
        // ملاحظة: التقييم الجديد pending، فمش هيظهر في القايمة إلا بعد موافقة الأدمن
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
      <div className="flex items-center gap-1.5 flex-wrap">
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

        {count > 0 && (
          <button
            type="button"
            onClick={openReviewsModal}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            {isEn ? 'View reviews' : 'عرض التقييمات'}
          </button>
        )}
      </div>

      {/* مودال إضافة تقييم */}
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

      {/* مودال عرض التقييمات والتعليقات */}
      {showReviewsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowReviewsModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg">{isEn ? 'Customer Reviews' : 'تقييمات العملاء'}</h3>
                <p className="text-xs text-muted-foreground">
                  {average.toFixed(1)} · {count} {isEn ? 'reviews' : 'تقييم'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReviewsModal(false)}
                aria-label={t('close_label')}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {isEn ? 'No reviews yet' : 'لا توجد تقييمات بعد'}
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-lg border bg-muted/30 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{review.customerName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}
                      </span>
                    </div>
                    <div className="flex items-center" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.value
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}