'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X, LogOut, Package, Settings, Plus, Pencil, Trash2,
  TrendingUp, Star, AlertCircle, CheckCircle, Snowflake,
  LayoutGrid, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminLogin } from './AdminLogin'
import { ProductForm } from './ProductForm'
import { SettingsForm } from './SettingsForm'
import type { Product, SiteSettings, Stats } from '@/lib/types'

interface AdminPanelProps {
  onClose: () => void
  onSiteUpdate: () => void
}

type TabType = 'dashboard' | 'products' | 'settings'

export function AdminPanel({ onClose, onSiteUpdate }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  // حالات النماذج
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showSettingsForm, setShowSettingsForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      toast.error('فشل في جلب المنتجات')
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings)
    } catch (error) {
      toast.error('فشل في جلب الإعدادات')
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data.stats)
    } catch (error) {
      toast.error('فشل في جلب الإحصائيات')
    }
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchProducts(), fetchSettings(), fetchStats()])
    setLoading(false)
  }, [fetchProducts, fetchSettings, fetchStats])

  useEffect(() => {
    if (isLoggedIn) {
      // تجنب استدعاء setState متزامن داخل useEffect مباشرة
      const timer = setTimeout(() => {
        loadAll()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, loadAll])

  const handleLogout = () => {
    setIsLoggedIn(false)
    onClose()
  }

  const handleProductSaved = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    loadAll()
    onSiteUpdate()
  }

  const handleSettingsSaved = () => {
    setShowSettingsForm(false)
    fetchSettings()
    onSiteUpdate()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('تم حذف المنتج بنجاح')
        setDeleteTarget(null)
        loadAll()
        onSiteUpdate()
      } else {
        toast.error('فشل في حذف المنتج')
      }
    } catch (error) {
      toast.error('حدث خطأ')
    }
  }

  // شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return <AdminLogin onClose={onClose} onLogin={() => setIsLoggedIn(true)} />
  }

  const statsCards = [
    {
      icon: Package,
      label: 'إجمالي المنتجات',
      value: stats?.totalProducts || 0,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Star,
      label: 'منتجات مميزة',
      value: stats?.featuredProducts || 0,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: CheckCircle,
      label: 'متوفر في المخزن',
      value: stats?.inStockProducts || 0,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: AlertCircle,
      label: 'غير متوفر',
      value: stats?.outOfStockProducts || 0,
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* الرأس */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">مصنع مكة للثلاجات</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadAll}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* الشريط الجانبي */}
        <aside className="w-16 md:w-60 border-r bg-white flex-shrink-0 overflow-y-auto">
          <nav className="p-2 md:p-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center md:justify-start ${
                activeTab === 'dashboard'
                  ? 'gradient-primary text-white'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <LayoutGrid className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">الرئيسية</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center md:justify-start ${
                activeTab === 'products'
                  ? 'gradient-primary text-white'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Package className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">المنتجات</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center md:justify-start ${
                activeTab === 'settings'
                  ? 'gradient-primary text-white'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">الإعدادات</span>
            </button>
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            {/* لوحة الإحصائيات */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم</h2>
                  <p className="text-muted-foreground">
                    إدارة شاملة لمنتجات ومحتوى موقع مصنع مكة للثلاجات
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsCards.map((card, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold mb-1">{card.value}</p>
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* إجراءات سريعة */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">إجراءات سريعة</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => {
                          setEditingProduct(null)
                          setShowProductForm(true)
                        }}
                        className="justify-start gradient-primary text-white h-14"
                      >
                        <Plus className="w-5 h-5 ml-2" />
                        إضافة منتج جديد
                      </Button>
                      <Button
                        onClick={() => setShowSettingsForm(true)}
                        variant="outline"
                        className="justify-start h-14"
                      >
                        <Settings className="w-5 h-5 ml-2" />
                        تعديل إعدادات الموقع
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* أحدث المنتجات */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">أحدث المنتجات</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('products')}
                      >
                        عرض الكل
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {products.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Snowflake className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.price.toLocaleString('ar-SA')} ر.س
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {product.featured && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                <Star className="w-3 h-3 ml-1" />
                                مميز
                              </Badge>
                            )}
                            {product.inStock ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                متوفر
                              </Badge>
                            ) : (
                              <Badge variant="destructive">غير متوفر</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {products.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          لا توجد منتجات بعد
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* إدارة المنتجات */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">إدارة المنتجات</h2>
                    <p className="text-sm text-muted-foreground">
                      إجمالي: {products.length} منتج
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingProduct(null)
                      setShowProductForm(true)
                    }}
                    className="gradient-primary text-white"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة منتج
                  </Button>
                </div>

                {products.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="font-bold text-lg mb-2">لا توجد منتجات</h3>
                      <p className="text-muted-foreground mb-4">
                        ابدأ بإضافة أول منتج لمتجرك
                      </p>
                      <Button
                        onClick={() => {
                          setEditingProduct(null)
                          setShowProductForm(true)
                        }}
                        className="gradient-primary text-white"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة منتج
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Snowflake className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {product.featured && (
                              <Badge className="bg-amber-500 text-white">
                                <Star className="w-3 h-3 ml-1" />
                                مميز
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            {product.inStock ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                متوفر
                              </Badge>
                            ) : (
                              <Badge variant="destructive">غير متوفر</Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <p className="text-lg font-bold text-primary mb-3">
                            {product.price.toLocaleString('ar-SA')} ر.س
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setEditingProduct(product)
                                setShowProductForm(true)
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5 ml-1" />
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                              onClick={() => setDeleteTarget(product)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* الإعدادات */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">إعدادات الموقع</h2>
                    <p className="text-sm text-muted-foreground">
                      تحكم في محتوى وعرض الموقع
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowSettingsForm(true)}
                    className="gradient-primary text-white"
                  >
                    <Settings className="w-4 h-4 ml-2" />
                    تعديل الإعدادات
                  </Button>
                </div>

                {settings && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-primary rounded-full" />
                          القسم الرئيسي
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">العنوان:</span>
                            <p className="font-medium">{settings.heroTitle}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">العنوان الفرعي:</span>
                            <p className="font-medium line-clamp-2">{settings.heroSubtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-primary rounded-full" />
                          معلومات التواصل
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">الهاتف:</span>
                            <span className="font-medium" dir="ltr">{settings.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">البريد:</span>
                            <span className="font-medium" dir="ltr">{settings.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">العنوان:</span>
                            <p className="font-medium">{settings.address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* النوافذ المنبثقة */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
          onSaved={handleProductSaved}
        />
      )}

      {showSettingsForm && settings && (
        <SettingsForm
          settings={settings}
          onClose={() => setShowSettingsForm(false)}
          onSaved={handleSettingsSaved}
        />
      )}

      {/* تأكيد الحذف */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المنتج &quot;{deleteTarget?.name}&quot;؟
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
