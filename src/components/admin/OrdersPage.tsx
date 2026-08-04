'use client'

import { useState, useEffect } from 'react'
import { Trash2, Phone, MapPin, Package, StickyNote, MessageCircle, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'

type Order = {
  id: string
  productName: string
  customerName: string
  phone: string
  address: string
  notes: string | null
  status: string
  source: string
  createdAt: string
  product: {
    imageUrl: string
    price: number
    showPrice: boolean
  } | null
}

const STATUS_KEYS = [
  { value: 'جديد', key: 'orders_status_new' },
  { value: 'قيد المعالجة', key: 'orders_status_processing' },
  { value: 'تم التواصل', key: 'orders_status_contacted' },
  { value: 'مكتمل', key: 'orders_status_completed' },
  { value: 'ملغي', key: 'orders_status_cancelled' },
] as const

const STATUS_STYLE: Record<string, string> = {
  'جديد': 'bg-blue-100 text-blue-700',
  'قيد المعالجة': 'bg-amber-100 text-amber-700',
  'تم التواصل': 'bg-purple-100 text-purple-700',
  'مكتمل': 'bg-green-100 text-green-700',
  'ملغي': 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const { hasPermission } = useAuth()
  const { t, locale } = useAdminLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  function statusLabel(status: string) {
    const found = STATUS_KEYS.find((s) => s.value === status)
    return found ? t(found.key) : status
  }

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (res.ok) setOrders(data)
      else toast.error(data.error || t('admin_error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success(t('orders_status_updated'))
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } else {
      toast.error(t('orders_status_update_error'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('orders_delete_confirm'))) return
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success(t('orders_delete_success'))
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } else {
      toast.error(t('admin_error'))
    }
  }

  if (!hasPermission('orders.manage')) {
    return <p className="p-6 text-muted-foreground">{t('orders_no_permission')}</p>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t('orders_title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('orders_total')} {orders.length} {t('orders_unit')}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('orders_loading')}</p>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center rounded-xl border bg-white">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-lg mb-2">{t('orders_none_title')}</h3>
          <p className="text-muted-foreground">{t('orders_none_subtitle')}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-xl border bg-white space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {o.customerName}
                    <Badge variant="secondary" className={STATUS_STYLE[o.status] || ''}>
                      {statusLabel(o.status)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {o.source === 'whatsapp' ? (
                        <MessageCircle className="w-3 h-3" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      {o.source === 'whatsapp' ? t('orders_source_whatsapp') : t('orders_source_website')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {o.product?.imageUrl ? (
                      <img
                        src={o.product.imageUrl}
                        alt={o.productName}
                        className="w-10 h-10 rounded-lg object-cover border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        {o.productName}
                      </p>
                      {o.product?.showPrice && (
                        <p className="text-xs font-medium text-primary">
                          {o.product.price.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} {locale === 'ar' ? 'ج.م' : 'EGP'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p className="flex items-center gap-2" dir="ltr">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" /> {o.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" /> {o.address}
                </p>
                {o.notes && (
                  <p className="flex items-center gap-2 sm:col-span-2">
                    <StickyNote className="w-4 h-4 text-muted-foreground shrink-0" /> {o.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1.5 bg-white"
                >
                  {STATUS_KEYS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {t(s.key)}
                    </option>
                  ))}
                </select>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(o.id)}
                >
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