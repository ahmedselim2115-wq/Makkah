'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Save, Loader2, Upload, ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

interface ProductFormProps {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

const CATEGORIES = ['ثلاجات تجارية', 'ثلاجات عرض', 'فريزر', 'غرف تبريد', 'ثلاجات منزلية']

export function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'ثلاجات تجارية',
    capacity: '',
    temperature: '',
    power: '',
    featured: false,
    inStock: true,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageUrl: product.imageUrl,
        category: product.category,
        capacity: product.capacity || '',
        temperature: product.temperature || '',
        power: product.power || '',
        featured: product.featured,
        inStock: product.inStock,
      })
    }
  }, [product])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار ملف صورة صالح')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جدًا، الحد الأقصى 5 ميجابايت')
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json()

      if (res.ok) {
        handleChange('imageUrl', data.url)
        toast.success('تم رفع الصورة بنجاح')
      } else {
        toast.error(data.error || 'حدث خطأ أثناء رفع الصورة')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    handleChange('imageUrl', '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('الرجاء ملء الحقول المطلوبة')
      return
    }

    setLoading(true)
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(product ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح')
        onSaved()
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ')
      }
    } catch (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <h2 className="text-xl font-bold">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المنتج *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="مثال: ثلاجة عرض تجارية 1200 لتر"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="وصف تفصيلي للمنتج ومميزاته"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (ر.س) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">الفئة</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* رفع الصورة */}
          <div className="space-y-2">
            <Label>صورة المنتج</Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {formData.imageUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                <img
                  src={formData.imageUrl}
                  alt="معاينة"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 ml-1" />
                    تغيير
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm">جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">اضغط لرفع صورة (JPG, PNG, WebP)</span>
                    <span className="text-xs">الحد الأقصى 5 ميجابايت</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">السعة</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="مثال: 1200 لتر"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">درجة الحرارة</Label>
              <Input
                id="temperature"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                placeholder="من +2 إلى +8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="power">الاستطاقة</Label>
              <Input
                id="power"
                value={formData.power}
                onChange={(e) => handleChange('power', e.target.value)}
                placeholder="مثال: 450 واط"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div>
                <Label htmlFor="featured" className="font-medium cursor-pointer">
                  منتج مميز
                </Label>
                <p className="text-xs text-muted-foreground">يظهر في المقدمة</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div>
                <Label htmlFor="inStock" className="font-medium cursor-pointer">
                  متوفر في المخزن
                </Label>
                <p className="text-xs text-muted-foreground">جاهز للبيع</p>
              </div>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleChange('inStock', checked)}
              />
            </div>
          </div>
        </form>

        {/* الأزرار */}
        <div className="flex gap-3 p-6 border-t bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="flex-1 gradient-primary text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                {product ? 'حفظ التغييرات' : 'إضافة المنتج'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}