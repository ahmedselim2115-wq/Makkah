'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'

type Category = { id: string; name: string; nameEn: string | null }

export default function CategoriesPage() {
  const { hasPermission } = useAuth()
  const { t, locale } = useAdminLanguage()
  const isAdminEn = locale === 'en'
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [newName, setNewName] = useState('')
  const [newNameEn, setNewNameEn] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingNameEn, setEditingNameEn] = useState('')

  async function loadCategories() {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (res.ok) setCategories(data.categories)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleCreate() {
    if (!newName.trim()) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName.trim(),
        nameEn: newNameEn.trim() || null,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success(t('categories_add_success'))
      setNewName('')
      setNewNameEn('')
      loadCategories()
    } else {
      toast.error(data.error || t('admin_error'))
    }
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingName.trim(),
        nameEn: editingNameEn.trim() || null,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success(t('categories_update_success'))
      setEditingId(null)
      loadCategories()
    } else {
      toast.error(data.error || t('admin_error'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('categories_delete_confirm'))) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      toast.success(t('categories_delete_success'))
      loadCategories()
    } else {
      toast.error(data.error || t('admin_error'))
    }
  }

  const canCreate = hasPermission('categories.create')
  const canEdit = hasPermission('categories.edit')
  const canDelete = hasPermission('categories.delete')

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('categories_title')}</h1>

      {canCreate && (
        <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('categories_name_ar_placeholder')}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Input
            value={newNameEn}
            onChange={(e) => setNewNameEn(e.target.value)}
            placeholder={t('categories_name_en_placeholder')}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} className="gradient-primary text-white shrink-0">
            <Plus className="w-4 h-4 ml-1" /> {t('categories_add')}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">{t('admin_loading')}</p>
      ) : (
        <div className="grid gap-2 max-w-xl">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl border bg-white">
              {editingId === cat.id ? (
                <div className="flex flex-col sm:flex-row gap-2 flex-1 ml-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder={t('categories_edit_ar_placeholder')}
                    autoFocus
                  />
                  <Input
                    value={editingNameEn}
                    onChange={(e) => setEditingNameEn(e.target.value)}
                    placeholder={t('categories_edit_en_placeholder')}
                  />
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="outline" onClick={() => handleUpdate(cat.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                      <span className="font-medium">
                        {isAdminEn && cat.nameEn ? cat.nameEn : cat.name}
                      </span>
                      {isAdminEn && cat.nameEn ? (
                        <span className="text-xs text-muted-foreground" dir="rtl">
                          {cat.name}
                        </span>
                      ) : (
                        cat.nameEn && (
                          <span className="text-xs text-muted-foreground" dir="ltr">
                            {cat.nameEn}
                          </span>
                        )
                      )}
                    </div>
                  <div className="flex gap-1">
                    {canEdit && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingId(cat.id)
                          setEditingName(cat.name)
                          setEditingNameEn(cat.nameEn || '')
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}