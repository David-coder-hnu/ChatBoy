import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
  color: string
}

export default function GlobalRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = useCallback((e: MouseEvent) => {
    // Skip if clicking on interactive elements
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[role="button"]') ||
      target.closest('label')
    ) {
      return
    }

    const id = Date.now() + Math.random()
    const x = e.clientX
    const y = e.clientY

    // Use accent color based on position for subtle variety
    const colors = ['rgba(0,240,255,0.15)', 'rgba(255,0,110,0.12)', 'rgba(255,190,11,0.12)']
    const color = colors[Math.floor(Math.random() * colors.length)]

    setRipples((prev) => [...prev, { id, x, y, color }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [handleClick])

  return (
    <AnimatePresence>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 120, height: 120, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed rounded-full pointer-events-none z-[9999]"
          style={{
            left: ripple.x - 60,
            top: ripple.y - 60,
            background: `radial-gradient(circle, ${ripple.color}, transparent 70%)`,
          }}
        />
      ))}
    </AnimatePresence>
  )
}
