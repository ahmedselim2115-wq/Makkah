'use client'

import { useState } from 'react'
import { Lock, ArrowRight, Snowflake, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface AdminLoginProps {
  onClose: () => void
  onLogin: () => void
}

export function AdminLogin({ onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error('الرجاء إدخال كلمة المرور')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        toast.success('تم تسجيل الدخول بنجاح')
        onLogin()
      } else {
        const data = await res.json()
        toast.error(data.error || 'كلمة المرور غير صحيحة')
      }
    } catch (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* رأس */}
        <div className="gradient-primary p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Snowflake className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">لوحة التحكم</h2>
          <p className="text-white/80 text-sm">مصنع مكة للثلاجات</p>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="pr-10 text-right"
                dir="ltr"
                autoFocus
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <p className="font-medium mb-1">كلمة المرور الافتراضية:</p>
            <code className="bg-amber-100 px-2 py-1 rounded font-mono" dir="ltr">admin123</code>
            <p className="text-xs mt-2 text-amber-700">يمكنك تغييرها من قاعدة البيانات لاحقاً</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-white text-lg py-6"
          >
            {loading ? (
              'جاري التحقق...'
            ) : (
              <>
                تسجيل الدخول
                <ArrowRight className="w-5 h-5 mr-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
