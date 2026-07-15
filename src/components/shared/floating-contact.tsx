import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 1.67c2.24 0 4.35.87 5.94 2.46a8.23 8.23 0 0 1 2.42 5.85c0 4.56-3.71 8.27-8.28 8.27a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.57 3.71-8.33 8.29-8.33Zm-3.68 4.6c-.15 0-.4.06-.6.28-.21.22-.8.79-.8 1.92 0 1.13.82 2.23.94 2.38.11.15 1.6 2.6 4.02 3.53 1.98.77 2.39.62 2.82.58.43-.04 1.39-.57 1.58-1.11.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28-.24-.12-1.4-.7-1.62-.78-.22-.08-.37-.12-.53.12-.16.24-.6.78-.74.93-.14.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.32-.74-1.8-.2-.47-.4-.4-.53-.4h-.45Z" />
    </svg>
  )
}

export function FloatingContact() {
  const { data: settings } = useSettings()
  const whatsapp = settings?.whatsapp_number?.replace(/[^\d]/g, '')
  const phone = settings?.contact_phone

  if (!whatsapp && !phone) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {phone && (
        <motion.a
          href={`tel:${phone}`}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
          aria-label="Call us"
        >
          <Phone className="h-5 w-5" />
        </motion.a>
      )}
      {whatsapp && (
        <motion.a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
          <WhatsAppIcon className="relative h-7 w-7" />
        </motion.a>
      )}
    </div>
  )
}
