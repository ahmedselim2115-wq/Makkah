'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X, LogOut, Package, Settings, Plus, Pencil, Trash2,
  TrendingUp, Star, AlertCircle, CheckCircle, Snowflake,
  LayoutGrid, RefreshCw, Users, FolderTree, ShieldCheck, Languages
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
import CategoriesPage from './categoriespage'
import UsersPage from './UsersPage'
import ShowcaseForm from './ShowcaseForm'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'
import type { Product, SiteSettings, Stats } from '@/lib/types'
import { ClipboardList } from 'lucide-react'
import OrdersPage from './OrdersPage'
import RatingsPage from './RatingsPage'
import { MessageCircle } from 'lucide-react'
import WhatsAppSettingsPage from './WhatsAppSettingsPage'

interface AdminPanelProps {
  onClose: () => void
  onSiteUpdate: () => void
}

type TabType = 'dashboard' | 'products' | 'categories' | 'users' | 'settings' | 'showcase' | 'orders' | 'ratings' | 'whatsapp'

export function AdminPanel({ onClose, onSiteUpdate }: AdminPanelProps) {
  const { user, loading: authLoading, hasPermission, logout, refreshUser } = useAuth()
  const { t, locale, setLocale } = useAdminLanguage()
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
      toast.error(t('admin_error'))
    }
  }, [t])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings)
    } catch (error) {
      toast.error(t('admin_error'))
    }
  }, [t])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data.stats)
    } catch (error) {
      toast.error(t('admin_error'))
    }
  }, [t])

  const loadAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchProducts(), fetchSettings(), fetchStats()])
    setLoading(false)
  }, [fetchProducts, fetchSettings, fetchStats])

  // لما نتأكد إن فيه مستخدم مسجل دخول (من الكوكي)، نجيب البيانات
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        loadAll()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [user, loadAll])

  const handleLogout = async () => {
    await logout()
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
        toast.success(t('product_deleted'))
        setDeleteTarget(null)
        loadAll()
        onSiteUpdate()
      } else {
        toast.error(t('product_delete_failed'))
      }
    } catch (error) {
      toast.error(t('admin_error'))
    }
  }

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <AdminLogin
        onClose={onClose}
        onLogin={async () => {
          await refreshUser()
        }}
      />
    )
  }

  // التحقق من الصلاحيات للأقسام المختلفة
  const canViewStats = user?.isSuperAdmin || hasPermission('dashboard.view_stats')
  const canSeeProducts =
    hasPermission('products.create') ||
    hasPermission('products.edit') ||
    hasPermission('products.delete')
  const canSeeCategories = hasPermission('categories.manage')
  const canSeeUsers = hasPermission('users.manage')
  const canSeeOrders = hasPermission('orders.manage')
  const canSeeRatings = hasPermission('ratings.manage')
  const canSeeShowcase = hasPermission('showcase.manage')
  const canSeeWhatsapp = hasPermission('whatsapp.manage')
  const canSeeSettings = hasPermission('settings.manage')

  const statsCards = [
    {
      icon: Package,
      label: t('stats_total_products'),
      value: stats?.totalProducts || 0,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Star,
      label: t('stats_featured_products'),
      value: stats?.featuredProducts || 0,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: CheckCircle,
      label: t('stats_in_stock'),
      value: stats?.inStockProducts || 0,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: AlertCircle,
      label: t('stats_out_of_stock'),
      value: stats?.outOfStockProducts || 0,
      color: 'bg-red-100 text-red-600',
    },
  ]

  const navItems: { tab: TabType; label: string; icon: typeof LayoutGrid; visible: boolean }[] = [
    { 
      tab: 'dashboard', 
      label: t('nav_dashboard'), 
      icon: LayoutGrid, 
      visible: hasPermission('dashboard.view') 
    },
    { tab: 'products', label: t('nav_products'), icon: Package, visible: canSeeProducts },
    { tab: 'showcase', label: t('nav_showcase'), icon: TrendingUp, visible: canSeeShowcase },
    { tab: 'categories', label: t('nav_categories'), icon: FolderTree, visible: canSeeCategories },
    { tab: 'orders', label: t('nav_orders'), icon: ClipboardList, visible: canSeeOrders },
    { tab: 'ratings', label: t('nav_ratings'), icon: Star, visible: canSeeRatings },
    { tab: 'whatsapp', label: t('nav_whatsapp'), icon: MessageCircle, visible: canSeeWhatsapp },
    { tab: 'users', label: t('nav_users'), icon: Users, visible: canSeeUsers },
    { tab: 'settings', label: t('nav_settings'), icon: Settings, visible: canSeeSettings },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* الرأس */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt={t('company_name')}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h1 className="font-bold text-base">{t('admin_panel')}</h1>
                <p className="text-xs text-muted-foreground">{t('company_name')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground ml-2">
                {user.isSuperAdmin && <ShieldCheck className="w-4 h-4 text-primary" />}
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              >
                <Languages className="w-4 h-4 ml-2" />
                {t('lang_switch')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAll}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                {t('header_refresh')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 ml-2" />
                {t('header_logout')}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label={t('admin_close')}
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
            {navItems
              .filter((item) => item.visible)
              .map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center md:justify-start ${
                    activeTab === item.tab
                      ? 'gradient-primary text-white'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            {/* لوحة الإحصائيات (تظهر فقط لمن يملك الصلاحية أو كونه مدير عام) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('dashboard_welcome')}</h2>
                  <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
                </div>

                {canViewStats ? (
                  <>
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

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4">{t('quick_actions')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            onClick={() => {
                              setEditingProduct(null)
                              setShowProductForm(true)
                            }}
                            className="justify-start gradient-primary text-white h-14"
                          >
                            <Plus className="w-5 h-5 ml-2" />
                            {t('quick_add_product')}
                          </Button>
                          <Button
                            onClick={() => setShowSettingsForm(true)}
                            variant="outline"
                            className="justify-start h-14"
                          >
                            <Settings className="w-5 h-5 ml-2" />
                            {t('quick_edit_settings')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg">{t('latest_products')}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('products')}
                          >
                            {t('view_all')}
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
                                  {product.price.toLocaleString('ar-EG')} ج.م
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {product.featured && (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                    <Star className="w-3 h-3 ml-1" />
                                    {t('badge_featured')}
                                  </Badge>
                                )}
                                {product.inStock ? (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {t('badge_in_stock')}
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">{t('badge_out_of_stock')}</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          {products.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              {t('no_products_yet')}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  /* رسالة أنيقة تظهر للمستخدم العادي في حال لم يكن لديه صلاحية رؤية الإحصائيات */
                  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      🔒
                    </div>
                    <h2 className="text-lg font-semibold">مرحباً بك في لوحة التحكم</h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                      يمكنك الانتقال إلى الأقسام المختلفة من القائمة الجانبية لإدارة المنتجات، الطلبات، أو إعدادات الموقع حسب صلاحياتك الممنوحة.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* العرض التفاعلي للمنتجات */}
            {activeTab === 'showcase' && <ShowcaseForm />}

            {/* إدارة المنتجات */}
            {activeTab === 'products' && canSeeProducts && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{t('products_title')}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t('products_total')} {products.length} {t('products_unit')}
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
                    {t('add_product')}
                  </Button>
                </div>

                {products.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="font-bold text-lg mb-2">{t('no_products_title')}</h3>
                      <p className="text-muted-foreground mb-4">{t('no_products_subtitle')}</p>
                      <Button
                        onClick={() => {
                          setEditingProduct(null)
                          setShowProductForm(true)
                        }}
                        className="gradient-primary text-white"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        {t('add_product')}
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
                                {t('badge_featured')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            {product.inStock ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {t('badge_in_stock')}
                              </Badge>
                            ) : (
                              <Badge variant="destructive">{t('badge_out_of_stock')}</Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <p className="text-lg font-bold text-primary mb-3">
                            {product.price.toLocaleString('ar-EG')} ج.م
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
                              {t('action_edit')}
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

            {/* إدارة الفئات */}
            {activeTab === 'categories' && canSeeCategories && <CategoriesPage />}

            {/* إدارة المستخدمين */}
            {activeTab === 'users' && canSeeUsers && <UsersPage />}
            {activeTab === 'orders' && canSeeOrders && <OrdersPage />}
            {activeTab === 'ratings' && canSeeRatings && <RatingsPage />}
            {activeTab === 'whatsapp' && <WhatsAppSettingsPage onSaved={onSiteUpdate} />}

            {/* الإعدادات */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{t('settings_title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('settings_subtitle')}</p>
                  </div>
                  <Button
                    onClick={() => setShowSettingsForm(true)}
                    className="gradient-primary text-white"
                  >
                    <Settings className="w-4 h-4 ml-2" />
                    {t('settings_edit')}
                  </Button>
                </div>

                {settings && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-primary rounded-full" />
                          {t('settings_hero_section')}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('settings_hero_title_label')}</span>
                            <p className="font-medium">{settings.heroTitle}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('settings_hero_subtitle_label')}</span>
                            <p className="font-medium line-clamp-2">{settings.heroSubtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-primary rounded-full" />
                          {t('settings_contact_info')}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{t('settings_phone_label')}</span>
                            <span className="font-medium" dir="ltr">{settings.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{t('settings_email_label')}</span>
                            <span className="font-medium" dir="ltr">{settings.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('settings_address_label')}</span>
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
            <AlertDialogTitle>{t('admin_confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && t('delete_product_confirm', deleteTarget.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin_cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin_delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}