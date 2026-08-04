'use client'

import { useState, useMemo } from 'react'
import { Package, Snowflake, ThermometerSnowflake, Gauge, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Product, SiteSettings } from '@/lib/types'
import { OrderModal } from './OrderModal'
import { StarRating } from './StarRating'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProductsSectionProps {
  products: Product[]
  settings?: SiteSettings | null
}

export function ProductsSection({ products, settings }: ProductsSectionProps) {
  const { t, locale } = useLanguage()
  const isEn = locale === 'en'
  const allLabel = t('products_all')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null)

  // دالة لترجمة الفئات تلقائياً أو الاعتماد على categoryEn
  const getDisplayCategory = (category: string, product?: Product) => {
    if (!isEn) return category
    if (product?.categoryEn) return product.categoryEn

    // ترجمة تلقائية احتياطية للفئات الشائعة إذا لم تتوفر categoryEn
    const translations: Record<string, string> = {
      'ثلاجات عرض باب واحد': 'Single Door Display Fridges',
      'ثلاجات عرض بابين': 'Double Door Display Fridges',
      'ثلاجات عرض': 'Display Fridges',
      'ديب فريزر': 'Deep Freezers',
    }

    return translations[category] || category
  }

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)))
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  const badge =
    (isEn ? settings?.productsBadgeEn : settings?.productsBadge)?.trim() || t('products_badge')
  const headingRest =
    (isEn ? settings?.productsHeadingRestEn : settings?.productsHeadingRest)?.trim() ||
    t('products_heading_rest')
  const headingHighlight =
    (isEn ? settings?.productsHeadingHighlightEn : settings?.productsHeadingHighlight)?.trim() ||
    t('products_heading_highlight')
  const text =
    (isEn ? settings?.productsTextEn : settings?.productsText)?.trim() || t('products_default_text')

  return (
    <>
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* العنوان */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {headingRest} <span className="text-gradient">{headingHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{text}</p>
          </div>

          {/* الفئات */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" dir={isEn ? 'ltr' : 'rtl'}>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
            >
              {allLabel}
            </button>
            {categories.map((category) => {
              const matchedProduct = products.find((p) => p.category === category)
              const displayCategory = getDisplayCategory(category, matchedProduct)
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'gradient-primary text-white shadow-lg'
                      : 'bg-accent text-foreground hover:bg-accent/80'
                  }`}
                >
                  {displayCategory}
                </button>
              )
            })}
          </div>

          {/* شبكة المنتجات */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">{t('products_none')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const displayName = isEn && product.nameEn ? product.nameEn : product.name
                const displayDescription = isEn && product.descriptionEn ? product.descriptionEn : product.description
                const displayCategory = getDisplayCategory(product.category, product)
                const displayCapacity = isEn && product.capacityEn ? product.capacityEn : product.capacity
                const displayTemperature = isEn && product.temperatureEn ? product.temperatureEn : product.temperature
                const displayPower = isEn && product.powerEn ? product.powerEn : product.power

                return (
                  <Card
                    key={product.id}
                    className="card-hover overflow-hidden border-2 border-transparent hover:border-primary/20 flex flex-col"
                  >
                    {/* صورة المنتج */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={displayName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Snowflake className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                      )}
                      {/* شارات */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {product.featured && (
                          <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                            {t('products_featured')}
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="destructive">{t('products_out_of_stock')}</Badge>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {displayCategory}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
                        {displayName}
                      </h3>
                      <StarRating productId={product.id} />
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {displayDescription}
                      </p>

                      {/* المواصفات */}
                      <div className="space-y-2 pt-2 border-t">
                        {displayCapacity && (
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{t('products_capacity')}</span>
                            <span className="font-medium">{displayCapacity}</span>
                          </div>
                        )}
                        {displayTemperature && (
                          <div className="flex items-center gap-2 text-sm">
                            <ThermometerSnowflake className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{t('products_temperature')}</span>
                            <span className="font-medium text-xs">{displayTemperature}</span>
                          </div>
                        )}
                        {displayPower && (
                          <div className="flex items-center gap-2 text-sm">
                            <Gauge className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{t('products_power')}</span>
                            <span className="font-medium">{displayPower}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/30">
  <div>
    {product.showPrice ? (
      <div className="flex flex-col">
        {/* السعر القديم مشطوب بحجم أكبر ومتناسق */}
        {product.compareAtPrice && product.compareAtPrice > 0 && (
          <span className="text-sm text-muted-foreground/80 line-through font-medium">
            {product.compareAtPrice.toLocaleString(isEn ? 'en-US' : 'ar-EG')}{' '}
            {t('products_currency')}
          </span>
        )}
        {/* السعر الحالي */}
        <p className="text-xl font-bold text-primary">
          {product.price.toLocaleString(isEn ? 'en-US' : 'ar-EG')}{' '}
          {t('products_currency')}
        </p>
      </div>
    ) : (
      <p className="text-sm font-medium text-muted-foreground">
        {t('products_price_on_request')}
      </p>
    )}
  </div>
  <Button
    size="sm"
    className="gradient-primary text-white"
    disabled={!product.inStock}
    onClick={() => setOrderingProduct(product)}
  >
    {product.inStock ? (
      <>
        <ShoppingCart className="w-4 h-4 ml-1" />
        {t('products_order')}
      </>
    ) : (
      <>
        <CheckCircle2 className="w-4 h-4 ml-1" />
        {t('products_soon')}
      </>
    )}
  </Button>
</CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
      {orderingProduct && (
        <OrderModal
          product={orderingProduct}
          settings={settings}
          onClose={() => setOrderingProduct(null)}
        />
      )}
    </>
  )
}