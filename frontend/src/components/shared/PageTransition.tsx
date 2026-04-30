import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { playSound } from '@/lib/sound'

interface PageTransitionProps {
  children: ReactNode
}

// ───────── Soul Page Transition ─────────
// Not a standard fade. The old page evaporates like smoke
// (dissolve: opacity + scale + blur), the new page crystallizes
// like liquid metal in darkness (condense: blur sharpens, form solidifies).

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  useEffect(() => {
    playSound('page-transition')
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          filter: 'blur(4px)',
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
