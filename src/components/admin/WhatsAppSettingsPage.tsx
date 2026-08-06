'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAdminLanguage } from '@/contexts/AdminLanguageContext'

export default function WhatsAppSettingsPage({ onSaved }: { onSaved?: () => void }) {
  const { t, locale } = useAdminLanguage()
  const isAdminEn = locale === 'en'
  const [phone, setPhone] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [welcomeMessageEn, setWelcomeMessageEn] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        const s = data.settings
        setPhone(s?.whatsapp || '')
        setEnabled(s?.whatsappWidgetEnabled !== false)
        setWelcomeMessage(s?.whatsappWelcomeMessage || t('whatsapp_settings_default_welcome'))
        setWelcomeMessageEn(s?.whatsappWelcomeMessageEn || '')
      } catch {
        toast.error(t('whatsapp_settings_load_error'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [t])

  async function handleSave() {
    setSaving(true)
    setJustSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
          whatsapp: phone,
          whatsappWidgetEnabled: enabled,
          whatsappWelcomeMessage: welcomeMessage,
          whatsappWelcomeMessageEn: welcomeMessageEn,
        }),
      })
      if (res.ok) {
        toast.success(t('whatsapp_settings_save_success'))
        setJustSaved(true)
        onSaved?.()
        setTimeout(() => setJustSaved(false), 3000)
      } else {
        toast.error(t('whatsapp_settings_save_error'))
      }
    } catch {
      toast.error(t('admin_error_retry'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-6 text-muted-foreground">{t('admin_loading')}</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t('whatsapp_settings_title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('whatsapp_settings_subtitle')}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('whatsapp_settings_enable_title')}</p>
            <p className="text-sm text-muted-foreground">
              {t('whatsapp_settings_enable_subtitle')}
            </p>
          </div>
          <button
            onClick={() => setEnabled((v) => !v)}
            className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
              enabled ? 'bg-[#25D366]' : 'bg-muted'
            }`}
            aria-label={t('whatsapp_settings_enable_title')}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                enabled ? 'right-1' : 'right-6'
              }`}
            />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t('whatsapp_settings_phone_label')}</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="w-full px-3 py-2 rounded-lg border text-sm text-right"
            placeholder="01xxxxxxxxx"
          />
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('whatsapp_settings_welcome_label')} (عربي)</label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              placeholder={t('whatsapp_settings_default_welcome')}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('whatsapp_settings_welcome_label')} (English)</label>
            <textarea
              value={welcomeMessageEn}
              onChange={(e) => setWelcomeMessageEn(e.target.value)}
              rows={3}
              dir="ltr"
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              placeholder="Welcome! How can we help you today?"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('whatsapp_settings_welcome_hint')}
        </p>

        <Button
          onClick={handleSave}
          disabled={saving}
          className={`w-full text-white transition-colors ${
            justSaved ? 'bg-green-600 hover:bg-green-600' : 'gradient-primary'
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              {t('admin_saving')}
            </>
          ) : justSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 ml-2" />
              {t('whatsapp_settings_saved')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 ml-2" />
              {t('whatsapp_settings_save')}
            </>
          )}
        </Button>
      </div>

        {/* معاينة */}
        <div className="rounded-xl border bg-white p-6">
          <p className="font-medium mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            {t('whatsapp_settings_preview')}
          </p>
          <div className="w-72 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-[#25D366] px-3 py-3">
              <p className="text-white font-bold text-sm">{t('whatsapp_settings_contact_us')}</p>
            </div>
            <div className="bg-[#0b141a] p-3">
              <div
                className="bg-[#1f2c33] text-white text-xs rounded-xl p-2.5"
                dir={isAdminEn ? 'ltr' : 'rtl'}
              >
                {isAdminEn
                  ? welcomeMessageEn || welcomeMessage || 'Welcome! How can we help you today?'
                  : welcomeMessage || t('whatsapp_settings_default_welcome')}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}