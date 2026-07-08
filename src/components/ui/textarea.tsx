import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-dark-navy">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-dark-navy placeholder:text-gray-400 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
