import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

interface CountUpProps {
  value: string
  className?: string
}

export function CountUp({ value, className }: CountUpProps) {
  const match = value.match(/^([\d,]+)(.*)$/)
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(target === null ? value : '0')

  useEffect(() => {
    if (target === null || !ref.current) return
    const el = ref.current
    let played = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played) return
        played = true
        animate(0, target, {
          duration: 1.5,
          ease: 'easeOut',
          onUpdate: (v) => setDisplay(Math.round(v).toString()),
        })
        observer.disconnect()
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref} className={className}>{target === null ? value : display}{suffix}</span>
}
