'use client'

import { useState, useMemo } from 'react'
import { Package, Snowflake, ThermometerSnowflake, Gauge, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return ['الكل', ...cats]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'الكل') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            <span>منتجاتنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            تشكيلتنا من <span className="text-gradient">الثلاجات والفريزرات</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            نقدم مجموعة واسعة من الثلاجات التجارية والصناعية والفريزرات وغرف التبريد
            المصممة لتلبية جميع احتياجات أعمالك بأعلى معايير الجودة والكفاءة
          </p>
        </div>

        {/* الفئات */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* شبكة المنتجات */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="card-hover overflow-hidden border-2 border-transparent hover:border-primary/20 flex flex-col"
              >
                {/* صورة المنتج */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
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
                        مميز
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="destructive">غير متوفر</Badge>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>

                  {/* المواصفات */}
                  <div className="space-y-2 pt-2 border-t">
                    {product.capacity && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">السعة:</span>
                        <span className="font-medium">{product.capacity}</span>
                      </div>
                    )}
                    {product.temperature && (
                      <div className="flex items-center gap-2 text-sm">
                        <ThermometerSnowflake className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">درجة الحرارة:</span>
                        <span className="font-medium text-xs">{product.temperature}</span>
                      </div>
                    )}
                    {product.power && (
                      <div className="flex items-center gap-2 text-sm">
                        <Gauge className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">الاستطاعة:</span>
                        <span className="font-medium">{product.power}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground">السعر</p>
                    <p className="text-xl font-bold text-primary">
                      {product.price.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gradient-primary text-white"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="w-4 h-4 ml-1" />
                        اطلب
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 ml-1" />
                        قريباً
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
