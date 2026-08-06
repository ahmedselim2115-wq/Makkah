'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface WhatsAppWidgetProps {
  settings?: SiteSettings | null
}

export function WhatsAppWidget({ settings }: WhatsAppWidgetProps) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const rawNumber = settings?.whatsapp || ''
  let cleanNumber = rawNumber.replace(/[^\d]/g, '')
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '20' + cleanNumber.slice(1)
  } else if (cleanNumber && !cleanNumber.startsWith('20')) {
    cleanNumber = '20' + cleanNumber
  }

  const isEnabled = settings?.whatsappWidgetEnabled !== false
const welcomeMessage = isEn
  ? settings?.whatsappWelcomeMessageEn?.trim() || settings?.whatsappWelcomeMessage?.trim() || 'Welcome! How can we help you today?'
  : settings?.whatsappWelcomeMessage?.trim() || 'مرحباً بك! كيف يمكننا مساعدتك اليوم؟'

const displayTitle = isEn
  ? settings?.heroTitleEn?.trim() || settings?.heroTitle?.trim() || 'Contact Us'
  : settings?.heroTitle?.trim() || 'تواصل معنا'

  if (!cleanNumber || !isEnabled) return null

  function handleSend() {
  const text = message.trim() || (isEn ? 'Hello, I would like to ask about' : 'مرحباً، أريد الاستفسار')
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank')
    setMessage('')
    setOpen(false)
  }

  return (
    // استخدام start-6 لتعمل تلقائياً مع اليمين واليسار حسب اتجاه الصفحة dir
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-start gap-3">
      {open && (
        <div className="w-80 max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl bg-white text-start">
          <div className="bg-[#25D366] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                {displayTitle.charAt(0)}
              </div>
              <div>
              <p className="text-white font-bold text-sm">
                {displayTitle}
              </p>
              <p className="container text-white/90 text-xs flex items-center gap-1 p-0">
                <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
                {isEn ? 'Active now' : 'نشط الآن'}
              </p>
            </div>
            </div>
            <button
                  onClick={() => setOpen(false)}
                  className="text-white/90 hover:text-white"
                  aria-label={isEn ? 'Close' : 'إغلاق'}
                >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#0b141a] p-4">
            <div className="bg-[#1f2c33] text-white text-sm rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
              {welcomeMessage}
            </div>
          </div>

          <div className="bg-[#0b141a] px-3 pb-3 flex items-center gap-2">
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 hover:bg-[#20bd5a] transition-colors"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 text-white -scale-x-100" />
            </button>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isEn ? 'Type your message...' : 'اكتب رسالتك...'}
                dir={isEn ? 'ltr' : 'rtl'}
                className="flex-1 bg-[#1f2c33] text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder:text-white/40"
              />
          </div>
        </div>
      )}

      <button
              onClick={() => setOpen((v) => !v)}
              className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isEn ? 'Contact via WhatsApp' : 'تواصل عبر واتساب'}
            >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        )}
      </button>
    </div>
  )
}