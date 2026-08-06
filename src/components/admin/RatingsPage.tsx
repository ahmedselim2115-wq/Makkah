'use client'

import { useState, useEffect } from 'react'
import { Trash2, Phone, Star, Package, MessageSquare, Check, X } from 'lucide-react'
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
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  product: { imageUrl: string } | null
}

type FilterType = 'all' | 'pending' | 'approved' | 'rejected'

export default function RatingsPage() {
  const { hasPermission } = useAuth()
  const { t, locale } = useAdminLanguage()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('pending')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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

  async function handleStatusChange(id: string, status: 'approved' | 'rejected') {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/ratings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success(status === 'approved' ? t('ratings_approved_toast') : t('ratings_rejected_toast'))
        setRatings((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      } else {
        toast.error(t('admin_error'))
      }
    } finally {
      setUpdatingId(null)
    }
  }

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

  const filteredRatings = ratings.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const counts = {
    all: ratings.length,
    pending: ratings.filter((r) => r.status === 'pending').length,
    approved: ratings.filter((r) => r.status === 'approved').length,
    rejected: ratings.filter((r) => r.status === 'rejected').length,
  }

  const statusBadge = (status: Rating['status']) => {
  if (status === 'approved')
    return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">{t('ratings_tab_approved')}</span>
  if (status === 'rejected')
    return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">{t('ratings_tab_rejected')}</span>
  return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">{t('ratings_tab_pending')}</span>
}

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t('ratings_title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('ratings_total')} {ratings.length} {t('ratings_unit')}
        </p>
      </div>

      {/* تبويبات الفلترة */}
      <div className="flex gap-2 flex-wrap border-b pb-3">
       {([
          { key: 'pending', label: `${t('ratings_tab_pending')} (${counts.pending})` },
          { key: 'approved', label: `${t('ratings_tab_approved')} (${counts.approved})` },
          { key: 'rejected', label: `${t('ratings_tab_rejected')} (${counts.rejected})` },
          { key: 'all', label: `${t('ratings_tab_all')} (${counts.all})` },
        ] as { key: FilterType; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('admin_loading')}</p>
      ) : filteredRatings.length === 0 ? (
        <div className="py-16 text-center rounded-xl border bg-white">
          <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-lg mb-2">{t('ratings_none_title')}</h3>
          <p className="text-muted-foreground">{t('ratings_none_subtitle')}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredRatings.map((r) => (
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
                <div className="flex items-center gap-2">
                  {statusBadge(r.status)}
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
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

              <div className="flex justify-end gap-2 pt-2 border-t">
                {r.status !== 'approved' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(r.id, 'approved')}
                    disabled={updatingId === r.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 ml-1" />
                    قبول
                  </Button>
                )}
                {r.status !== 'rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(r.id, 'rejected')}
                    disabled={updatingId === r.id}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 ml-1" />
                    رفض
                  </Button>
                )}
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