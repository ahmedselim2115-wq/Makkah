'use client'

import { useState, useEffect } from 'react'
import { Trash2, Phone, Star, Package, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'

type Rating = {
  id: string
  productName: string
  customerName: string
  phone: string
  value: number
  comment: string | null
  createdAt: string
  product: { imageUrl: string } | null
}

export default function RatingsPage() {
  const { hasPermission } = useAuth()
  const { t, locale } = useAdminLanguage()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  async function loadRatings() {
    setLoading(true)
    try {
      const res = await fetch('/api/ratings')
      const data = await res.json()
      if (res.ok) setRatings(data)
      else toast.error(data.error || t('admin_error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRatings()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm(t('ratings_delete_confirm'))) return
    const res = await fetch(`/api/ratings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success(t('ratings_delete_success'))
      setRatings((prev) => prev.filter((r) => r.id !== id))
    } else {
      toast.error(t('admin_error'))
    }
  }

  if (!hasPermission('ratings.manage')) {
    return <p className="p-6 text-muted-foreground">{t('ratings_no_permission')}</p>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t('ratings_title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('ratings_total')} {ratings.length} {t('ratings_unit')}
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('admin_loading')}</p>
      ) : ratings.length === 0 ? (
        <div className="py-16 text-center rounded-xl border bg-white">
          <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-lg mb-2">{t('ratings_none_title')}</h3>
          <p className="text-muted-foreground">{t('ratings_none_subtitle')}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {ratings.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border bg-white space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  {r.product?.imageUrl ? (
                    <img
                      src={r.product.imageUrl}
                      alt={r.productName}
                      className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{r.customerName}</p>
                    <p className="text-sm text-muted-foreground">{r.productName}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                </p>
              </div>

              <div className="flex items-center gap-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= r.value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p className="flex items-center gap-2" dir="ltr">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" /> {r.phone}
                </p>
              </div>

              {r.comment && (
                <p className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg p-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  {r.comment}
                </p>
              )}

              <div className="flex justify-end pt-2 border-t">
                <Button size="icon" variant="destructive" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}