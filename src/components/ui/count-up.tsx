import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

interface CountUpProps {
  value: string
  className?: string
}

export function CountUp({ value, className }: CountUpProps) {
  const match = value.match(/^([\d,]+)(.*)$/)
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(target === null ? value : '0')

  useEffect(() => {
    if (!inView || target === null) return
    const controls = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })
    return () => controls.stop()
  }, [inView, target])

  return <span ref={ref} className={className}>{target === null ? value : display}{suffix}</span>
}
