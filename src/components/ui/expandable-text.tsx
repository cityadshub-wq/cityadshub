import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpandableTextProps {
  text: string
  className?: string
  threshold?: number
}

export function ExpandableText({ text, className, threshold = 140 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > threshold

  return (
    <div>
      <p className={cn(className, !expanded && isLong && 'line-clamp-3')}>{text}</p>
      {isLong && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded) }}
          className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? 'Read Less' : 'Read More'}
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  )
}
