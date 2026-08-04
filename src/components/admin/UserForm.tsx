'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { AVAILABLE_PERMISSIONS } from '@/lib/permissions'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'

type ManagedUser = {
  id: string
  name: string
  email: string
  isActive: boolean
  isSuperAdmin: boolean
  permissions: string[]
} | null

interface UserFormProps {
  user: ManagedUser
  onClose: () => void
  onSaved: () => void
}

export function UserForm({ user, onClose, onSaved }: UserFormProps) {
  const { t } = useAdminLanguage()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsActive(user.isActive)
      setPermissions(user.permissions)
    }
  }, [user])

  function togglePermission(key: string) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || (!user && !password)) {
      toast.error(t('user_form_validation'))
      return
    }

    setLoading(true)
    try {
      const url = user ? `/api/users/${user.id}` : '/api/users'
      const method = user ? 'PUT' : 'POST'
      const body: Record<string, unknown> = { name, email, permissions }
      if (!user) body.email = email
      if (password) body.password = password
      if (user) body.isActive = isActive

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || t('admin_error'))
        return
      }
      toast.success(user ? t('user_form_success_edit') : t('user_form_success_add'))
      onSaved()
    } catch {
      toast.error(t('admin_error_retry'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <h2 className="text-xl font-bold">{user ? t('user_form_edit_title') : t('user_form_add_title')}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('user_form_name')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('user_form_email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? t('user_form_password_edit') : t('user_form_password_new')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {user && !user.isSuperAdmin && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <Label htmlFor="isActive" className="font-medium cursor-pointer">
                {t('user_form_active')}
              </Label>
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            </div>
          )}

          {!user?.isSuperAdmin && (
            <div className="space-y-2">
              <Label>{t('user_form_permissions')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm.key}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm.key)}
                      onChange={() => togglePermission(perm.key)}
                    />
                    {t(perm.labelKey)}
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>

        <div className="flex gap-3 p-6 border-t bg-muted/30">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            {t('admin_cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1 gradient-primary text-white">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" /> {t('admin_saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" /> {t('admin_save')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}